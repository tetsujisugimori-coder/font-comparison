'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { createController } = require('./opentype-dialog');

class FakeClassList {
  constructor() { this.values = new Set(); }
  toggle(name, enabled) { enabled ? this.values.add(name) : this.values.delete(name); }
  contains(name) { return this.values.has(name); }
}

class FakeElement {
  constructor(tag = '') {
    this.tag = tag;
    this.attributes = {};
    this.dataset = {};
    this.listeners = {};
    this.classList = new FakeClassList();
    this.focused = false;
    this.open = false;
    this.chips = [];
  }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.listeners[type] || []) listener(event); }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  querySelectorAll() { return this.chips; }
  closest(selector) { return selector === '.open-type-feature-chip' && this.tag === 'chip' ? this : null; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.dispatch('close'); }
}

function setup() {
  const dialog = new FakeElement('dialog');
  const closeButton = new FakeElement('close');
  const featureList = new FakeElement('list');
  const first = new FakeElement('chip');
  const second = new FakeElement('chip');
  first.dataset.featureTag = 'ccmp';
  second.dataset.featureTag = 'kern';
  featureList.chips = [first, second];
  const selected = [];
  const controller = createController({
    dialog,
    closeButton,
    featureList,
    onSelect: (tag) => selected.push(tag)
  });
  return { dialog, closeButton, featureList, first, second, selected, controller };
}

test('カードの詳細ボタンでダイアログを開き、閉じるボタンへフォーカスする', () => {
  const state = setup();
  const trigger = new FakeElement('trigger');
  state.controller.open(trigger, state.first);
  assert.equal(state.dialog.open, true);
  assert.equal(state.closeButton.focused, true);
  assert.deepEqual(state.selected, ['ccmp']);
});

test('チップ選択で説明コールバックとaria-pressedを切り替える', () => {
  const state = setup();
  state.controller.open(new FakeElement('trigger'), state.first);
  state.featureList.dispatch('click', { target: state.second });
  assert.equal(state.first.getAttribute('aria-pressed'), 'false');
  assert.equal(state.second.getAttribute('aria-pressed'), 'true');
  assert.equal(state.second.classList.contains('is-selected'), true);
  assert.deepEqual(state.selected, ['ccmp', 'kern']);
});

test('閉じるボタンとEscapeで閉じ、元のボタンへフォーカスを戻す', () => {
  for (const closeWith of ['button', 'escape']) {
    const state = setup();
    const trigger = new FakeElement('trigger');
    state.controller.open(trigger, state.first);
    if (closeWith === 'button') {
      state.closeButton.dispatch('click');
    } else {
      let prevented = false;
      state.dialog.dispatch('cancel', { preventDefault: () => { prevented = true; } });
      assert.equal(prevented, true);
    }
    assert.equal(state.dialog.open, false);
    assert.equal(trigger.focused, true);
  }
});
