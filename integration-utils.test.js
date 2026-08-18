'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const {
  MAX_SAMPLE_LENGTH,
  buildMemoNexusReturnUrl,
  isAllowedReturnUrl,
  parseMemoNexusParams
} = require('./integration-utils');

const app = fs.readFileSync('app.js', 'utf8');

const fontIds = ['yu-gothic-ui', 'consolas'];
const font = {
  id: 'yu-gothic-ui',
  name: 'Yu Gothic UI',
  memoCssFamily: '"Yu Gothic UI", "Hiragino Sans", Meiryo, system-ui, sans-serif'
};

const webFonts = [
  ['noto-sans-jp-web', 'Noto Sans JP', '"Noto Sans JP", "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif'],
  ['noto-serif-jp-web', 'Noto Serif JP', '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif'],
  ['noto-sans-sc-web', 'Noto Sans SC', '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif'],
  ['noto-sans-tc-web', 'Noto Sans TC', '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif'],
  ['source-han-sans-web', 'Source Han Sans', '"Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif'],
  ['inter-web', 'Inter', 'Inter, "Segoe UI", Arial, sans-serif'],
  ['ibm-plex-sans-web', 'IBM Plex Sans', '"IBM Plex Sans", "Segoe UI", Arial, sans-serif'],
  ['jetbrains-mono-web', 'JetBrains Mono', '"JetBrains Mono", "Cascadia Code", Consolas, monospace'],
  ['zen-kaku-gothic-new-web', 'Zen Kaku Gothic New', '"Zen Kaku Gothic New", "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif'],
  ['shippori-mincho-web', 'Shippori Mincho', '"Shippori Mincho", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif']
].map(([id, name, memoCssFamily]) => ({ id, name, memoCssFamily }));

test('mode=memo-nexusのURLパラメータをURLSearchParamsで読み取る', () => {
  const query = new URLSearchParams({
    mode: 'memo-nexus',
    target: 'body',
    scope: 'note',
    currentFontId: 'yu-gothic-ui',
    returnUrl: 'https://tetsujisugimori-coder.github.io/memo/',
    sample: '日本語 & 記号 +',
    memoId: 'memo-1'
  });
  const result = parseMemoNexusParams(`?${query}`, fontIds);

  assert.equal(result.target, 'body');
  assert.equal(result.scope, 'note');
  assert.equal(result.sample, '日本語 & 記号 +');
  assert.equal(result.memoId, 'memo-1');
  assert.deepEqual(result.errors, []);
});

test('通常起動では連携モードにしない', () => {
  assert.equal(parseMemoNexusParams('?target=body', fontIds), null);
});

test('長いサンプルを上限で切り、日本語や記号でも停止しない', () => {
  const query = new URLSearchParams({
    mode: 'memo-nexus',
    target: 'code',
    currentFontId: 'consolas',
    sample: `日本語<>${'x'.repeat(MAX_SAMPLE_LENGTH)}`
  });
  assert.equal(parseMemoNexusParams(`?${query}`, fontIds).sample.length, MAX_SAMPLE_LENGTH);
});

test('Memo Nexus本番URLとローカル開発URLだけを戻り先として許可する', () => {
  assert.equal(isAllowedReturnUrl('https://tetsujisugimori-coder.github.io/memo/?keep=1'), true);
  assert.equal(isAllowedReturnUrl('http://localhost:8080/memo/'), true);
  assert.equal(isAllowedReturnUrl('http://127.0.0.1:3000/'), true);
  assert.equal(isAllowedReturnUrl('https://evil.example/memo/'), false);
  assert.equal(isAllowedReturnUrl('https://user:password@tetsujisugimori-coder.github.io/memo/'), false);
  assert.equal(isAllowedReturnUrl('javascript:alert(1)'), false);
});

test('選択フォントを検証済み戻りURLへ安全に設定する', () => {
  const context = {
    target: 'body',
    scope: 'note',
    returnUrl: 'https://tetsujisugimori-coder.github.io/memo/?keep=1#old',
    memoId: 'memo-1',
    errors: []
  };
  const url = new URL(buildMemoNexusReturnUrl(context, font));

  assert.equal(url.searchParams.get('keep'), '1');
  assert.equal(url.searchParams.get('fontSource'), 'font-comparison');
  assert.equal(url.searchParams.get('fontTarget'), 'body');
  assert.equal(url.searchParams.get('fontScope'), 'note');
  assert.equal(url.searchParams.get('fontId'), 'yu-gothic-ui');
  assert.equal(url.searchParams.get('fontFamily'), font.memoCssFamily);
  assert.equal(url.searchParams.get('fontLabel'), font.name);
  assert.equal(url.searchParams.get('fontMemoId'), 'memo-1');
  assert.equal(url.hash, '');
});

test('全10WebフォントのID・表示名・font-familyを戻りURLへ設定できる', () => {
  const context = {
    target: 'body',
    scope: 'global',
    returnUrl: 'https://tetsujisugimori-coder.github.io/memo/',
    memoId: '',
    errors: []
  };
  for (const webFont of webFonts) {
    assert.equal(app.includes(`memoCssFamily: '${webFont.memoCssFamily}'`), true, `${webFont.id} must use the tested font-family`);
    const url = new URL(buildMemoNexusReturnUrl(context, webFont));
    assert.equal(url.searchParams.get('fontId'), webFont.id);
    assert.equal(url.searchParams.get('fontLabel'), webFont.name);
    assert.equal(url.searchParams.get('fontFamily'), webFont.memoCssFamily);
  }
});

test('未登録の現在フォントIDを連携入力として受け入れない', () => {
  const query = new URLSearchParams({
    mode: 'memo-nexus',
    target: 'body',
    currentFontId: 'unknown-font'
  });
  const result = parseMemoNexusParams(`?${query}`, fontIds);
  assert.match(result.errors.join(' '), /現在のフォントを確認できません/);
  assert.equal(result.currentFontId, fontIds[0]);
});

test('不正な戻り先では遷移URLを作らない', () => {
  const context = {
    target: 'heading',
    scope: 'global',
    returnUrl: 'https://evil.example/',
    memoId: '',
    errors: []
  };
  assert.throws(() => buildMemoNexusReturnUrl(context, font), /安全なMemo Nexus/);
});
