'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  STATUS,
  appendCoverageText,
  characterStatus,
  codepointStatus,
  formatCodepoint,
  shouldKeepNormalOpacity
} = require('./font-coverage');

const coverageData = {
  fonts: {
    analyzed: { status: 'analyzed', ranges: [[0x41, 0x41], [0x1f600, 0x1f600]] },
    missing: { status: 'not-analyzed', ranges: [] }
  }
};

class FakeNode {
  constructor(tagName = null, ownerDocument = null) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.dataset = {};
    this.className = '';
    this.title = '';
    this._textContent = '';
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get textContent() {
    return this._textContent || this.children.map((child) => child.textContent).join('');
  }
}

class FakeDocument {
  createElement(tagName) {
    return new FakeNode(tagName.toUpperCase(), this);
  }

  createTextNode(value) {
    const node = new FakeNode(null, this);
    node.textContent = value;
    return node;
  }
}

function render(text, fontId = 'analyzed') {
  const documentRef = new FakeDocument();
  const container = new FakeNode('DIV', documentRef);
  const unsupportedCount = appendCoverageText(container, text, fontId, coverageData);
  return { container, unsupportedCount };
}

test('収録済み・未収録・未解析を3状態で返す', () => {
  assert.equal(codepointStatus('analyzed', 0x41, coverageData), STATUS.SUPPORTED);
  assert.equal(codepointStatus('analyzed', 0x42, coverageData), STATUS.UNSUPPORTED);
  assert.equal(codepointStatus('missing', 0x41, coverageData), STATUS.UNKNOWN);
  assert.equal(codepointStatus('absent', 0x41, coverageData), STATUS.UNKNOWN);
});

test('二分探索で範囲端を含めて判定する', () => {
  assert.equal(characterStatus('analyzed', 'A', coverageData), STATUS.SUPPORTED);
  assert.equal(characterStatus('analyzed', '😀', coverageData), STATUS.SUPPORTED);
  assert.equal(formatCodepoint('😀'), 'U+1F600');
});

test('サロゲートペアを途中で分割せず未収録文字だけにクラスを付ける', () => {
  const { container, unsupportedCount } = render('A🙂B');
  const unsupported = container.children.filter((node) => node.className === 'unsupported-glyph');
  assert.equal(unsupportedCount, 2);
  assert.equal(unsupported[0].textContent, '🙂');
  assert.equal(unsupported[0].dataset.codepoint, 'U+1F642');
  assert.equal(unsupported[0].title, '未収録（U+1F642）');
  assert.equal(container.textContent, 'A🙂B');
});

test('空白・改行・タブなどの制御用文字は薄くしない', () => {
  assert.equal(shouldKeepNormalOpacity(' '), true);
  assert.equal(shouldKeepNormalOpacity('\n'), true);
  assert.equal(shouldKeepNormalOpacity('\t'), true);
  const { container, unsupportedCount } = render('B \n\tB');
  assert.equal(unsupportedCount, 2);
  assert.equal(container.textContent, 'B \n\tB');
});

test('未解析フォントは文字を薄くせず文章をそのまま保つ', () => {
  const { container, unsupportedCount } = render('A日本語😀', 'missing');
  assert.equal(unsupportedCount, 0);
  assert.equal(container.children.some((node) => node.className === 'unsupported-glyph'), false);
  assert.equal(container.textContent, 'A日本語😀');
});

test('script風文字列を要素として解釈せず文字順を維持する', () => {
  const value = '<script>alert(1)</script>\n次';
  const { container } = render(value);
  assert.equal(container.textContent, value);
  assert.equal(container.children.some((node) => node.tagName === 'SCRIPT'), false);
});
