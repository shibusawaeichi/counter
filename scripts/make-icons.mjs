// 依存なしでアイコンPNGを生成する（青背景＋白い「+」）
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const sum = Buffer.alloc(4); sum.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, sum]);
};

function png(size) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  const c = size / 2, half = size * 0.28, thick = size * 0.07;
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const dx = Math.abs(x - c), dy = Math.abs(y - c);
      const plus = (dx < thick && dy < half) || (dy < thick && dx < half);
      const o = y * (size * 3 + 1) + 1 + x * 3;
      const [r, g, b] = plus ? [255, 255, 255] : [10, 132, 255];
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync('src/icons', { recursive: true });
writeFileSync('src/icons/icon-192.png', png(192));
writeFileSync('src/icons/icon-512.png', png(512));
writeFileSync('src/icons/apple-touch-icon.png', png(180));
