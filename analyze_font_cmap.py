from fontTools.ttLib import TTFont

FONT_PATH = r"C:\Windows\Fonts\bauhs93.ttf"

ranges = {
    "基本ラテン": (0x0020, 0x007E),
    "ラテン1補助": (0x00A0, 0x00FF),
    "ラテン拡張A": (0x0100, 0x017F),
    "ラテン拡張B": (0x0180, 0x024F),
    "ギリシャ文字": (0x0370, 0x03FF),
    "キリル文字": (0x0400, 0x04FF),
    "一般句読点": (0x2000, 0x206F),
    "通貨記号": (0x20A0, 0x20CF),
    "矢印": (0x2190, 0x21FF),
    "数学記号": (0x2200, 0x22FF),
    "CJK記号・句読点": (0x3000, 0x303F),
    "ひらがな": (0x3040, 0x309F),
    "カタカナ": (0x30A0, 0x30FF),
    "CJK統合漢字": (0x4E00, 0x9FFF),
    "私用領域": (0xE000, 0xF8FF),
}

font = TTFont(FONT_PATH)

try:
    cmap = font.getBestCmap()

    if cmap is None:
        print("Unicode対応のcmapが見つかりませんでした。")
    else:
        print("フォントファイル:", FONT_PATH)
        print("Unicode対応文字数:", len(cmap))
        print()

        for label, (start, end) in ranges.items():
            count = sum(
                1
                for code_point in cmap
                if start <= code_point <= end
            )
            print(f"{label}: {count}")

finally:
    font.close()