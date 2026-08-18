'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('font-coverage-data.js', 'utf8'), context);
const data = context.window.FontCoverageData;
const loadDetail = (id) => {
  const detailContext = { window: { FontAnalysisDetails: {} } };
  vm.runInNewContext(fs.readFileSync(`analysis-details/${id}.js`, 'utf8'), detailContext);
  return detailContext.window.FontAnalysisDetails[id];
};

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

test('Noto Sans JPの収録サマリーは起動時に保持し、ファイル証拠は詳細JSへ分離する', () => {
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
  assert.equal(noto.hasDetails, true);
  assert.equal(noto.detailSchemaVersion, 1);
  assert.equal('files' in noto, false);
  assert.equal('userAgent' in noto, false);
  const detail = loadDetail('noto-sans-jp-web');
  assert.equal(detail.evidence.files.length, 124);
  assert.equal(detail.evidence.cssUrl, 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
  assert.match(detail.evidence.userAgent, /Mozilla/);
});

test('Source Han Sans CNの固定版URLとファイルサイズは詳細JSで維持する', () => {
  const sourceHan = data.fonts['source-han-sans-web'];
  assert.equal(sourceHan.analysisTarget, '固定版のWeb配信OTF');
  assert.equal(sourceHan.fileCount, 2);
  assert.match(sourceHan.caveat, /日本語版・繁体字版.*ではありません/);
  const detail = loadDetail('source-han-sans-web');
  assert.match(detail.evidence.files[0].url, /source-han-sans@2\.005R/);
  assert.ok(detail.evidence.files.every((file) => file.fileSize > 8_000_000));
});

test('起動時cmapデータは重いファイル別証拠を含まない', () => {
  assert.equal(data.schemaVersion, 2);
  for (const font of Object.values(data.fonts)) {
    assert.equal('files' in font, false);
    assert.equal('userAgent' in font, false);
    assert.equal('sha256' in font, false);
    assert.ok(Array.isArray(font.ranges));
  }
});

test('解析済みフォントにはスキーマ整合した個別詳細JSがある', () => {
  for (const [id, font] of Object.entries(data.fonts)) {
    if (font.status !== 'analyzed') {
      assert.equal(font.hasDetails, false);
      continue;
    }
    assert.equal(fs.existsSync(`analysis-details/${id}.js`), true, id);
    const detail = loadDetail(id);
    assert.equal(detail.fontId, id);
    assert.equal(detail.schemaVersion, font.detailSchemaVersion);
  }
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
