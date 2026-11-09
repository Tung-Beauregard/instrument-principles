// 中文版有沒有被改到(2026-11-06,英文版的配套檢查):把指定版本(預設 origin/main)的檔案取出來放到暫存資料夾,
// 和目前的工作目錄各開一個靜態伺服器,用本機的 Chrome 以中文打開同一頁比對:
//   1. 畫面上每一段看得到的文字與它的字型、大小、粗細、斜體、顏色、字距(拿掉切換鈕;數字遮掉,3D 頁的讀值會跳動)
//   2. 2D 教材另外逐章每 0.5 秒比對字幕、畫布上畫的每一段字,以及每一章「自己調整」的文字
// 加英文時,中文版應該一個字、一個樣式都不變;有差就列出來。3D 頁自動循環的畫面(例如拆開探索的階段)會因截取時間不同而有差,看內容判斷。
// usage: node scripts/check-i18n-zh.mjs [--ref <git 版本>] [頁面資料夾 ...]   (portal 是入口;省略時全部)
//   CHECK_BROWSER=<chrome.exe 或 msedge.exe 的路徑>
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const ref = argv.includes('--ref') ? argv[argv.indexOf('--ref') + 1] : 'origin/main';
const names = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--ref');
const BROWSER = process.env.CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// 舊版的檔案(只取網站會用到的)
const old = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-zh-old-'));
const list = execFileSync('git', ['-C', root, 'ls-tree', '-r', '--name-only', ref], { encoding: 'utf8' }).split('\n').filter((f) => /\.(html|js|mjs|css|json|svg|png|jpg|woff2)$/.test(f));
for (const f of list) {
  const out = path.join(old, f);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, execFileSync('git', ['-C', root, 'show', `${ref}:${f}`], { maxBuffer: 64 * 1024 * 1024 }));
}
const { instruments } = JSON.parse(fs.readFileSync(path.join(root, 'content/instruments.json'), 'utf8'));
const all = ['', ...instruments.map((i) => i.href.replace(/^\.\//, '')), 'lcq-3d/'];
const pages = names.length ? names.map((p) => (p === 'portal' ? '' : p.replace(/\/?$/, '/'))) : all;
const twoD = new Set(instruments.filter((i) => i.categories.some((c) => ['bio', 'bio-adv', 'fg'].includes(c))).map((i) => i.href.replace(/^\.\//, '')));

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const serve = (dir) => new Promise((resolve) => {
  const s = http.createServer((req, res) => {
    let file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(dir)) { res.writeHead(403); res.end(); return; }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(fs.readFileSync(file));
    } catch { res.writeHead(404); res.end('not found'); }
  });
  s.listen(0, '127.0.0.1', () => resolve(s));
});
const sOld = await serve(old), sNew = await serve(root);
const OLD = `http://127.0.0.1:${sOld.address().port}/`, NEW = `http://127.0.0.1:${sNew.address().port}/`;

const PORT = 9300 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-zh-'));
const browser = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1920,1080', '--force-device-scale-factor=1', '--disable-extensions', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const cleanup = () => { try { browser.kill(); } catch {} sOld.close(); sNew.close(); for (const d of [old, profile]) try { fs.rmSync(d, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let sock;
for (let i = 0; i < 100 && !sock; i++) { try { sock = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl; } catch {} if (!sock) await sleep(200); }
if (!sock) { console.error(`找不到瀏覽器:${BROWSER}(用 CHECK_BROWSER 指定)`); process.exit(2); }
const ws = new WebSocket(sock);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => { const n = ++seq; pending.set(n, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result))); ws.send(JSON.stringify({ id: n, method, params })); });
const ev = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.addScriptToEvaluateOnNewDocument', { source: "(() => { const P = CanvasRenderingContext2D.prototype, o = P.fillText; P.fillText = function (t, x, y, m) { if (window.__rec && this.canvas.id === 'stage') window.__rec.push(String(t)); return o.call(this, t, x, y, m); }; try { localStorage.removeItem('ip-lang'); } catch (e) {} })();" });

const TEXT = `(() => {
  const sw = document.querySelector('.lang-sw'); if (sw) sw.remove();
  const out = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement, s = n.nodeValue.replace(/\\s+/g, ' ').trim();
    if (!s || !el || el.closest('script,style')) continue;
    let hidden = false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden') { hidden = true; break; } }
    if (hidden) continue;
    const cs = getComputedStyle(el);
    out.push(s.replace(/[0-9]+([.,][0-9]+)*/g, '#') + ' | ' + [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.color, cs.letterSpacing, cs.textTransform].join(' ; '));
  }
  return { title: document.title, out };
})()`;
const LESSON = `(() => {
  const api = window.__lesson; if (!api) return null; api.pause();
  const n = document.querySelectorAll('#chapters li').length, out = [];
  for (let i = 0; i < n; i++) {
    api.go(i); api.pause(); const d = api.duration;
    out.push(api.chapter + ' 自己調整:' + [...document.querySelectorAll('.ops-body .op')].filter((e) => e.offsetParent !== null).map((e) => e.innerText.replace(/\\s+/g, ' ')).join(' / '));
    for (let t = 0; t <= d; t += 0.5) { api.time = Math.min(t, d - 0.001); window.__rec = []; api.redraw(); out.push(api.chapter + '@' + t + ':' + document.querySelector('#cap .cap-tx').textContent + ' || ' + window.__rec.join(' | ')); window.__rec = null; }
  }
  return out;
})()`;
async function snap(base, p) {
  await send('Page.navigate', { url: base + p });
  for (let i = 0; i < 80; i++) { await sleep(200); try { if (await ev('document.readyState === "complete"')) break; } catch {} }
  await sleep(twoD.has(p) ? 800 : 5000);
  const s = await ev(TEXT);
  if (twoD.has(p)) s.lesson = await ev(LESSON);
  return s;
}
const count = (xs) => { const m = new Map(); for (const x of xs) m.set(x, (m.get(x) || 0) + 1); return m; };
let bad = 0;
for (const p of pages) {
  const a = await snap(OLD, p), b = await snap(NEW, p), diffs = [];
  if (a.title !== b.title) diffs.push(`<title>:${a.title} → ${b.title}`);
  const ca = count(a.out), cb = count(b.out);
  for (const [k, v] of ca) if ((cb.get(k) || 0) < v) diffs.push(`只有 ${ref}:${k.slice(0, 220)}`);
  for (const [k, v] of cb) if ((ca.get(k) || 0) < v) diffs.push(`只有現在:${k.slice(0, 220)}`);
  if (a.lesson && b.lesson) {
    const k = a.lesson.findIndex((x, i) => x !== b.lesson[i]);
    if (k >= 0 || a.lesson.length !== b.lesson.length) diffs.push(`動畫第 ${k} 格不同:\n      ${ref} ${(a.lesson[k] || '').slice(0, 300)}\n      現在 ${(b.lesson[k] || '').slice(0, 300)}`);
  }
  if (diffs.length) { bad++; console.log(`DIFF ${p || 'portal'}`); for (const d of diffs.slice(0, 12)) console.log('  ' + d); }
  else console.log(`SAME ${p || 'portal'}(${a.out.length} 段文字${a.lesson ? `、${a.lesson.length} 格動畫` : ''})`);
}
ws.close(); cleanup();
process.exit(bad ? 1 : 0);
