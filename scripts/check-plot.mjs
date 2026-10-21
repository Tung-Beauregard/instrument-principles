// 數據畫圖(plot/)的讀檔與畫圖檢查:在程式裡合成各種格式的小檔案,讀回來核對數值,再畫成 SVG 檢查。
// 不需要真實數據檔,也不碰網路。用法:node scripts/check-plot.mjs
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = await import(pathToFileURL(path.join(root, 'plot', 'parsers.js')).href);
const F = await import(pathToFileURL(path.join(root, 'plot', 'figure.js')).href);
const close = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} vs ${b}`);
const utf8 = new TextEncoder();
const ab = u8 => u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);

// ---------------------------------------------------------------- SPC
{
  const npts = 1000, first = 4000, last = 800;
  const buf = new ArrayBuffer(512 + 32 + 4 * npts);
  const dv = new DataView(buf);
  dv.setUint8(0, 0); dv.setUint8(1, 0x4b); dv.setInt8(3, -128);
  dv.setInt32(4, npts, true); dv.setFloat64(8, first, true); dv.setFloat64(16, last, true);
  dv.setUint8(28, 1); dv.setUint8(29, 2);
  const y = new Float32Array(buf, 544, npts);
  for (let i = 0; i < npts; i++) { const x = first + (last - first) * i / (npts - 1); y[i] = 0.02 + 0.4 * Math.exp(-(((x - 1741) / 12) ** 2)); }
  const ds = P.parseSpc(buf, 'test.spc');
  assert.equal(ds.kind, 'spectrum');
  assert.equal(ds.x.length, npts);
  close(ds.x[0], 4000, 1e-9, 'spc 起點'); close(ds.x[npts - 1], 800, 1e-9, 'spc 終點');
  const best = ds.x.map((x, i) => [ds.y[i], x]).sort((a, b) => b[0] - a[0])[0];
  close(best[1], 1741, 2, 'spc 最高峰位置'); close(best[0], 0.42, 0.01, 'spc 最高峰高度');
  assert.match(ds.xlabel, /Wavenumber/);
  // 整數 Y(fexp = 10)
  const buf2 = new ArrayBuffer(512 + 32 + 4 * 10);
  const dv2 = new DataView(buf2);
  dv2.setUint8(1, 0x4b); dv2.setInt8(3, 10); dv2.setInt32(4, 10, true); dv2.setFloat64(8, 1, true); dv2.setFloat64(16, 10, true);
  for (let i = 0; i < 10; i++) dv2.setInt32(544 + 4 * i, (i + 1) * 2 ** 22, true);   // (i+1) × 2^22 × 2^(10-32) = (i+1)
  const ds2 = P.parseSpc(buf2, 'int.spc');
  close(ds2.y[9], 10, 1e-9, 'spc 整數 Y');
  console.log('PASS spc');
}

// ---------------------------------------------------------------- ASP(單欄與雙欄)
{
  const n = 5;
  const one = ['5', '4000', '3600', '1', '2', '4', '0.1', '0.2', '0.3', '0.2', '0.1'].join('\r\n');
  const a = P.parseAsp(one, 'one.asp');
  assert.deepEqual(a.x, [4000, 3900, 3800, 3700, 3600]);
  assert.deepEqual(a.y, [0.1, 0.2, 0.3, 0.2, 0.1]);
  const two = ['5\t1.86', '4000\t', '3600\t', '1\t', '2\t', '4\t', '0.1\t4000', '0.2\t3900', '0.3\t3800', '0.2\t3700', '0.1\t3600'].join('\r\n');
  const b = P.parseAsp(two, 'two.asp');
  assert.deepEqual(b.x, [4000, 3900, 3800, 3700, 3600]);
  assert.deepEqual(b.y, [0.1, 0.2, 0.3, 0.2, 0.1]);
  void n;
  console.log('PASS asp');
}

// ---------------------------------------------------------------- PerkinElmer csv:DSC 兩個循環(含等溫段),樣品溫度落後程式溫度
function peCsv(kind) {
  const col = kind === 'dsc' ? 'Unsubtracted Heat Flow' : 'Unsubtracted Weight';
  const lines = [`Time,${col},Baseline,Program Temperature,Sample Temperature,Approx. Gas Flow,`];
  let t = 0, lag = 0;
  const push = (prog) => { lag = lag * 0.9 + (prog - (prog - lag)) * 0; const st = prog - 6 * Math.sign(lines.length > 60 ? 1 : 0) * 0 + (lines.length % 2 ? 0 : 0); lines.push(`${t.toFixed(3)},${(kind === 'dsc' ? 20 - 0.01 * prog : 10 * (1 - prog / 1000)).toFixed(4)},0,${prog.toFixed(2)},${(st).toFixed(2)},20,`); t += 1 / 60; };
  for (let i = 0; i < 61; i++) push(30);                       // 等溫
  for (let i = 1; i <= 320; i++) push(30 + i);                // 升到 350
  for (let i = 1; i <= 320; i++) push(350 - i);               // 降到 30
  for (let i = 1; i <= 320; i++) push(30 + i);                // 第 2 次升溫
  return lines.join('\r\n') + '\r\n';
}
{
  const ds = P.parsePeCsv(peCsv('dsc'), 'dsc.csv');
  assert.equal(ds.kind, 'dsc');
  assert.deepEqual(ds.segments.map(s => s.kind), ['up', 'down', 'up']);
  assert.equal(ds.segments[0].T.length, 321);            // 含反轉前的那一點
  close(ds.segments[0].T[0], 30, 1e-9, 'dsc 升溫起點'); close(ds.segments[1].T[0], 350, 1e-9, 'dsc 降溫起點');
  const tg = P.parsePeCsv(peCsv('tga'), 'tga.csv');
  assert.equal(tg.kind, 'tga');
  assert.ok(P.isPerkinElmerCsv(peCsv('dsc')));
  assert.equal(P.detectType('x.csv', ab(utf8.encode(peCsv('dsc')))), 'pe-csv');
  assert.equal(P.detectType('x.csv', ab(utf8.encode('1,2\n3,4\n5,6\n'))), 'xy');
  const xy = P.parseXyText('1,2\n3,4\n5,6\n', 'xy.csv');
  assert.deepEqual(xy.x, [1, 3, 5]);
  // 反轉點修剪:樣品溫度比程式溫度慢時,升溫段開頭幾點溫度還在往下
  const segs = [{ kind: 'up', T: [40, 38, 36, 37, 50, 80], y: [1, 2, 3, 4, 5, 6], t: [0, 1, 2, 3, 4, 5], P: [30, 31, 32, 33, 34, 35] }];
  const tr = P.trimTurnarounds(segs);
  assert.deepEqual(tr[0].T, [36, 37, 50, 80]);
  console.log('PASS pe-csv');
}

// ---------------------------------------------------------------- xlsx(自己打包一個 zip,stored 方式)
function crc32(u8) {
  let c, crc = 0xffffffff;
  for (let i = 0; i < u8.length; i++) {
    c = (crc ^ u8[i]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function zipStored(entries) {
  const parts = [], central = [];
  let offset = 0;
  for (const [name, text] of entries) {
    const nm = utf8.encode(name), data = utf8.encode(text), crc = crc32(data);
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(8, 0, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, nm.length, true);
    parts.push(new Uint8Array(lh.buffer), nm, data);
    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true); cd.setUint16(4, 20, true); cd.setUint16(6, 20, true); cd.setUint16(10, 0, true);
    cd.setUint32(16, crc, true); cd.setUint32(20, data.length, true); cd.setUint32(24, data.length, true); cd.setUint16(28, nm.length, true);
    cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), nm);
    offset += 30 + nm.length + data.length;
  }
  const cdStart = offset;
  const cdLen = central.reduce((s, p) => s + p.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true); eocd.setUint16(8, entries.length, true); eocd.setUint16(10, entries.length, true);
  eocd.setUint32(12, cdLen, true); eocd.setUint32(16, cdStart, true);
  const all = [...parts, ...central, new Uint8Array(eocd.buffer)];
  const out = new Uint8Array(all.reduce((s, p) => s + p.length, 0));
  let p = 0;
  for (const part of all) { out.set(part, p); p += part.length; }
  return out;
}
{
  const heads = ['Sample Temperature', 'Unsubtracted Weight', 'SH%'];
  const rows = ['<row r="1">' + heads.map((_, i) => `<c r="${String.fromCharCode(65 + i)}1" t="s"><v>${i}</v></c>`).join('') + '</row>'];
  for (let k = 0; k < 60; k++) {
    const T = 30 + k * 10;
    rows.push(`<row r="${k + 2}"><c r="A${k + 2}"><v>${T}</v></c><c r="B${k + 2}"><v>${(8 * (1 - k / 100)).toFixed(4)}</v></c><c r="C${k + 2}"><v>${100 - k}</v></c></row>`);
  }
  const sheet = '<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + rows.join('') + '</sheetData></worksheet>';
  const sst = '<?xml version="1.0"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' + heads.map(h => `<si><t>${h.replace('%', '%')}</t></si>`).join('') + '</sst>';
  const zip = zipStored([['[Content_Types].xml', '<Types/>'], ['xl/sharedStrings.xml', sst], ['xl/worksheets/sheet1.xml', sheet]]);
  assert.equal(P.detectType('t.xlsx', ab(zip)), 'xlsx');
  const ds = await P.parseTgaXlsx(ab(zip), 't.xlsx');
  assert.equal(ds.series.length, 2);
  assert.equal(ds.series[0].name, 'Unsubtracted Weight');
  close(ds.series[0].w[0], 100, 1e-9, 'xlsx 第一點 100%'); close(ds.series[0].w[59], 100 * (1 - 0.59), 1e-6, 'xlsx 59 點後');
  close(ds.series[0].w0, 8, 1e-9, 'xlsx 起始重');
  assert.equal(ds.series[1].percentGiven, true); close(ds.series[1].w[59], 41, 1e-9, 'xlsx 已是 % 的欄');
  console.log('PASS xlsx');
}

// ---------------------------------------------------------------- LCQ .RAW:合成一個有 run header、索引與峰值的檔
function lcqRaw(scans) {
  // scans: [{peaks:[[mz, I]], lo, hi, time}];強度字用 exp = 0(整數強度)
  const rh = 2000, base = rh + 592, idxAddr = base + 13 * 520;
  const dataAddr = idxAddr + 72 * scans.length;
  const dataLen = scans.reduce((s, sc) => s + 8 * sc.peaks.length, 0);
  const buf = new ArrayBuffer(dataAddr + dataLen + 64);
  const dv = new DataView(buf), u8 = new Uint8Array(buf);
  dv.setUint32(rh + 8, 1, true); dv.setUint32(rh + 12, scans.length, true); dv.setUint32(rh + 28, idxAddr, true); dv.setUint32(rh + 32, dataAddr, true);
  for (let k = 0; k < 13; k++) {
    const s = 'C:\\Xcalibur\\data\\test' + k + '.raw';
    for (let i = 0; i < s.length; i++) { u8[base + 520 * k + 2 * i] = s.charCodeAt(i); u8[base + 520 * k + 2 * i + 1] = 0; }
  }
  let off = 0;
  scans.forEach((sc, i) => {
    const o = idxAddr + 72 * i;
    let tic = 0, bp = [0, 0];
    for (const [mz, I] of sc.peaks) { tic += I; if (I > bp[1]) bp = [mz, I]; }
    dv.setUint32(o, off, true); dv.setUint32(o + 4, i + 1, true); dv.setUint32(o + 20, sc.peaks.length, true);
    dv.setFloat64(o + 24, sc.time ?? i, true); dv.setFloat64(o + 32, tic, true); dv.setFloat64(o + 40, bp[1], true);
    dv.setFloat64(o + 48, Math.floor(bp[0] * 65536) / 65536, true); dv.setFloat64(o + 56, sc.lo ?? 150, true); dv.setFloat64(o + 64, sc.hi ?? 2000, true);
    for (const [mz, I] of sc.peaks) {
      const p = dataAddr + off;
      dv.setUint32(p, Math.round(I) << 8, true);
      dv.setUint16(p + 4, Math.floor(mz), true); dv.setUint16(p + 6, Math.round((mz - Math.floor(mz)) * 65536), true);
      off += 8;
    }
  });
  return buf;
}
{
  const buf = lcqRaw([
    { peaks: [[578.8, 1000], [579.3, 400], [700.0, 50]] },
    { peaks: [[578.9, 800], [580.2, 300]] },
    { peaks: [[300.5, 10], [578.7, 600]], lo: 150, hi: 1000 },   // 不同的掃描範圍(像 MS/MS)
  ]);
  assert.equal(P.detectType('t.raw', buf), 'raw');
  const ds = P.parseLcqRaw(buf, 't.raw');
  assert.equal(ds.scans.length, 3); assert.equal(ds.bad, 0); assert.equal(ds.empty, 0);
  assert.deepEqual(ds.ranges.map(r => r.key), ['150.0-2000.0', '150.0-1000.0']);
  close(ds.peaks(ds.scans[0])[0][0], 578.8, 1e-4, 'raw m/z'); close(ds.peaks(ds.scans[0])[0][1], 1000, 1e-9, 'raw 強度');
  // 平均前兩張(同一種掃描):578.8 附近的視窗 ±0.65 收到 578.8、579.3、578.9 共 2200,除以 2 張 = 1100
  const r = P.msSticks(ds, 1, 3, '150.0-2000.0');
  assert.equal(r.n, 2);
  const main = r.sticks.slice().sort((a, b) => b[1] - a[1])[0];
  close(main[1], 1100, 1e-6, '視窗加總 / 張數');
  close(main[0], (578.8 * 1000 + 579.3 * 400 + 578.9 * 800) / 2200, 1e-3, '加權 m/z');
  assert.equal(P.fmtNL(1100), '1.1E3'); assert.equal(P.fmtNL(99500), '1.0E5'); assert.equal(P.fmtNL(2.3e7), '2.3E7');
  console.log('PASS raw');
}

// ---------------------------------------------------------------- 畫圖:不能有 NaN,要有框線、軸名與標示
{
  const x = Array.from({ length: 800 }, (_, i) => 4000 - i * 4);
  const y = x.map(v => 0.05 + 0.5 * Math.exp(-(((v - 1741) / 15) ** 2)) + 0.3 * Math.exp(-(((v - 2924) / 30) ** 2)));
  const svg = F.spectrumFigure([{ label: '甲', x, y }, { label: '乙', x, y: y.map(v => v * 0.6) }], { marks: [1741, 1692] });
  assert.match(svg, /^<svg /); assert.doesNotMatch(svg, /NaN|undefined/);
  assert.ok(svg.includes('>甲<') && svg.includes('>1741<') && svg.includes('Wavenumber (cm<tspan'), '光譜圖缺標示或軸名');
  const T = Array.from({ length: 300 }, (_, i) => 30 + i);
  const seg = k => ({ kind: k, T: k === 'up' ? T : T.slice().reverse(), y: T.map(v => 20 - v * 0.02) });
  const d = F.dscFigure([{ label: 'A', segments: [seg('up'), seg('down'), seg('up')] }], { cond: '10 °C/min', connect: true });
  assert.doesNotMatch(d, /NaN|undefined/); assert.ok(d.includes('>endo<') && d.includes('第 2 次降溫') && d.includes('10 °C/min'), 'DSC 圖缺圖例');
  const w = T.map(v => 100 / (1 + Math.exp((v - 200) / 15)));
  const t = F.tgaFigure([{ label: '樣品', T, w }], { xlim: [30, 330] });
  assert.doesNotMatch(t, /NaN|undefined/); assert.ok(t.includes('DTG (%/°C)') && t.includes('Weight (%)'), 'TGA 圖缺軸名');
  const { dtg } = F.dtg(T, w, 30, 330, 1, 8);
  const peakT = 30 + dtg.indexOf(Math.max(...dtg));
  close(peakT, 200, 3, 'DTG 峰溫');
  const m = F.msFigure([{ label: 'S', sticks: [[300.5, 10], [578.8, 1100], [700.1, 200]], n: 2, nl: 1100, nlText: '1.1E3' }], { showScans: true });
  assert.doesNotMatch(m, /NaN|undefined/); assert.ok(m.includes('>578.8<') && m.includes('平均 2 張掃描') && m.includes('NL 1.1E3'), '質譜圖缺標示');
  const tic = F.ticStrip([{ num: 1, tic: 1 }, { num: 2, tic: 3 }, { num: 3, tic: 2 }], [1, 2]);
  assert.match(tic, /^<svg /);
  console.log('PASS figures');
}
console.log('PASS: plot parsers (spc, asp, PerkinElmer csv, xlsx, LCQ raw) and figures.');
