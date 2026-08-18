'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('font-metadata.js', 'utf8'), context);
const metadata = context.window.FontMetadata;

test('通常のTTF/OTF/WOFF2は内部フェイスを表示対象にしない', () => {
  assert.equal(metadata.isFontCollection({ fileName: 'segoeui.ttf', faceName: 'Segoe UI' }), false);
  assert.equal(metadata.isFontCollection({ fileName: 'noto.woff2', faceName: 'Noto Sans JP' }), false);
});

test('TTC/OTCだけを内部フェイス表示対象にする', () => {
  assert.equal(metadata.isFontCollection({ fileName: 'meiryo.ttc', faceIndex: 0 }), true);
  assert.equal(metadata.isFontCollection({ fileName: 'collection.otc', faceIndex: 2 }), true);
});

test('バージョンは単数または集約結果をそのまま表示し、未解析理由は安全な既定値を使う', () => {
  assert.equal(metadata.formatFontVersion({ fontVersion: 'Version 2.004-H2; build' }, { compact: true }), 'Version 2.004-H2');
  assert.equal(metadata.formatFontVersion({ fontVersions: ['Version 1', 'Version 2'] }), 'Version 1 / Version 2');
  assert.equal(metadata.safeUnparsedReason({}), 'フォントファイルを確認できていません。');
});

test('WeightとStyleはファミリー共通モデルで、読み込み済み情報と未確認情報を分ける', () => {
  const profile = metadata.createFontFaceProfile({
    family: 'Example Sans',
    loadedWeights: [700, 400, 700],
    loadedStyles: [{ value: 'normal', native: true }]
  });
  assert.equal(profile.family, 'Example Sans');
  assert.deepEqual([...profile.loadedWeights], [400, 700]);
  assert.equal(metadata.formatWeightSummary(profile), 'Regular 400 / Bold 700（このアプリで読み込み確認済み。ファミリー全体は未確認）');
  assert.equal(metadata.formatStyleSummary(profile), 'Normal（このアプリで読み込み確認済み）');
  assert.equal(metadata.formatWeightSummary(metadata.createFontFaceProfile({ family: 'Unknown' })), '未確認');
  assert.equal(metadata.formatStyleSummary(metadata.createFontFaceProfile({ family: 'Unknown' })), '未確認');
});

test('検証環境で解析したWeightと専用Styleは重複を除き、数値順と確認範囲を表示する', () => {
  const profile = metadata.createFontFaceProfile({
    family: 'Example Sans',
    availableWeights: [700, 350, 400, 700],
    availableStyles: [{ value: 'italic', native: true }, { value: 'normal', native: true }, { value: 'italic', native: true }],
    verification: { scope: 'environment', label: 'この検証環境（Windows）で確認済み' }
  });
  assert.deepEqual([...profile.availableWeights], [350, 400, 700]);
  assert.deepEqual([...profile.availableStyles].map((style) => style.value), ['italic', 'normal']);
  assert.equal(metadata.formatWeightSummary(profile), 'Weight 350 / Regular 400 / Bold 700（この検証環境（Windows）で確認済み）');
  assert.equal(metadata.formatStyleSummary(profile), 'Italic / Normal（この検証環境（Windows）で確認済み）');
});

test('擬似Italicは専用Italic対応として表示しない', () => {
  const profile = metadata.createFontFaceProfile({
    family: 'Example Sans',
    syntheticStyles: ['italic']
  });
  assert.equal(metadata.formatStyleSummary(profile), '専用Styleは未確認');
});
