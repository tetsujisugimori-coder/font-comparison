from fontTools.ttLib import TTFont

font = TTFont(r"C:\Windows\Fonts\bauhs93.ttf")
cmap = font.getBestCmap()

print("Unicode対応文字数:", len(cmap))

font.close()


from fontTools.ttLib import TTFont

font = TTFont(r"C:\Windows\Fonts\bauhs93.ttf")
cmap = font.getBestCmap()

ranges = {
    "基本ラテン": (0x0020, 0x007E),
    "ラテン1補助": (0x00A0, 0x00FF),
    "ひらがな": (0x3040, 0x309F),
    "カタカナ": (0x30A0, 0x30FF),
    "CJK統合漢字": (0x4E00, 0x9FFF),
}

for label, (start, end) in ranges.items():
    count = sum(1 for code in cmap if start <= code <= end)
    print(label, count)

font.close()