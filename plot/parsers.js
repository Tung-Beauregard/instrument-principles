// 數據畫圖:讀檔模組。只用瀏覽器(與 Node 18 以上)內建的 API,沒有外部依賴。
// 支援:Galactic .spc(FTIR)、Agilent .asp、PerkinElmer 的 DSC 與 TGA csv、
//       Excel .xlsx(溫度欄配重量欄的 TGA 整理檔)、Thermo LCQ Deca XP 的 .RAW、兩欄數字的 txt/csv。

const utf8 = new TextDecoder('utf-8');

export function stem(name) {
  return String(name).replace(/\.[^.]+$/, '');
}

// ---------------------------------------------------------------- Galactic SPC
// 新格式(fversn 0x4B):512 位元組主檔頭 + (可選的 X 陣列) + 32 位元組子檔頭 + Y 陣列。
export function parseSpc(buf, name = 'spc') {
  const dv = new DataView(buf);
  const flags = dv.getUint8(0);
  const version = dv.getUint8(1);
  if (version !== 0x4b) throw new Error('只支援新格式的 .spc(fversn 0x4B),這個檔是 0x' + version.toString(16));
  const fexp = dv.getInt8(3);
  const npts = dv.getInt32(4, true);
  const first = dv.getFloat64(8, true);
  const last = dv.getFloat64(16, true);
  const xtype = dv.getUint8(28);
  const ytype = dv.getUint8(29);
  if (!(npts > 1 && npts < 1e7)) throw new Error('.spc 點數不合理:' + npts);
  let pos = 512;
  let x;
  if (flags & 0x80) {           // TXVALS:X 陣列在前
    x = Array.from(new Float32Array(buf.slice(pos, pos + 4 * npts)));
    pos += 4 * npts;
  } else {
    const step = (last - first) / (npts - 1);
    x = Array.from({ length: npts }, (_, i) => first + i * step);
  }
  const subexp = dv.getInt8(pos + 1);
  pos += 32;
  const exp = (flags & 0x04) ? subexp : fexp;    // TMULTI:每個子檔自己的指數
  let y;
  if (exp === -128) {
    y = Array.from(new Float32Array(buf.slice(pos, pos + 4 * npts)));
  } else if (flags & 0x01) {    // TSPREC:16 位元整數
    const raw = new Int16Array(buf.slice(pos, pos + 2 * npts));
    y = Array.from(raw, v => v * 2 ** (exp - 16));
  } else {
    const raw = new Int32Array(buf.slice(pos, pos + 4 * npts));
    y = Array.from(raw, v => v * 2 ** (exp - 32));
  }
  const XTYPES = { 1: 'Wavenumber (cm^{-1})', 2: 'Micrometers', 3: 'Nanometers', 4: 'Seconds', 5: 'Minutes', 7: 'Hertz' };
  const YTYPES = { 1: 'Interferogram', 2: 'Absorbance', 3: 'Kubelka-Munk', 4: 'Counts', 5: 'Volts', 6: 'Degrees', 7: 'mA', 8: 'mm', 9: 'mV', 10: 'log(1/R)', 11: 'Percent', 12: 'Intensity', 128: 'Transmission', 129: 'Reflectance', 131: 'Emission' };
  return { kind: 'spectrum', name: stem(name), x, y, xlabel: XTYPES[xtype] || 'X', ylabel: YTYPES[ytype] || 'Y',
    meta: { 格式: 'Galactic SPC', 點數: npts, 範圍: first.toFixed(1) + ' 至 ' + last.toFixed(1) } };
}

// ---------------------------------------------------------------- Agilent ASP
// 純文字:前六個數字是點數、起點、終點與三個儀器參數,後面是 Y 值。
export function parseAsp(text, name = 'asp') {
  // 第 1 行:點數(後面可能還有解析度);第 2、3 行:起點與終點波數;再三行儀器參數;
  // 之後每行一個 Y 值,有的版本後面多一欄 X 值(Y 在前、X 在後)。
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
  const npts = Number(lines[0].split(/\s+/)[0]);
  if (!(npts > 1 && lines.length >= npts + 6)) throw new Error('.asp 的點數與內容不符');
  const first = Number(lines[1].split(/\s+/)[0]), last = Number(lines[2].split(/\s+/)[0]);
  const data = lines.slice(lines.length - npts);
  const step = (last - first) / (npts - 1);
  const x = [], y = [];
  data.forEach((l, i) => {
    const p = l.split(/\s+/).map(Number);
    y.push(p[0]);
    x.push(p.length > 1 && Number.isFinite(p[1]) ? p[1] : first + i * step);
  });
  if (y.some(v => !Number.isFinite(v))) throw new Error('.asp 有讀不出的數值');
  return { kind: 'spectrum', name: stem(name), x, y, xlabel: 'Wavenumber (cm^{-1})', ylabel: 'Absorbance',
    meta: { 格式: 'Agilent ASP', 點數: npts, 範圍: first.toFixed(1) + ' 至 ' + last.toFixed(1) } };
}

