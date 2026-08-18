# フォント比較アプリ

複数のフォントを同じ文章・同じ表示条件で並べ、見た目、文字幅、字形、用途、収録文字をカード形式で比較する静的Webアプリです。

## 主な機能

- Segoe UI、Yu Gothic UI、Meiryo、MS Mincho、Consolas、Cascadia Code、Courier New、Times New Romanの比較
- 文字サイズ、太さ、行間、字間の変更
- 通常、固定マス、実幅枠の3表示モード
- 日本語、英語、繁体字、簡体字、判別、記号、コードの見本
- cmap解析で未収録と確認できた文字の薄い表示
- OpenType機能情報を「OpenType機能」として、カードごとに共通ダイアログで確認
- KaTeX数式フォント専用ビュー（51用例、LaTeXコピー対応）
- PC、狭幅、スマートフォン、OSダークモード対応
- 通常表示とMemo Nexus連携で共通の3条件から上位3フォントを探せる検索UI
- Memo Nexusから比較文章を受け取り、検証済みURLへ選択結果を返す連携モード

## フォントファミリー、Weight、Style

カード見出しはフォントファミリー名です。属性欄では同じ名前を繰り返さず、そのファミリー内で確認できたWeightとStyleを表示します。Boldは別カードや別フォントではなく、通常は同じフォントファミリー内のWeight 700として扱います。個別のフォントフェイスはWeightとStyleの組み合わせです。

Windowsシステムフォントは、この検証環境の `C:\Windows\Fonts` にあるTTF / OTF / TTC / OTCをfontToolsで確認し、Font Family、OS/2の`usWeightClass`、専用Italicの有無を表示します。`font-face-data.js`には確認日、検証環境、解析元ファイル、TTC/OTCのfaceIndexを記録します。この結果は他のOSや別バージョンの同名フォントまで保証するものではありません。解析できなかったカードは推測せず未確認と表示します。

Webフォントでは、フォントファミリー全体で利用できるWeight、このアプリの読み込み対象、実行時に読み込み成功したWeightを分けて扱います。カードは選択前に`読み込み対象`を表示し、`Font Loading API`で成功したWeightだけを実行時の`読み込み成功`として表示します。ファミリー全体のWeight / Styleは、別途確認できるまで未確認のままです。

Italicは専用書体が確認できた場合だけStyleとして扱います。ブラウザが通常書体を傾ける擬似Italicは、専用Italic対応とは表示しません。

## 選択時に読み込むWebフォント

Webフォントは初期表示では取得せず、チェックボックス、検索候補、または連携カードで明示選択したフォントだけを読み込みます。Google Fonts配信は選択時にCSS stylesheetを追加し、解析済みcmapに存在する見本文字を`Font Loading API`へ渡して必要なWeightを確認します。Source Han SansはAdobe公式タグ`2.005R`の簡体字（CN）SubsetOTFを同APIで読み込みます。通常表示の対象はRegular 400、太字の表示を選んだときはBold 700で、専用Italicは今回読み込みません。初期候補の表示、条件変更、候補の並べ替え、Memo Nexus連携モードの全カード表示ではWebフォントを取得しません。

