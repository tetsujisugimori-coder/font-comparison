'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  MAX_SAMPLE_LENGTH,
  buildMemoNexusReturnUrl,
  fontSettingCopyText,
  isAllowedReturnUrl,
  parseMemoNexusParams
} = require('./integration-utils');

const fontIds = ['yu-gothic-ui', 'consolas'];
const font = {
  id: 'yu-gothic-ui',
  name: 'Yu Gothic UI',
  memoCssFamily: '"Yu Gothic UI", "Hiragino Sans", Meiryo, system-ui, sans-serif'
};

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
  assert.equal(url.searchParams.get('fontId'), 'yu-gothic-ui');
  assert.equal(url.searchParams.get('fontFamily'), font.memoCssFamily);
  assert.equal(url.searchParams.get('fontMemoId'), 'memo-1');
  assert.equal(url.hash, '');
});

test('不正な戻り先では遷移URLを作らずコピー用文字列は作れる', () => {
  const context = {
    target: 'heading',
    scope: 'global',
    returnUrl: 'https://evil.example/',
    memoId: '',
    errors: []
  };
  assert.throws(() => buildMemoNexusReturnUrl(context, font), /安全なMemo Nexus/);
  assert.match(fontSettingCopyText(context, font), /font-family: "Yu Gothic UI"/);
});
