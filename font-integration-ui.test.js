'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

test('Memo Nexus連携パネルは通常起動時に非表示で必要な操作を持つ', () => {
  assert.match(html, /id="memoNexusPanel"[^>]*hidden/);
  assert.match(html, /id="returnToMemoButton"[^>]*>Memo Nexusで使用/);
  assert.match(html, /id="copyFontSettingButton"[^>]*>フォント設定をコピー/);
  assert.match(html, /id="recommendedOnly"/);
  assert.match(html, /integration-utils\.js/);
});

test('受け取った比較文章はtextContentまたはescapeHtmlを経由しHTMLとして解釈しない', () => {
  assert.match(app, /memoNexusSample\.textContent = memoIntegration\.sample/);
  assert.match(app, /escapeHtml\(memoIntegration\.sample\)/);
  assert.doesNotMatch(app, /memoNexusSample\.innerHTML\s*=/);
});

test('連携モードでは全フォントを用途別に並べ、明示選択して戻す', () => {
  assert.match(app, /state\.selectedIds = fonts\.map/);
  assert.match(app, /recommendedFor/);
  assert.match(app, /この用途に推奨/);
  assert.match(app, /selectedMemoFontId = font\.id/);
  assert.match(app, /location\.assign\(integrationApi\.buildMemoNexusReturnUrl/);
});

test('未確認情報を未対応と断定せずメタデータとして表示する', () => {
  assert.match(app, /languages: \{ latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' \}/);
  assert.match(app, /license: '未確認'/);
  assert.match(app, /配布元URL:.*未確認/s);
});

test('連携UIは狭幅とOSダークモードへ対応する', () => {
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.memo-integration-panel/);
  assert.match(css, /@media \(max-width: 699px\)[\s\S]*?\.memo-integration-panel/);
  assert.match(css, /\.recommendation-badge\.recommended/);
});
