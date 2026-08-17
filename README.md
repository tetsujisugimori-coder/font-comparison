# フォント比較アプリ

複数のフォントを同じ文章・同じ表示条件で並べ、見た目、文字幅、字形、用途、収録文字をカード形式で比較する静的Webアプリです。

## 主な機能

- Segoe UI、Yu Gothic UI、Meiryo、MS Mincho、Consolas、Cascadia Code、Courier New、Times New Romanの比較
- 文字サイズ、太さ、行間、字間の変更
- 通常、固定マス、実幅枠、詳細の4表示モード
- 日本語、英語、繁体字、簡体字、判別、記号、コードの見本
- cmap解析で未収録と確認できた文字の薄い表示
- OpenType機能情報を「OpenType機能」として、カードごとに折りたたみ表示
- KaTeX数式フォント専用ビュー（51用例）
- PC、狭幅、スマートフォン、OSダークモード対応
- Memo Nexusから比較文章を受け取り、検証済みURLへ選択結果を返す連携モード

## 薄い文字と収録状態

見本内の不透明度が低い文字は、解析した対象フォントのUnicode `cmap` に未収録です。ブラウザは別のフォントによる代替表示を試みますが、実際に使われたフォールバックフォントや代替表示の成功までは確認しません。文字そのものやCSSのフォールバックは削除していません。マウスを合わせると `未収録（U+XXXX）` を確認できます。

判定は次の3状態を区別します。

- `supported`: 解析したcmapにコードポイントがある
- `unsupported`: cmap解析済みだがコードポイントがない（薄く表示）
- `unknown`: フォント未解析、データなし、判定不能（通常の濃さ）

空白、改行、タブなどの制御用文字は薄くしません。文字列は `Intl.Segmenter` による書記素クラスタ単位で処理し、結合文字、異体字セレクタ、ZWJ絵文字をspan境界で分断しません。未収録の通常文字または結合記号を含むクラスタは、クラスタ全体を薄くします。`Intl.Segmenter` 非対応時は、結合記号・異体字セレクタ・絵文字修飾子・地域指標・ZWJ/ZWNJを前後のコードポイントとまとめる保守的なフォールバックを使用します。

公式ページの「言語・文字体系対応」と、この環境で解析したフォントファイルの「個々の文字の収録」は別情報です。日本語対応フォントでも、すべてのCJK統合漢字を収録しているとは限りません。

## 解析データの注意点

- 収録判定は `font-coverage-data.js` を生成した時点のフォントファイルに基づきます。
- 収録判定は `font-coverage-data.js` に記録された解析フェイスを基準にします。太さを変更すると実際の表示で別ファイル・別フェイスが使われる可能性があり、その収録内容が解析フェイスと完全に同じであることは保証しません。
- カードに表示するファイル名、内部フェイス名、バージョンで、収録判定の解析基準を確認できます。
- 閲覧者のOSにある同名フォントは、解析時とバージョンや収録内容が異なる場合があります。
- ブラウザが実際に選んだフォールバックフォントまでは特定しません。
- `document.fonts.check()` や文字幅比較だけで収録有無を断定しません。
- フォントファイル自体はリポジトリに含めません。
- Cascadia Codeは解析環境にファイルがなかったため、現在のデータでは `unknown` です。自動ダウンロードは行いません。
- このアプリで登録・解析するMS Minchoは等幅です。MS PMinchoは別フェイスのプロポーショナル書体であり、混同しません。

## OpenType機能表示

- 各フォントカードの属性欄に「OpenType機能」を追加し、`収録確認済み` と `未確認` を要約表示します。
- カードごとの `OpenType機能` ボタンで展開/折りたたみを切り替えます。
- 展開時は OpenType タグ、機能名、対応状況（収録確認済み／未収録／未確認）と短い説明を表示します。
- システムフォントもWebフォントも同じカード生成処理で表示し、`Noto Sans JP` も同一UIで確認対象にしています。

## cmapデータの再生成

