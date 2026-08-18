'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('font-coverage-data.js', 'utf8'), context);
const data = context.window.FontCoverageData;

test('対象9フォントを持ち、未解析を未収録扱いにしない', () => {
  assert.equal(Object.keys(data.fonts).length, 9);
  assert.equal(data.fonts['cascadia-code'].status, 'not-analyzed');
  assert.deepEqual([...data.fonts['cascadia-code'].ranges], []);
  assert.equal(Object.values(data.fonts).filter((font) => font.status === 'analyzed').length, 8);
});

test('ローカル解析済みデータは版・ファイル・整列済み範囲を持つ', () => {
  for (const font of Object.values(data.fonts).filter((item) => item.status === 'analyzed' && item.sourceType !== 'web')) {
    assert.ok(font.fileName);
    assert.match(font.fontVersion, /^Version /);
    assert.ok(font.codepointCount > 0);
    assert.ok(font.ranges.length > 0);
    for (let index = 0; index < font.ranges.length; index += 1) {
      const [start, end] = font.ranges[index];
      assert.ok(Number.isInteger(start) && Number.isInteger(end) && start <= end);
      if (index > 0) assert.ok(font.ranges[index - 1][1] + 1 < start);
    }
  }
});

test('Noto Sans JPの収録情報は124配信WOFF2のcmap統合結果を持つ', () => {
  const noto = data.fonts['noto-sans-jp-web'];
  assert.equal(noto.status, 'analyzed');
  assert.equal(noto.sourceType, 'web');
  assert.equal(noto.analysisTarget, 'Google Fonts配信WOFF2 124ファイル');
  assert.match(noto.fontVersion, /^Version 2\.004-H2/);
  assert.equal(noto.fileCount, 124);
  assert.ok(noto.codepointCount > 0);
  assert.ok(noto.ranges.length > 0);
  assert.match(noto.analysisMethod, /cmapを統合/);
  assert.match(noto.caveat, /全WOFF2のcmapを統合/);
  assert.equal('fileName' in noto, false);
  assert.equal('faceName' in noto, false);
});
