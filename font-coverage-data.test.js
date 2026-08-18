'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('font-coverage-data.js', 'utf8'), context);
const data = context.window.FontCoverageData;

const webFontIds = [
  'noto-sans-jp-web', 'noto-serif-jp-web', 'noto-sans-sc-web', 'noto-sans-tc-web',
  'source-han-sans-web', 'inter-web', 'ibm-plex-sans-web', 'jetbrains-mono-web',
  'zen-kaku-gothic-new-web', 'shippori-mincho-web'
];

test('10種類のWebフォントを解析済みで持ち、未解析を未収録扱いにしない', () => {
  assert.equal(Object.keys(data.fonts).length, 18);
  assert.equal(data.fonts['cascadia-code'].status, 'not-analyzed');
  assert.deepEqual([...data.fonts['cascadia-code'].ranges], []);
  assert.equal(Object.values(data.fonts).filter((font) => font.status === 'analyzed').length, 17);
  for (const id of webFontIds) {
    const font = data.fonts[id];
    assert.equal(font.status, 'analyzed');
    assert.ok(font.codepointCount > 0);
    assert.ok(font.ranges.length > 0);
    assert.equal(font.requestedStyles.includes('normal'), true);
  }
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
  assert.equal(noto.files.length, 124);
});

test('Source Han Sans CNは固定版の単体OTFを解析し、地域版を明示する', () => {
  const sourceHan = data.fonts['source-han-sans-web'];
  assert.equal(sourceHan.analysisTarget, '固定版のWeb配信OTF');
  assert.equal(sourceHan.fileCount, 2);
  assert.match(sourceHan.files[0].url, /source-han-sans@2\.005R/);
  assert.ok(sourceHan.files.every((file) => file.fileSize > 8_000_000));
  assert.match(sourceHan.caveat, /日本語版・繁体字版.*ではありません/);
});

test('Noto系4書体の見本文字は生成済みcmapに基づいて比較する', () => {
  const hasCodepoint = (fontId, character) => data.fonts[fontId].ranges.some(([start, end]) => {
    const codepoint = character.codePointAt(0);
    return start <= codepoint && codepoint <= end;
  });
  const comparisonIds = ['noto-sans-jp-web', 'noto-serif-jp-web', 'noto-sans-sc-web', 'noto-sans-tc-web'];
  for (const id of comparisonIds) {
    for (const character of 'いろは第条天皇天地玄黃黄張列') assert.equal(hasCodepoint(id, character), true, `${id}: ${character}`);
  }
  for (const id of ['noto-sans-jp-web', 'noto-serif-jp-web', 'noto-sans-tc-web']) {
    for (const character of '张过懒') assert.equal(hasCodepoint(id, character), false, `${id}: ${character}`);
  }
  for (const character of '张过懒') assert.equal(hasCodepoint('noto-sans-sc-web', character), true, character);
});
