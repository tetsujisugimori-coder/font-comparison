"""対象フォントを解析し、cmap と OpenType機能情報を Web アプリ用データとして出力する。"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from fontTools.ttLib import TTCollection, TTFont, TTLibError


SUMMARY_SCHEMA_VERSION = 2
DETAIL_SCHEMA_VERSION = 1


@dataclass(frozen=True)
class FontTarget:
    label: str
    candidates: tuple[str, ...]
    face_names: tuple[str, ...]


TARGETS: dict[str, FontTarget] = {
    "segoe-ui": FontTarget("Segoe UI", ("segoeui.ttf",), ("Segoe UI", "Segoe UI Regular")),
    "yu-gothic-ui": FontTarget(
        "Yu Gothic UI",
        ("YuGothM.ttc", "YuGothR.ttc", "YuGothL.ttc", "YuGothB.ttc"),
        ("Yu Gothic UI Regular", "Yu Gothic UI"),
    ),
    "meiryo": FontTarget("Meiryo", ("meiryo.ttc",), ("Meiryo",)),
    "ms-mincho": FontTarget("MS Mincho", ("msmincho.ttc",), ("MS Mincho",)),
    "consolas": FontTarget("Consolas", ("consola.ttf",), ("Consolas",)),
    "cascadia-code": FontTarget(
        "Cascadia Code",
        ("CascadiaCode.ttf", "CascadiaCodePL.ttf", "CascadiaMono.ttf"),
        ("Cascadia Code", "Cascadia Code Regular"),
    ),
    "courier-new": FontTarget("Courier New", ("cour.ttf",), ("Courier New", "Courier New Regular")),
    "times-new-roman": FontTarget(
        "Times New Roman", ("times.ttf",), ("Times New Roman", "Times New Roman Regular")
    ),
}


def name_values(font: TTFont, name_id: int) -> list[str]:
    values: list[str] = []
    for record in font["name"].names:
        if record.nameID != name_id:
            continue
        try:
            value = record.toUnicode().strip()
        except UnicodeError:
            continue
        if value and value not in values:
            values.append(value)
    return values


def face_metadata(font: TTFont) -> dict[str, object]:
    family_names = name_values(font, 1)
    subfamily_names = name_values(font, 2)
    full_names = name_values(font, 4)
    postscript_names = name_values(font, 6)
    versions = name_values(font, 5)
    return {
        "familyNames": family_names,
        "subfamilyNames": subfamily_names,
        "fullNames": full_names,
        "postscriptNames": postscript_names,
        "version": versions[0] if versions else f"Version {font['head'].fontRevision:g}",
    }


def face_score(metadata: dict[str, object], expected_names: Iterable[str]) -> int:
    expected = [value.casefold() for value in expected_names]
    full_names = [value.casefold() for value in metadata["fullNames"]]
    family_names = [value.casefold() for value in metadata["familyNames"]]
    postscript_names = [value.casefold() for value in metadata["postscriptNames"]]
    for index, candidate in enumerate(expected):
        priority = len(expected) - index
        if candidate in full_names:
            return 300 + priority
        if candidate in family_names:
            return 200 + priority
        normalized = candidate.replace(" ", "-")
        if normalized in postscript_names or candidate.replace(" ", "") in postscript_names:
            return 100 + priority
    return 0


def open_faces(path: Path) -> list[TTFont]:
    if path.suffix.casefold() in {".ttc", ".otc"}:
        return TTCollection(path, lazy=True).fonts
    return [TTFont(path, lazy=True)]


def select_face(path: Path, target: FontTarget, requested_face: str | None) -> tuple[TTFont, int, dict[str, object], list[TTFont]]:
    faces = open_faces(path)
    expected_names = (requested_face,) if requested_face else target.face_names
    matches: list[tuple[int, int, TTFont, dict[str, object]]] = []
    for index, font in enumerate(faces):
        metadata = face_metadata(font)
        matches.append((face_score(metadata, expected_names), index, font, metadata))
    matches.sort(key=lambda item: (-item[0], item[1]))
    score, index, font, metadata = matches[0]
    if score == 0:
        available = [name for _, _, _, item in matches for name in item["fullNames"]]
        for item in faces:
            item.close()
        raise ValueError(
            f"対象フェイス {target.label!r} を {path.name} から選択できません。"
            f" 内部フェイス: {', '.join(available) or '名前なし'}"
        )
    return font, index, metadata, faces


def parse_feature_tags(font: TTFont, table_tag: str) -> list[str]:
    table = font.get(table_tag)
    if table is None or not hasattr(table, "table"):
        return []
    feature_list = getattr(getattr(table, "table", None), "FeatureList", None)
    if feature_list is None:
        return []
    tags = []
    for record in getattr(feature_list, "FeatureRecord", []):
        raw_tag = getattr(record, "FeatureTag", None)
        if raw_tag is None:
            continue
        tag = raw_tag.decode("ascii", "ignore") if isinstance(raw_tag, (bytes, bytearray)) else str(raw_tag)
        tag = tag.strip()
        if len(tag) == 4 and tag not in tags:
            tags.append(tag)
    return tags


def analyze_features(font: TTFont) -> list[dict[str, object]]:
    gsub = parse_feature_tags(font, "GSUB")
    gpos = parse_feature_tags(font, "GPOS")
    result: list[dict[str, object]] = []
    for tag in sorted(set(gsub) | set(gpos)):
        tables = []
        if tag in gsub:
            tables.append("GSUB")
        if tag in gpos:
            tables.append("GPOS")
        result.append({"tag": tag, "tables": tables})
    return result


def compress_codepoints(codepoints: Iterable[int]) -> list[list[int]]:
    points = sorted(set(codepoints))
    if not points:
        return []
    ranges: list[list[int]] = []
    start = previous = points[0]
    for codepoint in points[1:]:
        if codepoint == previous + 1:
            previous = codepoint
            continue
        ranges.append([start, previous])
        start = previous = codepoint
    ranges.append([start, previous])
    return ranges


def parse_assignments(values: list[str], option: str) -> dict[str, str]:
    parsed: dict[str, str] = {}
    for value in values:
        if "=" not in value:
            raise ValueError(f"{option} は FONT_ID=VALUE 形式で指定してください: {value}")
        font_id, assigned = value.split("=", 1)
        if font_id not in TARGETS:
            raise ValueError(f"未知のフォントIDです: {font_id}")
        parsed[font_id] = assigned
    return parsed


def default_font_path(target: FontTarget, font_dir: Path) -> Path | None:
    if not font_dir.is_dir():
        return None
    entries = {entry.name.casefold(): entry for entry in font_dir.iterdir()}
    for candidate in target.candidates:
        if candidate.casefold() in entries:
            return entries[candidate.casefold()]
    return None


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def analyze_font(target: FontTarget, path: Path, requested_face: str | None) -> tuple[dict[str, object], dict[str, object]]:
    font, face_index, metadata, all_faces = select_face(path, target, requested_face)
    try:
        cmap = font.getBestCmap()
        if cmap is None:
            raise ValueError("Unicode対応のcmapが見つかりません。")
        cover = {
            "fontName": target.label,
            "status": "analyzed",
            "sourceType": "collection" if path.suffix.casefold() in {".ttc", ".otc"} else "file",
            "fileName": path.name,
            "faceIndex": face_index,
            "faceName": (metadata["fullNames"] or metadata["familyNames"] or ["未確認"])[0],
            "fontVersion": metadata["version"],
            "codepointCount": len(cmap),
            "ranges": compress_codepoints(cmap.keys()),
        }
        feature = {
            "fontName": target.label,
            "status": "analyzed",
            "sourceType": "collection" if path.suffix.casefold() in {".ttc", ".otc"} else "file",
            "fileName": path.name,
            "faceIndex": face_index,
            "faceName": (metadata["fullNames"] or metadata["familyNames"] or ["未確認"])[0],
            "fontVersion": metadata["version"],
            "analysisDate": now_iso(),
            "analysisMethod": "fontTools FeatureList解析（GSUB/GPOS）",
            "features": analyze_features(font),
        }
        return cover, feature
    finally:
        for item in all_faces:
            item.close()


def analyzed_entry_not_available(font_id: str, path: Path | None, reason: str) -> dict[str, object]:
    return {
        "fontName": TARGETS[font_id].label,
        "status": "not-analyzed",
        "fileName": path.name if path else None,
        "faceIndex": None,
        "faceName": None,
        "fontVersion": None,
        "analysisDate": now_iso(),
        "analysisMethod": None,
        "features": [],
        "reason": reason,
    }


def build_output(font_paths: dict[str, str], face_names: dict[str, str], font_dir: Path) -> dict[str, dict[str, object]]:
    coverage_fonts: dict[str, object] = {}
    opentype_fonts: dict[str, object] = {}

    for font_id, target in TARGETS.items():
        configured_path = Path(font_paths[font_id]).expanduser() if font_id in font_paths else None
        path = configured_path or default_font_path(target, font_dir)
        if path is None or not path.is_file():
            not_analyzed = analyzed_entry_not_available(font_id, path, "フォントファイルが見つかりません。")
            coverage_fonts[font_id] = {
                "fontName": not_analyzed["fontName"],
                "status": "not-analyzed",
                "fileName": not_analyzed["fileName"],
                "faceIndex": None,
                "faceName": None,
                "fontVersion": None,
                "codepointCount": None,
                "ranges": [],
                "reason": not_analyzed["reason"],
            }
            opentype_fonts[font_id] = not_analyzed
            continue
        try:
            coverage_result, open_type_result = analyze_font(target, path, face_names.get(font_id))
            coverage_fonts[font_id] = coverage_result
            opentype_fonts[font_id] = open_type_result
        except (OSError, TTLibError, ValueError, KeyError) as error:
            not_analyzed = analyzed_entry_not_available(font_id, path, str(error))
            coverage_fonts[font_id] = {
                "fontName": not_analyzed["fontName"],
                "status": "not-analyzed",
                "fileName": not_analyzed["fileName"],
                "faceIndex": None,
                "faceName": None,
                "fontVersion": None,
                "codepointCount": None,
                "ranges": [],
                "reason": not_analyzed["reason"],
            }
            opentype_fonts[font_id] = not_analyzed

    return {
        "coverage": {
            "schemaVersion": 1,
            "generatedAt": now_iso(),
            "fonts": coverage_fonts,
        },
        "openType": {
            "schemaVersion": 1,
            "generatedAt": now_iso(),
            "fonts": opentype_fonts,
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--font",
        action="append",
        default=[],
        metavar="FONT_ID=PATH",
        help="フォントIDごとのTTF/OTF/TTCパス。複数回指定可能。",
    )
    parser.add_argument(
        "--face",
        action="append",
        default=[],
        metavar="FONT_ID=INTERNAL_NAME",
        help="TTC等で選ぶ内部ファミリー名またはフルネーム。複数回指定可能。",
    )
    parser.add_argument(
        "--font-dir",
        type=Path,
        default=Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts",
        help="明示パスがない場合に既知のファイル名を探すフォントディレクトリ。",
    )
    parser.add_argument("--output", type=Path, default=Path("font-coverage-data.js"))
    parser.add_argument("--open-type-output", type=Path, default=Path("font-opentype-data.js"))
    parser.add_argument("--details-dir", type=Path, default=Path("analysis-details"))
    return parser.parse_args()


def serialize_javascript_data(variable_name: str, comment: str, data: dict[str, object]) -> str:
    return f"/* {comment} */\nwindow.{variable_name} = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};\n"


def serialize_detail_javascript(font_id: str, detail: dict[str, object]) -> str:
    return (
        "/* 解析証拠の詳細。フォントファイル自体は含みません。 */\n"
        "window.FontAnalysisDetails = window.FontAnalysisDetails || {};\n"
        f"window.FontAnalysisDetails[{json.dumps(font_id, ensure_ascii=False)}] = {json.dumps(detail, ensure_ascii=False, separators=(',', ':'))};\n"
    )


def create_temporary_file(target: Path, contents: str) -> Path:
    target.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=".tmp", dir=target.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as output:
            output.write(contents)
    except Exception:
        temporary.unlink(missing_ok=True)
        raise
    return temporary


def replace_prepared_outputs(prepared: list[tuple[Path, Path]]) -> None:
    originals = {target: target.read_bytes() if target.exists() else None for _temporary, target in prepared}
    backups: dict[Path, Path | None] = {}
    replaced: list[Path] = []
    preserved_backups: set[Path] = set()
    try:
        for _temporary, target in prepared:
            original = originals[target]
            if original is None:
                backups[target] = None
                continue
            descriptor, backup_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=".bak", dir=target.parent)
            backup = Path(backup_name)
            with os.fdopen(descriptor, "wb") as output:
                output.write(original)
            backups[target] = backup
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
        message = f"生成データの置換に失敗しました: {error}"
        if rollback_errors:
            message += f"; ロールバックにも失敗しました: {'; '.join(rollback_errors)}"
        raise RuntimeError(message) from error
    finally:
        for temporary, _target in prepared:
            temporary.unlink(missing_ok=True)
        for backup in backups.values():
            if backup is not None and backup not in preserved_backups:
                backup.unlink(missing_ok=True)


def split_analysis_entries(font_id: str, coverage: dict[str, object], open_type: dict[str, object]) -> tuple[dict[str, object], dict[str, object], dict[str, object]]:
    """起動時サマリーと、ファイル証拠を一つに正規化した詳細へ分離する。"""
    status = str(open_type.get("status") or coverage.get("status") or "not-analyzed")
    has_details = status == "analyzed"
    common_keys = (
        "fontName", "status", "sourceType", "fileName", "faceIndex", "faceName", "fontVersion",
        "fontVersions", "fontVersionMissingFiles", "requestedWeights", "requestedStyles", "fileCount",
        "analysisDate", "reason", "caveat", "sourceNote",
    )
    common = {key: open_type.get(key, coverage.get(key)) for key in common_keys if open_type.get(key, coverage.get(key)) is not None}
    marker = {"schemaVersion": SUMMARY_SCHEMA_VERSION, "detailSchemaVersion": DETAIL_SCHEMA_VERSION if has_details else None, "hasDetails": has_details}
    coverage_summary = {
        **common, **marker,
        "codepointCount": coverage.get("codepointCount"), "ranges": coverage.get("ranges", []),
        "analysisTarget": coverage.get("analysisTarget"), "analysisMethod": coverage.get("analysisMethod"),
    }
    open_type_summary = {
        **common, **marker,
        "features": open_type.get("features", []),
        "analysisTarget": open_type.get("analysisTarget"), "analysisMethod": open_type.get("analysisMethod"),
    }
    evidence = {**coverage, **open_type}
    files = open_type.get("files") if isinstance(open_type.get("files"), list) else coverage.get("files", [])
    for key in ("files", "ranges", "features", "codepointCount", "analysisTarget", "analysisMethod", "caveat"):
        evidence.pop(key, None)
    evidence["files"] = files
    detail = {
        "schemaVersion": DETAIL_SCHEMA_VERSION,
        "fontId": font_id,
        "evidence": evidence,
        "coverage": {key: coverage[key] for key in ("analysisTarget", "analysisMethod", "caveat") if coverage.get(key) is not None},
        "openType": {key: open_type[key] for key in ("analysisTarget", "analysisMethod", "caveat") if open_type.get(key) is not None},
    }
    return coverage_summary, open_type_summary, detail


def load_javascript_data(path: Path, variable_name: str) -> dict[str, object]:
    match = re.search(rf"window\.{re.escape(variable_name)}\s*=\s*(\{{.*\}});\s*$", path.read_text(encoding="utf-8"), flags=re.DOTALL)
    if not match:
        raise ValueError(f"既存データを読み取れません: {path}")
    return json.loads(match.group(1))


def write_javascript(coverage_path: Path, opentype_path: Path, coverage_data: dict[str, object], open_type_data: dict[str, object], details_dir: Path, updated_ids: set[str] | None = None) -> None:
    existing_coverage = load_javascript_data(coverage_path, "FontCoverageData") if updated_ids and coverage_path.exists() else {"fonts": {}}
    existing_opentype = load_javascript_data(opentype_path, "FontOpenTypeData") if updated_ids and opentype_path.exists() else {"fonts": {}}
    coverage_fonts: dict[str, object] = dict(existing_coverage.get("fonts", {}))
    opentype_fonts: dict[str, object] = dict(existing_opentype.get("fonts", {}))
    prepared: list[tuple[Path, Path]] = []
    try:
        target_ids = updated_ids or set(coverage_data["fonts"])
        for font_id in target_ids:
            coverage = coverage_data["fonts"][font_id]
            open_type = open_type_data["fonts"][font_id]
            coverage_summary, opentype_summary, detail = split_analysis_entries(font_id, coverage, open_type)
            coverage_fonts[font_id] = coverage_summary
            opentype_fonts[font_id] = opentype_summary
            if detail["evidence"].get("status") == "analyzed":
                target = details_dir / f"{font_id}.js"
                prepared.append((create_temporary_file(target, serialize_detail_javascript(font_id, detail)), target))
        coverage_summary_data = {"schemaVersion": SUMMARY_SCHEMA_VERSION, "generatedAt": coverage_data["generatedAt"], "fonts": coverage_fonts}
        open_type_summary_data = {"schemaVersion": SUMMARY_SCHEMA_VERSION, "generatedAt": open_type_data["generatedAt"], "fonts": opentype_fonts}
        prepared.append((
            create_temporary_file(coverage_path, serialize_javascript_data("FontCoverageData", "cmap起動時サマリー。ファイル別の解析証拠はanalysis-detailsに分離。", coverage_summary_data)),
            coverage_path,
        ))
        prepared.append((
            create_temporary_file(opentype_path, serialize_javascript_data("FontOpenTypeData", "OpenType起動時サマリー。ファイル別の解析証拠はanalysis-detailsに分離。", open_type_summary_data)),
            opentype_path,
        ))
        replace_prepared_outputs(prepared)
    finally:
        for temporary, _target in prepared:
            temporary.unlink(missing_ok=True)


def main() -> int:
    args = parse_args()
    try:
        font_paths = parse_assignments(args.font, "--font")
        face_names = parse_assignments(args.face, "--face")
        analyzed = build_output(font_paths, face_names, args.font_dir)
        coverage_data = analyzed["coverage"]
        open_type_data = analyzed["openType"]
        write_javascript(args.output, args.open_type_output, coverage_data, open_type_data, args.details_dir, set(font_paths) or None)
    except (OSError, ValueError) as error:
        print(f"エラー: {error}", file=sys.stderr)
        return 2

    for font_id, result in coverage_data["fonts"].items():
        if result["status"] == "analyzed":
            print(
                f"{font_id}: {result['fileName']} / {result['faceName']} / "
                f"{result['fontVersion']} / {result['codepointCount']} codepoints"
            )
        else:
            print(f"{font_id}: cmap解析未実施 ({result['reason']})")

    for font_id, result in open_type_data["fonts"].items():
        feature_count = len(result["features"])
        if result["status"] == "analyzed":
            print(f"{font_id}: OpenType機能 {feature_count}件 / {result['analysisMethod']}")
        else:
            print(f"{font_id}: OpenType機能 未解析 ({result['reason']})")

    print(f"cmap出力: {args.output}")
    print(f"OpenType出力: {args.open_type_output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