Python 3と[fontTools](https://fonttools.readthedocs.io/)が必要です。

```powershell
python -m pip install fonttools
python analyze_font_cmap.py --output font-coverage-data.js
```

引数を省略すると、`%WINDIR%\Fonts` から既知のファイル名を探し、TTCでは内部ファミリー名・フルネームを照合して対象フェイスを選びます。ファイル名だけでTTCフェイスを決めません。

環境固有のTTF、OTF、TTCを明示する場合は、`--font FONT_ID=PATH` を複数指定できます。必要なら `--face FONT_ID=INTERNAL_NAME` で内部フェイスも指定できます。

```powershell
python analyze_font_cmap.py `
  --font "yu-gothic-ui=C:\Windows\Fonts\YuGothM.ttc" `
  --face "yu-gothic-ui=Yu Gothic UI Regular" `
  --font "cascadia-code=C:\path\to\CascadiaCode.ttf" `
  --output font-coverage-data.js
```

出力には解析日時、表示名、ファイル名、内部フェイス名、フェイス番号、バージョン、コードポイント数、連続範囲へ圧縮したcmapを記録します。見つからないフォントや選べないフェイスは `not-analyzed` として記録します。

## ファイル構成

- `index.html`: 画面とスクリプト読込
- `style.css`: 通常表示、薄い文字、凡例、レスポンシブ、ダークモード
- `app.js`: フォント情報、カード、4表示モード、Memo Nexus連携UI
- `font-coverage.js`: 3状態判定、範囲の二分探索、安全な書記素クラスタ単位DOM描画
- `font-coverage-data.js`: 生成済みcmap範囲データ
- `analyze_font_cmap.py`: TTF／OTF／TTC解析・データ生成CLI
- `integration-utils.js`: Memo Nexusパラメータと戻りURLの検証
- `katex-data.js` / `katex-page.js`: KaTeX専用ビュー
- `*.test.js`: Node.js自動テスト

## 使用方法

ビルドは不要です。`index.html` を直接開くか、ローカルHTTPサーバーで配信します。KaTeXのCDN読込にはインターネット接続が必要です。

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

その後、`http://127.0.0.1:4173/` を開きます。

## 自動テスト

```powershell
node --check app.js
node --check font-coverage.js
node --test *.test.js
python -m py_compile analyze_font_cmap.py
```

テストでは3状態、二分探索、サロゲートペア、空白・改行・タブ、未収録クラス、文字順、XSS防止、全表示モード、初期3カード、Memo Nexus連携を確認します。

## Memo Nexus連携

次のURLパラメータで連携モードを起動します。

- `mode=memo-nexus`
- `target=body|heading|code`
- `scope=global|note`
- `currentFontId`: 現在の登録済みフォントID
- `returnUrl`: 選択結果を返すMemo Nexus URL
- `sample`: 比較文章（最大700文字）
- `memoId`: メモ個別設定の対象ID

戻り先はMemo Nexus公開URLとlocalhost／127.0.0.1だけを許可します。比較文章はHTMLとして挿入せず、テキストノードと未収録文字用の `span` だけをDOM APIで生成します。

## 公式情報とライセンス

カードの文字体系情報は、各[Microsoft Typography font list](https://learn.microsoft.com/en-us/typography/font-list/)と[Cascadia Code公式リポジトリ](https://github.com/microsoft/cascadia-code)、[Google Fonts Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)を基準にしています。

Microsoft製品に付属するフォントは「Microsoft製品付属（再配布は別途ライセンス確認）」と表示します。製品への収録だけを根拠に「フリー」や「商用利用自由」とは扱いません。Cascadia Codeは公式[LICENSE](https://github.com/microsoft/cascadia-code/blob/main/LICENSE)で確認できる `SIL Open Font License 1.1` を表示します。

- Noto Sans JP は [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+JP)経由のWebフォントとして利用しており、ライセンスは `SIL Open Font License 1.1` です。取得元の記載は `font` 定義と公式情報欄に反映しています。

## 既知の制約

- 静的cmapは解析した1バージョン・1フェイスの情報で、閲覧環境との差異を自動検出しません。
- cmapにコードポイントがあっても、字形品質、OpenType機能、異体字シーケンス、言語全体の完全対応までは保証しません。
- 結合文字や異体字セレクタも削除せずコードポイント単位で保持しますが、書記素クラスタ全体の描画成否は判定しません。
- OpenType機能は「収録確認済み」「未収録」「未確認」を分けて管理し、未調査を未収録として断定しません。
- CSSフォールバック先と、画面上で最終的に使われたフォント名は特定しません。
- フォントのライセンスを自動判定しません。
