// 手機版面板收合 assets/mobile-panels.js 的檢查:樣式只在手機尺寸作用,六份教材都有接上
// (離子阱的兩頁本來就適合手機,沒有用這個模組)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MOBILE_QUERY } from '../assets/mobile-panels.js';

assert.equal(MOBILE_QUERY, '(max-width: 760px), (max-height: 500px)', '手機尺寸的判斷改了,教材裡的 html.mp 樣式也要一起檢查');

// 樣式表:除了「平常藏起細條」與只在手機上才會建立的轉向提示,每一條規則都要限定在 html.mp / html.mp-suspended 底下
const css = readFileSync(new URL('../assets/mobile-panels.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'mobile-panels.css 的大括號不成對');
const selectors = [];
css.replace(/([^{}]+)\{[^{}]*\}/g, (m, sel) => { if (!sel.trim().startsWith('@')) selectors.push(...sel.split(',').map((x) => x.trim())); return m; });
assert.ok(selectors.length > 20, 'mobile-panels.css 讀不到規則');
for (const sel of selectors) {
  // @keyframes 裡的 from、to、百分比不是選擇器
  const ok = /^html\.mp(-suspended)?[ .:]/.test(sel) || sel === '.mp-tab' || sel.startsWith('.mp-rotate') || /^(from|to|\d+(\.\d+)?%)$/.test(sel);
  assert.ok(ok, `mobile-panels.css 的「${sel}」沒有限定在手機尺寸,桌機版面會被改到`);
}
assert.ok(/(^|\})\s*\.mp-tab\{display:none\}/.test(css), '桌機要藏起細條(.mp-tab{display:none})');

const LESSONS = {
  'uv-vis': { run: '#btnScan' },
  nmr: { run: 'btnRun' },
  'mass-analyzers': { run: 'btnRun' },
  spectroscopy: { run: 'btnScan' },
  chromatography: { run: 'btnRun' },
  'gc-ms': { dock: false },
};
for (const [lesson, cfg] of Object.entries(LESSONS)) {
  const html = readFileSync(new URL(`../${lesson}/index.html`, import.meta.url), 'utf8');
  assert.ok(html.includes('<link rel="stylesheet" href="../assets/mobile-panels.css">'), `${lesson}: 沒有載入 mobile-panels.css`);
  assert.ok(html.includes("import { createMobilePanels } from '../assets/mobile-panels.js';"), `${lesson}: 沒有載入 mobile-panels.js`);
  const calls = html.match(/createMobilePanels\(\{/g) || [];
  assert.equal(calls.length, 1, `${lesson}: createMobilePanels 應該剛好呼叫一次`);
  const call = html.slice(html.indexOf('createMobilePanels({'), html.indexOf('\n});', html.indexOf('createMobilePanels({')));
  assert.ok(/rotateHint: true/.test(call), `${lesson}: 沒有打開「建議轉成橫式」提示`);
  assert.ok(/suspended: \(\) =>/.test(call), `${lesson}: 導覽中沒有暫停收合`);
  assert.ok(/label: /.test(call) && /items: /.test(call), `${lesson}: 細條要有名稱與內容說明`);
  if (cfg.dock === false) {
    assert.ok(!/dock: true/.test(call), `${lesson}: 這頁的面板在格線裡,不用停靠區`);
  } else {
    assert.ok(/dock: true/.test(call), `${lesson}: 沒有用底部停靠區`);
    assert.ok(/el: '#ctl'/.test(call) && /el: '#console'/.test(call), `${lesson}: 控制面板與譜都要能收合`);
    assert.ok(new RegExp(`${cfg.run.replace('#', '#?')}'\\)\\)?\\.addEventListener\\('click', \\(\\) => mp\\.open\\('#console'\\)\\)`).test(html), `${lesson}: 按 ${cfg.run} 時沒有打開譜`);
    assert.ok(/onToggle: \(open\) => \{ if \(!open\) .*\('help'\)\.classList\.remove\('show'\); \}/.test(call), `${lesson}: 收起控制面板時沒有一起關掉說明框`);
    // 3D 讓位:render() 每一格呼叫 mp.applyView(camera);有直拿取景的頁面,手機版互動時不再自己往上移
    const r0 = html.indexOf('function render() {');
    assert.ok(r0 > 0 && /mp\.applyView\(camera\)/.test(html.slice(r0, r0 + 400)), `${lesson}: render() 沒有呼叫 mp.applyView(camera)`);
    if (html.includes('function fitPortrait(')) {
      assert.ok(/function portraitLift\(\) \{\n  return mp\.active\(\) && !root\.classList\.contains\('touring'\) \? 0 : 0\.36;/.test(html), `${lesson}: 手機版互動時 portraitLift() 要是 0(由 mp.applyView 取景)`);
    }
  }
  assert.ok(/html\.mp \.hud|html\.mp \.brief/.test(html), `${lesson}: 沒有手機版的標題樣式`);
}
// 離子阱質譜的兩個畫面:直拿只有轉向提示;拆開探索在手機橫拿時把控制面板收成細條,動畫講解在矮的橫向畫面播放時讓出上下兩條
{
  const js = readFileSync(new URL('../assets/mobile-panels.js', import.meta.url), 'utf8');
  assert.ok(/export function createRotateHint\(/.test(js), 'mobile-panels.js 要匯出 createRotateHint');
  assert.ok(/if \(rotateHint\) createRotateHint\(/.test(js), 'createMobilePanels 的 rotateHint 要交給 createRotateHint');
  for (const lesson of ['lcq', 'lcq-3d']) {
    const html = readFileSync(new URL(`../${lesson}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes('<link rel="stylesheet" href="../assets/mobile-panels.css">'), `${lesson}: 沒有載入 mobile-panels.css(轉向提示的樣式)`);
    assert.ok(/import \{ createRotateHint(, createMobilePanels)? \} from '\.\.\/assets\/mobile-panels\.js';/.test(html), `${lesson}: 沒有載入 createRotateHint`);
    assert.equal((html.match(/createRotateHint\(\{/g) || []).length, 1, `${lesson}: createRotateHint 應該剛好呼叫一次`);
    assert.ok(/createRotateHint\(\{ top: '[^']+', suspended: \(\) =>/.test(html), `${lesson}: 轉向提示要有位置與暫停條件`);
  }
  const l3 = readFileSync(new URL('../lcq-3d/index.html', import.meta.url), 'utf8');
  assert.ok(l3.includes("query: '(max-height: 500px) and (orientation: landscape)'"), 'lcq-3d: 控制面板只在手機橫拿時收合(直拿照原本的排法)');
  assert.ok(/mp\.applyView\(camera\);[^\n]*\n  renderScene\(\);/.test(l3), 'lcq-3d: 每一格在 renderScene() 之前呼叫 mp.applyView(camera)');
  assert.ok(l3.indexOf('const mp = createMobilePanels({') < l3.indexOf('\nboot();'), 'lcq-3d: mp 要在 boot() 之前建立(第一格就會用到)');
  assert.ok(/html\.mp:has\(#app\.cine\) \.mp-dock \.ctl \.row:not\(\.tools\)\{display:none\}/.test(l3), 'lcq-3d: 導覽時停靠區裡的控制面板只留工具列');
  const l1 = readFileSync(new URL('../lcq/index.html', import.meta.url), 'utf8');
  assert.ok(l1.includes("matchMedia('(orientation: landscape) and (max-height: 479px)')"), 'lcq: 只在矮的橫向畫面讓出上下兩條');
  assert.ok(/html\.immersive #topnav,html\.immersive #bar/.test(l1), 'lcq: 缺少 html.immersive 的樣式');
  assert.ok(/const imm = !APP\.rec && /.test(l1), 'lcq: 錄影時字幕位置不能跟著淡出改變');
}
// 手機橫拿時寬度可能不到 760 px(2026-10-24 實機:Galaxy S23 Ultra 的 Chrome 橫拿是 742 × 298),橫拿的版面不能只看寬度
{
  const gc = readFileSync(new URL('../gc-ms/index.html', import.meta.url), 'utf8');
  assert.ok(gc.includes('@media (max-width:760px) and (orientation:portrait), (max-width:760px) and (min-height:501px){'), 'gc-ms: 直排的手機版面只給直拿(或高於 500 px 的窄視窗)');
  assert.ok(!/@media \(max-width:760px\)\{/.test(gc), 'gc-ms: 不能有只看寬度的直排手機版面,橫拿的手機也會套到');
  assert.ok(gc.includes('@media (orientation:landscape) and (max-height:500px){') && gc.includes('@media (orientation:landscape) and (max-height:420px){'), 'gc-ms: 橫拿版面要用方向與高度判斷');
  assert.ok(!/@media \(min-width:761px\)( and \(max-height:420px\))?\{/.test(gc), 'gc-ms: 橫拿版面不能要求寬度 761 px 以上');
  assert.ok(/html\.mp \.ctl\{top:calc\(8px[^}]*max-height:calc\(100dvh - 16px\);overflow-y:auto/.test(gc), 'gc-ms: 橫拿時「調整」的設定面板要放得進矮畫面(放不下就在面板裡捲動)');
  const l3 = readFileSync(new URL('../lcq-3d/index.html', import.meta.url), 'utf8');
  assert.ok(/html\.mp #app\.cine #pStab\{[^}]*var\(--mp-dock-h/.test(l3) && /html\.mp #app\.cine #pSpec\{[^}]*var\(--mp-dock-h/.test(l3), 'lcq-3d: 手機橫拿導覽時兩個示波窗要排在停靠區下面');
  assert.ok(/html\.mp #app\.cine \.cap\{left:calc\(\(100% - var\(--scol\)\) \/ 2\)[^}]*bottom:calc\(8px/.test(l3), 'lcq-3d: 手機橫拿導覽時字幕貼底、避開示波窗');
  const js = readFileSync(new URL('../assets/mobile-panels.js', import.meta.url), 'utf8');
  assert.ok(/export function revealCurrentNav\(/.test(js) && /if \(typeof document !== 'undefined'\) \{/.test(js), 'mobile-panels.js: 分頁列要自動捲到目前這一頁(只在瀏覽器裡執行)');
  const plot = readFileSync(new URL('../plot/index.html', import.meta.url), 'utf8');
  assert.ok(plot.includes('<script type="module" src="../assets/mobile-panels.js"></script>'), 'plot: 分頁列也要捲到目前這一頁');
}
// 收在右緣的把手與全螢幕(2026-10-24):預設開啟,收起的面板整個藏起來,停靠區排在把手左邊,導覽中把手藏起來
{
  const js = readFileSync(new URL('../assets/mobile-panels.js', import.meta.url), 'utf8');
  assert.ok(/rotateHint = false, rail = true,/.test(js), 'mobile-panels.js: 把手(rail)要預設開啟');
  assert.ok(/root\.classList\.add\('mp-railed'\)/.test(js) && /p\.ph\.replaceWith\(p\.tab\)/.test(js), 'mobile-panels.js: 離開手機尺寸時細條要放回原處');
  assert.ok(/const fsBtn = railEl && fsSupported\(\) \? makeFullscreenButton\(\) : null;/.test(js), 'mobile-panels.js: 全螢幕鈕只在瀏覽器支援時出現');
  assert.ok(/requestFullscreen \|\| el\.webkitRequestFullscreen/.test(js), 'mobile-panels.js: 全螢幕要照顧舊版 Safari 的前綴');
  assert.ok(/obs\.some\(\(o\) => hit\(r, o\)\)/.test(js) && /measureFree\(\[tr, dockEl\.getBoundingClientRect\(\), R\]\)/.test(js), 'mobile-panels.js: 3D 讓位時要避開把手');
  assert.ok(/html\.mp\.mp-railed \.mp-closed\{display:none!important\}/.test(css), 'mobile-panels.css: 有把手時收起的面板要整個藏起來');
  assert.ok(/html\.mp-suspended \.mp-rail\{display:none!important\}/.test(css), 'mobile-panels.css: 導覽中把手要藏起來');
  assert.ok(/html\.mp\.mp-railed:not\(\.mp-suspended\) \.mp-dock\{right:calc\(var\(--mp-rail-w\) \+ 6px\)\}/.test(css), 'mobile-panels.css: 停靠區要排在把手左邊');
  const gc = readFileSync(new URL('../gc-ms/index.html', import.meta.url), 'utf8');
  assert.ok(gc.includes('html.mp.mp-railed:not(.mp-suspended) .hud{padding-right:calc(var(--gut) + var(--mp-rail-w))}'), 'gc-ms: 格線右邊要留出把手的寬度');
  assert.ok(gc.includes('html.mp:has(#app.sheet) .mp-rail{display:none}'), 'gc-ms: 設定面板打開時把手要藏起來(兩者不在同一個圖層)');
}
console.log(`PASS: mobile-panels.css only applies at phone sizes; ${Object.keys(LESSONS).length} lessons wired (dock, labels, run opens the chart, tour suspends, rotate hint, 3D kept in the free area); ion trap pages: rotate hint, landscape panel, immersive playback; landscape layouts do not depend on width; the site nav shows the current page.`);
