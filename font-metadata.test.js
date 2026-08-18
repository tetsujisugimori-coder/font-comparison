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
