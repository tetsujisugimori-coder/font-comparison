'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('font-opentype-data.js', 'utf8'), context);
const data = context.window.FontOpenTypeData;
const noto = data.fonts['noto-sans-jp-web'];

test('Noto Sans JPは指定Google Fonts CSSの全配信ファイル解析結果を持つ', () => {
  assert.equal(noto.status, 'analyzed');
  assert.equal(noto.sourceType, 'web');
  assert.equal(noto.analysisTarget, 'Google Fonts CSSに定義されたWOFF2');
  assert.equal(noto.cssUrl, 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
  assert.deepEqual([...noto.requestedWeights], [400, 700]);
  assert.equal(noto.cssHost, 'fonts.googleapis.com');
  assert.deepEqual([...noto.woff2Hosts], ['fonts.gstatic.com']);
  assert.equal(noto.fontFaceCount, 248);
  assert.equal(noto.fileCount, 124);
  assert.equal(noto.files.length, 124);
  assert.match(noto.fontVersion, /^Version 2\.004-H2/);
  assert.equal(noto.files.filter((file) => file.weights.includes(400)).length, 124);
  assert.equal(noto.files.filter((file) => file.weights.includes(700)).length, 124);
});

test('各WOFF2はunicode-range、SHA-256、ウェイト、解析結果を保持する', () => {
  for (const file of noto.files) {
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