| フォント | 主対象・分類 | 配布元・ライセンス | 注意点 |
| --- | --- | --- | --- |
| Noto Sans JP | 日本語、ゴシック | Google Fonts / SIL Open Font License 1.1 | CSSの400 / 700配信WOFF2を124ファイル解析済みです。 |
| Noto Serif JP | 日本語、明朝・セリフ | Google Fonts / SIL Open Font License 1.1 | CSSの400 / 700配信WOFF2を124ファイル解析済みです。 |
| Noto Sans SC | 簡体字中国語、ゴシック | Google Fonts / SIL Open Font License 1.1 | 101配信WOFF2を解析済み。日本語・繁体字は別フォントへフォールバックする場合があります。 |
| Noto Sans TC | 繁体字中国語、ゴシック | Google Fonts / SIL Open Font License 1.1 | 105配信WOFF2を解析済み。日本語・簡体字は別フォントへフォールバックする場合があります。 |
| Source Han Sans | 簡体字中国語、CJKゴシック | Adobe Source Han Sans `2.005R`（jsDelivr経由）/ SIL Open Font License 1.1 | CN SubsetOTF（Regular 8,429,224 bytes / Bold 8,569,308 bytes）を解析。地域別字形を日本語・繁体字用と混同しません。 |
| Inter | ラテン文字、サンセリフ | Google Fonts / SIL Open Font License 1.1 | 7配信WOFF2を解析済み。日本語・中国語は原則として別フォントへフォールバックします。 |
| IBM Plex Sans | ラテン文字、サンセリフ | Google Fonts / SIL Open Font License 1.1 | 6配信WOFF2を解析済み。日本語・中国語は原則として別フォントへフォールバックします。 |
| JetBrains Mono | ラテン文字、等幅・コード向け | Google Fonts / SIL Open Font License 1.1 | 6配信WOFF2を解析済み。日本語・中国語は別フォントへフォールバックします。 |
| Zen Kaku Gothic New | 日本語、ゴシック | Google Fonts / SIL Open Font License 1.1 | 242配信WOFF2を解析済みです。 |
| Shippori Mincho | 日本語、明朝・セリフ | Google Fonts / SIL Open Font License 1.1 | 244配信WOFF2を解析済みです。 |

各Webフォントはこのアプリの400 / 700・Normal配信対象についてcmapとOpenType機能を解析済みです。Family全体で提供されるWeight・Styleは未確認のままです。カードの「対応文字種」は配布元・用途に基づく説明であり、個々の見本文字の収録判定とは混同しません。

## 薄い文字と収録状態

見本内の不透明度が低い文字は、解析した対象フォントのUnicode `cmap` に未収録です。ブラウザは別のフォントによる代替表示を試みますが、実際に使われたフォールバックフォントや代替表示の成功までは確認しません。文字そのものやCSSのフォールバックは削除していません。マウスを合わせると `未収録（U+XXXX）` を確認できます。

判定は次の3状態を区別します。

- `supported`: 解析したcmapにコードポイントがある
- `unsupported`: cmap解析済みだがコードポイントがない（薄く表示）
- `unknown`: フォント未解析、データなし、判定不能（通常の濃さ）

空白、改行、タブなどの制御用文字は薄くしません。文字列は `Intl.Segmenter` による書記素クラスタ単位で処理し、結合文字、異体字セレクタ、ZWJ絵文字をspan境界で分断しません。未収録の通常文字または結合記号を含むクラスタは、クラスタ全体を薄くします。`Intl.Segmenter` 非対応時は、結合記号・異体字セレクタ・絵文字修飾子・地域指標・ZWJ/ZWNJを前後のコードポイントとまとめる保守的なフォールバックを使用します。

公式ページの「言語・文字体系対応」と、この環境で解析したフォントファイルの「個々の文字の収録」は別情報です。日本語対応フォントでも、すべてのCJK統合漢字を収録しているとは限りません。

## 解析データの注意点

- 起動時は`font-coverage-data.js`の圧縮済み`ranges`と`codepointCount`、`font-opentype-data.js`の統合済みOpenType機能一覧だけを読みます。ファイル別URL、SHA-256、`unicode-range`、User-Agentなどの解析証拠は、OpenType詳細ダイアログを開いたときにだけ`analysis-details/<font-id>.js`を従来型`script`として読みます。
- 詳細JSにはフォント本体を含めません。同じ画面内で一度読んだ詳細はメモリ上で再利用し、読込失敗時は再試行できます。`file://`でも動かせるよう、JSONの`fetch()`やES Modulesの動的`import()`ではなく、許可済みIDとパスの対応表を使う`script`要素を採用しています。HTTPやGitHub Pagesでも同じ相対パスで配信されます。
- 収録判定は `font-coverage-data.js` を生成した時点のフォントファイルに基づきます。
- 収録判定は `font-coverage-data.js` に記録された解析フェイスを基準にします。太さを変更すると実際の表示で別ファイル・別フェイスが使われる可能性があり、その収録内容が解析フェイスと完全に同じであることは保証しません。
- カードでは文字収録判定の解析元・バージョン・解析方法を確認できます。内部フェイス名とfaceIndexはTTC/OTCだけに表示し、通常のTTF/OTF/WOFF2では表示しません。未解析には推測した値を表示しません。
- 閲覧者のOSにある同名フォントは、解析時とバージョンや収録内容が異なる場合があります。
- ブラウザが実際に選んだフォールバックフォントまでは特定しません。
- `document.fonts.check()` や文字幅比較だけで収録有無を断定しません。
- フォントファイル自体はリポジトリに含めません。
- Cascadia Codeは解析環境にファイルがなかったため、現在のデータでは `unknown` です。自動ダウンロードは行いません。
- このアプリで登録・解析するMS Minchoは等幅です。MS PMinchoは別フェイスのプロポーショナル書体であり、混同しません。

