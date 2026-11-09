// 中英切換(2026-11-06)的靜態檢查:頁面與共用程式裡每一段給人看的中文都要有英文。
//   HTML:有中文的文字要放在 lang="zh-Hant" 的元素裡(緊接著要有一個 lang="en" 的元素放英文),
//         或放在只含文字的元素上、元素另有 data-en="英文";有中文的屬性(aria-label、title、alt、placeholder…)要另有 data-en-屬性名。
//         <title> 要有 data-en。<meta> 的內容(分享預覽)只給社群網站讀,維持中文。
//   JS:有中文的字串要是 zhEn('中文', 'English') 的第一個參數;第二個參數不能有中文。
//       只給維護者看、不會顯示的中文(例如比對檔案內容的字串),在同一行加註解 zh-only。
//   content/instruments.json:分類與教材的 name、imageAlt 都要有對應的 nameEn、imageAltEn。
// 用法:node scripts/check-i18n.mjs            全部檢查,有缺就失敗並列出前幾筆
//       node scripts/check-i18n.mjs --report   每個檔案列出還沒有英文的中文有幾段(不失敗)
//       node scripts/check-i18n.mjs --list pcr/index.html   列出那個檔案每一段缺英文的中文(含行號)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CJK = /[㐀-鿿豈-﫿]/;
// 英文裡不用的字元:彎引號(很多頁的字型是 Noto Sans TC,中文字型裡它們是全形,英文會多出一格空白)與破折號
const EN_BAD = /[‘’“”—]/;
const args = process.argv.slice(2);
const mode = args[0] === '--report' ? 'report' : args[0] === '--list' ? 'list' : 'check';

