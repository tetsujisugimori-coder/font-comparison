'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

function createLoaderContext() {
  const scripts = [];
  const window = {
    document: {
      createElement() {
        return { dataset: {}, remove() { this.removed = true; } };
      },
      head: { append(script) { scripts.push(script); } }
    }
  };
  vm.runInNewContext(fs.readFileSync('analysis-details-loader.js', 'utf8'), { window });
  return { window, scripts };
}

test('詳細ローダーは同じフォントの読込中Promiseを共有し、成功後はメモリを再利用する', async () => {
  const { window, scripts } = createLoaderContext();
  const first = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 1);
  const second = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 1);
  assert.strictEqual(first, second);
  assert.equal(scripts.length, 1);
  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'noto-sans-jp-web', schemaVersion: 1 };
  scripts[0].onload();
  assert.equal((await first).fontId, 'noto-sans-jp-web');
  await window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 1);
  assert.equal(scripts.length, 1);
});

test('詳細ローダーは失敗時にキャッシュを外し、再試行できる', async () => {
  const { window, scripts } = createLoaderContext();
  const failed = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web');
  scripts[0].onerror();
  await assert.rejects(failed, /読み込めません/);
  const retried = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web');
  assert.equal(scripts.length, 2);
  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'noto-sans-jp-web', schemaVersion: 1 };
  scripts[1].onload();
  await retried;
});

test('fontIdが一致しない登録は削除して失敗し、再試行で新しいscriptを使う', async () => {
  const { window, scripts } = createLoaderContext();
  const invalid = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 1);
  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'other-font', schemaVersion: 1 };
  scripts[0].onload();
  await assert.rejects(invalid, /fontIdが一致/);
  assert.equal(window.FontAnalysisDetails['noto-sans-jp-web'], undefined);
  assert.equal(scripts[0].removed, true);
  const retry = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 1);
  assert.equal(scripts.length, 2);
  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'noto-sans-jp-web', schemaVersion: 1 };
  scripts[1].onload();
  await retry;
});

test('schemaVersionが一致しない値はキャッシュとして再利用しない', async () => {
  const { window, scripts } = createLoaderContext();
  const mismatch = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 2);
  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'noto-sans-jp-web', schemaVersion: 1 };
  scripts[0].onload();
  await assert.rejects(mismatch, /schemaVersionが一致/);
  assert.equal(window.FontAnalysisDetails['noto-sans-jp-web'], undefined);
  const retry = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 2);
  assert.equal(scripts.length, 2);
  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'noto-sans-jp-web', schemaVersion: 2 };
  scripts[1].onload();
  await retry;

  window.FontAnalysisDetails['noto-sans-jp-web'] = { fontId: 'wrong-after-load', schemaVersion: 2 };
  await assert.rejects(window.FontAnalysisDetailsLoader.load('noto-sans-jp-web', 2), /fontIdが一致/);
  assert.equal(window.FontAnalysisDetails['noto-sans-jp-web'], undefined);
  assert.equal(scripts[1].removed, true);
  assert.equal(scripts.length, 2);
});

test('詳細JSが対象データを登録しない場合と、詳細なしフォントを検出する', async () => {
  const { window, scripts } = createLoaderContext();
  const missingRegistration = window.FontAnalysisDetailsLoader.load('noto-sans-jp-web');
  scripts[0].onload();
  await assert.rejects(missingRegistration, /オブジェクトではありません/);
  await assert.rejects(window.FontAnalysisDetailsLoader.load('cascadia-code'), /詳細データはありません/);
  assert.equal(scripts.length, 1);
});
