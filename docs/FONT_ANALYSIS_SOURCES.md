# フォント解析元一覧

## 現在の解析・確認状況

表示利用元と解析元は異なる場合があります。件数は、記載した解析日時点の静的データで確認できる値です。

| 表示名 | 種別 | 表示利用元またはCSS指定 | cmap解析状況 | OpenType解析状況 | 解析元ファイルまたはCSS URL | 内部フェイス名 | バージョン | 解析日 | 備考・未確認理由 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Segoe UI | システムフォント | Windows標準、`"Segoe UI"` | 確認済み（3,996コードポイント） | 確認済み（30機能） | `segoeui.ttf` | 該当なし | Version 5.71 | 2026-08-18T07:13:11+09:00 | Windows環境の単体TTFを解析。 |
| Yu Gothic UI | システムフォント | Windows標準、`"Yu Gothic UI"` | 確認済み（16,538コードポイント） | 確認済み（33機能） | `YuGothM.ttc` | Yu Gothic UI Regular（faceIndex 1） | Version 1.95 | 2026-08-18T07:13:11+09:00 | Windows環境のTTCを解析。 |
| Meiryo | システムフォント | Windows標準、`Meiryo` | 確認済み（17,189コードポイント） | 確認済み（29機能） | `meiryo.ttc` | Meiryo（faceIndex 0） | Version 6.51 | 2026-08-18T07:13:11+09:00 | Windows環境のTTCを解析。 |
| MS Mincho | システムフォント | Windows標準、`"ＭＳ 明朝", "MS Mincho", serif` | 確認済み（16,134コードポイント） | 確認済み（4機能） | `msmincho.ttc` | MS Mincho（faceIndex 0） | Version 5.32 | 2026-08-18T07:13:11+09:00 | Windows環境のTTCを解析。 |
| Consolas | システムフォント | Windows標準、`Consolas` | 確認済み（2,489コードポイント） | 確認済み（24機能） | `consola.ttf` | 該当なし | Version 7.01 | 2026-08-18T07:13:11+09:00 | Windows環境の単体TTFを解析。 |
| Cascadia Code | システムフォント | `"Cascadia Code"`、インストール済みか要確認 | 未確認 | 未確認 | 未確認 | 該当なし | 未確認 | 2026-08-18T07:13:11+09:00 | フォントファイルが見つからないため解析できていない。 |
| Courier New | システムフォント | Windows標準、`"Courier New"` | 確認済み（3,180コードポイント） | 確認済み（14機能） | `cour.ttf` | 該当なし | Version 6.95 | 2026-08-18T07:13:11+09:00 | Windows環境の単体TTFを解析。 |
| Times New Roman | システムフォント | Windows標準、`"Times New Roman"` | 確認済み（3,678コードポイント） | 確認済み（25機能） | `times.ttf` | 該当なし | Version 7.12 | 2026-08-18T07:13:11+09:00 | Windows環境の単体TTFを解析。 |
| Noto Sans JP | Webフォント | Google Fonts CSS API、`"Noto Sans JP", sans-serif` | 確認済み（16,657コードポイント、124ファイルの`cmap`統合） | 確認済み（11機能） | `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap` | 該当なし | Version 2.004-H2;hotconv 1.0.118;makeotfexe 2.5.65603 | 2026-08-18 | Google Fonts配信WOFF2を、指定UA・ウェイト400/700で解析した現時点の一例。CSSは248件の`@font-face`、配信内容は将来変化し得る。 |

## 更新ルール

- 新しいフォントを追加したPRでは、この一覧も同時に更新します。
- 解析元やバージョンを更新した場合は、解析日と`LOG.md`も更新します。
- Webフォントのライブ解析結果が変わった場合は、以前の件数に無理に合わせず、配信側の変更として記録します。
- 未確認の項目は、確認できるまで空欄や推測値で埋めません。
