// 英文版的版面檢查(2026-11-06):用本機的 Chrome(或 Edge)開 2D 教材(生化原理、生化進階、官能基編號)的中文版與英文版,
// 每一章每 0.5 秒畫一次,再把「自己調整」的每個選項各畫幾次,比對畫布上的每一段字(攔截 fillText、strokeText):
//   1. 英文版畫出中文字(漏翻)
//   2. 英文的字超出 960 × 540 的畫面(中文同一段字沒有超出)
//   3. 英文的字和別段字疊在一起(中文同一對字沒有疊在一起)
// 另外檢查:英文版的頁面文字、屬性、字幕、章名、選項還有沒有中文;選項的按鈕有沒有擠出框;
// 每一句英文字幕要放慢多少(bio-lesson.js 的 READ_CPS,慢到下限 MIN_RATE 還不夠的列出來);
// 最長的英文字幕在 1366×768 與 1024×768 會不會把播放列擠出畫面。
// 自己會開一個靜態伺服器(這個資料夾),不需要另外架。
// usage: node scripts/check-i18n-layout.mjs [資料夾名稱 ...]   省略時檢查全部 2D 教材
//   CHECK_BROWSER=<chrome.exe 或 msedge.exe 的路徑>;--shots <資料夾> 另外存每一章中間與最後的英文截圖
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const shotsAt = argv.includes('--shots') ? path.resolve(argv[argv.indexOf('--shots') + 1]) : null;
const names = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--shots');
const BROWSER = process.env.CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const { instruments } = JSON.parse(fs.readFileSync(path.join(root, 'content/instruments.json'), 'utf8'));
const lessons = instruments.filter((i) => i.status === 'ready' && i.categories.some((c) => ['bio', 'bio-adv', 'fg'].includes(c))).map((i) => i.href.replace(/^\.\/|\/$/g, ''))
  .filter((n) => !names.length || names.includes(n));
const W = 960, H = 540, CJK = /[\u3400-\u9fff]/;
const READ_CPS = 17, MIN_RATE = 0.35; // 和 assets/bio-lesson.js 相同

// ---------- 靜態伺服器 ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
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

