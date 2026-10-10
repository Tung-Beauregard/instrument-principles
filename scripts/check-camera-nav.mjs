// 共用視角操作 assets/camera-nav.js 的檢查:滾輪事件怎麼判斷,以及每份 3D 教材都有接上
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wheelKind } from '../assets/camera-nav.js';

const ev = (o) => ({ deltaX: 0, deltaY: 0, deltaMode: 0, ctrlKey: false, ...o });
assert.equal(wheelKind(ev({ deltaY: 100 })), 'zoom', 'Chrome/Edge 的滑鼠滾輪一格');
assert.equal(wheelKind(ev({ deltaY: -300 })), 'zoom', '滑鼠滾輪一次轉好幾格');
assert.equal(wheelKind(ev({ deltaY: 3, deltaMode: 1 })), 'zoom', 'Firefox 以行為單位的滑鼠滾輪');
assert.equal(wheelKind(ev({ deltaY: 12 })), 'pan', '觸控板小幅滑動');
assert.equal(wheelKind(ev({ deltaY: 52.5 })), 'pan', '觸控板的非整數位移');
assert.equal(wheelKind(ev({ deltaX: 8, deltaY: 100 })), 'pan', '帶水平分量');
assert.equal(wheelKind(ev({ deltaY: -6, ctrlKey: true })), 'pinch', '觸控板捏合');
assert.equal(wheelKind(ev({ deltaY: 120 }), { kind: 'pan', at: 1000 }, 1100), 'pan', '同一串事件沿用第一下的判斷');
assert.equal(wheelKind(ev({ deltaY: 120 }), { kind: 'pan', at: 1000 }, 1300), 'zoom', '停頓超過 220 ms 後重新判斷');

const LESSONS = ['lcq', 'gc-ms', 'uv-vis', 'lcq-3d', 'nmr', 'mass-analyzers', 'spectroscopy', 'chromatography'];
for (const lesson of LESSONS) {
  const html = readFileSync(new URL(`../${lesson}/index.html`, import.meta.url), 'utf8');
  assert.ok(html.includes("from '../assets/camera-nav.js'"), `${lesson}: 沒有載入 assets/camera-nav.js`);
  assert.ok(/createCameraNav\(\{/.test(html), `${lesson}: 沒有建立視角操作`);
  assert.ok(/nav\??\.step\(dt\)/.test(html), `${lesson}: 每一格沒有呼叫 nav.step(dt)`);
}
console.log(`PASS: wheel classification (mouse wheel, trackpad, pinch, gesture latch) and ${LESSONS.length} lessons wired to camera-nav.`);
