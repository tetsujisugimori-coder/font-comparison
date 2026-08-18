## 2026-08-18 PR #7: cmap/ OpenType情報分離とCI追加

- 原因: カードの「解析フォント」は `font-coverage-data.js` のcmap解析結果をOpenType解析結果のように混在表示していた。
- 対応: 文字収録判定の解析元・版・解析方法をcmap情報として独立表示し、OpenType機能はダイアログでGSUB/GPOS情報として表示するよう分離した。
- Noto Sans JPはGoogle Fonts CSSの124 WOFF2を解析し、cmapを統合した。2026-08-18の結果は16,657コードポイント、`Version 2.004-H2;hotconv 1.0.118;makeotfexe 2.5.65603`、OpenType機能11件（`ccmp`、`halt`、`kern`、`liga`、`locl`、`palt`、`vert`、`vhal`、`vkrn`、`vpal`、`vrt2`）。
- 通常のTTF/OTF/WOFF2では内部フェイスを表示せず、TTC/OTCだけにfaceIndex付きで表示する。未解析には推測値を出さない。
- `.github/workflows/ci.yml` にフィクスチャ専用CIを、`.github/workflows/live-google-fonts-analysis.yml` に手動の実解析・アーティファクト出力を追加した。いずれも読み取り専用権限で、自動コミット・フォントバイナリ保存はしない。
- Nodeテスト、Pythonフィクスチャテスト、構文検査、実Google Fonts解析、差分空白検査を実施する。ブラウザのPC/モバイル、ライト/ダーク、キーボード操作確認はこの後に実施する。

## 2026-08-18 cmap収録文字調査と未収録文字表示

### 目的

ブラウザやOSのフォールバックにより対象フォントで表示できているように見える問題を改善し、解析済みcmapにない文字だけを文章中で薄く表示する。未解析データは未収録と決めつけず、`supported` / `unsupported` / `unknown` の3状態で扱う。

### 公式情報調査

- Segoe UI: Microsoft Learnでラテン、ギリシャ、キリル、アルメニア、グルジア、アラビア、ヘブライ、リス等を確認。製品・サービスへの排他的収録と再配布案内を確認。`https://learn.microsoft.com/en-us/typography/font-list/segoe-ui`
- Yu Gothic UI: Microsoft Learnで日本語（漢字・ひらがな・カタカナ）、ラテン、ギリシャ、キリルを確認。Yu Gothic UI各ウェイトがTTCに含まれることを確認。`https://learn.microsoft.com/en-us/typography/font-list/yu-gothic`
- Meiryo: Microsoft Learnで日本語、ラテン、ギリシャ、キリルを確認。Microsoft製品への収録と再配布案内を確認。`https://learn.microsoft.com/en-us/typography/font-list/meiryo`
- MS Mincho: Microsoft Learnで日本語、ラテン、ギリシャ、キリルを確認。MS MinchoとMS PMinchoが同じTTCの別フェイスであることを確認。`https://learn.microsoft.com/en-us/typography/font-list/ms-mincho`
- Consolas: Microsoft Learnでラテン、ギリシャ、キリル、アルメニアと等幅であることを確認。`https://learn.microsoft.com/en-us/typography/font-list/consolas`
- Cascadia Code: Microsoft公式GitHubでWindows Terminal同梱のコーディングフォント、配布形式、公式リリースを確認。公式ページから文字体系一覧を確定できなかったため未確認を維持。LICENSEでSIL Open Font License 1.1を確認。`https://github.com/microsoft/cascadia-code` / `https://github.com/microsoft/cascadia-code/blob/main/LICENSE`
- Courier New: Microsoft Learnでラテン、ギリシャ、キリル、アルメニアを主対象、アラビア・ヘブライを補助対象として確認。等幅と製品付属・再配布案内を確認。`https://learn.microsoft.com/en-us/typography/font-list/courier-new`
- Times New Roman: Microsoft Learnでラテン、ギリシャ、キリル、アルメニアを主対象、アラビア・ヘブライを補助対象として確認。製品付属・再配布案内を確認。`https://learn.microsoft.com/en-us/typography/font-list/times-new-roman`