## フォント追加・解析の運用記録

文字収録情報とOpenType機能は解析元・取得日・フォント版によって変わり得るため、追加方法と確認根拠を別途記録しています。

- [フォント追加・解析の運用手引き](docs/FONT_ADDING_GUIDE.md)
- [フォント解析元一覧](docs/FONT_ANALYSIS_SOURCES.md)

## OpenType機能表示

- OpenType機能はカード内のトグルではなく、全フォントで再利用する共通ダイアログに表示します。機能のオン・オフは今回の対象外です。
- 解析対象ファイルのGSUB／GPOS FeatureListで確認できたタグだけを掲載します。表示されないタグを「未収録」と断定せず、未解析と解析済み0件も区別します。
- OpenType Registered Featuresまたはフォント公式資料で意味を確認できたタグだけを説明付きチップにします。意味を確認できない独自タグや「説明未確認」は表示しません。
- Noto Sans JPは、画面が読み込むGoogle Fonts CSS API（ウェイト400／700）に定義された全WOFF2を解析し、重複URLを1回だけ取得したうえで、cmapと機能タグをそれぞれ和集合として表示します。
- Google Fontsはunicode-rangeごとのサブセット配信です。ブラウザが実際に取得するファイルは表示文字やブラウザ環境によって異なる場合があります。

## Noto Sans JP OpenTypeデータの再生成

Python 3、fontTools、Brotli拡張が必要です。依存関係は専用ファイルから導入できます。

```powershell
python -m pip install -r requirements-font-analysis.txt
python analyze_google_fonts.py
```

`analyze_google_fonts.py` は固定User-Agentで `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap` を取得し、すべての `@font-face`、ウェイト、unicode-range、WOFF2 URLを解析します。圧縮済みcmapと統合タグは起動時サマリーへ、各ファイルのSHA-256、URL、`unicode-range`、GSUB／GPOSタグ、CSS取得日、取得ホストは`analysis-details/<font-id>.js`へ記録します。全ファイルの取得・解析が成功した場合だけサマリーと対象詳細をまとめて更新し、フォントファイル自体はメモリ上だけで処理します。`--font`による部分更新は、他フォントのサマリーや詳細JSを削除しません。Notoのcmapは全WOFF2の統合結果であり、1回の閲覧でブラウザが全ファイルを取得するという意味ではありません。

サマリー2ファイルと対象詳細JSは、更新後の内容を一時ファイルへ作成して検証した後にまとめて置換します。置換途中で失敗した場合は、すでに置換した側を元の内容へロールバックします。ロールバックにも失敗したバックアップだけは、手動復旧用に残します。

## CIと手動ライブ解析

`CI` はPR、mainへのpush、手動実行でNode 22とPython 3.12の構文検査、Nodeテスト、ネットワークを使わないPythonフィクスチャテスト、PRまたはコミット範囲の空白検査を実施します。引数なしの作業ツリー差分検査は使いません。PRではbase SHAからhead SHA、pushではbefore SHAからcurrent SHA、比較元を使えない手動実行では現在HEADを検査します。

実際のGoogle Fontsを再解析する場合は、GitHub Actionsの **Live Google Fonts analysis** を手動実行し、`run_live_analysis` を有効にします。URL、実行日、User-Agent、ファイル数、版、機能数と生成データの差分をアーティファクトで取得します。このワークフローは読み取り専用で、コミット、プッシュ、フォントバイナリの保存を行いません。

通常はPython標準HTTPSクライアントを使用します。ローカルの証明書構成でTLS検証に失敗し、検証済みの `curl` が利用できる環境では、同じUser-Agentを指定して `curl` へフォールバックします。証明書検証は無効化しません。

## cmapデータの再生成

