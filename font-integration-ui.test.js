'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const fontFaceDataSource = fs.readFileSync('font-face-data.js', 'utf8');
const katexData = fs.readFileSync('katex-data.js', 'utf8');
const katexPage = fs.readFileSync('katex-page.js', 'utf8');

test('Memo Nexus連携パネルは通常起動時に非表示で必要な操作を持つ', () => {
  assert.match(html, /id="memoNexusPanel"[^>]*hidden/);
  assert.match(html, /id="returnToMemoButton"[^>]*>Memo Nexusで使用/);
  assert.match(html, /id="copyFontSettingButton"[^>]*>フォント設定をコピー/);
  assert.match(html, /id="recommendedOnly"/);
  assert.match(html, /integration-utils\.js/);
});

test('受け取った比較文章はtextContentまたは安全な文字描画を経由しHTMLとして解釈しない', () => {
  assert.match(app, /memoNexusSample\.textContent = memoIntegration\.sample/);
  assert.match(app, /appendSection\('Memo Nexusの比較文章', memoIntegration\.sample/);
  assert.match(app, /coverageApi\.appendCoverageText/);
  assert.doesNotMatch(app, /memoNexusSample\.innerHTML\s*=/);
});

test('連携モードでは全フォントを用途別に並べ、明示選択して戻す', () => {
  assert.match(app, /state\.selectedIds = fonts\.map/);
  assert.match(app, /recommendedFor/);
  assert.match(app, /この用途に推奨/);
  assert.match(app, /selectedMemoFontId = font\.id/);
  assert.match(app, /location\.assign\(integrationApi\.buildMemoNexusReturnUrl/);
});

test('未確認情報を未対応と断定せず公式メタデータと分けて表示する', () => {
  assert.match(app, /languages: \{ latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' \}/);
  assert.match(app, /SIL Open Font License 1\.1/);
  assert.match(app, /Microsoft製品付属（再配布は別途ライセンス確認）/);
  assert.match(app, /収録文字情報は未確認です。未収録とは判定していません。/);
  assert.match(app, /公式情報:/);
});

test('収録判定データと文字判定スクリプトをapp.jsより先に読み込む', () => {
  assert.match(html, /font-coverage-data\.js[\s\S]*font-coverage\.js[\s\S]*app\.js/);
});

test('通常・固定マス・実幅枠へ同じ文字判定を適用する', () => {
  assert.match(app, /state\.mode === 'fixed'[\s\S]*appendCoverageText/);
  assert.match(app, /state\.mode === 'width'[\s\S]*appendCoverageText/);
  assert.match(app, /for \(const section of samples\.normal\)[\s\S]*appendSection/);
  assert.doesNotMatch(app, /state\.mode === 'detail'/);
  assert.match(css, /\.unsupported-glyph\s*\{[\s\S]*opacity:\s*0\.3/);
});

test('通常モードの初期3カードと3表示モードを維持し、詳細モードを削除する', () => {
  assert.match(app, /selectedIds: \['segoe-ui', 'yu-gothic-ui', 'consolas'\]/);
  for (const mode of ['normal', 'fixed', 'width']) {
    assert.match(html, new RegExp(`data-mode="${mode}"`));
  }
  assert.doesNotMatch(html, /data-mode="detail"/);
  assert.doesNotMatch(app, /詳細用/);
});

test('凡例は未収録がある解析済みカードだけに出し、未解析は未確認とする', () => {
  assert.match(app, /if \(coverage\.status !== 'analyzed'\)[\s\S]*収録文字情報は未確認/);
  assert.match(app, /if \(unsupportedCount === 0\) return null/);
  assert.match(app, /薄い文字は、解析した対象フォントに未収録です。ブラウザが別のフォントによる代替表示を試みます。/);
  assert.doesNotMatch(app, /別のフォントで代替表示されています。/);
});

test('MS Minchoは通常カードの属性欄で等幅属性を表示する', () => {
  assert.match(app, /id: 'ms-mincho',[\s\S]*?width: '等幅'/);
  assert.match(app, /font\.attributes\.width/);
  assert.match(app, /function coverageStatusLabel\(coverage\)/);
  assert.match(app, /収録文字データ: \$\{coverageStatusLabel\(coverage\)\}/);
});

test('KaTeXの51用例と表示切替処理を維持する', () => {
  assert.equal((katexData.match(/\{ id: '[^']+', category:/g) || []).length, 51);
  assert.match(katexPage, /viewButtons\.forEach/);
  assert.match(katexPage, /setView\('katex'/);
});

test('連携UIは狭幅とOSダークモードへ対応する', () => {
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.memo-integration-panel/);
  assert.match(css, /@media \(max-width: 699px\)[\s\S]*?\.memo-integration-panel/);
  assert.match(css, /\.recommendation-badge\.recommended/);
});

test('OpenType機能はカードの展開トグルではなく共通ダイアログへ変更されている', () => {
  assert.doesNotMatch(app, /openTypeFeaturePanels/);
  assert.doesNotMatch(app, /open-type-toggle/);
  assert.match(app, /openTypeFeatureDialog/);
  assert.match(app, /openTypeFeatureDialogForFont/);
  assert.match(app, /openTypeFeatureRows\(font\)/);
  assert.match(app, /aria-controls="openTypeFeatureDialog"/);
  assert.match(app, /OpenType機能の詳細/);
});

test('OpenType機能は共通辞書で公開され、未確認タグは掲載しない', () => {
  assert.match(app, /openTypeFeatureDefinitions/);
  assert.match(app, /任意/);
  assert.match(app, /自動/);
  assert.match(app, /フォント固有/);
  assert.doesNotMatch(app, /説明未確認/);
  assert.doesNotMatch(app, /未確認のみを/);
  assert.match(app, /openTypeUnparsedMessage =/);
  assert.match(app, /openTypeNoFeatureMessage =/);
});

test('Webフォントも同じカード構造でOpenType情報を扱う', () => {
  assert.match(app, /'noto-sans-jp-web'/);
  assert.match(app, /sourceType: 'web'/);
  assert.match(app, /fontOrigin: 'Webブラウザ'/);
  assert.match(app, /sourceType: 'system'/);
  assert.match(app, /font\.attributes\.sourceKind/);
  assert.match(html, /fonts\.googleapis\.com/);
});

test('WeightとStyleは全カード共通の個別フェイス情報として表示し、重複するFont Family行は出力しない', () => {
  assert.match(app, /fontFace: createFontFaceProfile\(font\)/);
  assert.match(app, /Weight:/);
  assert.match(app, /Style:/);
  assert.match(app, /function createFontFaceProfile\(font\)/);
  assert.match(app, /function fontVariantInfoRows\(font\)/);
  assert.doesNotMatch(app, /Font Family:/);
  assert.match(app, /const fontFaceData = window\.FontFaceData/);
  assert.match(app, /const analyzed = fontFaceData\.fonts\?\.\[font\.id\]/);
  assert.match(app, /loadedWeights: metadata\.loadedWeights \|\| font\.delivery\?\.weights/);
  assert.match(app, /loadedStyles: \[\{ value: 'normal', native: true \}\]/);
  assert.doesNotMatch(app, /noto-sans-jp-web[\s\S]*?if \(font\.id === 'noto-sans-jp-web'\)/);
});

test('Windows実フォントの生成データはWeightを順序付きで集約し、TTC faceIndexと専用Italicを保持する', () => {
  const context = { window: {} };
  require('node:vm').runInNewContext(fontFaceDataSource, context);
  const data = context.window.FontFaceData;
  assert.deepEqual([...data.fonts['segoe-ui'].availableWeights], [300, 350, 400, 600, 700, 900]);
  assert.equal(data.fonts['segoe-ui'].family, 'Segoe UI');
  assert.equal(data.fonts['segoe-ui'].sources[0].family, 'Segoe UI');
  assert.deepEqual([...data.fonts['yu-gothic-ui'].availableStyles].map((style) => style.value), ['normal']);
  assert.equal(data.fonts['meiryo'].sources.some((source) => source.fileName === 'meiryo.ttc' && source.faceIndex === 1), true);
  assert.equal(data.fonts.consolas.availableStyles.some((style) => style.value === 'italic' && style.native), true);
  assert.equal(data.fonts['cascadia-code'].status, 'not-analyzed');
  assert.match(data.fonts['segoe-ui'].verification.label, /この検証環境（Windows）で確認済み/);
});

test('Weight・Style情報は既存の属性リストと狭幅対応を使い、確認範囲を区別してItalicを推測表示しない', () => {
  assert.match(app, /fontVariantInfoRows\(font\)/);
  assert.match(css, /\.font-card\s*\{[\s\S]*?min-width:\s*0/);
  assert.match(css, /\.attribute-list li\s*\{[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(app, /Italic対応/);
  assert.match(html, /font-face-data\.js[\s\S]*app\.js/);
  assert.match(fontFaceDataSource, /この検証環境（Windows）で確認済み/);
  assert.match(fs.readFileSync('font-metadata.js', 'utf8'), /このアプリで読み込み確認済み/);
});

test('OpenType機能ダイアログにはボタン、一覧、説明欄の要素があり、同一ダイアログを再利用する', () => {
  assert.match(html, /id="openTypeFeatureDialog"/);
  assert.match(html, /openTypeFeatureDialogSummary/);
  assert.match(html, /openTypeFeatureDialogMeta/);
  assert.match(html, /openTypeFeatureDialogFeatureList/);
  assert.match(html, /openTypeFeatureDialogFeatureDetail/);
  assert.match(app, /openTypeFeatureDialogForFont\(font, openTypeButton\)/);
  assert.match(html, /opentype-dialog\.js[\s\S]*app\.js/);
  assert.match(app, /OpenTypeDialog\.createController/);
  assert.match(app, /aria-pressed="false"/);
  assert.doesNotMatch(app, /role="option"/);
  assert.doesNotMatch(app, /role', 'listbox/);
  assert.match(css, /\.open-type-feature-button/);
  assert.match(css, /\.open-type-dialog/);
});

test('ダイアログは指定された情報順とGoogle Fontsの注意書きを持つ', () => {
  const metaPosition = html.indexOf('openTypeFeatureDialogMeta');
  const filesPosition = html.indexOf('openTypeFeatureDialogFiles');
  const summaryPosition = html.indexOf('openTypeFeatureDialogSummary');
  const listPosition = html.indexOf('openTypeFeatureDialogFeatureList');
  const detailPosition = html.indexOf('openTypeFeatureDialogFeatureDetail');
  const notePosition = html.indexOf('openTypeFeatureDialogDisclaimer');
  const officialPosition = html.indexOf('openTypeFeatureDialogOfficial');
  assert.ok(metaPosition < filesPosition && filesPosition < summaryPosition);
  assert.ok(summaryPosition < listPosition && listPosition < detailPosition);
  assert.ok(detailPosition < notePosition && notePosition < officialPosition);
  assert.match(app, /Google FontsのCSSに定義された複数の配信ファイルを解析し/);
  assert.match(app, /CSS取得日/);
  assert.match(app, /User-Agent/);
  assert.match(app, /確認できたOpenType機能数/);
  assert.match(app, /フォントバージョン/);
  assert.match(app, /meta\.caveat/);
});

test('cmap収録情報とOpenType情報を分離し、内部フェイスの未確認表示をしない', () => {
  assert.doesNotMatch(app, /解析フォント:/);
  assert.doesNotMatch(app, /内部フェイス未確認/);
  assert.match(app, /文字収録判定の解析元/);
  assert.match(app, /webCoverageAnalysisRows/);
  assert.match(app, /shouldDisplayInternalFace/);
  assert.match(html, /font-metadata\.js[\s\S]*app\.js/);
});

test('OpenType機能辞書は公式Registered Featuresページだけを参照する', () => {
  for (const page of ['features_ae', 'features_fj', 'features_ko', 'features_pt', 'features_uz']) {
    assert.match(app, new RegExp(page));
  }
  assert.doesNotMatch(app, /features_(?:[0-9]+|zh)(?:['"/])/);
  assert.doesNotMatch(app, /unicode\.org\/standard\/reports\/tr11/);
  for (const officialName of [
    'Alternative Fractions',
    'Small Capitals From Capitals',
    'Contextual Alternates',
    'Case-Sensitive Forms',
    'Glyph Composition / Decomposition',
    'Capital Spacing',
    'Required Contextual Alternates',
    'Required Ligatures',
    'Alternate Vertical Half Metrics'
  ]) {
    assert.match(app, new RegExp(officialName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(app, /変え内容/);
});