Microsoft製品付属7フォントは「Microsoft製品付属（再配布は別途ライセンス確認）」とし、利用とファイル再配布を混同しない表現にした。「フリー」「商用利用自由」とは表示していない。

### cmap解析結果

解析日時は `2026-08-18T04:37:02+09:00`。Python 3.14.6、fontTools 4.63.0の `getBestCmap()` を使用した。

| フォント | 解析 | ファイル / 内部フェイス | バージョン | コードポイント / 圧縮範囲 |
|---|---|---|---|---:|
| Segoe UI | 済 | `segoeui.ttf` / Segoe UI | Version 5.71 | 3,996 / 159 |
| Yu Gothic UI | 済 | `YuGothM.ttc` / Yu Gothic UI Regular（face 1） | Version 1.95 | 16,538 / 4,892 |
| Meiryo | 済 | `meiryo.ttc` / Meiryo（face 0） | Version 6.51 | 17,189 / 4,754 |
| MS Mincho | 済 | `msmincho.ttc` / MS Mincho（face 0） | Version 5.32 | 16,134 / 4,660 |
| Consolas | 済 | `consola.ttf` / Consolas | Version 7.01 | 2,489 / 116 |
| Cascadia Code | 未実施 | ファイルなし | 未確認 | 未確認 |
| Courier New | 済 | `cour.ttf` / Courier New | Version 6.95 | 3,180 / 163 |
| Times New Roman | 済 | `times.ttf` / Times New Roman | Version 7.12 | 3,678 / 122 |

`YuGothR.ttc` のUIフェイスはこの環境ではYu Gothic UI Semilightだった。通常ウェイトに対応するYu Gothic UI Regularを内部名で確認し、`YuGothM.ttc` のface 1を解析した。Cascadia CodeはWindowsフォント登録情報と既知のフォントファイル名で見つからなかった。要件どおり自動ダウンロードせず、`not-analyzed` / `unknown` とした。

### 実装内容

- `analyze_font_cmap.py`をTTF、OTF、TTC対応CLIへ再構成した。`--font`と`--face`を複数指定でき、TTC内部名で対象フェイスを選ぶ。
- `font-coverage-data.js`へ解析日時、ファイル名、内部フェイス名・番号、バージョン、コードポイント数、連続範囲を出力した。フォントファイル自体は追加していない。
- `font-coverage.js`へ圧縮範囲の二分探索と3状態判定を分離した。
- 文字列を `for...of` でUnicodeコードポイント単位に走査し、未収録文字だけ `unsupported-glyph` と `data-codepoint`、`title` を持つspanにした。その他はまとめてテキストノードにした。
- 通常、詳細、固定マス、実幅枠、全見本種別、Memo Nexus比較文章へ同じ処理を適用した。
- 未収録がある解析済みカードだけフォールバック説明の凡例を表示し、未解析カードには未確認の凡例を表示した。
- カードへ公式文字体系、cmap状態、バージョン、解析元ファイル、内部フェイス、確認日、ライセンス、公式URLを追加した。
- KaTeX専用ビューへ通常フォント用の判定処理は混在させていない。

### セキュリティ

- Memo Nexusの比較文章を `innerHTML` へ渡さず、`textContent` / `createTextNode` と未収録文字用spanだけで構築する。
- サロゲートペアを分割せず、文字順、空白、改行、結合文字、異体字セレクタを削除しない。
- 空白、改行、タブ、Unicode制御・書式文字は未収録クラスを付けない。
- 既存の戻りURL許可リスト、最大700文字、フォントID検証を維持した。

### 自動テスト

