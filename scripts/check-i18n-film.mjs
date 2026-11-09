// 英文版的 3D 教材檢查(2026-11-06):有影片模式(?film&rec,頁面提供 window.__seek)的五頁
// (uv-vis、nmr、mass-analyzers、spectroscopy、chromatography),用本機的 Chrome 開中文版與英文版:
//   1. 影片從頭到尾每 STEP 秒跳一格,記下畫面上每一段看得到的字(DOM 元素,含 3D 的元件標籤、字幕、片頭字卡):
//      英文版還有中文、英文的字超出視窗(中文同一段沒有)、英文的字和別段疊在一起(中文同一對沒有)。
//   2. 一般模式(不是影片)在 1920×1080、1366×768、1024×768 與手機橫拿(844×390)各開一次:頁面還有中文、
//      按鈕或標題的字擠出框(scrollWidth 大於 clientWidth)而中文沒有、console 錯誤。
//   3. 影片字幕的速度:每一句英文字幕在畫面上停幾秒、每秒幾個字母(超過 READ_CPS 的列出來;3D 的導覽不放慢)。
// 自己會開一個靜態伺服器(這個資料夾)。
// usage: node scripts/check-i18n-film.mjs [資料夾名稱 ...]   省略時五頁都檢查
//   CHECK_BROWSER=<chrome.exe 或 msedge.exe 的路徑>;--shots <資料夾> 另外存英文影片每 4 秒一張的截圖;--step <秒> 改取樣間隔(預設 1)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const shotsAt = opt('--shots') ? path.resolve(opt('--shots')) : null;
const STEP = Number(opt('--step') || 1);
const names = argv.filter((a, i) => !a.startsWith('--') && !['--shots', '--step'].includes(argv[i - 1]));
const ALL = ['uv-vis', 'nmr', 'mass-analyzers', 'spectroscopy', 'chromatography'];
const pages = names.length ? names : ALL;
const BROWSER = process.env.CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const CJK = /[\u3400-\u9fff]/, READ_CPS = 17;

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const PORT = 9300 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-film-'));
const browser = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1920,1080', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--disable-features=Translate', '--disable-extensions', '--enable-gpu', '--ignore-gpu-blocklist', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const quit = () => { try { browser.kill(); } catch { /* gone */ } server.close(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* locked */ } };
process.on('exit', quit);
let sock;
for (let i = 0; i < 100 && !sock; i++) {
  try { sock = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl; } catch { /* not yet */ }
  if (!sock) await sleep(200);
}
if (!sock) { console.error(`找不到瀏覽器:${BROWSER}(用 CHECK_BROWSER 指定)`); process.exit(2); }
const ws = new WebSocket(sock);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pending = new Map(); let errors = [];
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0]);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').split('\n')[0]);
});
const send = (method, params = {}) => new Promise((res, rej) => { const n = ++seq; pending.set(n, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result))); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });

async function open(url, w, h, ready, mobile = false) {
  errors = [];
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
  await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
  await send('Page.navigate', { url });
  for (let i = 0; i < 160; i++) { await sleep(250); try { if (await evaluate(ready)) break; } catch { /* navigating */ } }
  await sleep(300);
}