// ---------------------------------------------------------------- PerkinElmer csv(DSC、TGA)
function splitCsvLine(line) {
  const out = [];
  let cur = '', q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}

export function isPerkinElmerCsv(text) {
  const head = text.slice(0, 4000);
  return /Program Temperature/.test(head) && /Sample Temperature/.test(head);
}

// 依程式溫度的升降分段;等溫段略過。回傳 segments:[{kind:'up'|'down', T:[], y:[], t:[], P:[]}]
export function parsePeCsv(text, name = 'csv') {
  const lines = text.split(/\r?\n/);
  const hdr = lines.findIndex(l => /Program Temperature/.test(l));
  if (hdr < 0) throw new Error('找不到 Program Temperature 的表頭');
  const cols = splitCsvLine(lines[hdr]);
  const idx = key => cols.findIndex(c => c.startsWith(key));
  const iT = idx('Time'), iPT = idx('Program Temperature'), iST = idx('Sample Temperature');
  const iHF = idx('Unsubtracted Heat Flow'), iW = idx('Unsubtracted Weight');
  const kind = iHF >= 0 ? 'dsc' : (iW >= 0 ? 'tga' : null);
  if (!kind) throw new Error('沒有 Unsubtracted Heat Flow 或 Unsubtracted Weight 欄');
  const iY = kind === 'dsc' ? iHF : iW;
  const rows = [];
  for (const line of lines.slice(hdr + 1)) {
    const p = splitCsvLine(line);
    const pt = Number(p[iPT]), st = Number(p[iST]), y = Number(p[iY]), t = iT >= 0 ? Number(p[iT]) : rows.length;
    if (Number.isFinite(pt) && Number.isFinite(st) && Number.isFinite(y) && p[iY] !== '') rows.push({ pt, st, y, t });
  }
  if (rows.length < 10) throw new Error('有效數據列太少');
  const segs = [];
  let cur = [], dir = null;
  for (let i = 1; i < rows.length; i++) {
    const d = rows[i].pt - rows[i - 1].pt;
    const k = d > 1e-6 ? 'up' : (d < -1e-6 ? 'down' : 'iso');
    if (k !== dir) {
      if ((dir === 'up' || dir === 'down') && cur.length > 50) segs.push({ kind: dir, rows: cur });
      cur = k !== 'iso' ? [rows[i - 1]] : [];
      dir = k;
    }
    if (k !== 'iso') cur.push(rows[i]);
  }
  if ((dir === 'up' || dir === 'down') && cur.length > 50) segs.push({ kind: dir, rows: cur });
  const segments = segs.map(s => ({ kind: s.kind, T: s.rows.map(r => r.st), y: s.rows.map(r => r.y), t: s.rows.map(r => r.t), P: s.rows.map(r => r.pt) }));
  let rate = 0;
  if (segs.length) {
    const r = segs[0].rows;
    rate = Math.abs((r[r.length - 1].pt - r[0].pt) / Math.max(r[r.length - 1].t - r[0].t, 1e-9));
  }
  const desc = segments.map(s => (s.kind === 'up' ? '升 ' : '降 ') + Math.round(s.T[0]) + '→' + Math.round(s.T[s.T.length - 1])).join('、');
  return { kind, name: stem(name), segments, all: rows,
    meta: { 格式: 'PerkinElmer csv', 段數: desc, 速率: rate ? rate.toFixed(1) + ' °C/min' : '' } };
}

// 程式溫度剛反轉時樣品溫度還在往原方向走:升溫段從樣品溫度最低點起算、降溫段從最高點起算
export function trimTurnarounds(segments) {
  return segments.map(s => {
    const i = s.kind === 'up' ? s.T.indexOf(Math.min(...s.T)) : s.T.indexOf(Math.max(...s.T));
    return { ...s, T: s.T.slice(i), y: s.y.slice(i), t: s.t.slice(i), P: s.P.slice(i) };
  });
}

