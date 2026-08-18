'use strict';

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const scriptPath = path.resolve('scripts/check-diff-whitespace.mjs');

async function select(input, revisions) {
  const module = await import(`${pathToFileURL(scriptPath).href}?${Math.random()}`);
  return module.selectWhitespaceCheck(input, (revision) => revisions.has(revision));
}

test('pull_requestはbaseからhead、pushはbeforeからcurrentを検査する', async () => {
  const revisions = new Set(['base', 'head', 'before', 'current']);
  assert.deepEqual(await select({ eventName: 'pull_request', baseSha: 'base', currentSha: 'head' }, revisions), {
    description: 'pull request base...head', args: ['diff', '--check', 'base...head']
  });
  assert.deepEqual(await select({ eventName: 'push', beforeSha: 'before', currentSha: 'current' }, revisions), {
    description: 'push before..current', args: ['diff', '--check', 'before..current']
  });
});

test('workflow_dispatch、空SHA、存在しない比較元は現在HEADを検査する', async () => {
  const revisions = new Set(['current']);
  for (const input of [
    { eventName: 'workflow_dispatch', currentSha: 'current' },
    { eventName: 'push', beforeSha: '0000000000000000000000000000000000000000', currentSha: 'current' },
    { eventName: 'pull_request', baseSha: 'missing', currentSha: 'current' }
  ]) {
    assert.deepEqual(await select(input, revisions), {
      description: 'current HEAD commit fallback', args: ['show', '--check', '--format=', 'current']
    });
  }
});

test('正常な差分は成功し、空白エラーを含む差分は失敗する', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'font-diff-check-'));
  try {
    const git = (...args) => execFileSync('git', args, { cwd: directory, stdio: 'pipe' });
    git('init');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'user.name', 'Test');
    fs.writeFileSync(path.join(directory, 'sample.txt'), 'valid\n');
    git('add', '.');
    git('commit', '-m', 'base');
    const before = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
    fs.writeFileSync(path.join(directory, 'sample.txt'), 'still valid\n');
    git('commit', '-am', 'good');
    const good = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
    const pass = spawnSync(process.execPath, [scriptPath], { cwd: directory, env: { ...process.env, CI_EVENT_NAME: 'push', CI_BEFORE_SHA: before, CI_CURRENT_SHA: good }, encoding: 'utf8' });
    assert.equal(pass.status, 0, pass.stderr);
    fs.writeFileSync(path.join(directory, 'sample.txt'), 'trailing space \n');
    git('commit', '-am', 'bad whitespace');
    const bad = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
    const fail = spawnSync(process.execPath, [scriptPath], { cwd: directory, env: { ...process.env, CI_EVENT_NAME: 'push', CI_BEFORE_SHA: good, CI_CURRENT_SHA: bad }, encoding: 'utf8' });
    assert.notEqual(fail.status, 0);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
