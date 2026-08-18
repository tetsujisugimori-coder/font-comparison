import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function size(path) {
  const content = readFileSync(path);
  return { raw: content.length, gzip: gzipSync(content).length };
}

function add(left, right) {
  return { raw: left.raw + right.raw, gzip: left.gzip + right.gzip };
}

const startupFiles = ['font-coverage-data.js', 'font-opentype-data.js', 'analysis-details-loader.js'];
const startup = Object.fromEntries(startupFiles.map((file) => [file, size(file)]));
const detailDirectory = 'analysis-details';
const detailFiles = readdirSync(detailDirectory)
  .filter((file) => file.endsWith('.js') && statSync(join(detailDirectory, file)).isFile())
  .sort();
const details = Object.fromEntries(detailFiles.map((file) => [file, size(join(detailDirectory, file))]));
const startupAnalysis = add(startup['font-coverage-data.js'], startup['font-opentype-data.js']);
const startupWithLoader = add(startupAnalysis, startup['analysis-details-loader.js']);
const detailTotal = Object.values(details).reduce(add, { raw: 0, gzip: 0 });

console.log(JSON.stringify({ startup, startupAnalysis, startupWithLoader, detailTotal, notoSansJp: details['noto-sans-jp-web.js'] }, null, 2));
