// src/ を dist/ にコピーし、Service Worker のキャッシュ版を更新する
import { cpSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

rmSync('dist', { recursive: true, force: true });
cpSync('src', 'dist', { recursive: true });
const hash = createHash('sha1');
for (const f of ['index.html', 'style.css', 'app.js', 'counter.js', 'manifest.webmanifest']) {
  hash.update(readFileSync(`dist/${f}`));
}
const sw = readFileSync('dist/sw.js', 'utf8').replace('__CACHE_VERSION__', hash.digest('hex').slice(0, 8));
writeFileSync('dist/sw.js', sw);
writeFileSync('dist/.nojekyll', '');
console.log('built → dist/');
