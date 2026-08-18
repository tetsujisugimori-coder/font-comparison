"""Google Fonts CSSに定義されたWOFF2を解析し、cmapとOpenType静的データを更新する。"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections.abc import Callable, Iterable
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from fontTools.ttLib import TTFont, TTLibError

from analyze_font_cmap import (
    DETAIL_SCHEMA_VERSION,
    SUMMARY_SCHEMA_VERSION,
    analyze_features,
    compress_codepoints,
    face_metadata,
    serialize_detail_javascript,
    split_analysis_entries,
)


DEFAULT_CSS_URL = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
FONT_ID = "noto-sans-jp-web"
FONT_NAME = "Noto Sans JP"
REQUESTED_WEIGHTS = (400, 700)
CMAP_CAVEAT = (
    "文字収録情報はCSSに定義された全WOFF2のcmapを統合したものです。"
    "1回の閲覧でブラウザが全ファイルを取得するという意味ではありません。"
)


@dataclass(frozen=True)
class WebFontTarget:
    """アプリが実際に読み込むWebフォントの解析条件。"""

    font_id: str
    font_name: str
    weights: tuple[int, ...]
    styles: tuple[str, ...]
    css_url: str | None = None
    font_files: tuple[tuple[int, str], ...] = ()
    source_note: str = ""


GOOGLE_FONT_TARGETS: tuple[WebFontTarget, ...] = (
    WebFontTarget("noto-sans-jp-web", "Noto Sans JP", (400, 700), ("normal",), DEFAULT_CSS_URL),
    WebFontTarget("noto-serif-jp-web", "Noto Serif JP", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap"),
    WebFontTarget("noto-sans-sc-web", "Noto Sans SC", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap"),
    WebFontTarget("noto-sans-tc-web", "Noto Sans TC", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap"),
    WebFontTarget("inter-web", "Inter", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"),
    WebFontTarget("ibm-plex-sans-web", "IBM Plex Sans", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap"),
    WebFontTarget("jetbrains-mono-web", "JetBrains Mono", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"),
    WebFontTarget("zen-kaku-gothic-new-web", "Zen Kaku Gothic New", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&display=swap"),
    WebFontTarget("shippori-mincho-web", "Shippori Mincho", (400, 700), ("normal",), "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&display=swap"),
)

SOURCE_HAN_TARGET = WebFontTarget(
    "source-han-sans-web",
    "Source Han Sans CN",
    (400, 700),
    ("normal",),
    font_files=(
        (400, "https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@2.005R/SubsetOTF/CN/SourceHanSansCN-Regular.otf"),
        (700, "https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@2.005R/SubsetOTF/CN/SourceHanSansCN-Bold.otf"),
    ),
    source_note="Adobe Source Han Sans 2.005RのCN SubsetOTF。日本語版・繁体字版ではありません。",
)

ALL_WEB_FONT_TARGETS = GOOGLE_FONT_TARGETS + (SOURCE_HAN_TARGET,)


class GoogleFontsAnalysisError(RuntimeError):
    """取得または解析が不完全な場合に投げるエラー。"""


def parse_declarations(block: str) -> dict[str, str]:
    declarations: dict[str, str] = {}
    for declaration in block.split(";"):
        if ":" not in declaration:
            continue
        name, value = declaration.split(":", 1)
        declarations[name.strip().casefold()] = value.strip()
    return declarations


def declared_weights(value: str, requested: set[int]) -> list[int]:
    """単一Weightと可変Weight範囲の両方を、要求したWeightへ展開する。"""
    values = [int(item) for item in re.findall(r"\d+", value)]
    if len(values) == 1:
        return values if values[0] in requested else []
    if len(values) == 2:
        low, high = sorted(values)
        return sorted(weight for weight in requested if low <= weight <= high)
    raise GoogleFontsAnalysisError(f"未対応のfont-weight指定です: {value or '値なし'}")


def parse_google_fonts_css(
    css: str,
    weights: Iterable[int] = REQUESTED_WEIGHTS,
    styles: Iterable[str] = ("normal",),
) -> list[dict[str, object]]:
    requested = set(weights)
    requested_styles = {str(style).casefold() for style in styles}
    faces: list[dict[str, object]] = []
    for match in re.finditer(r"@font-face\s*\{(?P<body>.*?)\}", css, flags=re.DOTALL | re.IGNORECASE):
        declarations = parse_declarations(match.group("body"))
        style = declarations.get("font-style", "normal").casefold()
        if style not in requested_styles:
            continue
        matching_weights = declared_weights(declarations.get("font-weight", ""), requested)
        if not matching_weights:
            continue
        source = declarations.get("src", "")
        url_match = re.search(r"url\(\s*['\"]?(?P<url>https://[^)'\"\s]+\.woff2)['\"]?\s*\)", source)
        if not url_match:
            raise GoogleFontsAnalysisError(f"font-weight {declarations.get('font-weight', '')} のWOFF2 URLを抽出できません。")
        for weight in matching_weights:
            faces.append({"weight": weight, "style": style, "url": url_match.group("url"), "unicodeRange": declarations.get("unicode-range", "")})
    missing = sorted(requested - {int(face["weight"]) for face in faces})
    if missing:
        raise GoogleFontsAnalysisError(f"CSSに指定ウェイトがありません: {', '.join(map(str, missing))}")
    missing_styles = sorted(requested_styles - {str(face["style"]) for face in faces})
    if missing_styles:
        raise GoogleFontsAnalysisError(f"CSSに指定Styleがありません: {', '.join(missing_styles)}")
    return faces


def deduplicate_font_faces(faces: Iterable[dict[str, object]]) -> list[dict[str, object]]:
    by_url: dict[str, dict[str, object]] = {}
    for face in faces:
        url = str(face["url"])
        entry = by_url.setdefault(url, {"url": url, "weights": [], "styles": [], "unicodeRanges": []})
        weight = int(face["weight"])
        style = str(face.get("style") or "normal")
        unicode_range = str(face.get("unicodeRange") or "")
        if weight not in entry["weights"]:
            entry["weights"].append(weight)
        if style not in entry["styles"]:
            entry["styles"].append(style)
        if unicode_range and unicode_range not in entry["unicodeRanges"]:
            entry["unicodeRanges"].append(unicode_range)
    for entry in by_url.values():
        entry["weights"].sort()
    return list(by_url.values())


def merge_feature_results(files: Iterable[dict[str, object]]) -> list[dict[str, object]]:
    merged: dict[str, set[str]] = {}
    for file_result in files:
        for feature in file_result.get("features", []):
            tag = str(feature.get("tag") or "")
            if tag:
                merged.setdefault(tag, set()).update(str(table) for table in feature.get("tables", []))
    table_order = {"GSUB": 0, "GPOS": 1}
    return [{"tag": tag, "tables": sorted(tables, key=lambda value: table_order.get(value, 99))} for tag, tables in sorted(merged.items())]


def aggregate_font_versions(files: Iterable[dict[str, object]]) -> dict[str, object]:
    versions = sorted({str(item.get("fontVersion") or "").strip() for item in files if str(item.get("fontVersion") or "").strip()})
    missing = [str(item.get("fileName") or item.get("url") or "unknown") for item in files if not str(item.get("fontVersion") or "").strip()]
    result: dict[str, object] = {"fontVersionMissingFiles": missing}
    if len(versions) == 1:
        result["fontVersion"] = versions[0]
    elif versions:
        result["fontVersions"] = versions
    return result


def fetch_bytes(url: str, user_agent: str, timeout: int = 60) -> bytes:
    request = Request(url, headers={"User-Agent": user_agent})
    try:
        with urlopen(request, timeout=timeout) as response:
            return response.read()
    except OSError as error:
        curl = shutil.which("curl") or shutil.which("curl.exe")
        if not curl:
            raise GoogleFontsAnalysisError(f"取得に失敗しました: {url}: {error}") from error
        try:
            completed = subprocess.run([curl, "--fail", "--location", "--silent", "--show-error", "--user-agent", user_agent, url], check=True, capture_output=True, timeout=timeout)
        except (OSError, subprocess.SubprocessError) as fallback_error:
            raise GoogleFontsAnalysisError(f"取得に失敗しました: {url}: urllib={error}; curl={fallback_error}") from fallback_error
        return completed.stdout


def analyze_woff2(data: bytes) -> dict[str, object]:
    try:
        font = TTFont(io.BytesIO(data), lazy=False)
    except (TTLibError, ImportError, OSError) as error:
        raise GoogleFontsAnalysisError(f"WOFF2解析に失敗しました: {error}") from error
    try:
        cmap = font.getBestCmap()
        if cmap is None:
            raise GoogleFontsAnalysisError("Unicode対応のcmapを取得できません。")
        metadata = face_metadata(font)
        return {"fontVersion": metadata["version"], "features": analyze_features(font), "codepoints": set(cmap)}
    except GoogleFontsAnalysisError:
        raise
    except (KeyError, TTLibError, ValueError) as error:
        raise GoogleFontsAnalysisError(f"WOFF2のテーブル解析に失敗しました: {error}") from error
    finally:
        font.close()


def analyze_css_delivery(
    css: str,
    target: WebFontTarget | str,
    user_agent: str,
    fetched_on: str,
    downloader: Callable[[str, str], bytes] = fetch_bytes,
) -> dict[str, dict[str, object]]:
    if isinstance(target, str):
        target = WebFontTarget(FONT_ID, FONT_NAME, REQUESTED_WEIGHTS, ("normal",), target)
    if not target.css_url:
        raise GoogleFontsAnalysisError(f"Google Fonts CSS URLがありません: {target.font_id}")
    faces = parse_google_fonts_css(css, target.weights, target.styles)
    unique_files = deduplicate_font_faces(faces)
    analyzed_files: list[dict[str, object]] = []
    all_codepoints: set[int] = set()
    for index, file_info in enumerate(unique_files, start=1):
        url = str(file_info["url"])
        try:
            data = downloader(url, user_agent)
            parsed = analyze_woff2(data)
        except GoogleFontsAnalysisError as error:
            raise GoogleFontsAnalysisError(f"WOFF2 {index}/{len(unique_files)} の解析に失敗しました: {url}: {error}") from error
        codepoints = parsed.get("codepoints")
        if not isinstance(codepoints, set):
            raise GoogleFontsAnalysisError(f"WOFF2 {index}/{len(unique_files)} のcmap結果が不正です: {url}")
        all_codepoints.update(codepoints)
        analyzed_files.append({**file_info, "fileName": Path(urlparse(url).path).name, "sha256": hashlib.sha256(data).hexdigest(), "fontVersion": parsed.get("fontVersion"), "features": parsed.get("features", [])})

    versions = aggregate_font_versions(analyzed_files)
    common = {
        "fontName": target.font_name, "status": "analyzed", "sourceType": "web", "requestedWeights": list(target.weights), "requestedStyles": list(target.styles),
        "cssUrl": target.css_url, "cssFetchedAt": fetched_on, "userAgent": user_agent, "cssHost": urlparse(target.css_url).hostname,
        "woff2Hosts": sorted({urlparse(str(item["url"])).hostname for item in analyzed_files}), "fontFaceCount": len(faces),
        "fileCount": len(analyzed_files), "analysisDate": fetched_on, **versions,
    }
    coverage = {
        **common, "analysisTarget": f"Google Fonts配信WOFF2 {len(analyzed_files)}ファイル",
        "analysisMethod": "Google Fonts CSSに定義されたWOFF2のcmapを統合", "codepointCount": len(all_codepoints),
        "ranges": compress_codepoints(all_codepoints),
        "files": [{key: item[key] for key in ("url", "fileName", "weights", "styles", "unicodeRanges", "sha256", "fontVersion")} for item in analyzed_files],
        "caveat": CMAP_CAVEAT,
    }
    opentype = {
        **common, "analysisTarget": "Google Fonts CSSに定義されたWOFF2",
        "analysisMethod": "Google Fonts CSS解析後、全WOFF2のfontTools GSUB/GPOS FeatureListを解析して和集合を作成",
        "files": analyzed_files, "features": merge_feature_results(analyzed_files), "caveat": CMAP_CAVEAT,
    }
    return {"coverage": coverage, "openType": opentype}


def analyze_font_file_delivery(
    target: WebFontTarget,
    user_agent: str,
    fetched_on: str,
    downloader: Callable[[str, str], bytes] = fetch_bytes,
) -> dict[str, dict[str, object]]:
    """単体OTF/TTF/WOFF2配信をGoogle Fontsと同じ結果形式へ解析する。"""
    if not target.font_files:
        raise GoogleFontsAnalysisError(f"配信ファイルがありません: {target.font_id}")
    configured_weights = {weight for weight, _url in target.font_files}
    missing = sorted(set(target.weights) - configured_weights)
    if missing:
        raise GoogleFontsAnalysisError(f"配信ファイルに指定ウェイトがありません: {', '.join(map(str, missing))}")

    analyzed_files: list[dict[str, object]] = []
    all_codepoints: set[int] = set()
    for index, (weight, url) in enumerate(target.font_files, start=1):
        try:
            data = downloader(url, user_agent)
            parsed = analyze_woff2(data)
        except GoogleFontsAnalysisError as error:
            raise GoogleFontsAnalysisError(f"配信ファイル {index}/{len(target.font_files)} の解析に失敗しました: {url}: {error}") from error
        codepoints = parsed.get("codepoints")
        if not isinstance(codepoints, set):
            raise GoogleFontsAnalysisError(f"配信ファイル {index}/{len(target.font_files)} のcmap結果が不正です: {url}")
        all_codepoints.update(codepoints)
        analyzed_files.append({
            "url": url,
            "fileName": Path(urlparse(url).path).name,
            "weights": [weight],
            "styles": list(target.styles),
            "fileSize": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "fontVersion": parsed.get("fontVersion"),
            "features": parsed.get("features", []),
        })

    versions = aggregate_font_versions(analyzed_files)
    common = {
        "fontName": target.font_name,
        "status": "analyzed",
        "sourceType": "web",
        "requestedWeights": list(target.weights),
        "requestedStyles": list(target.styles),
        "analysisDate": fetched_on,
        "userAgent": user_agent,
        "fileCount": len(analyzed_files),
        "fileHosts": sorted({urlparse(str(item["url"])).hostname for item in analyzed_files}),
        "sourceNote": target.source_note,
        "files": analyzed_files,
        **versions,
    }
    coverage = {
        **common,
        "analysisTarget": "固定版のWeb配信OTF",
        "analysisMethod": "固定版OTFのfontTools cmap解析結果を統合",
        "codepointCount": len(all_codepoints),
        "ranges": compress_codepoints(all_codepoints),
        "caveat": "Source Han Sans CNの固定版SubsetOTFを解析した結果です。日本語版・繁体字版の収録情報ではありません。",
    }
    opentype = {
        **common,
        "analysisTarget": "固定版のWeb配信OTF",
        "analysisMethod": "固定版OTFのfontTools GSUB/GPOS FeatureListを解析して和集合を作成",
        "features": merge_feature_results(analyzed_files),
        "caveat": coverage["caveat"],
    }
    return {"coverage": coverage, "openType": opentype}


def analyze_targets(
    targets: Iterable[WebFontTarget],
    user_agent: str,
    fetched_on: str,
    downloader: Callable[[str, str], bytes] = fetch_bytes,
) -> dict[str, dict[str, dict[str, object]]]:
    """全対象が成功した場合だけ呼び出し元へ結果を返す。"""
    results: dict[str, dict[str, dict[str, object]]] = {}
    for target in targets:
        if target.css_url:
            css = downloader(target.css_url, user_agent).decode("utf-8")
            results[target.font_id] = analyze_css_delivery(css, target, user_agent, fetched_on, downloader)
        else:
            results[target.font_id] = analyze_font_file_delivery(target, user_agent, fetched_on, downloader)
    return results


def load_javascript_data(path: Path, variable_name: str) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    match = re.search(rf"window\.{re.escape(variable_name)}\s*=\s*(\{{.*\}});\s*$", text, flags=re.DOTALL)
    if not match:
        raise GoogleFontsAnalysisError(f"既存データを読み取れません: {path}")
    return json.loads(match.group(1))


def serialize_javascript_data(variable_name: str, comment: str, data: dict[str, object]) -> str:
    serialized = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return f"/* {comment} */\nwindow.{variable_name} = {serialized};\n"


def create_temporary_file(target: Path, contents: str, suffix: str = ".tmp") -> Path:
    target.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=suffix, dir=target.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as output:
            output.write(contents)
    except Exception:
        temporary.unlink(missing_ok=True)
        raise
    return temporary


def validate_temporary_javascript_data(path: Path, variable_name: str, target_ids: Iterable[str] = (FONT_ID,)) -> None:
    data = load_javascript_data(path, variable_name)
    fonts = data.get("fonts")
    missing = [font_id for font_id in target_ids if not isinstance(fonts, dict) or font_id not in fonts]
    if missing:
        raise GoogleFontsAnalysisError(f"一時データに対象フォントIDがありません: {', '.join(missing)}: {path}")
    if not data.get("generatedAt"):
        raise GoogleFontsAnalysisError(f"一時データにgeneratedAtがありません: {path}")


def create_backup(target: Path, original: bytes | None) -> Path | None:
    if original is None:
        return None
    descriptor, backup_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=".bak", dir=target.parent)
    backup = Path(backup_name)
    try:
        with os.fdopen(descriptor, "wb") as output:
            output.write(original)
    except Exception:
        backup.unlink(missing_ok=True)
        raise
    return backup


def replace_prepared_outputs(prepared: list[tuple[Path, Path]]) -> None:
    originals = {target: target.read_bytes() if target.exists() else None for _temporary, target in prepared}
    backups: dict[Path, Path | None] = {}
    replaced: list[Path] = []
    preserved_backups: set[Path] = set()
    try:
        for _temporary, target in prepared:
            backups[target] = create_backup(target, originals[target])
        for temporary, target in prepared:
            os.replace(temporary, target)
            replaced.append(target)
    except Exception as error:
        rollback_errors: list[str] = []
        for target in reversed(replaced):
            try:
                backup = backups.get(target)
                if backup is None:
                    target.unlink(missing_ok=True)
                else:
                    os.replace(backup, target)
                    backups[target] = None
            except Exception as rollback_error:
                backup = backups.get(target)
                if backup is not None:
                    preserved_backups.add(backup)
                    rollback_errors.append(f"対象 {target} をバックアップ {backup} から復元できませんでした: {rollback_error}")
                else:
                    rollback_errors.append(f"対象 {target} を削除して復元できませんでした: {rollback_error}")
        detail = f"生成データの置換に失敗しました: {error}"
        if rollback_errors:
            detail += f"; ロールバックにも失敗しました: {'; '.join(rollback_errors)}"
        raise GoogleFontsAnalysisError(detail) from error
    finally:
        for temporary, _target in prepared:
            temporary.unlink(missing_ok=True)
        for backup in backups.values():
            if backup is not None and backup not in preserved_backups:
                backup.unlink(missing_ok=True)


def update_outputs(
    opentype_path: Path,
    coverage_path: Path,
    results: dict[str, dict[str, dict[str, object]]] | dict[str, dict[str, object]],
    details_dir: Path | None = None,
) -> None:
    """全対象の一時出力検証後に、サマリーと詳細JSを同時に置換する。"""
    if "openType" in results and "coverage" in results:
        results = {FONT_ID: results}  # 後方互換: 既存の単一フォント呼び出し。
    details_dir = details_dir or opentype_path.parent / "analysis-details"
    typed_results = results
    opentype_data = load_javascript_data(opentype_path, "FontOpenTypeData")
    coverage_data = load_javascript_data(coverage_path, "FontCoverageData")
    detail_outputs: list[tuple[Path, dict[str, object]]] = []
    for font_id, result in typed_results.items():
        coverage_summary, opentype_summary, detail = split_analysis_entries(font_id, result["coverage"], result["openType"])
        opentype_data.setdefault("fonts", {})[font_id] = opentype_summary
        coverage_data.setdefault("fonts", {})[font_id] = coverage_summary
        detail_outputs.append((details_dir / f"{font_id}.js", detail))
    dates = {str(result["openType"]["analysisDate"]) for result in typed_results.values()}
    if len(dates) != 1:
        raise GoogleFontsAnalysisError("複数フォントの解析日が一致しません。")
    generated_at = dates.pop()
    opentype_data["generatedAt"] = generated_at
    coverage_data["generatedAt"] = generated_at
    opentype_data["schemaVersion"] = SUMMARY_SCHEMA_VERSION
    coverage_data["schemaVersion"] = SUMMARY_SCHEMA_VERSION
    prepared: list[tuple[Path, Path]] = []
    try:
        prepared.append((create_temporary_file(opentype_path, serialize_javascript_data("FontOpenTypeData", "OpenType起動時サマリー。ファイル別の解析証拠はanalysis-detailsに分離。", opentype_data)), opentype_path))
        prepared.append((create_temporary_file(coverage_path, serialize_javascript_data("FontCoverageData", "cmap起動時サマリー。ファイル別の解析証拠はanalysis-detailsに分離。", coverage_data)), coverage_path))
        for target, detail in detail_outputs:
            prepared.append((create_temporary_file(target, serialize_detail_javascript(target.stem, detail)), target))
        validate_temporary_javascript_data(prepared[0][0], "FontOpenTypeData", typed_results)
        validate_temporary_javascript_data(prepared[1][0], "FontCoverageData", typed_results)
        replace_prepared_outputs(prepared)
    finally:
        for temporary, _target in prepared:
            temporary.unlink(missing_ok=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font", action="append", choices=[target.font_id for target in ALL_WEB_FONT_TARGETS], help="解析する既定WebフォントID。複数指定可。省略時は全10フォント。")
    parser.add_argument("--font-id", help="任意のGoogle FontsフォントID（--css-url、--font-nameと併用）")
    parser.add_argument("--font-name", help="任意のGoogle Fonts表示名（--font-id、--css-urlと併用）")
    parser.add_argument("--css-url", help="任意のGoogle Fonts CSS URL")
    parser.add_argument("--weight", action="append", type=int, help="任意フォントのWeight。複数指定可。")
    parser.add_argument("--style", action="append", help="任意フォントのStyle。複数指定可。")
    parser.add_argument("--user-agent", default=DEFAULT_USER_AGENT)
    parser.add_argument("--output", type=Path, default=Path("font-opentype-data.js"))
    parser.add_argument("--coverage-output", type=Path, default=Path("font-coverage-data.js"))
    parser.add_argument("--details-dir", type=Path, default=Path("analysis-details"))
    return parser.parse_args()


def selected_targets(args: argparse.Namespace) -> tuple[WebFontTarget, ...]:
    font_id = getattr(args, "font_id", None)
    font_name = getattr(args, "font_name", None)
    css_url = getattr(args, "css_url", None)
    requested_ids = getattr(args, "font", None)
    requested_weights = getattr(args, "weight", None)
    requested_styles = getattr(args, "style", None)
    custom_values = (font_id, font_name, css_url)
    if css_url and not font_id and not font_name and not hasattr(args, "font_id"):
        return (WebFontTarget(FONT_ID, FONT_NAME, REQUESTED_WEIGHTS, ("normal",), css_url),)
    if any(custom_values):
        if not all(custom_values):
            raise GoogleFontsAnalysisError("任意フォントは --font-id、--font-name、--css-url をすべて指定してください。")
        if requested_ids:
            raise GoogleFontsAnalysisError("任意フォント指定と --font は併用できません。")
        weights = tuple(requested_weights or REQUESTED_WEIGHTS)
        styles = tuple(requested_styles or ("normal",))
        return (WebFontTarget(font_id, font_name, weights, styles, css_url),)
    if requested_weights or requested_styles:
        raise GoogleFontsAnalysisError("--weight と --style は任意フォント指定と併用してください。")
    wanted = set(requested_ids or [target.font_id for target in ALL_WEB_FONT_TARGETS])
    return tuple(target for target in ALL_WEB_FONT_TARGETS if target.font_id in wanted)


def main() -> int:
    args = parse_args()
    fetched_on = date.today().isoformat()
    try:
        targets = selected_targets(args)
        results = analyze_targets(targets, args.user_agent, fetched_on, downloader=fetch_bytes)
        update_outputs(args.output, args.coverage_output, results, getattr(args, "details_dir", None))
    except (GoogleFontsAnalysisError, UnicodeError, OSError, ValueError) as error:
        print(f"エラー: {error}", file=sys.stderr)
        return 2
    print(f"取得日: {fetched_on} / User-Agent: {args.user_agent}")
    for font_id, result in results.items():
        opentype = result["openType"]
        coverage = result["coverage"]
        version = opentype.get("fontVersion") or " / ".join(opentype.get("fontVersions", [])) or "記録なし"
        source = opentype.get("cssUrl") or ", ".join(item["url"] for item in opentype["files"])
        print(f"解析元: {source}")
        print(f"{font_id}: {opentype['fileCount']} files / {coverage['codepointCount']} cmap codepoints / {len(opentype['features'])} features / {version}")
    print(f"OpenType出力: {args.output}")
    print(f"cmap出力: {args.coverage_output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