- `node --check app.js`: 成功
- `node --check font-coverage.js`: 成功
- `node --test *.test.js`: 20件成功、失敗0件
- `python -m py_compile analyze_font_cmap.py`: 成功
- Python補助テスト（連続範囲圧縮、`FONT_ID=VALUE`引数解析）: 成功

3状態、範囲端、サロゲートペア、空白・改行・タブ、収録済み文字、未収録クラス、文字順、`<script>`風文字列、未解析表示、全4モード、初期3カード、Memo Nexus連携を確認した。

### 実ブラウザ確認

- 初期3カード、全8カード、通常・固定マス・実幅枠・詳細を確認した。固定マスは各8セル、実幅枠は各30枠、詳細は各8セクションで0幅要素はなかった。
- Segoe UI、Consolas、Courier New、Times New Romanは日本語見本29文字が未収録表示になった。
- Yu Gothic UI、Meiryo、MS Minchoは日本語見本の未収録表示が0文字だった。
- 3日本語フォントは簡体字の `张`（U+5F20）、`过`（U+8FC7）、`懒`（U+61D2）のみ見本内で未収録表示となり、文字単位の濃淡を確認した。
- Cascadia Codeは未収録文字0、未確認凡例を表示し、通常濃度を維持した。
- 未収録文字の不透明度0.3、`data-codepoint`、`未収録（U+XXXX）`タイトルを確認した。
- サイズ28px、太さ700、行間1.8、字間2pxの変更がカードへ反映された。
- Memo Nexusの `<script>window.memoXss=1</script>` 風文章はパネルとカードで文字として保持され、script要素は生成されなかった。全8カード、選択状態、安全な戻り先の有効化も確認した。
- KaTeX 51用例、12フォント役割カード、レンダリング51件、エラー表示0件、通常ビューへの復帰を確認した。
- 390pxでは1列、800pxでは2列、横スクロールなし。OSダークモードで凡例色と薄い文字を目視確認した。
- ブラウザのconsole error / warning、エラーオーバーレイはいずれも0件だった。

### 未確認・既知の制約

- Cascadia Codeの実ファイル、バージョン、cmapはこの環境にないため未確認。
- Cascadia Codeの公式リポジトリから文字体系一覧を確定できなかったため未確認。
- 閲覧環境の同名フォントが解析版と同一バージョンかはブラウザから確認しない。
- cmapはコードポイントの有無であり、字形品質、言語全体、結合・異体字シーケンス、OpenType機能の完全対応を保証しない。
- フォールバック先の具体的なフォント名は特定しない。

## 2026-08-18 OpenType機能情報のダイアログ化

### Google Fonts版Noto Sans JPの追加解析

