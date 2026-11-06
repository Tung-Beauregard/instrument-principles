// 畫面大小的檢查(2026-11-06):大螢幕的介面放大(assets/ui-scale.css)與桌機小螢幕的取景(assets/free-view.js)
// node scripts/check-ui-scale.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { largestFreeRect, SMALL_DESKTOP } from '../assets/free-view.js';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// 1. 放大的級距:基準 1920×950,每級 1/6 倍,寬高門檻都等於基準乘上倍數,倍數一級比一級大
const css = read('assets/ui-scale.css');
assert.match(css, /:root\{--ui:1\}/, 'ui-scale.css: 預設是 1 倍');
const steps = [...css.matchAll(/@media \(min-width:(\d+)px\) and \(min-height:(\d+)px\)\{:root\{--ui:([\d.]+)\}\}/g)].map((m) => m.slice(1).map(Number));
assert.ok(steps.length >= 6, 'ui-scale.css: 至少六級');
let prev = 1;
for (const [w, h, k] of steps) {
  assert.ok(k > prev, `ui-scale.css: ${k} 要比前一級大`); prev = k;
  assert.ok(Math.abs(w - 1920 * k) <= 1 && Math.abs(h - 950 * k) <= 1, `ui-scale.css: ${k} 倍的門檻要是 ${Math.round(1920 * k)}×${Math.round(950 * k)}`);
}
const at = (W, H) => steps.reduce((v, [w, h, k]) => (W >= w && H >= h ? k : v), 1);
assert.equal(at(1920, 1080), 1, '1080P 是 1 倍');
assert.equal(at(2560, 1440), 1.3333, '2K 是 1.33 倍');
assert.equal(at(3840, 2160), 2, '4K 是 2 倍');
assert.equal(at(3440, 1310), 1.3333, '超寬螢幕(3440×1440 放到最大的瀏覽器視窗)看比較矮的那一邊');
assert.equal(at(1920, 950), 1, '1080P 螢幕上放到最大的瀏覽器視窗是基準');

// 2. 每一頁都接上:3D 教材只放大面板與標籤;2D 教材、入口與數據畫圖整頁放大
const LESSONS3D = ['lcq', 'lcq-3d', 'gc-ms', 'uv-vis', 'nmr', 'mass-analyzers', 'spectroscopy', 'chromatography'];
const mainStyle = (html) => html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
for (const l of LESSONS3D) {
  const html = read(`${l}/index.html`), st = mainStyle(html);
  assert.ok(html.includes('<link rel="stylesheet" href="../assets/ui-scale.css">'), `${l}: 要載入 ../assets/ui-scale.css`);
  assert.match(st, /\{zoom:var\(--ui,1\)\}/, `${l}: 面板要套 zoom: var(--ui,1)`);
  // 放大的元素裡 vw、vh 會跟著放大:除了只在手機作用的規則,每一個 vw、vh 都要除以 var(--ui,1)
  for (const line of st.split('\n')) {
    const t = line.trim();
    if (t.startsWith('html.mp') || t.startsWith('@media (max-width:760px)') || t.startsWith('@media(max-width:760px)') || t.startsWith('/*')) continue;
    for (const m of t.matchAll(/(?<![\w.-])\d+(?:\.\d+)?(?:dv|sv|lv|v)[wh]\b(?! \/ var\(--ui,1\))/g)) {
      assert.fail(`${l}: 「${t.slice(0, 80)}」的 ${m[0]} 沒有除以 var(--ui,1)`);
    }
  }
  // 面板裡的畫布、提示框或標籤要用 currentCSSZoom 換算(畫布多畫幾倍像素、滑鼠座標除回來)
  assert.ok(/currentCSSZoom|uiScale\(\)/.test(html), `${l}: 要依放大倍數換算畫布或座標`);
  // 頁面自己另設的每格像素上限(動畫講解的 resize())也要乘上 --ui 的平方,寫死的話 4K 只畫一部分解析度
  for (const m of html.matchAll(/pr \* pr > ([^)]+)\)/g)) {
    assert.ok(!/^[\d.e]+$/.test(m[1].trim()), `${l}: 每格的像素上限 ${m[1].trim()} 是寫死的,要乘上 uiScale() 的平方`);
  }
}
assert.match(read('assets/bio-lesson.css'), /@import url\("ui-scale\.css"\);[\s\S]*body\{[^}]*zoom:var\(--ui,1\)/, '2D 教材的 bio-lesson.css 要匯入 ui-scale.css 並放大整頁');
assert.match(read('assets/styles.css'), /@import url\("ui-scale\.css"\);[\s\S]*body \{[^}]*zoom: var\(--ui, 1\)/, '入口的 styles.css 要匯入 ui-scale.css 並放大整頁');
const plot = read('plot/index.html');
assert.ok(plot.includes('<link rel="stylesheet" href="../assets/ui-scale.css">') && /body\{[^}]*zoom:var\(--ui,1\)/.test(plot), '數據畫圖要放大整頁');
assert.match(read('assets/render-quality.js'), /budget\.pixelRatio\(w, h, devicePixelRatio, cap, uiScale\(\)\)/, '畫質的像素預算要跟著 --ui 放大');