// ---------- 瀏覽器 ----------
const PORT = 9300 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-layout-'));
const browser = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1400,900', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--disable-features=Translate', '--disable-extensions', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
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
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
// 攔截畫布的字:記下每一段字在畫面上的範圍(邏輯座標在頁面那邊換算)
await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const P = CanvasRenderingContext2D.prototype;
  for (const fn of ['fillText', 'strokeText']) {
    const orig = P[fn];
    P[fn] = function (text, x, y, maxWidth) {
      const R = window.__rec;
      if (R && this.canvas.id === 'stage') {
        const s = String(text);
        if (s.trim()) {
          const m = this.measureText(s);
          let l = -m.actualBoundingBoxLeft, r = m.actualBoundingBoxRight;
          if (maxWidth !== undefined && r - l > maxWidth) { const k = maxWidth / (r - l); l *= k; r *= k; }
          const a = -m.actualBoundingBoxAscent, b = m.actualBoundingBoxDescent, T = this.getTransform();
          const pts = [[x + l, y + a], [x + r, y + a], [x + l, y + b], [x + r, y + b]].map(([px, py]) => [T.a * px + T.c * py + T.e, T.b * px + T.d * py + T.f]);
          const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
          R.push({ s, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys), al: this.globalAlpha, fn, ml: this.__ml || 0 });
        }
      }
      return orig.call(this, text, x, y, maxWidth);
    };
  }
})();` });

// 在頁面裡跑:每一章每 0.5 秒、每個選項各畫幾次;回傳每一格畫面的字(邏輯座標)與字幕
const SAMPLE = `(async () => {
  const api = window.__lesson; api.pause();
  const cv = document.getElementById('stage');
  const s = Math.min(cv.width / ${W}, cv.height / ${H}), ox = (cv.width - ${W} * s) / 2, oy = (cv.height - ${H} * s) / 2;
  const toL = (b) => ({ s: b.s, al: +b.al.toFixed(2), x0: +((b.x0 - ox) / s).toFixed(1), x1: +((b.x1 - ox) / s).toFixed(1), y0: +((b.y0 - oy) / s).toFixed(1), y1: +((b.y1 - oy) / s).toFixed(1) });
  // 分成幾行的同一段字(ml 相同、前後相連)併成一段:框取聯集,字用換行接起來
  const merge = (list) => { const out = []; for (const b of list) { const p = out[out.length - 1]; if (b.ml && p && p.ml === b.ml) { p.s += '\\n' + b.s; p.x0 = Math.min(p.x0, b.x0); p.y0 = Math.min(p.y0, b.y0); p.x1 = Math.max(p.x1, b.x1); p.y1 = Math.max(p.y1, b.y1); p.al = Math.max(p.al, b.al); } else out.push({ ...b }); } return out; };
  const shot = () => { window.__rec = []; api.redraw(); const r = merge(window.__rec).map(toL); window.__rec = null; return r; };
  const nCh = document.querySelectorAll('#chapters li').length;
  const frames = [], cues = [], chapters = [], ops = [];
  for (let ci = 0; ci < nCh; ci++) {
    api.go(ci); api.pause();
    const dur = api.duration, key = api.chapter;
    chapters.push({ key, dur, name: document.querySelector('#cap .cap-ch').textContent });
    // 字幕:每 0.1 秒看一次換句
    let last = null;
    for (let t = 0; t <= dur + 1e-9; t += 0.1) {
      api.time = t; api.redraw();
      const tx = document.querySelector('#cap .cap-tx').textContent;
      if (tx !== last) { cues.push({ ci, key, t: +t.toFixed(1), tx, dur }); last = tx; }
    }
    for (let t = 0; t <= dur + 1e-9; t += 0.5) { api.time = Math.min(t, dur - 0.001); frames.push({ ci, key, t, v: '', texts: shot() }); }
    // 這一章看得到的選項
    const vis = [...document.querySelectorAll('.ops-body .op')].filter((e) => e.offsetParent !== null);
    for (const op of vis) {
      const label = (op.querySelector('.op-k') || op).textContent.trim().slice(0, 40);
      ops.push({ ci, key, label, overflow: [...op.querySelectorAll('.seg,.op-k,.tg')].some((e) => e.scrollWidth > e.clientWidth + 1) });
      const acts = [];
      for (const b of op.querySelectorAll('.seg button')) acts.push(['seg ' + b.textContent, () => b.click()]);
      if (op.classList.contains('op-toggle')) { const b = op.querySelector('button'); acts.push(['toggle', () => b.click()], ['toggle back', () => b.click()]); }
      const inp = op.querySelector('input[type=range]');
      if (inp) for (const v of [inp.min, inp.max, inp.value]) acts.push(['range ' + v, () => { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); }]);
      for (const [name, act] of acts) {
        act(); api.pause();
        for (const t of [dur * 0.35, dur * 0.7, dur - 0.001]) { api.time = t; frames.push({ ci, key, t: +t.toFixed(2), v: label + ' → ' + name, texts: shot() }); }
      }
    }
  }
  return { frames, cues, chapters, ops };
})()`;

// 英文版頁面上還有沒有中文(看得到的文字與屬性;中文那一份與切換鈕不算)
const DOM_CJK = `(() => {
  const cjk = /[\\u3400-\\u9fff]/, out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!cjk.test(n.nodeValue) || !el || el.closest('script,style,[lang|="zh"],.lang-sw')) continue;
    if (getComputedStyle(el).display === 'none') continue;
    out.push(n.nodeValue.trim().slice(0, 70));
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[alt],[placeholder]')) {
    if (el.closest('.lang-sw')) continue;
    for (const a of ['aria-label', 'title', 'alt', 'placeholder']) { const v = el.getAttribute(a); if (v && cjk.test(v)) out.push(a + '="' + v.slice(0, 60) + '"'); }
  }
  if (cjk.test(document.title)) out.push('<title> ' + document.title);
  return [...new Set(out)];
})()`;

async function open(url, w, h) {
  errors = [];
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  for (let i = 0; i < 60; i++) { await sleep(150); try { if (await evaluate('!!(window.__lesson && document.readyState === "complete")')) break; } catch { /* navigating */ } }
  await sleep(200);
}
const area = (b) => Math.max(0, b.x1 - b.x0) * Math.max(0, b.y1 - b.y0);
const inter = (a, b) => { const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0); return w > 3 && h > 3 ? w * h : 0; }; // 3 以下多半是字母本身凸出(例如 f 的右上角),看不出疊到
const overlaps = (texts) => {
  const out = new Set();
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (a.al < 0.15 || b.al < 0.15 || a.s === b.s) continue;
    const x = inter(a, b);
    if (x > 0.1 * Math.min(area(a), area(b))) out.add(`${i},${j}`);
  }
  return out;
};
const outside = (b) => b.al >= 0.05 && (b.x0 < -1 || b.x1 > W + 1 || b.y0 < -1 || b.y1 > H + 1);

let failed = 0;
for (const name of lessons) {
  const issues = [];
  await open(`${base}${name}/?lang=zh`, 1400, 900);
  const zh = await evaluate(SAMPLE);
  await open(`${base}${name}/?lang=en`, 1400, 900);
  const domEn = await evaluate(DOM_CJK);
  const en = await evaluate(SAMPLE);
  const domAfter = await evaluate(DOM_CJK);
  for (const s of new Set([...domEn, ...domAfter])) issues.push(`頁面還有中文:${s}`);
  if (errors.length) issues.push(...[...new Set(errors)].map((e) => `console:${e}`));
  if (zh.frames.length !== en.frames.length) issues.push(`取樣數不同(中文 ${zh.frames.length}、英文 ${en.frames.length}),選項的數目或章節不一樣`);
  // 畫布上的字:桌機一次,手機直拿(390×844,畫面小,播放器把圖上的字放大到 1.3 倍)再一次
  await open(`${base}${name}/?lang=zh`, 390, 844);
  const zhPhone = await evaluate(SAMPLE);
  await open(`${base}${name}/?lang=en`, 390, 844);
  const enPhone = await evaluate(SAMPLE);
  let ovZh = 0, ovEn = 0, nText = 0; // 兩個版本各有幾對字疊在一起(包含原本就疊的),確認檢查有在作用
  for (const [where, ZH, EN] of [['', zh, en], ['手機', zhPhone, enPhone]]) {
    const groups = new Map(); // 同一件事只列一次,記下第一次與最後一次出現的時間
    // 同一章同一段字(數字不算,例如滑桿換了數值)只列一次,記下第一次的選項、出現的時間範圍與次數
    const note = (k, msg, f) => { k = k.replace(/[0-9]+([.,][0-9]+)*/g, '#'); const g = groups.get(k); if (g) { g.last = Math.max(g.last, f.t); g.first = Math.min(g.first, f.t); g.n++; } else groups.set(k, { msg, key: f.key, v: f.v, first: f.t, last: f.t, n: 1 }); };
    EN.frames.forEach((f, idx) => {
      const z = ZH.frames[idx] || { texts: [] };
      if (!where) { nText += f.texts.length; ovEn += overlaps(f.texts).size; ovZh += overlaps(z.texts).size; }
      for (const b of f.texts) if (CJK.test(b.s) && b.al >= 0.05) note(`cjk|${f.key}|${b.s}`, `畫布上有中文「${b.s}」`, f);
      f.texts.forEach((b, i) => {
        const zb = z.texts.length === f.texts.length ? z.texts[i] : null;
        if (outside(b) && !(zb && outside(zb))) note(`out|${f.key}|${b.s}`, `超出畫面「${b.s}」(${b.x0}..${b.x1}, ${b.y0}..${b.y1})`, f);
      });
      const oe = overlaps(f.texts), oz = z.texts.length === f.texts.length ? overlaps(z.texts) : null;
      for (const p of oe) {
        if (oz && oz.has(p)) continue;
        const [i, j] = p.split(',').map(Number), a = f.texts[i], b = f.texts[j];
        note(`ov|${f.key}|${a.s}|${b.s}`, `字疊在一起「${a.s}」×「${b.s}」${oz ? '' : '(中英的字數不同,無法逐段對照)'}`, f);
      }
    });
    for (const g of groups.values()) if (!where || !g.msg.startsWith('畫布上有中文')) issues.push(`${where ? `〈${where}〉` : ''}${g.key}${g.v ? `〔${g.v}${g.n > 1 ? ' 等' : ''}〕` : ''} t=${g.first}${g.last !== g.first ? `..${g.last}` : ''}(${g.n} 格):${g.msg}`);
  }
  // 選項擠出框
  for (const o of en.ops) if (o.overflow) issues.push(`${o.key}:選項「${o.label}」的字擠出框`);
  for (const c of en.chapters) if (CJK.test(c.name)) issues.push(`章名還是中文:${c.name}`);
  // 字幕:要放慢多少
  const slow = [];
  let zhSec = 0, enSec = 0;
  const byCh = new Map();
  for (const c of en.cues) { if (!byCh.has(c.ci)) byCh.set(c.ci, []); byCh.get(c.ci).push(c); }
  for (const [ci, list] of byCh) {
    const dur = list[0].dur;
    zhSec += dur;
    let played = list[0].tx ? 0 : list[1] ? list[1].t : dur;
    list.forEach((c, k) => {
      if (!c.tx) return;
      if (CJK.test(c.tx)) issues.push(`${c.key} t=${c.t}:字幕還是中文「${c.tx.slice(0, 40)}」`);
      const span = (k + 1 < list.length ? list[k + 1].t : dur) - c.t;
      const need = c.tx.length / READ_CPS, rate = Math.max(MIN_RATE, Math.min(1, span / need));
      played += span / rate;
      if (span / need < MIN_RATE) slow.push(`${c.key} t=${c.t}:字幕 ${c.tx.length} 個字母只有 ${span.toFixed(1)} 秒,放慢到 ${MIN_RATE} 倍還要 ${(need * MIN_RATE).toFixed(1)} 秒才讀得完「${c.tx.slice(0, 50)}…」`);
    });
    enSec += played;
  }
  issues.push(...slow);
  // 每一句英文字幕會不會把播放列擠出畫面(折成幾行要看斷字,不一定是最長的那句;字幕框只有兩行的高度)
  const shown = en.cues.filter((c) => c.tx);
  if (shown.length) for (const [w, h] of [[1366, 768], [1024, 768]]) {
    await open(`${base}${name}/?lang=en`, w, h);
    const list = JSON.stringify(shown.map((c) => [c.ci, c.t, c.key, c.tx.length]));
    const over = await evaluate(`(() => { const out = []; __lesson.pause(); for (const [ci, t, key, n] of ${list}) { __lesson.go(ci); __lesson.pause(); __lesson.time = t + 0.05; __lesson.redraw(); const b = document.querySelector('.bar').getBoundingClientRect(); if (b.bottom + scrollY > innerHeight) out.push(key + ' t=' + t + '(' + n + ' 個字母,播放列在 ' + Math.round(b.bottom + scrollY) + ' px)'); } return out; })()`);
    for (const s of over) issues.push(`${w}×${h}:字幕把播放列擠出畫面 ${s}`);
  }
  if (shotsAt) {
    fs.mkdirSync(path.join(shotsAt, name), { recursive: true });
    await open(`${base}${name}/?lang=en`, 1400, 900);
    for (const c of en.chapters) for (const [tag, k] of [['mid', 0.5], ['end', 1]]) {
      await evaluate(`(() => { __lesson.go(${JSON.stringify(c.key)}); __lesson.pause(); __lesson.time = ${c.dur * k - 0.001}; __lesson.redraw(); })()`);
      const rect = await evaluate(`(() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, width: r.width, height: r.height }; })()`);
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, clip: { ...rect, scale: 1 } });
      fs.writeFileSync(path.join(shotsAt, name, `${String(en.chapters.indexOf(c) + 1).padStart(2, '0')}-${c.key}-${tag}.jpg`), Buffer.from(shot.data, 'base64'));
    }
  }
  const head = `${name}:${en.chapters.length} 章、${en.frames.length} 格畫面、${nText} 段字(疊在一起的:中文 ${ovZh} 對、英文 ${ovEn} 對)、${en.cues.filter((c) => c.tx).length} 句字幕;英文播放約 ${Math.round(enSec)} 秒(中文 ${Math.round(zhSec)} 秒)`;
  if (issues.length) { failed++; console.log(`FAIL ${head}`); for (const s of issues) console.log('  ' + s); }
  else console.log(`PASS ${head}`);
}
ws.close(); quit();
process.exit(failed ? 1 : 0);
