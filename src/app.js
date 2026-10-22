import { load, save, increment, decrement } from './counter.js';

const countEl = document.getElementById('count');
const tapEl = document.getElementById('tap');
let value = load(localStorage);

function render() {
  countEl.textContent = String(value);
}

function update(next) {
  if (next === value) return;
  value = next;
  save(localStorage, value);
  render();
  if (navigator.vibrate) navigator.vibrate(10);
}

tapEl.addEventListener('click', () => update(increment(value)));
document.getElementById('minus').addEventListener('click', () => update(decrement(value)));
document.getElementById('reset').addEventListener('click', () => {
  if (value !== 0 && window.confirm('カウントを 0 にリセットしますか？')) update(0);
});

render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