// ---------------------------------------------------------------- xlsx(TGA 整理檔)
// 最小的 zip 讀取:從中央目錄找檔案,deflate 用 DecompressionStream 解。
async function unzipEntries(buf, wanted) {
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 70000); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('不是 zip 檔');
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const out = {};
  for (let k = 0; k < count; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error('zip 中央目錄損壞');
    const method = dv.getUint16(p + 10, true);
    const csize = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    const lho = dv.getUint32(p + 42, true);
    const fname = utf8.decode(u8.subarray(p + 46, p + 46 + nlen));
    p += 46 + nlen + elen + clen;
    if (!wanted.includes(fname)) continue;
    const ln = dv.getUint16(lho + 26, true), le = dv.getUint16(lho + 28, true);
    const start = lho + 30 + ln + le;
    const data = u8.slice(start, start + csize);
    if (method === 0) out[fname] = data;
    else if (method === 8) {
      const ds = new DecompressionStream('deflate-raw');
      const blob = new Blob([data]);
      out[fname] = new Uint8Array(await new Response(blob.stream().pipeThrough(ds)).arrayBuffer());
    } else throw new Error('不支援的 zip 壓縮方式 ' + method);
  }
  return out;
}

function colIndex(ref) {
  let n = 0;
  for (const ch of ref.match(/^[A-Z]+/)[0]) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
}

const xmlUnescape = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&amp;/g, '&');

// 回傳 {columns: [{index, header, cells: Map(列 -> 數值)}]},只取第一張工作表;第一列的文字當表頭
export async function readXlsxSheet(buf) {
  const files = await unzipEntries(buf, ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml']);
  const sheetXml = files['xl/worksheets/sheet1.xml'];
  if (!sheetXml) throw new Error('xlsx 裡沒有 sheet1');
  const shared = [];
  if (files['xl/sharedStrings.xml']) {
    const ss = utf8.decode(files['xl/sharedStrings.xml']);
    for (const si of ss.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
      shared.push(xmlUnescape(Array.from(si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g), m => m[1]).join('')));
    }
  }
  const xml = utf8.decode(sheetXml);
  const cols = new Map();
  for (const m of xml.matchAll(/<c r="([A-Z]+)(\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const colRef = m[1], rowStr = m[2], attrs = m[3], inner = m[4];
    if (!inner) continue;
    const v = inner.match(/<v>([\s\S]*?)<\/v>/);
    let val;
    if (v) {
      val = /t="s"/.test(attrs) ? shared[Number(v[1])] : (/t="str"|t="e"/.test(attrs) ? v[1] : Number(v[1]));
    } else {
      const t = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/);
      if (t) val = xmlUnescape(t[1]);
    }
    if (val === undefined) continue;
    const c = colIndex(colRef);
    if (!cols.has(c)) cols.set(c, { index: c, header: '', cells: new Map() });
    const row = Number(rowStr);
    if (row === 1 && typeof val === 'string') cols.get(c).header = val;
    else if (typeof val === 'number' && Number.isFinite(val)) cols.get(c).cells.set(row, val);
  }
  return { columns: Array.from(cols.values()).sort((a, b) => a.index - b.index) };
}

// 溫度欄(表頭含 Temperature 或 溫度)配後面的數值欄,直到下一個溫度欄。重量以第一點為 100%(表頭有 % 的視為已是百分比)。
export async function parseTgaXlsx(buf, name = 'xlsx') {
  const { columns } = await readXlsxSheet(buf);
  const isTemp = c => /temperature|溫度|\btemp\b/i.test(c.header);
  const series = [];
  let tempCol = null;
  for (const c of columns) {
    if (isTemp(c)) { tempCol = c; continue; }
    if (!tempCol || c.cells.size < 10) continue;
    const rows = Array.from(c.cells.keys()).filter(r => tempCol.cells.has(r)).sort((a, b) => a - b);
    if (rows.length < 10) continue;
    const T = rows.map(r => tempCol.cells.get(r));
    const w = rows.map(r => c.cells.get(r));
    const percent = /%/.test(c.header);
    const w0 = w[0];
    const header = c.header || ('欄 ' + (c.index + 1));
    series.push({ name: header, T, w: percent ? w : w.map(v => v / w0 * 100), w0: percent ? null : w0, percentGiven: percent,
      extra: c.cells.size - rows.length });
  }
  if (!series.length) throw new Error('找不到「溫度欄 + 數值欄」的配對;第一列要有表頭,溫度欄的表頭要含 Temperature');
  return { kind: 'tga', name: stem(name), series, meta: { 格式: 'xlsx', 曲線數: series.length } };
}