Python 3と[fontTools](https://fonttools.readthedocs.io/)が必要です。OpenType用WOFF2も更新する場合は上記のBrotli依存関係も導入してください。

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

解析データの容量は次で再計測できます。`font-coverage-data.js`、`font-opentype-data.js`、ローダー、全詳細JS、Noto Sans JP詳細JSのraw/gzipサイズを区別して出力します。

```powershell
node scripts/measure-analysis-data.mjs
```

## ファイル構成

- `index.html`: 画面とスクリプト読込
- `style.css`: 通常表示、薄い文字、凡例、レスポンシブ、ダークモード
- `app.js`: フォント情報、カード、4表示モード、Memo Nexus連携UI
- `font-recommendation-catalog.js`: Memo Nexusと照合した18フォントの推薦用メタデータと連携用`font-family`
- `font-recommendation.js`: 通常表示とMemo Nexus連携で共用する条件検索の純粋な採点・上位3件選出
- `font-coverage.js`: 3状態判定、範囲の二分探索、安全な書記素クラスタ単位DOM描画
- `font-coverage-data.js`: 生成済みcmap範囲データ
- `font-opentype-data.js`: 生成済みGSUB／GPOS機能データ（Noto Sans JPは配信ファイルごとの根拠を含む）
- `analyze_font_cmap.py`: TTF／OTF／TTC解析・データ生成CLI
- `analyze_google_fonts.py`: Google Fonts CSS／WOFF2取得・OpenTypeデータ更新CLI
- `opentype-dialog.js`: ダイアログの選択、終了、フォーカス復帰処理
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
node --check integration-utils.js
node --check font-recommendation-catalog.js
node --check font-recommendation.js
node --check font-coverage.js
node --check opentype-dialog.js
node --test *.test.js
python -m py_compile analyze_font_cmap.py analyze_google_fonts.py
python -m unittest test_analyze_google_fonts.py
```

テストでは3状態、二分探索、サロゲートペア、空白・改行・タブ、未収録クラス、文字順、XSS防止、全表示モード、初期3カード、共通条件検索、Webフォントの明示選択、Memo Nexus連携を確認します。

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

「条件からフォントを探す」は通常表示と連携モードで同じフォーム、結果欄、変更イベントを共用します。初期条件は日本語、中立・読みやすさ重視、長文を書くで、起動時から順位・種別・理由・操作付きの上位3件を表示し、ラジオ変更時に自動更新します。`target=body|heading|code`は連携モードの主な用途を長文を書く／見出し・短文／プログラミングコードへ上書きし、言語と雰囲気の既定値は維持します。

推薦はMemo Nexus PR #114の`FONT_OPTIONS`と照合した`font-recommendation-catalog.js`を使い、カード表示・cmap解析用情報とは分離します。対象言語が`supported`または`partial`の候補を先に採点し、3件に満たない場合だけ`unknown`、それでも不足する場合だけ`unsupported`を補います。各段階内は言語・雰囲気・用途の点数とカタログ順で決定し、理由には一部対応、未確認、非対応の言語状態を明示します。

連携モードの各カードは、推薦理由と同じ契約を確認できるよう「条件検索の言語区分」としてラテン、日本語、簡体字、繁体字の4区分を表示します。この行は`font-recommendation-catalog.js`を参照し、カードの従来概要、公式に確認した文字体系、cmap収録判定とは別情報として併記します。

通常表示の候補操作は既存の比較対象へフォントを追加し、候補外を含む現在の比較対象を維持します。連携モードでは全18カードを残して推薦3件だけを先頭へ並べ、候補またはカードの操作で連携用の選択フォントを更新します。選択だけでは遷移せず、「Memo Nexusで使用」を押した時だけ検証済みURLへ結果を返します。

システムフォントは端末にインストールされたフォントを使います。Webフォントは条件検索の計算・表示・並べ替えだけでは取得せず、利用者が候補、チェックボックス、または連携カードで明示選択した時だけインターネットから読み込みます。読み込みに失敗した場合は、`font-family`の後続フォントへフォールバックします。候補、選択欄、カードではシステムフォント／Webフォントを文字でも識別します。

KaTeX表示中は条件検索パネルを隠し、通常フォントへ戻ると再表示します。`#katex`、`#category-*`、`#fontRolesSection`の直リンクとハッシュ変更も同じ切替規則です。KaTeX用例の「コピー」はLaTeXだけをClipboard APIまたは既存フォールバックでコピーし、成功／失敗を通知します。Memo Nexusの「フォント指定をコピー」、プレビュー、コピー用文字列生成は提供しません。

戻り先が不正な場合はエラーを表示して「Memo Nexusで使用」を無効にし、現在の比較状態は保持します。

次の10Webフォントを含む全18フォントは、`font-recommendation-catalog.js`をID、表示名、推薦用メタデータ、Memo Nexus連携用`font-family`の単一情報源にします。`webFontCatalog`はブラウザでの読込定義だけを保持します。戻りURLには契約どおりの`fontId`／`fontFamily`／`fontLabel`を設定します。

- Noto Sans JP (`noto-sans-jp-web`)
- Noto Serif JP (`noto-serif-jp-web`)
- Noto Sans SC (`noto-sans-sc-web`)
- Noto Sans TC (`noto-sans-tc-web`)
- Source Han Sans CN (`source-han-sans-web`)
- Inter (`inter-web`)
- IBM Plex Sans (`ibm-plex-sans-web`)
- JetBrains Mono (`jetbrains-mono-web`)
- Zen Kaku Gothic New (`zen-kaku-gothic-new-web`)
- Shippori Mincho (`shippori-mincho-web`)

2026-08-19の確認では、`node --check app.js`、`node --check integration-utils.js`、`node --check font-recommendation-catalog.js`、`node --check font-recommendation.js`、`node --check katex-page.js`、`node --test`（110件）、`git diff --check`が成功しました。実18フォントの自動テストでは、日本語・中立・長文はYu Gothic UI／Meiryo／Noto Sans JP、日本語・フォーマル・長文はMS Mincho／Noto Serif JP／Shippori Mincho、簡体字・中立・長文はNoto Sans SC／Source Han Sans／Noto Sans TC、繁体字・中立・長文はNoto Sans TC／Noto Sans SC／Source Han Sans、英数字・中立・コードはConsolas／Cascadia Code／JetBrains Monoになりました。Edgeでは通常表示の検索パネル、KaTeX切替と通常復帰、`#category-basic`直リンク、LaTeXコピー成功通知、連携モードの同一候補順・全18カード・Memo NexusコピーUI 0件・契約由来4言語区分、公式情報とcmap情報の併記を確認しました。Webフォントstylesheetは明示選択前0件、選択後1件でした。390px／タブレット幅／PC幅、ライト／ダーク表示、コンソールerror／warning、公開済みMemo Nexusとの実アプリ間往復は今回未確認です。

## 公式情報とライセンス

カードの文字体系情報は、各[Microsoft Typography font list](https://learn.microsoft.com/en-us/typography/font-list/)と[Cascadia Code公式リポジトリ](https://github.com/microsoft/cascadia-code)、[Google Fonts Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)を基準にしています。

Microsoft製品に付属するフォントは「Microsoft製品付属（再配布は別途ライセンス確認）」と表示します。製品への収録だけを根拠に「フリー」や「商用利用自由」とは扱いません。Cascadia Codeは公式[LICENSE](https://github.com/microsoft/cascadia-code/blob/main/LICENSE)で確認できる `SIL Open Font License 1.1` を表示します。

- Noto Sans JP は [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+JP)経由のWebフォントとして利用しており、ライセンスは `SIL Open Font License 1.1` です。取得元の記載は `font` 定義と公式情報欄に反映しています。

## 既知の制約

- 静的cmapは解析した1バージョン・1フェイスの情報で、閲覧環境との差異を自動検出しません。
- cmapにコードポイントがあっても、字形品質、OpenType機能、異体字シーケンス、言語全体の完全対応までは保証しません。
- 結合文字や異体字セレクタ、ZWJ絵文字は `Intl.Segmenter`（非対応時は保守的フォールバック）で書記素クラスタ単位で扱い、文字列を1文字に分断しません。
- OpenType機能は解析ファイルで確認できたものだけを掲載します。未解析を未収録と断定せず、未収録機能の推測一覧も作りません。
- CSSフォールバック先と、画面上で最終的に使われたフォント名は特定しません。
- フォントのライセンスを自動判定しません。
