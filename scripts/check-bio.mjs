// 生化原理分區(2026-10-26)的檢查:清單裡 bio 分類的每一頁都接上共用播放器、元素齊全、分頁列一致、
// 章節代號不重複、module 語法正確、有維護說明;頁面文字不放特定老師的名字、不用破折號。
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const { categories, instruments } = JSON.parse(read('content/instruments.json'));
assert.ok(categories.some((c) => c.id === 'bio' && c.name === '生化原理'), '清單裡要有「生化原理」分類(id: bio)');
const bio = instruments.filter((i) => i.categories.includes('bio') && i.status === 'ready');
assert.ok(bio.length > 0, '生化原理分類裡沒有已完成的教材');

// 共用檔
for (const f of ['assets/bio-lesson.js', 'assets/bio-draw.js', 'assets/bio-lesson.css']) assert.ok(fs.existsSync(path.join(root, f)), `缺少 ${f}`);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-bio-'));
const nodeCheck = (code, name) => {
  const f = path.join(tmp, name.replace(/[^\w.-]/g, '_') + '.mjs');
  fs.writeFileSync(f, code);
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  assert.equal(r.status, 0, `${name} 語法錯誤:\n${r.stderr}`);
};
nodeCheck(read('assets/bio-lesson.js'), 'bio-lesson.js');
nodeCheck(read('assets/bio-draw.js'), 'bio-draw.js');
// 轉向提示由播放器顯示一次(全螢幕可用時提示按全螢幕鈕),頁面不自己呼叫;全螢幕時切換劇場模式 .bio-fs,手機鎖成橫向
const player = read('assets/bio-lesson.js'), css = read('assets/bio-lesson.css');
assert.equal((player.match(/createRotateHint\(\{/g) || []).length, 1, 'bio-lesson.js 要呼叫一次 createRotateHint');
assert.ok(player.includes("classList.toggle('bio-fs', on)") && player.includes("orient.lock('landscape')"), 'bio-lesson.js:全螢幕要切換 .bio-fs,手機要鎖成橫向');
assert.ok(css.includes('html.bio-fs main.lesson{position:fixed;inset:0'), 'bio-lesson.css 缺少全螢幕的劇場模式版面');

// 分頁列:← 儀器入口,然後是清單裡 bio 的每一頁(順序相同),本頁 aria-current
const navOf = (html) => {
  const m = html.match(/<nav class="sitenav" aria-label="生化原理">([\s\S]*?)<\/nav>/);
  assert.ok(m, '缺少生化原理的分頁列');
  return [...m[1].matchAll(/<a href="([^"]+)"( aria-current="page")?>([^<]+)<\/a>/g)].map((x) => ({ href: x[1], current: !!x[2], text: x[3] }));
};
const NEED = ['id="stage"', 'class="cap-no"', 'class="cap-ch"', 'class="cap-tx"', 'id="btnPrev"', 'id="btnPlay"', 'id="btnNext"', 'id="prog"', 'id="chName"', 'id="chapters"', 'class="ops-body"', 'id="btnFs"'];
// 提供研究主題的老師姓名不寫進頁面與文件(使用者 2026-10-26 決定);名字本身也不寫進這個公開的檔案,只放雜湊。
// 中文比對每一段連續 3 個字;英文先轉小寫、只留字母,比對每一段連續 10 個字母(名在前或姓在前都算)。
const NAME_SHA = new Set(['4814bed48ca413c33784', '74bbef70035fe9f0cce0', 'ffbddbc11228ed554d2a', '4b5d5cc3df75b0ecf5fa', 'cd5454210b000fef7c9d', '7ba3ca7626427df215d2']);
const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 20);
const hasName = (text) => {
  for (const run of text.match(/[\u{4e00}-\u{9fff}]{3,}/gu) || []) for (let i = 0; i + 3 <= run.length; i++) if (NAME_SHA.has(sha(run.slice(i, i + 3)))) return true;
  const az = text.toLowerCase().replace(/[^a-z]/g, '');
  for (let i = 0; i + 10 <= az.length; i++) if (NAME_SHA.has(sha(az.slice(i, i + 10)))) return true;
  return false;
};
const DASH = /\u{2014}/u; // 破折號(UI 文案不用)
for (const item of bio) {
  const dir = item.href.replace('./', '');
  const file = dir + 'index.html';
  const html = read(file);
  assert.ok(html.includes('<link rel="stylesheet" href="../assets/bio-lesson.css">'), `${dir}: 沒有載入 bio-lesson.css`);
  assert.match(html, /import \{ createLesson \} from '\.\.\/assets\/bio-lesson\.js';/, `${dir}: 沒有載入 createLesson`);
  for (const n of NEED) assert.ok(html.includes(n), `${dir}: 播放器缺少 ${n}`);
  assert.ok(!html.includes('createRotateHint'), `${dir}: 轉向提示由播放器顯示,頁面不要自己呼叫 createRotateHint`);
  assert.ok(!hasName(html), `${dir}: 頁面出現了提供研究主題的老師姓名`);
  assert.ok(!DASH.test(html), `${dir}: 頁面不應出現破折號`);
  const nav = navOf(html);
  assert.equal(nav[0].href, '../', `${dir}: 分頁列第一個要是 ← 儀器入口`);
  assert.deepEqual(nav.slice(1).map((a) => a.href), bio.map((b) => (b.id === item.id ? './' : `../${b.href.replace('./', '')}`)), `${dir}: 分頁列和清單的生化原理教材不一致`);
  assert.deepEqual(nav.filter((a) => a.current).map((a) => a.href), ['./'], `${dir}: 分頁列要標出本頁`);
  const mod = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(mod, `${dir}: 缺少 module script`);
  nodeCheck(mod[1], dir + 'module');
  // 章節一律寫成 { key: '…', name: '…', …};只看這個寫法,資料物件裡的 key 欄位不算
  const keys = [...mod[1].matchAll(/key: '([a-z0-9-]+)', name: '/g)].map((m) => m[1]);
  assert.ok(keys.length >= 4, `${dir}: 章節太少`);
  assert.equal(new Set(keys).size, keys.length, `${dir}: 章節代號重複`);
  assert.ok(fs.existsSync(path.join(root, dir, 'MAINTENANCE.md')), `${dir}: 缺少 MAINTENANCE.md`);
  const md = read(dir + 'MAINTENANCE.md');
  assert.ok(!hasName(md), `${dir}MAINTENANCE.md 出現了提供研究主題的老師姓名`);
}
for (const f of ['index.html', 'content/instruments.json', 'INSTRUMENTS.md', 'README.md', 'AGENTS.md', 'docs/HANDOFF.md', 'docs/VALIDATION.md']) assert.ok(!hasName(read(f)), `${f} 出現了提供研究主題的老師姓名`);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`PASS: ${bio.length} 份生化原理教材:共用播放器、元素、分頁列、章節代號、module 語法、維護說明;頁面與文件沒有老師姓名與破折號。`);
