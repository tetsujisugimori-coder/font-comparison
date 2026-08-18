import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

function git(args, options = {}) {
  return spawnSync('git', args, { encoding: 'utf8', ...options });
}

function revisionExists(revision) {
  return Boolean(revision) && git(['cat-file', '-e', `${revision}^{commit}`]).status === 0;
}

export function selectWhitespaceCheck({ eventName, baseSha, beforeSha, currentSha }, exists) {
  const current = exists(currentSha) ? currentSha : 'HEAD';
  if (eventName === 'pull_request' && exists(baseSha) && exists(currentSha)) {
    return { description: 'pull request base...head', args: ['diff', '--check', `${baseSha}...${currentSha}`] };
  }
  if (eventName === 'push' && beforeSha && !/^0+$/.test(beforeSha) && exists(beforeSha) && exists(currentSha)) {
    return { description: 'push before..current', args: ['diff', '--check', `${beforeSha}..${currentSha}`] };
  }
  return { description: 'current HEAD commit fallback', args: ['show', '--check', '--format=', current] };
}

export function runWhitespaceCheck(environment = process.env) {
  const exists = revisionExists;
  const selected = selectWhitespaceCheck(
    {
      eventName: environment.CI_EVENT_NAME || '',
      baseSha: environment.CI_BASE_SHA || '',
      beforeSha: environment.CI_BEFORE_SHA || '',
      currentSha: environment.CI_CURRENT_SHA || 'HEAD'
    },
    exists
  );
  process.stdout.write(`Checking whitespace for ${selected.description}: git ${selected.args.join(' ')}\n`);
  const result = git(selected.args);
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runWhitespaceCheck();
}