// 畫面上看得到的字:有直接文字的元素,算上祖先的透明度,不看隱藏的與中文那一份
const TEXTS = `(() => {
  const out = [];
  const W = innerWidth, H = innerHeight;
  const opOf = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('script,style,.lang-sw')) continue;
    const nodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.nodeValue.trim());
    const own = nodes.map((n) => n.nodeValue.trim()).join(' ');
    if (!own) continue;
    // 用字本身的範圍(Range),不用元素的框:display:block 的標題框會比字寬很多
    const rg = document.createRange(), rs = nodes.map((n) => { rg.selectNodeContents(n); return rg.getBoundingClientRect(); }).filter((b) => b.width > 0 && b.height > 0);
    if (!rs.length) continue;
    const r = { left: Math.min(...rs.map((b) => b.left)), top: Math.min(...rs.map((b) => b.top)), right: Math.max(...rs.map((b) => b.right)), bottom: Math.max(...rs.map((b) => b.bottom)) };
    if (r.right - r.left < 1 || r.bottom - r.top < 1) continue;
    const op = opOf(el);
    if (op < 0.1) continue;
    out.push({ s: own.slice(0, 80), x0: Math.round(r.left), y0: Math.round(r.top), x1: Math.round(r.right), y1: Math.round(r.bottom), op: +op.toFixed(2), tag: el.tagName.toLowerCase() + (el.id ? '#' + el.id : el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') });
  }
  return { W, H, texts: out };
})()`;
const DOM_CJK = `(() => {
  const cjk = /[\\u3400-\\u9fff]/, out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!cjk.test(n.nodeValue) || !el || el.closest('script,style,[lang|="zh"],.lang-sw')) continue;
    let hidden = false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) if (getComputedStyle(e).display === 'none') { hidden = true; break; }
    if (!hidden) out.push(n.nodeValue.trim().slice(0, 70));
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[alt],[placeholder]')) {
    if (el.closest('.lang-sw')) continue;
    for (const a of ['aria-label', 'title', 'alt', 'placeholder']) { const v = el.getAttribute(a); if (v && cjk.test(v)) out.push(a + '="' + v.slice(0, 60) + '"'); }
  }
  if (cjk.test(document.title)) out.push('<title> ' + document.title);
  return [...new Set(out)];
})()`;
// 字擠出框:有字的按鈕、標題、標籤,內容比框寬
const OVERFLOW = `(() => {
  const out = [];
  for (const el of document.body.querySelectorAll('button,h1,h2,h3,h4,h5,h6,label,small,b,.chip,.lbl,.k,.big,.seg,.t,.legend,.con-head')) {
    if (el.closest('[lang|="zh"]') && document.documentElement.lang === 'en') continue;
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || !el.textContent.trim()) continue;
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) out.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + (el.className || '')).slice(0, 40) + ' 「' + el.textContent.trim().slice(0, 40) + '」');
  }
  return out;
})()`;

const inter = (a, b) => { const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0); return w > 2 && h > 2 ? w * h : 0; };
const area = (b) => (b.x1 - b.x0) * (b.y1 - b.y0);
const contains = (a, b) => a.x0 <= b.x0 + 1 && a.y0 <= b.y0 + 1 && a.x1 >= b.x1 - 1 && a.y1 >= b.y1 - 1;
// 疊在一起的字:用元素的類別與順序配對中英兩邊(文字不同,位置也不同)
const overlapPairs = (texts) => {
  const out = new Map();
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (contains(a, b) || contains(b, a)) continue; // 外框包著裡面的字(例如標籤的標題和小字)不算
    const x = inter(a, b);
    if (x > 0.15 * Math.min(area(a), area(b))) out.set(`${a.tag}#${i}|${b.tag}#${j}`, [a, b]);
  }
  return out;
};
const outside = (b, W, H) => b.x0 < -2 || b.y0 < -2 || b.x1 > W + 2 || b.y1 > H + 2;