- 取得元CSS: `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap`
- CSS取得日: `2026-08-18`
- User-Agent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36`
- CSS配信元／WOFF2配信元: `fonts.googleapis.com`／`fonts.gstatic.com`
- 指定ウェイト: 400／700。CSSの `@font-face` は各124件、計248件。
- 同一URLが400と700で共有されていたため、重複排除後の解析対象は124 WOFF2。各ウェイトは124ファイルに対応する。
- 124ファイルすべてについてSHA-256、unicode-range、ウェイト、GSUB／GPOS FeatureListを記録し、ファイルごとの結果から和集合を生成した。フォントファイル自体は保存・コミットしていない。
- 統合タグ（11件）: `ccmp`, `halt`, `kern`, `liga`, `locl`, `palt`, `vert`, `vhal`, `vkrn`, `vpal`, `vrt2`。
- GSUBで確認: 5タグ。GPOSで確認: 7タグ。`vert` は両テーブルに存在するため重複表示せず `GSUB / GPOS` として保持した。
- 注意: CSSに定義された全配信ファイルの解析結果であり、1回の閲覧でブラウザが全124ファイルを取得するという意味ではない。実際の取得ファイルは表示文字とブラウザ環境に依存する。
- 更新コマンド: `python -m pip install -r requirements-font-analysis.txt` 後に `python analyze_google_fonts.py`。

### 辞書・UI・テストの修正

- 掲載タグの名称・説明・分類・URLをOpenType 1.9.1 Registered Featuresの `features_ae`／`features_fj`／`features_ko`／`features_pt`／`features_uz` に合わせて更新した。
- 未確認の独自タグはチップ化せず、スタイルセットはフォント固有の変化を推測しない共通説明にした。
- `listbox`／`option`を廃止し、各チップを `button` と `aria-pressed` で表現した。Tab、Enter／Space、Escape、閉じるボタン、起点ボタンへのフォーカス復帰を実装した。
- CSS解析、ウェイト・unicode-range、URL重複排除、複数ファイル統合、GSUB／GPOS併存、失敗処理をPython fixtureで検証する。ダイアログの選択、`aria-pressed`、終了、フォーカス復帰はDOM動作を模したNodeテストで検証する。

### 変更内容

- `app.js`
  - OpenType機能の共通定義を追加（タグ/名称/説明）し、`font-opentype-data.js` を元に各フォントの `attributes.openType` を整備。
  - 各フォントカードの要約として `OpenType機能` を追加し、収録確認済み/未確認を区別して表示。
  - カード内の折りたたみトグルを廃止し、ボタンから共通ダイアログを開く構成へ変更。
  - ダイアログ内で要約、メタ情報、機能一覧、選択機能を表示し、未確認フォントは断定的な未収録表示をしない。
  - Webフォント `noto-sans-jp-web` を `sourceType: 'web'` として同一ロジックで表示。
- `style.css`
  - 共通ダイアログ、ボタン、チップ、説明欄のスタイルを追加。
  - スマートフォン幅でも崩れにくいレイアウトへ調整。
- `index.html`
  - 共通OpenTypeダイアログ要素を追加し、Google Fonts読み込み方針は既存仕様を維持。
- `README.md`
  - OpenType機能の表示方法をカード折りたたみから共通ダイアログへ更新。

### 実装上の判断

- `openType` 情報が未検証のフォントは `OpenType機能は未確認です。収録状況を確認できていません。` と表示し、未確認を未収録として断定しない。
- 展開内容はタグ名・機能名・説明を共通説明辞書で表示し、フォントごとの重複記述を抑制。
- 未確認データがあるフォントもダイアログで理由を表示し、空欄表示を避けた。

### 影響

- システムフォント・Webフォントのどちらにも `OpenType機能` セクションを同一UIで表示可能にした。
- 既存の4表示モード、Memo Nexus連携、文字判定・XSS対策、凡例運用は維持。

## 2026-08-18 PR #5 cmap収録判定のレビュー修正

### 変更内容

- `font-coverage.js`をUnicodeコードポイント単位ではなく書記素クラスタ単位で描画するようにし、結合文字、異体字セレクタ、ZWJ絵文字を`span.unsupported-glyph`の境界で分断しないようにした。
- `Intl.Segmenter`非対応時も、結合記号、異体字セレクタ、絵文字修飾子、地域指標、ZWJ/ZWNJをまとめる保守的なフォールバックを追加した。判定できない書式制御文字だけでは未収録表示にしない。
- 未収録クラスタの`title`と`data-codepoint` / `data-codepoints`に、原因となったコードポイントを保持するようにした。
- 凡例を「別のフォントで代替表示されています」から「ブラウザが別のフォントによる代替表示を試みます」へ変更し、代替表示の成功を断定しない表現にした。
- Microsoft LearnのMS Mincho公式情報（`Fixed pitch: True`）に合わせ、このアプリで登録・解析するMS Minchoの文字幅を「等幅」へ修正した。MS PMinchoは別フェイスのプロポーショナル書体として区別する。
- `font-coverage-data.js`は再生成していない。

## 2026-08-18 PR #7: CI差分検査と生成ファイル更新の整合性

- `git diff --check` はクリーンなActions作業ツリーでは未コミット差分しか確認しないため、`scripts/check-diff-whitespace.mjs` を追加した。PRではbase...head、pushではbefore..currentを検査し、空または取得不能な比較元では現在HEADの `git show --check` を必ず実行する。
- Google Fontsの2つの生成JSは、両方を一時生成・再読込検証してから置換するよう変更した。2つ目の置換が失敗した場合は、1つ目をバックアップから復元する。正常更新時、またはロールバック成功時は一時ファイルと不要なバックアップを削除し、ロールバックにも失敗した場合は手動復旧のため該当するバックアップを残す。エラーには、復元できなかった対象、バックアップのパス、失敗理由を含める。
- Pythonテストに一時ファイル作成失敗、不正な一時データ、2つ目の置換失敗とロールバック、generatedAt整合性を追加した。NodeテストにPR/push/workflow_dispatchの検査範囲、無効比較元の代替処理、空白エラーの検出を追加した。
- 通常CIは成功した。手動Live Google Fonts analysisはワークフロー定義がデフォルトブランチに未配置のため、PRブランチからは起動できないことを確認した。

## 2026-08-18 フォント追加・解析の運用手引き追加

- `docs/FONT_ADDING_GUIDE.md`を追加し、フォント追加時の表示利用、解析、確認、記録の標準手順を整理した。
- cmapによる文字収録情報とGSUB/GPOSによるOpenType機能を分けて扱う方針を文書化した。
- `docs/FONT_ANALYSIS_SOURCES.md`を追加し、現時点で登録されているフォントの解析元、解析日、バージョン、未確認理由を一覧化した。
- Noto Sans JPのGoogle Fonts解析はWebフォント対応の現時点の一例であり、今後の配信方式や解析対象の拡張・変更を前提とする。
- 今回はフォント追加や解析データの再生成を行っていない。

## 2026-07-26 Memo Nexusフォント設定連携

### 変更内容

- `mode=memo-nexus`のURLパラメータ読取、検証、戻りURL生成を`integration-utils.js`へ分離した
- Memo Nexusから用途、適用範囲、現在のフォント、比較文章、メモIDを受け取り、通常フォントカードを連携モードで表示する
- 本文・見出し・コードの用途別推奨を先に並べ、推奨だけの絞り込み、選択中表示、「Memo Nexusで使用」を追加した
- 戻り先をMemo Nexus公開URLとlocalhost／127.0.0.1に限定し、利用できない場合はフォント設定コピーへフォールバックする
- URL由来の比較文章はHTMLとして解釈せず、最大700文字に制限する
- 言語情報、ライセンス、配布元URLは確認できた範囲だけをメタデータ化し、不明値は「未確認」と表示する
- OSのダークモードとPC／狭幅／スマートフォン向けの連携UIを追加し、通常起動とKaTeXビューの既存動作は維持する
- `integration-utils.test.js`と`font-integration-ui.test.js`へパラメータ、長文・日本語・記号、安全な戻り先、コピー、XSS防止、推奨、レスポンシブ、ダークモードの確認を追加した

### 確認

- `node --check app.js`、`node --check integration-utils.js`、全11件の自動テスト、`git diff --check`が成功した
- 通常起動で連携パネルが非表示、初期3フォント、既存操作を維持し、KaTeXビューの51用例へ切り替えられることをブラウザで確認した
- 連携モードで用途、現在値、Memo Nexusの文章、全8フォント、推奨の先行表示と絞り込み、明示選択、戻り操作を確認した
- `<script>`風の比較文章は文字として表示され、連携パネルとカード内にscript要素を生成しなかった。確認中のコンソールerrorとエラーオーバーレイは0件だった
- Meiryoを選び、localhostのMemo Nexusへ検証済みパラメータで戻る一連の操作を確認した
- 接続ブラウザの表示領域とOSカラースキームを変更する機能を利用できなかったため、スマートフォン実幅とダークモードは自動テストとCSS契約で確認し、実ブラウザの目視確認はDraft PRの確認事項として残す

## 2026-07-15 KaTeX 数式フォント専用ビュー追加

### 変更内容

- index.html
- style.css
- katex-data.js
- katex-page.js
- README.md
- LOG.md

通常フォント比較ビューに加えて、KaTeX 数式フォント専用のビューを追加した。数式用例のカテゴリ別ナビゲーション、フォント群の役割説明、LaTeX コピー機能、コピー完了通知を実装し、README でも利用方法と確認手順を更新した。

### 実装した機能

- 表示切替ボタンで通常フォントビューと KaTeX ビューを切り替え
- KaTeX の数式用例をカテゴリ別に整理して表示
- 数式の構成要素ごとに使われる代表的なフォント役割を説明
- 用例の LaTeX コードをコピーできるボタンとコピー通知を追加
- KaTeX の CDN 読み込みに対応した構成へ変更

### 確認

- ブラウザで通常ビューと KaTeX ビューの切り替えを確認した
- 数式用例の表示とカテゴリナビゲーションを確認した
- コピーボタンで LaTeX がコピーされることを確認した

## 2026-07-08 フォント比較アプリMVP

### 目的

複数フォントを同じ文字・同じ条件で並べ、見た目・文字幅・用途の違いを比較できる静的WebアプリのMVPを実装する。

### 変更内容

- index.html
- style.css
- app.js
- README.md
- LOG.md

ヘッダー、サイドバー、比較設定パネル、フォントカード、レスポンシブレイアウトを追加した。READMEとLOGも作成した。

### 実装した機能

- フォント選択チェックボックス
- すべて選択 / すべて解除
- 文字サイズ、太さ、行間、字間の変更
- 通常、固定マス、実幅枠、詳細の表示モード切替
- サンプルテキストとカード下部情報の表示
- 3列 / 2列 / 1列のレスポンシブ対応

### 登録フォント

- Segoe UI
- Yu Gothic UI
- Meiryo
- MS Mincho
- Consolas
- Cascadia Code
- Courier New
- Times New Roman

### 採用したサンプル

日本語、英語、繁体字、簡体字、判別、記号、コードのサンプルをカード表示に採用した。

### 確認

- ブラウザでの画面表示を確認した
- フォント選択・表示モード切替・レスポンシブ表示を確認した
- 主要なUI操作に対して動作を確認した

### 未実装・保留

- Pythonやcmapによる自動解析
- フォントファイル読み込み
- フォールバックフォントの完全特定
- 設定保存
- ライセンス自動判定

### 注意点

- 閲覧環境に対象フォントが未インストールの場合、フォールバックが起こる可能性がある
- フォント属性や対応言語の情報はMVP段階の手動定義である
- Web利用可否やライセンスは未確認である

## 2026-07-08 MS Minchoのフォント指定修正

### 変更内容

- app.js の MS Mincho の cssFamily を `"ＭＳ 明朝", "MS Mincho", serif` の順で指定
- 日本語部分で明朝体が適用されやすい指定へ変更

## 2026-07-08 フォント適用方式の修正

### 原因

- `font.cssFamily` を HTML の style 属性へ直接埋め込んでいた
- フォント名内のダブルクォートと style 属性のダブルクォートが衝突していた
- インライン style が無効になり、本文のフォントが既定フォントへフォールバックしていた

### 変更内容

- HTML 文字列への `font-family` 直接埋め込みを削除
- カードへ CSS カスタムプロパティ `--sample-font` を設定
- サンプル本文、固定マス、実幅枠、コードサンプルへ `var(--sample-font)` を適用

### 確認

- MS Mincho の日本語表示を確認
- 通常、固定マス、実幅枠、詳細の各モードを確認
- 開発者ツールで Computed の font-family を確認
- コンソールエラーがないことを確認

### 注意点

- 実際の描画フォントは OS やブラウザ、インストール状況に依存する
- document.fonts.check() は完全な判定ではない
