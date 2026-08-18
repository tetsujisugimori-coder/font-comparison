"""Windows の実フォントからカード用 Font Family / Weight / Style 情報を生成する。"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from fontTools.ttLib import TTCollection, TTFont, TTLibError


# カードIDと、name テーブルに記録された同一ファミリー名を対応付ける。
# Weight / Style はここで定義せず、各フェイスの OS/2 テーブルから取得する。
TARGETS = {
    "segoe-ui": {"label": "Segoe UI", "families": {"Segoe UI"}},
    "yu-gothic-ui": {"label": "Yu Gothic UI", "families": {"Yu Gothic UI"}},
    "meiryo": {"label": "Meiryo", "families": {"Meiryo"}},
    "ms-mincho": {"label": "MS Mincho", "families": {"MS Mincho", "ＭＳ 明朝"}},
    "consolas": {"label": "Consolas", "families": {"Consolas"}},
    "cascadia-code": {"label": "Cascadia Code", "families": {"Cascadia Code"}},
    "courier-new": {"label": "Courier New", "families": {"Courier New"}},
    "times-new-roman": {"label": "Times New Roman", "families": {"Times New Roman"}},
}
FONT_EXTENSIONS = {".ttf", ".otf", ".ttc", ".otc"}


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


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


def family_names(font: TTFont) -> list[str]:
    # Typographic Family (16) があれば優先し、なければ Font Family (1) を使う。
    return name_values(font, 16) or name_values(font, 1)


def is_native_italic(font: TTFont) -> bool:
    # OS/2.fsSelection の ITALIC ビットは、専用の italic face を示す実データ。
    os2 = font.get("OS/2")
    return bool(os2 and int(getattr(os2, "fsSelection", 0)) & 0x01)


def open_faces(path: Path) -> tuple[list[TTFont], bool]:
    is_collection = path.suffix.casefold() in {".ttc", ".otc"}
    if is_collection:
        return TTCollection(path, lazy=True).fonts, True
    return [TTFont(path, lazy=True)], False


def analyze_font_directory(font_dir: Path) -> dict[str, object]:
    entries: dict[str, list[dict[str, object]]] = {font_id: [] for font_id in TARGETS}
    expected_names = {
        font_id: {name.casefold() for name in target["families"]}
        for font_id, target in TARGETS.items()
    }

    for path in sorted(font_dir.iterdir(), key=lambda item: item.name.casefold()):
        if path.suffix.casefold() not in FONT_EXTENSIONS or not path.is_file():
            continue
        try:
            faces, is_collection = open_faces(path)
        except (OSError, TTLibError):
            continue
        try:
            for face_index, font in enumerate(faces):
                names = family_names(font)
                matched_id = next(
                    (
                        font_id
                        for font_id, candidates in expected_names.items()
                        if any(name.casefold() in candidates for name in names)
                    ),
                    None,
                )
                if matched_id is None:
                    continue
                os2 = font.get("OS/2")
                weight = getattr(os2, "usWeightClass", None)
                if not isinstance(weight, int) or not 1 <= weight <= 1000:
                    continue
                entries[matched_id].append(
                    {
                        "fileName": path.name,
                        "faceIndex": face_index if is_collection else None,
                        "family": names[0],
                        "weight": weight,
                        "style": "italic" if is_native_italic(font) else "normal",
                    }
                )
        finally:
            for font in faces:
                font.close()

    analyzed_at = now_iso()
    fonts: dict[str, object] = {}
    for font_id, target in TARGETS.items():
        sources = sorted(
            entries[font_id],
            key=lambda item: (item["weight"], item["style"], item["fileName"].casefold(), item["faceIndex"] or -1),
        )
        if not sources:
            fonts[font_id] = {
                "fontName": target["label"],
                "status": "not-analyzed",
                "reason": f"{font_dir} に対象ファミリーの TTF / OTF / TTC / OTC が見つかりません。",
            }
            continue
        fonts[font_id] = {
            "fontName": target["label"],
            "status": "analyzed",
            "family": sources[0]["family"],
            "availableWeights": sorted({source["weight"] for source in sources}),
            "availableStyles": [
                {"value": style, "native": True}
                for style in ("normal", "italic")
                if any(source["style"] == style for source in sources)
            ],
            "verification": {
                "scope": "environment",
                "label": "この検証環境（Windows）で確認済み",
                "environment": "Windows",
                "fontDirectory": str(font_dir),
                "confirmedAt": analyzed_at,
            },
            "analysisMethod": "fontTools name / OS/2 (usWeightClass, fsSelection italic) 解析",
            "sources": sources,
        }

    return {"schemaVersion": 1, "generatedAt": analyzed_at, "fonts": fonts}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--font-dir",
        type=Path,
        default=Path(os.environ.get("WINDIR", r"C:\\Windows")) / "Fonts",
        help="解析する Windows フォントディレクトリ。",
    )
    parser.add_argument("--output", type=Path, default=Path("font-face-data.js"))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.font_dir.is_dir():
        raise SystemExit(f"エラー: フォントディレクトリが見つかりません: {args.font_dir}")
    data = analyze_font_directory(args.font_dir)
    serialized = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    args.output.write_text(
        "/* analyze_windows_font_faces.py で生成。Windows 検証環境の実フォント情報。 */\n"
        f"window.FontFaceData = {serialized};\n",
        encoding="utf-8",
    )
    for font_id, entry in data["fonts"].items():
        if entry["status"] == "analyzed":
            print(f"{font_id}: Weight {entry['availableWeights']} / Style {[item['value'] for item in entry['availableStyles']]}")
        else:
            print(f"{font_id}: 未確認 ({entry['reason']})")
    print(f"出力: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