// ---------- JS ----------
// 粗略的 JS 斷詞:註解、字串、模板字串(含 ${} 巢狀)、正規表示式、其他符號。回傳有中文的字串與它們在不在 zhEn() 的參數裡。
const REGEX_BEFORE = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', ';', '+', '-', '*', '%', '<', '>', '~', '^', '=>', 'return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'yield', 'await', '&&', '||', '??', '==', '===', '!=', '!==', '<=', '>=', '+=', '-=', '*=', '/=']);
function scanJs(src, lineOffset = 0) {
  const out = []; // { line, text, where: 'free' | 'zh' | 'en' }
  const lineAt = (i) => lineOffset + src.slice(0, i).split('\n').length;
  const zhOnlyLines = new Set();
  let prev = ''; // 前一個有意義的符號
  // zhEn 呼叫的狀態堆疊:{ depth, arg }(arg 0 = 中文、1 = 英文)
  const calls = [];
  let depth = 0;
  const where = () => (calls.length ? (calls[calls.length - 1].arg === 0 ? 'zh' : 'en') : 'free');
  const record = (i, text) => {
    const w = where();
    if (CJK.test(text)) out.push({ line: lineAt(i), text, where: w, at: i });
    else if (w === 'en' && EN_BAD.test(text)) out.push({ line: lineAt(i), text, where: 'en-punct', at: i });
  };
  let i = 0;
  const n = src.length;
  // 模板字串:回傳結束位置;裡面的 ${} 遞迴掃描
  function template(start) {
    let j = start + 1, chunk = '';
    while (j < n) {
      const c = src[j];
      if (c === '\\') { chunk += src.slice(j, j + 2); j += 2; continue; }
      if (c === '`') { record(start, chunk); return j + 1; }
      if (c === '$' && src[j + 1] === '{') {
        record(start, chunk); chunk = '';
        // 掃描 ${ ... } 裡的程式,直到對應的 }
        // ${ 也算一層大括號:結尾的 } 由 step() 減回來(少了這一行,每個 ${} 都讓深度少一層,zhEn 的參數就對不上)
        let k = j + 2, d = 0;
        const saved = prev; prev = '('; depth++;
        while (k < n) {
          const r = step(k, true);
          if (r.close && d === 0) { k = r.next; break; }
          if (r.open) d++;
          if (r.close) d--;
          k = r.next;
        }
        prev = saved;
        j = k; continue;
      }
      chunk += c; j++;
    }
    return n;
  }
  // 掃一個符號;inTpl 時回報大括號開合,給模板字串找結尾
  function step(j, inTpl = false) {
    const c = src[j];
    if (c === '/' && src[j + 1] === '/') {
      const e = src.indexOf('\n', j); const end = e < 0 ? n : e;
      if (/zh-only/.test(src.slice(j, end))) zhOnlyLines.add(lineAt(j));
      return { next: end };
    }
    if (c === '/' && src[j + 1] === '*') {
      const e = src.indexOf('*/', j + 2); const end = e < 0 ? n : e + 2;
      if (/zh-only/.test(src.slice(j, end))) zhOnlyLines.add(lineAt(j));
      return { next: end };
    }
    if (c === '"' || c === "'") {
      let k = j + 1;
      while (k < n && src[k] !== c) { if (src[k] === '\\') k++; if (src[k] === '\n') break; k++; }
      record(j, src.slice(j + 1, k));
      prev = 'str'; afterValue(); return { next: k + 1 };
    }
    if (c === '`') { const e = template(j); prev = 'str'; afterValue(); return { next: e }; }
    if (c === '/' && (REGEX_BEFORE.has(prev) || prev === '')) {
      let k = j + 1, cls = false;
      while (k < n) {
        if (src[k] === '\\') { k += 2; continue; }
        if (src[k] === '[') cls = true; else if (src[k] === ']') cls = false;
        else if (src[k] === '/' && !cls) break;
        else if (src[k] === '\n') break;
        k++;
      }
      k++; while (k < n && /[a-z]/i.test(src[k])) k++;
      prev = 'regex'; return { next: k };
    }
    if (/\s/.test(c)) return { next: j + 1 };
    if (/[A-Za-z_$À-￿]/.test(c)) {
      let k = j; while (k < n && /[\w$À-￿]/.test(src[k])) k++;
      const word = src.slice(j, k);
      // zhEn( 開始一個呼叫
      let m = k; while (m < n && /\s/.test(src[m])) m++;
      if (word === 'zhEn' && src[m] === '(' && prev !== '.' && prev !== 'function') { calls.push({ depth: depth + 1, arg: 0 }); depth++; prev = '('; return { next: m + 1 }; }
      prev = word; return { next: k };
    }
    if (/[0-9]/.test(c)) { let k = j; while (k < n && /[\w.]/.test(src[k])) k++; prev = 'num'; return { next: k }; }
    // 符號
    const three = src.slice(j, j + 3), two = src.slice(j, j + 2);
    if (c === '(' || c === '[') { depth++; prev = c; return { next: j + 1 }; }
    if (c === ')' || c === ']') {
      if (calls.length && calls[calls.length - 1].depth === depth) calls.pop();
      depth--; prev = c; return { next: j + 1 };
    }
    if (c === '{') { depth++; prev = '{'; return { next: j + 1, open: inTpl }; }
    if (c === '}') { depth--; prev = '}'; return { next: j + 1, close: inTpl }; }
    if (c === ',') {
      if (calls.length && calls[calls.length - 1].depth === depth) calls[calls.length - 1].arg = 1;
      prev = ','; return { next: j + 1 };
    }
    for (const op of [three, two]) if (REGEX_BEFORE.has(op)) { prev = op; return { next: j + op.length }; }
    prev = c; return { next: j + 1 };
  }
  function afterValue() {}
  while (i < n) i = step(i).next;
  return out.filter((r) => !zhOnlyLines.has(r.line));
}