// ---------------------------------------------------------------- 兩欄數字的文字檔
export function parseXyText(text, name = 'txt') {
  const x = [], y = [];
  for (const line of text.split(/\r?\n/)) {
    const p = line.trim().split(/[,\t; ]+/);
    if (p.length < 2) continue;
    const a = Number(p[0]), b = Number(p[1]);
    if (Number.isFinite(a) && Number.isFinite(b)) { x.push(a); y.push(b); }
  }
  if (x.length < 3) throw new Error('讀不到兩欄數字');
  return { kind: 'spectrum', name: stem(name), x, y, xlabel: 'X', ylabel: 'Y', meta: { 格式: '兩欄文字', 點數: x.length } };
}

// ---------------------------------------------------------------- Thermo LCQ Deca XP .RAW(版本 62)
// 位移 2000 之後有 13 個間隔 520 位元組的 UTF-16 檔名欄,其前 592 位元組是 run header(12 個 uint32):
// 第 3、4 個是起訖掃描編號,第 8 個是掃描索引位址,第 9 個是數據位址。
export function parseLcqRaw(buf, name = 'raw') {
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);
  const isRun = s => {           // 從 s 開始至少 4 個「可印 ASCII + 0」
    for (let k = 0; k < 4; k++) {
      const a = u8[s + 2 * k], b = u8[s + 2 * k + 1];
      if (!(a >= 0x20 && a <= 0x7e && b === 0)) return false;
    }
    return true;
  };
  let base = -1;
  for (let s = 2000; s < u8.length - 1600; s++) {           // 大檔的 run header 在檔尾附近,整個檔都要找
    if (u8[s + 2] !== 0x3a || u8[s + 3] !== 0) continue;    // 第二個字是「:」(磁碟代號)
    if (!isRun(s)) continue;
    if (u8[s - 1] === 0 && u8[s - 2] >= 0x20 && u8[s - 2] <= 0x7e) continue;   // 要是欄位的開頭
    if (isRun(s + 520) && isRun(s + 1040) && isRun(s + 1560)) { base = s; break; }
  }
  if (base < 0) throw new Error('找不到 run header,可能不是 LCQ Deca XP 的 .RAW');
  const rh = base - 592;
  const u = Array.from({ length: 12 }, (_, i) => dv.getUint32(rh + 4 * i, true));
  const first = u[2], last = u[3], idxAddr = u[7], dataAddr = u[8];
  const n = last - first + 1;
  if (!(n > 0 && n < 1e6 && idxAddr + 72 * n <= u8.length)) throw new Error('掃描索引不合理');
  const scans = [];
  for (let i = 0; i < n; i++) {
    const o = idxAddr + 72 * i;
    scans.push({ num: first + i, off: dv.getUint32(o, true), npk: dv.getUint32(o + 20, true),
      time: dv.getFloat64(o + 24, true), tic: dv.getFloat64(o + 32, true), bpi: dv.getFloat64(o + 40, true),
      bpmz: dv.getFloat64(o + 48, true), lo: dv.getFloat64(o + 56, true), hi: dv.getFloat64(o + 64, true) });
  }
  const peaks = sc => {        // 每個峰 8 位元組:強度字(uint32)、m/z 整數(uint16)、m/z 小數(uint16/65536)
    const o = dataAddr + sc.off;
    const out = new Array(sc.npk);
    for (let k = 0; k < sc.npk; k++) {
      const w = dv.getUint32(o + 8 * k, true);
      const mz = dv.getUint16(o + 8 * k + 4, true) + dv.getUint16(o + 8 * k + 6, true) / 65536;
      out[k] = [mz, (w >>> 8) * 8 ** (w & 255)];
    }
    return out;
  };
  // 用索引核對:算出的基峰與 TIC 要和索引一致
  let bad = 0, empty = 0;
  for (const sc of scans) {
    const pk = peaks(sc);
    if (!pk.length) { empty++; continue; }
    let tic = 0, bp = pk[0];
    for (const p of pk) { tic += p[1]; if (p[1] > bp[1]) bp = p; }
    const ok = Math.abs(tic - sc.tic) <= 1e-3 * Math.max(sc.tic, 1) && Math.abs(bp[1] - sc.bpi) <= 1e-3 * Math.max(sc.bpi, 1) && Math.abs(bp[0] - sc.bpmz) < 0.01;
    if (!ok) bad++;
  }
  // 掃描種類:依質量範圍分組(full scan 與 MS/MS 的範圍不同)
  const ranges = new Map();
  for (const sc of scans) {
    const key = sc.lo.toFixed(1) + '-' + sc.hi.toFixed(1);
    ranges.set(key, (ranges.get(key) || 0) + 1);
  }
  return { kind: 'ms', name: stem(name), scans, peaks, first, last, bad, empty,
    ranges: Array.from(ranges, ([k, v]) => ({ key: k, count: v })),
    meta: { 格式: 'LCQ .RAW', 掃描: first + ' 至 ' + last, 核對: bad ? ('有 ' + bad + ' 張與索引不符') : '全部與索引一致', 空白: empty } };
}

