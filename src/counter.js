export const STORAGE_KEY = 'tap-counter:value';
export const MAX = 999999;
export const MIN = -999999;

export function clamp(n) {
  return Math.min(MAX, Math.max(MIN, n));
}

export function load(storage) {
  try {
    const n = Number.parseInt(storage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(n) ? clamp(n) : 0;
  } catch {
    return 0;
  }
}

export function save(storage, value) {
  try {
    storage.setItem(STORAGE_KEY, String(value));
  } catch {
    /* プライベートモード等では保存を諦める */
  }
}

export const increment = (n) => clamp(n + 1);
export const decrement = (n) => clamp(n - 1);