// 3. 桌機小螢幕的取景:空地不碰到任何面板,且是最大的那一塊
assert.equal(SMALL_DESKTOP, '(max-width: 1279px), (max-height: 899px)');
const R = (left, top, right, bottom) => ({ left, top, right, bottom, width: right - left, height: bottom - top });
const W = 1024, H = 768, panels = [R(24, 20, 404, 400), R(490, 18, 1004, 170), R(112, 520, 912, 752)];
const F = largestFreeRect(panels, W, H);
for (const p of panels) assert.ok(F.x >= p.right + 10 - 1e-9 || F.x + F.w <= p.left - 10 + 1e-9 || F.y >= p.bottom + 10 - 1e-9 || F.y + F.h <= p.top - 10 + 1e-9, '空地不能碰到面板(含 10 px 邊距)');
assert.ok(F.w * F.h >= 600 * 330, `空地要是右邊那一大塊(得到 ${Math.round(F.w)}×${Math.round(F.h)})`);
assert.deepEqual(largestFreeRect([], W, H), { x: 0, y: 0, w: W, h: H, cx: W / 2, cy: H / 2 }, '沒有面板時是整個畫面');
const FV = ['uv-vis', 'nmr', 'mass-analyzers', 'spectroscopy', 'chromatography', 'lcq-3d'];
for (const l of FV) {
  const html = read(`${l}/index.html`);
  assert.ok(html.includes("import { createFreeView } from '../assets/free-view.js';"), `${l}: 要載入 free-view.js`);
  assert.match(html, /const fv = createFreeView\(\{ panels: \[[^\]]+\], active: \(\) => [^}]+\}\);/, `${l}: 要建立 createFreeView(導覽與影片時不作用)`);
  // 手機版(mp)接手時 fv 不作用:要嘛 mp.applyView 傳回 false 才呼叫 fv.apply,要嘛 fv 的 active() 裡有 !mp.active()
  const gated = /if \(!mp\.applyView\(camera\)(?: && !fv\.apply\(camera\)\) applyShift\(\);|\) fv\.apply\(camera\);)/.test(html)
    || (/fv\.apply\(camera\);[^\n]*\n  mp\.applyView\(camera\);/.test(html) && /active: \(\) => [^}]*!mp\.active\(\)/.test(html));
  assert.ok(gated, `${l}: 手機版接手時不能再由 fv.apply 取景`);
}
console.log(`PASS: ui-scale steps (${steps.length}, 1080P 1×, 2K 1.33×, 4K 2×); ${LESSONS3D.length} 3D lessons, the 2D player, the portal and plot scale up; largest free rect; ${FV.length} lessons wired to free-view.`);