// 沿用國科會報告的做法:範圍內各掃描的峰疊在一起,中心每 0.1 取 ±h 的視窗加總,除以掃描張數;
// 局部極大是一根棒,m/z 取視窗內強度加權平均。回傳 {sticks:[[mz, 強度]], n, nl}
export function msSticks(ds, a, z, rangeKey = null, h = 0.65, step = 0.1) {
  const pts = [];
  let n = 0;
  for (const sc of ds.scans) {
    if (sc.num < a || sc.num > z) continue;
    if (rangeKey && (sc.lo.toFixed(1) + '-' + sc.hi.toFixed(1)) !== rangeKey) continue;
    n++;
    for (const p of ds.peaks(sc)) pts.push(p);
  }
  if (!n || !pts.length) return { sticks: [], n, nl: 0 };
  pts.sort((p, q) => p[0] - q[0]);
  const mzs = pts.map(p => p[0]);
  const cum = new Float64Array(pts.length + 1), cumw = new Float64Array(pts.length + 1);
  for (let i = 0; i < pts.length; i++) { cum[i + 1] = cum[i] + pts[i][1]; cumw[i + 1] = cumw[i] + pts[i][1] * pts[i][0]; }
  const lower = v => { let lo = 0, hi = mzs.length; while (lo < hi) { const m = (lo + hi) >> 1; if (mzs[m] < v) lo = m + 1; else hi = m; } return lo; };
  const upper = v => { let lo = 0, hi = mzs.length; while (lo < hi) { const m = (lo + hi) >> 1; if (mzs[m] <= v) lo = m + 1; else hi = m; } return lo; };
  const k0 = Math.floor(mzs[0] / step) - 8, k1 = Math.floor(mzs[mzs.length - 1] / step) + 8;
  const S = new Float64Array(k1 - k0 + 1), W = new Float64Array(k1 - k0 + 1);
  for (let k = k0; k <= k1; k++) {
    const c = k * step;
    const i = lower(c - h - 1e-9), j = upper(c + h + 1e-9);
    const s = cum[j] - cum[i];
    S[k - k0] = s;
    W[k - k0] = s > 0 ? (cumw[j] - cumw[i]) / s : c;
  }
  const sticks = [];
  let i = 1;
  const N = S.length;
  while (i < N - 1) {
    if (S[i] > 0 && S[i] > S[i - 1]) {
      let j = i;
      while (j + 1 < N && S[j + 1] === S[i]) j++;
      if (j + 1 >= N || S[j + 1] < S[i]) sticks.push([W[i], S[i] / n]);
      i = j + 1;
    } else i++;
  }
  let nl = 0;
  for (const s of sticks) if (s[1] > nl) nl = s[1];
  return { sticks, n, nl };
}

export function fmtNL(v) {
  if (!(v > 0)) return '0';
  const e = Math.floor(Math.log10(v));
  const m = v / 10 ** e;
  return m >= 9.95 ? '1.0E' + (e + 1) : m.toFixed(1) + 'E' + e;
}

// ---------------------------------------------------------------- 總入口
export function detectType(name, buf) {
  const ext = (name.match(/\.([^.]+)$/) || ['', ''])[1].toLowerCase();
  const u8 = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
  if (ext === 'spc') return 'spc';
  if (ext === 'asp') return 'asp';
  if (ext === 'raw') return 'raw';
  if (ext === 'xlsx' || (u8[0] === 0x50 && u8[1] === 0x4b)) return 'xlsx';
  if (ext === 'csv' || ext === 'txt' || ext === 'dat' || ext === 'asc') {
    const text = utf8.decode(new Uint8Array(buf, 0, Math.min(4000, buf.byteLength)));
    return isPerkinElmerCsv(text) ? 'pe-csv' : 'xy';
  }
  return null;
}

export async function parseFile(name, buf) {
  const type = detectType(name, buf);
  switch (type) {
    case 'spc': return parseSpc(buf, name);
    case 'asp': return parseAsp(utf8.decode(buf), name);
    case 'raw': return parseLcqRaw(buf, name);
    case 'xlsx': return parseTgaXlsx(buf, name);
    case 'pe-csv': return parsePeCsv(utf8.decode(buf), name);
    case 'xy': return parseXyText(utf8.decode(buf), name);
    default: throw new Error('不認得的檔案類型:' + name);
  }
}