// ---------- HTML ----------
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
function parseAttrs(s) {
  const attrs = {};
  for (const m of s.matchAll(/([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+)))?/g)) attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return attrs;
}
function scanHtml(src) {
  const problems = []; // { line, text, why }
  const scripts = [];
  const lineAt = (i) => src.slice(0, i).split('\n').length;
  const stack = []; // { tag, attrs, line, kids: 0, at }
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  let m;
  const leafCheck = []; // data-en 的元素:裡面不能再有元素
  while ((m = re.exec(src))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[4] !== undefined) {
      const text = m[4];
      if (!CJK.test(text)) continue;
      const top = stack[stack.length - 1];
      if (top && (top.tag === 'style')) continue;
      // 往上找最近的 data-en 或 lang
      let ok = false, why = '沒有英文';
      for (let k = stack.length - 1; k >= 0; k--) {
        const el = stack[k];
        if (k === stack.length - 1 && 'data-en' in el.attrs) { ok = true; break; }
        if ('lang' in el.attrs && el.tag !== 'html') { ok = /^zh/i.test(el.attrs.lang); if (!ok) why = 'lang="en" 的元素裡有中文'; break; }
      }
      if (!ok) problems.push({ line: lineAt(m.index), text: text.trim().slice(0, 80), why });
      continue;
    }
    const closing = m[1] === '/', tag = m[2].toLowerCase();
    if (closing) {
      // 關到對應的元素
      for (let k = stack.length - 1; k >= 0; k--) if (stack[k].tag === tag) { stack.length = k; break; }
      continue;
    }
    const attrs = parseAttrs(m[3]);
    const line = lineAt(m.index);
    if (stack.length) stack[stack.length - 1].kids++;
    // 屬性
    for (const [name, value] of Object.entries(attrs)) {
      if (!CJK.test(value)) continue;
      if (tag === 'meta' || name.startsWith('data-en')) continue;
      if (name === 'data-zh') continue;
      if (!(`data-en-${name}` in attrs)) problems.push({ line, text: `${tag} ${name}="${value.slice(0, 60)}"`, why: `缺少 data-en-${name}` });
    }
    if ('data-en' in attrs && CJK.test(attrs['data-en'])) problems.push({ line, text: attrs['data-en'].slice(0, 60), why: 'data-en 裡有中文' });
    for (const [name, value] of Object.entries(attrs)) if (name.startsWith('data-en-') && CJK.test(value)) problems.push({ line, text: value.slice(0, 60), why: `${name} 裡有中文` });
    if (tag === 'script') {
      const end = src.indexOf('</script>', re.lastIndex);
      const type = (attrs.type || '').toLowerCase();
      if (!attrs.src && (!type || type === 'module' || type === 'text/javascript')) scripts.push({ code: src.slice(re.lastIndex, end), line: lineAt(re.lastIndex) - 1 });
      re.lastIndex = end + '</script>'.length;
      continue;
    }
    if (tag === 'style') {
      const end = src.indexOf('</style>', re.lastIndex);
      const css = src.slice(re.lastIndex, end).replace(/\/\*[\s\S]*?\*\//g, '');
      if (CJK.test(css)) problems.push({ line: lineAt(re.lastIndex), text: css.match(/[^\n]*[㐀-鿿][^\n]*/)[0].trim().slice(0, 80), why: 'CSS 裡有中文' });
      re.lastIndex = end + '</style>'.length;
      continue;
    }
    if (tag === 'title') {
      if (!('data-en' in attrs)) problems.push({ line, text: '<title>', why: '缺少 data-en' });
    }
    const self = m[3].trim().endsWith('/');
    if (!VOID.has(tag) && !self) {
      const el = { tag, attrs, line, kids: 0 };
      stack.push(el);
      if ('data-en' in attrs) leafCheck.push(el);
    }
  }
  for (const el of leafCheck) if (el.kids) problems.push({ line: el.line, text: `<${el.tag} data-en="${el.attrs['data-en'].slice(0, 40)}">`, why: 'data-en 只能放在只含文字的元素上(有子元素時改用 lang="zh-Hant" 與 lang="en" 兩份)' });
  // lang="zh-Hant" 的元素後面要緊接 lang="en" 的元素
  for (const mm of src.matchAll(/<([a-zA-Z][\w-]*)\b[^>]*\blang="zh(?:-Hant)?"[^>]*>/g)) {
    if (mm[1].toLowerCase() === 'html') continue;
    const tag = mm[1];
    // 找到對應的結束標籤(同名的巢狀也算)
    const open = new RegExp(`<${tag}\\b`, 'gi'), close = new RegExp(`</${tag}\\s*>`, 'gi');
    let pos = mm.index + mm[0].length, d = 1;
    while (d > 0) {
      open.lastIndex = pos; close.lastIndex = pos;
      const o = open.exec(src), c = close.exec(src);
      if (!c) break;
      if (o && o.index < c.index) { d++; pos = o.index + 1; } else { d--; pos = c.index + c[0].length; }
    }
    const rest = src.slice(pos).replace(/^(\s|<!--[\s\S]*?-->)*/, '');
    if (!/^<[a-zA-Z][\w-]*\b[^>]*\blang="en"/.test(rest)) problems.push({ line: lineAt(mm.index), text: mm[0].slice(0, 80), why: 'lang="zh-Hant" 的元素後面要緊接一個 lang="en" 的元素' });
  }
  return { problems, scripts };
}

