# フォント比較アプリ

複数のフォントを同じ文章・同じ表示条件で並べ、見た目、文字幅、字形、用途、収録文字をカード形式で比較する静的Webアプリです。

## 主な機能

- Segoe UI、Yu Gothic UI、Meiryo、MS Mincho、Consolas、Cascadia Code、Courier New、Times New Romanの比較
- 文字サイズ、太さ、行間、字間の変更
- 通常、固定マス、実幅枠、詳細の4表示モード
- 日本語、英語、繁体字、簡体字、判別、記号、コードの見本
- cmap解析で未収録と確認できた文字の薄い表示
- KaTeX数式フォント専用ビュー（51用例）
- PC、狭幅、スマートフォン、OSダークモード対応
- Memo Nexusから比較文章を受け取り、検証済みURLへ選択結果を返す連携モード

## 薄い文字と収録状態

見本内の不透明度が低い文字は、解析した対象フォントのUnicode `cmap` にそのコードポイントがなく、ブラウザが別フォントで代替表示している文字です。文字そのものやCSSのフォールバックは削除していません。マウスを合わせると `未収録（U+XXXX）` を確認できます。

判定は次の3状態を区別します。

- `supported`: 解析したcmapにコードポイントがある
- `unsupported`: cmap解析済みだがコードポイントがない（薄く表示）
- `unknown`: フォント未解析、データなし、判定不能（通常の濃さ）

空白、改行、タブなどの制御用文字は薄くしません。文字列はUnicodeコードポイント単位で処理するため、サロゲートペアを途中で分割しません。

公式ページの「言語・文字体系対応」と、この環境で解析したフォントファイルの「個々の文字の収録」は別情報です。日本語対応フォントでも、すべてのCJK統合漢字を収録しているとは限りません。

## 解析データの注意点

- 収録判定は `font-coverage-data.js` を生成した時点のフォントファイルに基づきます。
- 閲覧者のOSにある同名フォントは、解析時とバージョンや収録内容が異なる場合があります。
- ブラウザが実際に選んだフォールバックフォントまでは特定しません。
- `document.fonts.check()` や文字幅比較だけで収録有無を断定しません。
- フォントファイル自体はリポジトリに含めません。
- Cascadia Codeは解析環境にファイルがなかったため、現在のデータでは `unknown` です。自動ダウンロードは行いません。

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
- `font-coverage.js`: 3状態判定、範囲の二分探索、安全な文字単位DOM描画
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

カードの文字体系情報は、各[Microsoft Typography font list](https://learn.microsoft.com/en-us/typography/font-list/)と[Cascadia Code公式リポジトリ](https://github.com/microsoft/cascadia-code)を基準にしています。

Microsoft製品に付属するフォントは「Microsoft製品付属（再配布は別途ライセンス確認）」と表示します。製品への収録だけを根拠に「フリー」や「商用利用自由」とは扱いません。Cascadia Codeは公式[LICENSE](https://github.com/microsoft/cascadia-code/blob/main/LICENSE)で確認できる `SIL Open Font License 1.1` を表示します。

## 既知の制約

- 静的cmapは解析した1バージョン・1フェイスの情報で、閲覧環境との差異を自動検出しません。
- cmapにコードポイントがあっても、字形品質、OpenType機能、異体字シーケンス、言語全体の完全対応までは保証しません。
- 結合文字や異体字セレクタも削除せずコードポイント単位で保持しますが、書記素クラスタ全体の描画成否は判定しません。
- CSSフォールバック先と、画面上で最終的に使われたフォント名は特定しません。
- フォントのライセンスを自動判定しません。
