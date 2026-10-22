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
  const ok = /^html\.mp(-suspended)?[ .:]/.test(sel) || sel === '.mp-tab' || sel.startsWith('.mp-rotate');
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
  }
  assert.ok(/html\.mp \.hud|html\.mp \.brief/.test(html), `${lesson}: 沒有手機版的標題樣式`);
}
console.log(`PASS: mobile-panels.css only applies at phone sizes; ${Object.keys(LESSONS).length} lessons wired (dock, labels, run opens the chart, tour suspends, rotate hint).`);