function checkFile(rel) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8');
  const problems = [];
  const js = (code, off) => {
    for (const r of scanJs(code, off)) {
      if (r.where === 'zh') continue;
      problems.push({ line: r.line, text: r.text.trim().slice(0, 80), why: r.where === 'en' ? 'zhEn 的英文參數裡有中文' : '沒有包在 zhEn() 裡' });
    }
  };
  if (rel.endsWith('.html')) {
    const h = scanHtml(src);
    problems.push(...h.problems);
    for (const s of h.scripts) js(s.code, s.line);
  } else if (rel.endsWith('.js') || rel.endsWith('.mjs')) js(src, 0);
  return problems.sort((a, b) => a.line - b.line);
}

// 要檢查的檔案:清單裡每一頁(含 lcq-3d)、入口、共用的 assets 程式、數據畫圖的程式
const { categories, instruments } = JSON.parse(fs.readFileSync(path.join(root, 'content/instruments.json'), 'utf8'));
const pages = ['index.html', ...instruments.filter((i) => i.status === 'ready').map((i) => i.href.replace('./', '') + 'index.html'), 'lcq-3d/index.html'];
const shared = fs.readdirSync(path.join(root, 'assets')).filter((f) => f.endsWith('.js')).map((f) => 'assets/' + f);
const plotJs = fs.readdirSync(path.join(root, 'plot')).filter((f) => f.endsWith('.js')).map((f) => 'plot/' + f);
const files = [...new Set([...pages, ...shared, ...plotJs])];

if (mode === 'list') {
  for (const rel of args.slice(1)) for (const p of checkFile(rel)) console.log(`${rel}:${p.line}  ${p.why}  ${p.text}`);
  process.exit(0);
}
let total = 0;
const failures = [];
for (const rel of files) {
  const p = checkFile(rel);
  total += p.length;
  if (mode === 'report') { if (p.length) console.log(String(p.length).padStart(5), rel); continue; }
  for (const x of p) failures.push(`${rel}:${x.line}  ${x.why}  ${x.text}`);
}
// 清單的英文欄位
const jsonProblems = [];
for (const c of categories) if (!c.nameEn || CJK.test(c.nameEn)) jsonProblems.push(`分類 ${c.id} 缺少 nameEn`);
for (const it of instruments) for (const k of ['name', 'imageAlt']) if (!it[k + 'En'] || CJK.test(it[k + 'En'])) jsonProblems.push(`教材 ${it.id} 缺少 ${k}En`);
if (mode === 'report') {
  console.log(String(jsonProblems.length).padStart(5), 'content/instruments.json');
  console.log('total', total + jsonProblems.length);
  process.exit(0);
}
failures.push(...jsonProblems);
if (failures.length) {
  console.error(`還沒有英文的中文 ${failures.length} 段,前 40 段:`);
  for (const f of failures.slice(0, 40)) console.error('  ' + f);
  process.exit(1);
}
console.log(`check-i18n: ${files.length} 個檔案的中文都有英文`);
