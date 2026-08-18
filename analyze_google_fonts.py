"""Google Fonts CSSに定義されたWOFF2を解析し、OpenType静的データを更新する。"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import shutil
import subprocess
import sys
from collections.abc import Callable, Iterable
from datetime import date
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from fontTools.ttLib import TTFont, TTLibError

from analyze_font_cmap import analyze_features, face_metadata


DEFAULT_CSS_URL = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
FONT_ID = "noto-sans-jp-web"
FONT_NAME = "Noto Sans JP"
REQUESTED_WEIGHTS = (400, 700)


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


def parse_google_fonts_css(css: str, weights: Iterable[int] = REQUESTED_WEIGHTS) -> list[dict[str, object]]:
    requested = set(weights)
    faces: list[dict[str, object]] = []
    for match in re.finditer(r"@font-face\s*\{(?P<body>.*?)\}", css, flags=re.DOTALL | re.IGNORECASE):
        declarations = parse_declarations(match.group("body"))
        try:
            weight = int(declarations.get("font-weight", ""))
        except ValueError:
            continue
        if weight not in requested:
            continue
        source = declarations.get("src", "")
        url_match = re.search(r"url\(\s*['\"]?(?P<url>https://[^)'\"\s]+\.woff2)['\"]?\s*\)", source)
        if not url_match:
            raise GoogleFontsAnalysisError(f"font-weight {weight} のWOFF2 URLを抽出できません。")
        faces.append(
            {
                "weight": weight,
                "url": url_match.group("url"),
                "unicodeRange": declarations.get("unicode-range", ""),
            }
        )
    missing = sorted(requested - {int(face["weight"]) for face in faces})
    if missing:
        raise GoogleFontsAnalysisError(f"CSSに指定ウェイトがありません: {', '.join(map(str, missing))}")
    return faces


def deduplicate_font_faces(faces: Iterable[dict[str, object]]) -> list[dict[str, object]]:
    by_url: dict[str, dict[str, object]] = {}
    for face in faces:
        url = str(face["url"])
        entry = by_url.setdefault(url, {"url": url, "weights": [], "unicodeRanges": []})
        weight = int(face["weight"])
        unicode_range = str(face.get("unicodeRange") or "")
        if weight not in entry["weights"]:
            entry["weights"].append(weight)
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
            if not tag:
                continue
            merged.setdefault(tag, set()).update(str(table) for table in feature.get("tables", []))
    table_order = {"GSUB": 0, "GPOS": 1}
    return [
        {"tag": tag, "tables": sorted(tables, key=lambda value: table_order.get(value, 99))}
        for tag, tables in sorted(merged.items())
    ]


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
            completed = subprocess.run(
                [curl, "--fail", "--location", "--silent", "--show-error", "--user-agent", user_agent, url],
                check=True,
                capture_output=True,
                timeout=timeout,
            )
        except (OSError, subprocess.SubprocessError) as fallback_error:
            raise GoogleFontsAnalysisError(
                f"取得に失敗しました: {url}: urllib={error}; curl={fallback_error}"
            ) from fallback_error
        return completed.stdout


def analyze_woff2(data: bytes) -> dict[str, object]:
    try:
        font = TTFont(io.BytesIO(data), lazy=False)
    except (TTLibError, ImportError, OSError) as error:
        raise GoogleFontsAnalysisError(f"WOFF2解析に失敗しました: {error}") from error
    try:
        metadata = face_metadata(font)
        return {
            "fontVersion": metadata["version"],
            "features": analyze_features(font),
        }
    except (KeyError, TTLibError, ValueError) as error:
        raise GoogleFontsAnalysisError(f"WOFF2のテーブル解析に失敗しました: {error}") from error
    finally:
        font.close()


def analyze_css_delivery(
    css: str,
    css_url: str,
    user_agent: str,
    fetched_on: str,
    downloader: Callable[[str, str], bytes] = fetch_bytes,
) -> dict[str, object]:
    faces = parse_google_fonts_css(css)
    unique_files = deduplicate_font_faces(faces)
    analyzed_files: list[dict[str, object]] = []
    for index, file_info in enumerate(unique_files, start=1):
        url = str(file_info["url"])
        try:
            data = downloader(url, user_agent)
            parsed = analyze_woff2(data)
        except GoogleFontsAnalysisError as error:
            raise GoogleFontsAnalysisError(
                f"WOFF2 {index}/{len(unique_files)} の解析に失敗しました: {url}: {error}"
            ) from error
        analyzed_files.append(
            {
                **file_info,
                "fileName": Path(urlparse(url).path).name,
                "sha256": hashlib.sha256(data).hexdigest(),
                **parsed,
            }
        )

    features = merge_feature_results(analyzed_files)
    return {
        "fontName": FONT_NAME,
        "status": "analyzed",
        "requestedWeights": list(REQUESTED_WEIGHTS),
        "cssUrl": css_url,
        "cssFetchedAt": fetched_on,
        "userAgent": user_agent,
        "cssHost": urlparse(css_url).hostname,
        "woff2Hosts": sorted({urlparse(str(item["url"])).hostname for item in analyzed_files}),
        "fontFaceCount": len(faces),
        "fileCount": len(analyzed_files),
        "files": analyzed_files,
        "analysisDate": fetched_on,
        "analysisMethod": "Google Fonts CSS解析後、全WOFF2のfontTools GSUB/GPOS FeatureListを解析して和集合を作成",
        "features": features,
    }


def load_javascript_data(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"window\.FontOpenTypeData\s*=\s*(\{.*\});\s*$", text, flags=re.DOTALL)
    if not match:
        raise GoogleFontsAnalysisError(f"既存データを読み取れません: {path}")
    return json.loads(match.group(1))


def write_javascript_data(path: Path, data: dict[str, object]) -> None:
    serialized = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    path.write_text(
        "/* OpenType解析スクリプトで生成。フォントファイル自体は含みません。 */\n"
        f"window.FontOpenTypeData = {serialized};\n",
        encoding="utf-8",
        newline="\n",
    )


def update_output(path: Path, noto_entry: dict[str, object]) -> None:
    data = load_javascript_data(path)
    fonts = data.setdefault("fonts", {})
    fonts[FONT_ID] = noto_entry
    data["generatedAt"] = str(noto_entry["analysisDate"])
    write_javascript_data(path, data)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--css-url", default=DEFAULT_CSS_URL)
    parser.add_argument("--user-agent", default=DEFAULT_USER_AGENT)
    parser.add_argument("--output", type=Path, default=Path("font-opentype-data.js"))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    fetched_on = date.today().isoformat()
    try:
        css = fetch_bytes(args.css_url, args.user_agent).decode("utf-8")
        entry = analyze_css_delivery(css, args.css_url, args.user_agent, fetched_on)
        update_output(args.output, entry)
    except (GoogleFontsAnalysisError, UnicodeError, OSError, ValueError) as error:
        print(f"エラー: {error}", file=sys.stderr)
        return 2
    print(
        f"{FONT_ID}: {entry['fileCount']} WOFF2 / {len(entry['features'])} features / "
        f"CSS取得日 {entry['cssFetchedAt']}"
    )
    print(f"OpenType出力: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
