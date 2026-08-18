'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const source = fs.readFileSync('katex-page.js', 'utf8');

function sourceFunction(name, nextName, dependencies, prefix = '') {
  const asyncStart = source.indexOf(`async function ${name}(`);
  const start = asyncStart === -1 ? source.indexOf(`function ${name}(`) : asyncStart;
  const nextStarts = [
    source.indexOf(`\nfunction ${nextName}(`, start),
    source.indexOf(`\nasync function ${nextName}(`, start)
  ].filter((position) => position !== -1);
  const end = nextStarts.length === 0 ? -1 : Math.min(...nextStarts);
  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${nextName} must follow ${name}`);
  return new Function(...Object.keys(dependencies), `${prefix}${source.slice(start, end)}\nreturn ${name};`)(...Object.values(dependencies));
}

function fakeButton(view) {
  return {
    dataset: { view },
    active: false,
    pressed: null,
    classList: { toggle(_name, value) { this.owner.active = value; }, owner: null },
    setAttribute(_name, value) { this.pressed = value; }
  };
}

test('setViewはフォント比較・条件検索・KaTeXを同時に切り替える', () => {
  const fontComparisonView = { hidden: false };
  const katexView = { hidden: true };
  const fontSearchPanel = { hidden: false };
  const fontsButton = fakeButton('fonts');
  const katexButton = fakeButton('katex');
  fontsButton.classList.owner = fontsButton;
  katexButton.classList.owner = katexButton;
  const historyCalls = [];
  const setView = sourceFunction('setView', 'showToast', {
    fontComparisonView,
    katexView,
    fontSearchPanel,
    viewButtons: [fontsButton, katexButton],
    history: { replaceState(...args) { historyCalls.push(args); } },
    window: { location: { pathname: '/index.html', search: '?mode=test' } }
  });

  setView('katex');
  assert.equal(fontComparisonView.hidden, true);
  assert.equal(katexView.hidden, false);
  assert.equal(fontSearchPanel.hidden, true);
  assert.equal(katexButton.active, true);
  assert.equal(katexButton.pressed, 'true');
  assert.equal(historyCalls.at(-1)[2], '#katex');

  setView('fonts');
  assert.equal(fontComparisonView.hidden, false);
  assert.equal(katexView.hidden, true);
  assert.equal(fontSearchPanel.hidden, false);
  assert.equal(fontsButton.active, true);
  assert.equal(fontsButton.pressed, 'true');
  assert.equal(historyCalls.at(-1)[2], '/index.html?mode=test');
});

test('KaTeX用ハッシュは直リンクとhashchangeで同じ判定を使う', () => {
  const isKatexHash = sourceFunction('isKatexHash', 'copyLatex', {});
  for (const hash of ['#katex', '#category-basic', '#fontRolesSection']) assert.equal(isKatexHash(hash), true);
  for (const hash of ['', '#other']) assert.equal(isKatexHash(hash), false);
  assert.match(source, /hashchange[\s\S]*setView\(isKatexHash\(window\.location\.hash\) \? 'katex' : 'fonts', false\)/);
  assert.match(source, /setView\(isKatexHash\(initialHash\) \? 'katex' : 'fonts', false\)/);
});

test('showToastは成功・失敗表示を更新し、要素がなくても例外にしない', () => {
  let timeoutCallback;
  const copyToast = {
    textContent: '',
    hidden: true,
    error: false,
    classList: { toggle(_name, value) { copyToast.error = value; } }
  };
  const window = {
    clearTimeout() {},
    setTimeout(callback) { timeoutCallback = callback; return 1; }
  };
  const showToast = sourceFunction('showToast', 'isKatexHash', { window, copyToast }, 'let toastTimer;\n');

  showToast('LaTeXをコピーしました');
  assert.equal(copyToast.textContent, 'LaTeXをコピーしました');
  assert.equal(copyToast.hidden, false);
  assert.equal(copyToast.error, false);
  timeoutCallback();
  assert.equal(copyToast.hidden, true);

  showToast('コピーできませんでした', true);
  assert.equal(copyToast.error, true);
  assert.doesNotThrow(() => sourceFunction('showToast', 'isKatexHash', { window, copyToast: null }, 'let toastTimer;\n')('message'));
});

function copyEnvironment({ secureContext, clipboardWrite, execCommand }) {
  const toasts = [];
  const textarea = {
    value: '',
    className: '',
    setAttribute() {},
    select() { this.selected = true; },
    remove() { this.removed = true; }
  };
  const document = {
    body: { appendChild(element) { element.appended = true; } },
    createElement(tagName) { assert.equal(tagName, 'textarea'); return textarea; },
    execCommand(command) { assert.equal(command, 'copy'); return execCommand; }
  };
  const navigator = clipboardWrite ? { clipboard: { writeText: clipboardWrite } } : {};
  const window = { isSecureContext: secureContext, setTimeout() { return 1; } };
  const showToast = (...args) => toasts.push(args);
  return {
    copyLatex: sourceFunction('copyLatex', 'renderMath', { navigator, window, document, showToast }),
    textarea,
    toasts
  };
}

test('copyLatexはClipboard API成功時にLaTeXと成功通知を渡す', async () => {
  let copiedText;
  const environment = copyEnvironment({
    secureContext: true,
    clipboardWrite: async (text) => { copiedText = text; },
    execCommand: false
  });
  await environment.copyLatex('\\frac{a}{b}');
  assert.equal(copiedText, '\\frac{a}{b}');
  assert.deepEqual(environment.toasts, [['LaTeXをコピーしました']]);
  assert.equal(environment.textarea.appended, undefined);
});

test('copyLatexはClipboard APIを使えない場合にexecCommandへフォールバックする', async () => {
  const environment = copyEnvironment({ secureContext: false, execCommand: true });
  await environment.copyLatex('x^2');
  assert.equal(environment.textarea.value, 'x^2');
  assert.equal(environment.textarea.className, 'copy-fallback');
  assert.equal(environment.textarea.selected, true);
  assert.equal(environment.textarea.removed, true);
  assert.deepEqual(environment.toasts, [['LaTeXをコピーしました']]);
});

test('copyLatexは両方失敗した場合にエラー通知を出す', async () => {
  const environment = copyEnvironment({ secureContext: false, execCommand: false });
  await environment.copyLatex('x^2');
  assert.deepEqual(environment.toasts, [['コピーできませんでした', true]]);
});
