import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load, save, increment, decrement, clamp, STORAGE_KEY, MAX, MIN } from '../src/counter.js';

const mem = (init = {}) => {
  const d = { ...init };
  return { getItem: (k) => d[k] ?? null, setItem: (k, v) => { d[k] = v; }, d };
};

test('増減', () => {
  assert.equal(increment(0), 1);
  assert.equal(decrement(0), -1);
});
test('上限・下限', () => {
  assert.equal(increment(MAX), MAX);
  assert.equal(decrement(MIN), MIN);
  assert.equal(clamp(MAX + 5), MAX);
});
test('保存と復元', () => {
  const s = mem();
  save(s, 42);
  assert.equal(s.d[STORAGE_KEY], '42');
  assert.equal(load(s), 42);
});
test('未保存・不正値は0', () => {
  assert.equal(load(mem()), 0);
  assert.equal(load(mem({ [STORAGE_KEY]: 'abc' })), 0);
});
test('storage が例外を投げても落ちない', () => {
  const bad = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } };
  assert.equal(load(bad), 0);
  assert.doesNotThrow(() => save(bad, 1));
});
test('マニフェストとアイコンが相対パスで揃っている', () => {
  const m = JSON.parse(readFileSync('src/manifest.webmanifest', 'utf8'));
  assert.equal(m.start_url, './');
  assert.equal(m.display, 'standalone');
  for (const i of m.icons) {
    assert.ok(!i.src.startsWith('/'), '絶対パス禁止');
    assert.ok(existsSync(`src/${i.src}`), i.src);
  }
  const html = readFileSync('src/index.html', 'utf8');
  assert.ok(!/(?:href|src)="\//.test(html), 'HTMLに絶対パスがある');
});
