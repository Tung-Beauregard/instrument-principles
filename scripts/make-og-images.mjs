// Regenerate the 1200x630 share-preview images in assets/og/ from the pages themselves.
// Needs a static HTTP server for this folder (any; folders must serve index.html) and a local Chrome or Edge.
// usage: node scripts/make-og-images.mjs [base-url] [name ...]
//   base-url defaults to http://127.0.0.1:4378/ ; names limit the run (portal, lcq, lcq-3d, gc-ms, ...)
//   OG_BROWSER=<path to chrome.exe or msedge.exe> picks the browser.
// The shots use the dark colour scheme and the GPU. Elements added to the page by browser extensions
// (for example a translator's floating button) are removed before each shot.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const base = /^https?:/.test(args[0] || '') ? args.shift() : 'http://127.0.0.1:4378/';
const only = args;
const BROWSER = process.env.OG_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9334, W = 1200, H = 630;

// name (file in assets/og), page path, seconds to wait after loading, script to run before the shot
const SHOTS = [
  { name: 'portal', url: '', wait: 3 },
  { name: 'lcq', url: 'lcq/?paused&t=3.6', wait: 9, js: "document.body.classList.add('rec'); document.querySelector('#hint').classList.remove('show')" },
  { name: 'lcq-3d', url: 'lcq-3d/?view=asm', wait: 12 },
  { name: 'gc-ms', url: 'gc-ms/', wait: 12 },
  { name: 'uv-vis', url: 'uv-vis/', wait: 10 },
  { name: 'nmr', url: 'nmr/', wait: 10 },
  { name: 'mass-analyzers', url: 'mass-analyzers/', wait: 18 },
  { name: 'spectroscopy', url: 'spectroscopy/', wait: 18 },
  { name: 'chromatography', url: 'chromatography/', wait: 18 },
].filter((s) => !only.length || only.includes(s.name));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'og-profile-'));
const browser = spawn(BROWSER, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, `--window-size=${W},${H}`,
  '--hide-scrollbars', '--force-device-scale-factor=1', '--lang=zh-TW', '--disable-features=Translate',
  '--enable-gpu', '--ignore-gpu-blocklist', '--disable-extensions', '--no-first-run', '--no-default-browser-check', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function pageSocket() {
  for (let i = 0; i < 50; i++) {
    try {
      const page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('browser did not start');
}
const ws = new WebSocket(await pageSocket());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const n = ++id;
  pending.set(n, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
  ws.send(JSON.stringify({ id: n, method, params }));
});

await send('Page.enable');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
const outDir = path.join(root, 'assets', 'og');
fs.mkdirSync(outDir, { recursive: true });
const dropForeign = `(() => {
  const hits = [];
  for (const el of document.querySelectorAll('body > *, html > *:not(head):not(body)')) {
    const tag = el.tagName.toLowerCase(), cls = typeof el.className === 'string' ? el.className : '';
    if (/immersive|translate/i.test(tag + ' ' + el.id + ' ' + cls) || tag.includes('-')) { hits.push(tag + '#' + el.id); el.remove(); }
  }
  return hits;
})()`;
for (const s of SHOTS) {
  await send('Page.navigate', { url: new URL(s.url, base).href });
  await sleep(s.wait * 1000);
  if (s.js) { await send('Runtime.evaluate', { expression: s.js }); await sleep(600); }
  const removed = (await send('Runtime.evaluate', { expression: dropForeign, returnByValue: true })).result.value;
  await sleep(300);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  const file = path.join(outDir, `${s.name}.jpg`);
  fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
  console.log(`${s.name}.jpg ${Math.round(fs.statSync(file).size / 1024)} KB${removed.length ? ` (removed ${removed.join(', ')})` : ''}`);
}
ws.close();
browser.kill();