let failed = 0;
for (const name of pages) {
  const issues = [];
  // ---- 1. 影片 ----
  const READY = 'window.__ready === true && typeof window.__seek === "function"';
  await open(`${base}${name}/?film&rec&lang=zh`, 1920, 1080, READY);
  const dur = await evaluate('window.__dur');
  const zhF = [];
  for (let t = 0; t <= dur; t += STEP) { await evaluate(`window.__seek(${t})`); zhF.push(await evaluate(TEXTS)); }
  await open(`${base}${name}/?film&rec&lang=en`, 1920, 1080, READY);
  const enF = [], caps = [];
  let cur = null; // 目前顯示中的字幕 { t, s }:換句或淡出時記下結束的秒數
  for (let k = 0, t = 0; t <= dur; t += STEP, k++) {
    await evaluate(`window.__seek(${t})`);
    const f = await evaluate(TEXTS);
    enF.push(f);
    for (const s of await evaluate(DOM_CJK)) issues.push(`影片 t=${t}:還有中文「${s}」`);
    // 只算字幕本文(#capTxt),不算上面的章名;字幕框淡出(透明度 0.5 以下)時算沒有字幕
    const cap = await evaluate(`(() => { const c = document.getElementById('cap') || document.querySelector('.cap'); if (!c) return null; const tx = document.getElementById('capTxt') || c; return +getComputedStyle(c).opacity > 0.5 ? tx.textContent.trim() : ''; })()`);
    if (cap !== null) {
      if (cur && cap !== cur.s) { cur.end = t; caps.push(cur); cur = null; }
      if (cap && !cur) cur = { t, s: cap };
    }
    if (shotsAt && k % Math.round(4 / STEP) === 0) {
      fs.mkdirSync(path.join(shotsAt, name), { recursive: true });
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 0.5 } });
      fs.writeFileSync(path.join(shotsAt, name, `t${String(t).padStart(3, '0')}.jpg`), Buffer.from(shot.data, 'base64'));
    }
  }
  if (cur) { cur.end = dur; caps.push(cur); }
  if (errors.length) issues.push(...[...new Set(errors)].map((e) => `影片 console:${e}`));
  const seen = new Map();
  enF.forEach((f, k) => {
    const z = zhF[k] || { texts: [] }, t = k * STEP;
    for (const b of f.texts) {
      if (CJK.test(b.s)) continue; // 上面已經列過
      const zb = z.texts.find((x) => x.tag === b.tag && Math.abs(x.y0 - b.y0) < 40);
      if (outside(b, f.W, f.H) && !(zb && outside(zb, z.W, z.H))) { const key = `out|${b.tag}|${b.s}`; if (!seen.has(key)) seen.set(key, `影片 t=${t}:超出視窗 ${b.tag}「${b.s}」(${b.x0}..${b.x1}, ${b.y0}..${b.y1})`); }
    }
    const oe = overlapPairs(f.texts), oz = overlapPairs(z.texts);
    const zKeys = new Set([...oz.values()].map(([a, b]) => `${a.tag}|${b.tag}`));
    for (const [, [a, b]] of oe) {
      if (zKeys.has(`${a.tag}|${b.tag}`)) continue;
      const key = `ov|${a.s}|${b.s}`;
      if (!seen.has(key)) seen.set(key, `影片 t=${t}:字疊在一起 ${a.tag}「${a.s}」× ${b.tag}「${b.s}」`);
    }
  });
  issues.push(...seen.values());
  // ---- 3. 字幕速度 ----
  for (const c of caps) {
    // 取樣間隔是 STEP 秒,量到的停留時間最多少算一格,所以用多一格的時間算,只列確定太快的
    const span = c.end - c.t, cps = c.s.length / (span + STEP);
    if (cps > READ_CPS) issues.push(`影片 t=${c.t}:字幕 ${c.s.length} 個字母只停約 ${span.toFixed(0)} 到 ${(span + STEP).toFixed(0)} 秒(每秒至少 ${cps.toFixed(1)} 個,上限約 ${READ_CPS})「${c.s.slice(0, 60)}…」`);
  }
  // ---- 2. 一般模式 ----
  const NORMAL = 'window.__ready === true';
  for (const [w, h, mobile] of [[1920, 1080, false], [1366, 768, false], [1024, 768, false], [844, 390, true]]) {
    await open(`${base}${name}/?lang=zh`, w, h, NORMAL, mobile);
    const zo = new Set((await evaluate(OVERFLOW)).map((s) => s.split(' 「')[0]));
    await open(`${base}${name}/?lang=en`, w, h, NORMAL, mobile);
    for (const s of await evaluate(DOM_CJK)) issues.push(`${w}×${h}:還有中文「${s}」`);
    for (const s of await evaluate(OVERFLOW)) if (!zo.has(s.split(' 「')[0])) issues.push(`${w}×${h}:字擠出框 ${s}`);
    if (errors.length) issues.push(...[...new Set(errors)].map((e) => `${w}×${h} console:${e}`));
  }
  const head = `${name}:影片 ${dur} 秒、${enF.length} 格、${caps.length} 句字幕`;
  if (issues.length) { failed++; console.log(`FAIL ${head}`); for (const s of [...new Set(issues)]) console.log('  ' + s); }
  else console.log(`PASS ${head}`);
}
ws.close(); quit();
process.exit(failed ? 1 : 0);
