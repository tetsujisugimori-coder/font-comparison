'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('font-opentype-data.js', 'utf8'), context);
const data = context.window.FontOpenTypeData;
const loadDetail = (id) => {
  const detailContext = { window: { FontAnalysisDetails: {} } };
  vm.runInNewContext(fs.readFileSync(`analysis-details/${id}.js`, 'utf8'), detailContext);
  return detailContext.window.FontAnalysisDetails[id];
};
const noto = data.fonts['noto-sans-jp-web'];
const webFontIds = [
  'noto-sans-jp-web', 'noto-serif-jp-web', 'noto-sans-sc-web', 'noto-sans-tc-web',
  'source-han-sans-web', 'inter-web', 'ibm-plex-sans-web', 'jetbrains-mono-web',
  'zen-kaku-gothic-new-web', 'shippori-mincho-web'
];

test('10種類のWebフォントが解析済みOpenTypeデータを持つ', () => {
  for (const id of webFontIds) {
    const font = data.fonts[id];
    assert.equal(font.status, 'analyzed');
    assert.ok(Array.isArray(font.features));
    assert.ok(font.fileCount > 0);
    assert.deepEqual([...font.requestedWeights], [400, 700]);
    assert.deepEqual([...font.requestedStyles], ['normal']);
  }
});

test('Noto Sans JPの統合OpenType一覧は起動時に保持し、配信証拠は詳細JSへ分離する', () => {
  assert.equal(noto.status, 'analyzed');
  assert.equal(noto.sourceType, 'web');
  assert.equal(noto.analysisTarget, 'Google Fonts CSSに定義されたWOFF2');
  assert.deepEqual([...noto.requestedWeights], [400, 700]);
  assert.equal(noto.fileCount, 124);
  assert.match(noto.fontVersion, /^Version 2\.004-H2/);
  assert.equal('files' in noto, false);
  const detail = loadDetail('noto-sans-jp-web');
  assert.equal(detail.evidence.cssHost, 'fonts.googleapis.com');
  assert.deepEqual([...detail.evidence.woff2Hosts], ['fonts.gstatic.com']);
  assert.equal(detail.evidence.fontFaceCount, 248);
  assert.equal(detail.evidence.files.length, 124);
  assert.equal(detail.evidence.files.filter((file) => file.weights.includes(400)).length, 124);
  assert.equal(detail.evidence.files.filter((file) => file.weights.includes(700)).length, 124);
});

test('各WOFF2のunicode-range、SHA-256、ウェイト、解析結果を詳細JSで保持する', () => {
  for (const file of loadDetail('noto-sans-jp-web').evidence.files) {
    assert.match(file.url, /^https:\/\/fonts\.gstatic\.com\/.+\.woff2$/);
    assert.ok(file.unicodeRanges.length > 0);
    assert.match(file.sha256, /^[0-9a-f]{64}$/);
    assert.match(file.fileName, /\.woff2$/);
    assert.ok(file.weights.length > 0);
    assert.ok(Array.isArray(file.features));
  }
});

test('統合タグは重複せず、GSUBとGPOSの両方を保持できる', () => {
  const tags = [...noto.features].map((feature) => feature.tag);
  assert.equal(new Set(tags).size, tags.length);
  assert.deepEqual(tags, ['ccmp', 'halt', 'kern', 'liga', 'locl', 'palt', 'vert', 'vhal', 'vkrn', 'vpal', 'vrt2']);
  assert.deepEqual([...noto.features.find((feature) => feature.tag === 'vert').tables], ['GSUB', 'GPOS']);
});

test('Source Han Sans CNは固定リリースURLと解析済みファイル情報を持つ', () => {
  const sourceHan = data.fonts['source-han-sans-web'];
  assert.equal(sourceHan.fileCount, 2);
  assert.ok(sourceHan.features.length > 0);
  const detail = loadDetail('source-han-sans-web');
  assert.match(detail.evidence.files[0].url, /source-han-sans@2\.005R/);
  assert.ok(detail.evidence.files.every((file) => /^[0-9a-f]{64}$/.test(file.sha256)));
});

test('起動時OpenTypeデータには統合機能のみを持ち、詳細証拠を含まない', () => {
  assert.equal(data.schemaVersion, 2);
  for (const font of Object.values(data.fonts)) {
    assert.ok(Array.isArray(font.features));
    assert.equal('files' in font, false);
    assert.equal('userAgent' in font, false);
    assert.equal('cssUrl' in font, false);
  }
});
