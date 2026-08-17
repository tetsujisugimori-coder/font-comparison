"""対象フォントを解析し、cmap と OpenType機能情報を Web アプリ用データとして出力する。"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from fontTools.ttLib import TTCollection, TTFont, TTLibError


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
    "noto-sans-jp-web": FontTarget(
        "Noto Sans JP",
        ("NotoSansJP-Regular.woff2", "NotoSansJP-Regular.otf", "NotoSansJP-Regular.ttf", "NotoSansJP-Regular.woff"),
        ("Noto Sans JP",),
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
    if path.suffix.casefold() == ".ttc":
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
    return parser.parse_args()


def write_javascript(
    coverage_path: Path,
    opentype_path: Path,
    coverage_data: dict[str, object],
    open_type_data: dict[str, object],
) -> None:
    coverage_serialized = json.dumps(coverage_data, ensure_ascii=False, separators=(",", ":"))
    coverage_path.write_text(
        "/* analyze_font_cmap.py で生成。フォントファイル自体は含みません。 */\n"
        f"window.FontCoverageData = {coverage_serialized};\n",
        encoding="utf-8",
    )
    open_type_serialized = json.dumps(open_type_data, ensure_ascii=False, separators=(",", ":"))
    opentype_path.write_text(
        "/* analyze_font_cmap.py で生成。OpenType機能用データ。フォントファイル自体は含みません。 */\n"
        f"window.FontOpenTypeData = {open_type_serialized};\n",
        encoding="utf-8",
    )


def main() -> int:
    args = parse_args()
    try:
        font_paths = parse_assignments(args.font, "--font")
        face_names = parse_assignments(args.face, "--face")
        analyzed = build_output(font_paths, face_names, args.font_dir)
        coverage_data = analyzed["coverage"]
        open_type_data = analyzed["openType"]
        write_javascript(args.output, args.open_type_output, coverage_data, open_type_data)
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
