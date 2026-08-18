'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { FONT_OPTIONS } = require('./font-recommendation-catalog');

const EXPECTED_FONT_OPTIONS = [
  ['segoe-ui', 'Segoe UI', 'system', 'sans-serif', ['body', 'heading'], ['supported', 'partial', 'unknown', 'unknown'], ['中立', '読みやすい'], ['欧文UI', '本文', '見出し'], '"Segoe UI", "Yu Gothic UI", sans-serif'],
  ['yu-gothic-ui', 'Yu Gothic UI', 'system', 'sans-serif', ['body', 'heading'], ['supported', 'supported', 'unknown', 'unknown'], ['中立', '落ち着いた'], ['日本語本文', '長文', 'UI', '見出し'], '"Yu Gothic UI", "Hiragino Sans", Meiryo, system-ui, sans-serif'],
  ['meiryo', 'Meiryo', 'system', 'sans-serif', ['body'], ['supported', 'supported', 'unknown', 'unknown'], ['読みやすい', '実用的'], ['日本語本文', '長文', 'UI'], 'Meiryo, "Yu Gothic UI", sans-serif'],
  ['ms-mincho', 'MS Mincho', 'system', 'serif', ['body', 'heading'], ['partial', 'supported', 'unknown', 'unknown'], ['落ち着いた', '古典的'], ['日本語本文', '長文', '見出し'], '"ＭＳ 明朝", "MS Mincho", serif'],
  ['consolas', 'Consolas', 'system', 'monospace', ['code'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['中立', '実用的'], ['コード'], 'Consolas, "Courier New", monospace'],
  ['cascadia-code', 'Cascadia Code', 'system', 'monospace', ['code'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['現代的', '明快'], ['コード'], '"Cascadia Code", Consolas, monospace'],
  ['courier-new', 'Courier New', 'system', 'monospace', ['code'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['古典的'], ['コード'], '"Courier New", Consolas, monospace'],
  ['times-new-roman', 'Times New Roman', 'system', 'serif', ['body', 'heading'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['落ち着いた', '古典的'], ['欧文本文', '長文', '見出し'], '"Times New Roman", "ＭＳ 明朝", serif'],
  ['noto-sans-jp-web', 'Noto Sans JP', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'supported', 'unknown', 'unknown'], ['読みやすい', '汎用'], ['日本語本文', '長文', 'UI', '見出し'], '"Noto Sans JP", "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif'],
  ['noto-serif-jp-web', 'Noto Serif JP', 'web', 'serif', ['body', 'heading'], ['supported', 'supported', 'unknown', 'unknown'], ['端正', '落ち着いた'], ['日本語本文', '長文', '見出し'], '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif'],
  ['noto-sans-sc-web', 'Noto Sans SC', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'unknown', 'supported', 'partial'], ['明快', '汎用'], ['簡体字本文', '長文', 'UI', '見出し'], '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif'],
  ['noto-sans-tc-web', 'Noto Sans TC', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'unknown', 'partial', 'supported'], ['明快', '汎用'], ['繁体字本文', '長文', 'UI', '見出し'], '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif'],
  ['source-han-sans-web', 'Source Han Sans', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'unknown', 'supported', 'partial'], ['実用的', '明快'], ['簡体字本文', '長文', 'UI', '見出し'], '"Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif'],
  ['inter-web', 'Inter', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['可読性', '現代的'], ['欧文本文', '長文', '欧文UI', '見出し'], 'Inter, "Segoe UI", Arial, sans-serif'],
  ['ibm-plex-sans-web', 'IBM Plex Sans', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['中立', '端正'], ['欧文本文', '長文', '欧文UI', '見出し'], '"IBM Plex Sans", "Segoe UI", Arial, sans-serif'],
  ['jetbrains-mono-web', 'JetBrains Mono', 'web', 'monospace', ['code'], ['supported', 'unsupported', 'unsupported', 'unsupported'], ['明快', '現代的'], ['コード'], '"JetBrains Mono", "Cascadia Code", Consolas, monospace'],
  ['zen-kaku-gothic-new-web', 'Zen Kaku Gothic New', 'web', 'sans-serif', ['body', 'heading'], ['supported', 'supported', 'unknown', 'unknown'], ['親しみ', '現代的'], ['日本語本文', '長文', 'UI', '見出し'], '"Zen Kaku Gothic New", "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif'],
  ['shippori-mincho-web', 'Shippori Mincho', 'web', 'serif', ['body', 'heading'], ['supported', 'supported', 'unknown', 'unknown'], ['上品', '落ち着いた'], ['日本語本文', '長文', '見出し'], '"Shippori Mincho", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif']
];

function contractRow(font) {
  return [
    font.id,
    font.name,
    font.sourceType,
    font.categoryType,
    font.recommendedFor,
    ['latin', 'japanese', 'simplifiedChinese', 'traditionalChinese'].map((language) => font.languages[language]),
    font.impression,
    font.uses,
    font.memoCssFamily
  ];
}

test('Memo Nexus PR #114と同じ順序・18フォント・推薦契約を保持する', () => {
  assert.deepEqual(FONT_OPTIONS.map(contractRow), EXPECTED_FONT_OPTIONS);
  assert.equal(FONT_OPTIONS.filter((font) => font.sourceType === 'system').length, 8);
  assert.equal(FONT_OPTIONS.filter((font) => font.sourceType === 'web').length, 10);
});

test('カード表示用情報と混同しやすい言語状態・用途を契約値で固定する', () => {
  const byId = new Map(FONT_OPTIONS.map((font) => [font.id, font]));
  assert.equal(byId.get('segoe-ui').languages.japanese, 'partial');
  assert.equal(byId.get('cascadia-code').languages.latin, 'supported');
  for (const id of ['consolas', 'cascadia-code', 'courier-new', 'times-new-roman', 'inter-web', 'ibm-plex-sans-web', 'jetbrains-mono-web']) {
    assert.deepEqual(
      ['japanese', 'simplifiedChinese', 'traditionalChinese'].map((language) => byId.get(id).languages[language]),
      ['unsupported', 'unsupported', 'unsupported']
    );
  }
  for (const id of ['noto-sans-sc-web', 'noto-sans-tc-web', 'source-han-sans-web']) {
    assert.deepEqual(byId.get(id).recommendedFor, ['body', 'heading']);
  }
});
