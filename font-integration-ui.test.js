'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
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

test('通常・詳細・固定マス・実幅枠へ同じ文字判定を適用する', () => {
  assert.match(app, /state\.mode === 'fixed'[\s\S]*appendCoverageText/);
  assert.match(app, /state\.mode === 'width'[\s\S]*appendCoverageText/);
  assert.match(app, /for \(const section of samples\.normal\)[\s\S]*appendSection/);
  assert.match(app, /state\.mode === 'detail'/);
  assert.match(css, /\.unsupported-glyph\s*\{[\s\S]*opacity:\s*0\.3/);
});

test('通常モードの初期3カードと4表示モードを維持する', () => {
  assert.match(app, /selectedIds: \['segoe-ui', 'yu-gothic-ui', 'consolas'\]/);
  for (const mode of ['normal', 'fixed', 'width', 'detail']) {
    assert.match(html, new RegExp(`data-mode="${mode}"`));
  }
});

test('凡例は未収録がある解析済みカードだけに出し、未解析は未確認とする', () => {
  assert.match(app, /if \(coverage\.status !== 'analyzed'\)[\s\S]*収録文字情報は未確認/);
  assert.match(app, /if \(unsupportedCount === 0\) return null/);
  assert.match(app, /薄い文字は、解析した対象フォントに未収録です。ブラウザが別のフォントによる代替表示を試みます。/);
  assert.doesNotMatch(app, /別のフォントで代替表示されています。/);
});

test('MS Minchoは通常カードと詳細表示で共通の等幅属性を使う', () => {
  assert.match(app, /id: 'ms-mincho',[\s\S]*?width: '等幅'/);
  assert.match(app, /font\.attributes\.width/);
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

test('OpenType機能はカードごとの折りたたみトグルとして表示される', () => {
  assert.match(app, /openTypeFeaturePanels/);
  assert.match(app, /openTypeFeatureSummary\(font\)/);
  assert.match(app, /openTypeFeatureRows\(font\)/);
  assert.match(app, /function updateOpenTypePanelState/);
  assert.match(app, /open-type-toggle/);
  assert.match(app, /aria-expanded="\$?\{?[^"]+\}?/);
  assert.match(app, /aria-controls="open-type-/);
  assert.match(app, /data-font-name="\$\{escapeHtml\(font\.name\)\}"/);
});

test('OpenType機能は説明を共通辞書で表示し、未確認は未収録と断定しない', () => {
  assert.match(app, /openTypeFeatureDefinitions/);
  assert.match(app, /収録確認済み/);
  assert.match(app, /未収録/);
  assert.match(app, /未確認/);
  assert.match(app, /OpenType機能は未確認です。収録状況を確認できていません。/);
  assert.doesNotMatch(app, /if \(font\.attributes\.openType\.verified === false\) return '未収録'/);
});

test('Webフォントも同じカード構造でOpenType情報を扱う', () => {
  assert.match(app, /'noto-sans-jp-web'/);
  assert.match(app, /sourceType: 'web'/);
  assert.match(app, /fontOrigin: 'Web'/);
  assert.match(app, /sourceType: 'system'/);
  assert.match(app, /font\.attributes\.sourceKind/);
  assert.match(html, /fonts\.googleapis\.com/);
});
