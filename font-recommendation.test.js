'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { FONT_OPTIONS } = require('./font-recommendation-catalog');
const { languageStatusScore, recommendFonts } = require('./font-recommendation');

function font(id, options = {}) {
  return {
    id,
    name: options.name || id,
    sourceType: options.sourceType || 'system',
    categoryType: options.categoryType || 'sans-serif',
    recommendedFor: options.recommendedFor || ['body'],
    languages: {
      latin: 'unknown',
      japanese: 'unknown',
      simplifiedChinese: 'unknown',
      traditionalChinese: 'unknown',
      ...options.languages
    },
    impression: options.impression || [],
    uses: options.uses || []
  };
}

const fixtures = [
  font('noto-sans-jp-web', { sourceType: 'web', languages: { latin: 'supported', japanese: 'supported' }, impression: ['読みやすい'], uses: ['日本語本文', 'UI', '長文'] }),
  font('yu-gothic-ui', { languages: { latin: 'supported', japanese: 'supported' }, impression: ['落ち着いた'], uses: ['日本語本文', '長文'] }),
  font('noto-serif-jp-web', { sourceType: 'web', categoryType: 'serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'supported' }, impression: ['端正', '落ち着いた'], uses: ['日本語本文', '見出し', '長文'] }),
  font('shippori-mincho-web', { sourceType: 'web', categoryType: 'serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'supported' }, impression: ['上品'], uses: ['日本語本文', '見出し', '長文'] }),
  font('noto-sans-sc-web', { sourceType: 'web', languages: { latin: 'supported', simplifiedChinese: 'supported' }, impression: ['明快'], uses: ['簡体字本文', 'UI'] }),
  font('source-han-sans-web', { sourceType: 'web', languages: { latin: 'supported', simplifiedChinese: 'supported' }, impression: ['実用的'], uses: ['簡体字本文', 'UI'] }),
  font('noto-sans-tc-web', { sourceType: 'web', languages: { latin: 'supported', traditionalChinese: 'supported' }, impression: ['明快'], uses: ['繁体字本文', 'UI'] }),
  font('inter-web', { sourceType: 'web', languages: { latin: 'supported' }, impression: ['可読性'], uses: ['欧文UI', '欧文本文'] }),
  font('consolas', { categoryType: 'monospace', recommendedFor: ['code'], languages: { latin: 'supported' }, impression: ['実用的'], uses: ['コード'] }),
  font('jetbrains-mono-web', { sourceType: 'web', categoryType: 'monospace', recommendedFor: ['code'], languages: { latin: 'supported' }, impression: ['明快'], uses: ['コード'] }),
  font('courier-new', { categoryType: 'monospace', recommendedFor: ['code'], languages: { latin: 'supported' }, impression: ['古典的'], uses: ['コード'] })
];

test('日本語＋中立＋長文では日本語対応の本文向けフォントが上位になる', () => {
  const results = recommendFonts(fixtures, { language: 'japanese', mood: 'neutral', purpose: 'writing' });
  assert.equal(results[0].font.id, 'noto-sans-jp-web');
  assert.equal(results.every((result) => result.font.languages.japanese === 'supported'), true);
  assert.match(results[0].reasons.join(' '), /日本語の長文向け/);
});

test('日本語＋フォーマルでは明朝・セリフ系が上位になる', () => {
  const results = recommendFonts(fixtures, { language: 'japanese', mood: 'formal', purpose: 'reading' });
  assert.equal(results.slice(0, 2).every((result) => result.font.categoryType === 'serif'), true);
  assert.match(results[0].reasons.join(' '), /落ち着いた明朝・セリフ系/);
});

test('簡体字ではNoto Sans SCとSource Han Sans CNが候補になる', () => {
  const ids = recommendFonts(fixtures, { language: 'simplifiedChinese', mood: 'neutral', purpose: 'reading' })
    .map((result) => result.font.id);
  assert.equal(ids.includes('noto-sans-sc-web'), true);
  assert.equal(ids.includes('source-han-sans-web'), true);
});

test('繁体字ではNoto Sans TCが最上位候補になる', () => {
  const results = recommendFonts(fixtures, { language: 'traditionalChinese', mood: 'neutral', purpose: 'reading' });
  assert.equal(results[0].font.id, 'noto-sans-tc-web');
});

test('英数字中心＋コードではJetBrains Monoなどの等幅フォントが上位になる', () => {
  const results = recommendFonts(fixtures, { language: 'latin', mood: 'neutral', purpose: 'code' });
  assert.equal(results.every((result) => result.font.categoryType === 'monospace'), true);
  assert.equal(results.some((result) => result.font.id === 'jetbrains-mono-web'), true);
  assert.match(results.find((result) => result.font.id === 'jetbrains-mono-web').reasons.join(' '), /等幅でコード向け/);
});

test('unknownをunsupportedと同一視せず、未確認は非対応より上に置く', () => {
  assert.equal(languageStatusScore('unknown'), 0);
  assert.ok(languageStatusScore('unknown') > languageStatusScore('unsupported'));
  const results = recommendFonts([
    font('unsupported-font', { languages: { japanese: 'unsupported' } }),
    font('unknown-font', { languages: { japanese: 'unknown' } })
  ], { language: 'japanese', mood: 'neutral', purpose: 'writing' });
  assert.equal(results[0].font.id, 'unknown-font');
});

test('supportedとpartialが3件あればunknownを混ぜず、グループ内だけを採点する', () => {
  const results = recommendFonts([
    font('partial-first', { recommendedFor: [], languages: { japanese: 'partial' } }),
    font('supported-second', { recommendedFor: [], languages: { japanese: 'supported' } }),
    font('partial-third', { recommendedFor: [], languages: { japanese: 'partial' } }),
    font('unknown-high-score', { languages: { japanese: 'unknown' }, impression: ['読みやすい'], uses: ['本文', '長文'] })
  ], { language: 'japanese', mood: 'neutral', purpose: 'writing' });
  assert.equal(results.length, 3);
  assert.equal(results.some((result) => result.font.id === 'unknown-high-score'), false);
  assert.equal(results.every((result) => ['supported', 'partial'].includes(result.font.languages.japanese)), true);
});

test('preferredが不足する時だけunknownを補い、さらに不足する時だけunsupportedを使う', () => {
  const results = recommendFonts([
    font('unsupported-first', { languages: { japanese: 'unsupported' } }),
    font('unknown-first', { languages: { japanese: 'unknown' } }),
    font('partial-first', { languages: { japanese: 'partial' } }),
    font('unknown-second', { languages: { japanese: 'unknown' } })
  ], { language: 'japanese', mood: 'neutral', purpose: 'writing' });
  assert.deepEqual(results.map((result) => result.font.id), ['partial-first', 'unknown-first', 'unknown-second']);

  const withUnsupported = recommendFonts([
    font('unsupported-first', { languages: { japanese: 'unsupported' } }),
    font('unknown-first', { languages: { japanese: 'unknown' } }),
    font('partial-first', { languages: { japanese: 'partial' } })
  ], { language: 'japanese', mood: 'neutral', purpose: 'writing' });
  assert.deepEqual(withUnsupported.map((result) => result.font.id), ['partial-first', 'unknown-first', 'unsupported-first']);
});

test('partial・unknown・unsupportedの理由に言語状態を優先して表示する', () => {
  const answers = { language: 'japanese', mood: 'neutral', purpose: 'writing' };
  const reasonFor = (status) => recommendFonts([
    font(`${status}-font`, { languages: { japanese: status }, impression: ['読みやすい'], uses: ['本文', '長文'] })
  ], answers, 1)[0].reasons;
  assert.match(reasonFor('partial').join(' '), /一部対応/);
  assert.match(reasonFor('unknown').join(' '), /未確認/);
  assert.match(reasonFor('unsupported').join(' '), /非対応/);
});

test('実18フォントではMemo Nexusと同じ代表5条件の上位3件を返す', () => {
  const cases = [
    [{ language: 'japanese', mood: 'neutral', purpose: 'writing' }, ['yu-gothic-ui', 'meiryo', 'noto-sans-jp-web']],
    [{ language: 'japanese', mood: 'formal', purpose: 'writing' }, ['ms-mincho', 'noto-serif-jp-web', 'shippori-mincho-web']],
    [{ language: 'simplifiedChinese', mood: 'neutral', purpose: 'writing' }, ['noto-sans-sc-web', 'source-han-sans-web', 'noto-sans-tc-web']],
    [{ language: 'traditionalChinese', mood: 'neutral', purpose: 'writing' }, ['noto-sans-tc-web', 'noto-sans-sc-web', 'source-han-sans-web']],
    [{ language: 'latin', mood: 'neutral', purpose: 'code' }, ['consolas', 'cascadia-code', 'jetbrains-mono-web']]
  ];
  for (const [answers, expectedIds] of cases) {
    assert.deepEqual(recommendFonts(FONT_OPTIONS, answers).map((result) => result.font.id), expectedIds);
  }
});

test('常に重複しない最大3件を返す', () => {
  const duplicated = [fixtures[0], fixtures[0], ...fixtures];
  const results = recommendFonts(duplicated, { language: 'japanese', mood: 'neutral', purpose: 'writing' }, 10);
  assert.equal(results.length, 3);
  assert.equal(new Set(results.map((result) => result.font.id)).size, results.length);
});

test('同点時は入力順を安定して維持する', () => {
  const tied = ['first', 'second', 'third', 'fourth'].map((id) => font(id));
  const results = recommendFonts(tied, { language: 'japanese', mood: 'neutral', purpose: 'writing' });
  assert.deepEqual(results.map((result) => result.font.id), ['first', 'second', 'third']);
});

test('3問が未回答なら候補を断定しない', () => {
  assert.deepEqual(recommendFonts(fixtures, { language: '', mood: '', purpose: 'writing' }), []);
});
