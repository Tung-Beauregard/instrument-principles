// 數據畫圖:頁面邏輯。檔案只在瀏覽器裡讀,不上傳。
import { parseFile, msSticks, fmtNL, trimTurnarounds } from './parsers.js';
import { spectrumFigure, dscFigure, tgaFigure, msFigure, ticStrip } from './figure.js';

// 中英切換(assets/i18n.js,2026-11-06);沒有載入 i18n.js 時(Node 的 check-plot.mjs)一律中文
const zhEn = globalThis.zhEn ?? ((zh) => zh);

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

const state = { files: [], seq: 0, opts: {
  spectrum: { step: '', xmin: '', xmax: '', reverse: true, normalize: false, marks: '', xlabel: 'Wavenumber (cm^{-1})', ylabel: 'Absorbance' },
  dsc: { showCool: true, connect: true, legend: true, cond: '', cols: 3, xmin: '', xmax: '' },
  tga: { showDtg: true, half: 8, xmin: '30', xmax: '800', showCool: false, title: '' },
  ms: { xmin: '', xmax: '', nLabels: 6, minRel: 2, showScans: false, h: 0.65 },
} };

const KIND_NAME = { spectrum: zhEn('光譜', 'Spectrum'), dsc: 'DSC', tga: 'TGA', ms: zhEn('質譜', 'Mass spectrum') };
const KIND_TITLE = { spectrum: zhEn('光譜疊圖(FTIR 等)', 'Overlaid spectra (FTIR and others)'), dsc: zhEn('DSC 升溫與降溫', 'DSC heating and cooling'), tga: zhEn('TGA 失重與 DTG', 'TGA weight loss and DTG'), ms: zhEn('質譜(平均掃描)', 'Mass spectrum (averaged scans)') };

// ---------------------------------------------------------------- 讀檔
async function addFiles(fileList) {
  const list = Array.from(fileList);
  for (const f of list) {
    const entry = { id: ++state.seq, name: f.name, label: f.name.replace(/\.[^.]+$/, ''), enabled: true, ds: null, error: null };
    state.files.push(entry);
    try {
      const buf = await f.arrayBuffer();
      entry.ds = await parseFile(f.name, buf);
      if (entry.ds.kind === 'ms') {
        const main = entry.ds.ranges.slice().sort((a, b) => b.count - a.count)[0];
        entry.rangeKey = main.key;
        entry.scanFrom = entry.ds.first;
        entry.scanTo = entry.ds.last;
      }
      if (entry.ds.kind === 'tga' && entry.ds.series) entry.seriesOn = entry.ds.series.map((s, i) => !/^Unsubtracted Weight$/.test(s.name) || i === 0);
    } catch (e) {
      entry.error = e.message || String(e);
    }
  }
  render();
}

function removeFile(id) {
  state.files = state.files.filter(f => f.id !== id);
  render();
}

// ---------------------------------------------------------------- 檔案清單
function renderFiles() {
  const box = $('#files');
  box.replaceChildren();
  if (!state.files.length) { box.append(el('p', 'muted', zhEn('還沒有檔案。', 'No files yet.'))); return; }
  for (const f of state.files) {
    const card = el('article', 'file' + (f.error ? ' bad' : ''));
    const head = el('div', 'file-head');
    const on = el('input'); on.type = 'checkbox'; on.checked = f.enabled; on.disabled = !!f.error; on.title = zhEn('畫進圖裡', 'Include in the figure');
    on.setAttribute('aria-label', zhEn('畫進圖裡:', 'Include in the figure: ') + f.name);
    on.addEventListener('change', () => { f.enabled = on.checked; renderFigures(); });
    const name = el('span', 'file-name', f.name);
    const kind = el('span', 'tag', f.error ? zhEn('讀不出來', 'Unreadable') : KIND_NAME[f.ds.kind] || f.ds.kind);
    const rm = el('button', 'icon', '×'); rm.type = 'button'; rm.title = zhEn('移除', 'Remove'); rm.setAttribute('aria-label', zhEn('移除 ', 'Remove ') + f.name);
    rm.addEventListener('click', () => removeFile(f.id));
    head.append(on, name, kind, rm);
    card.append(head);
    if (f.error) { card.append(el('p', 'err', f.error)); box.append(card); continue; }
    const meta = Object.entries(f.ds.meta || {}).filter(([, v]) => v !== '' && v !== undefined).map(([k, v]) => k + zhEn(' ', ': ') + v).join(zhEn('　', ' · '));
    card.append(el('p', 'meta', meta));
    if (f.ds.kind !== 'tga' || !f.ds.series) {
      const lab = el('label', 'row'); lab.append(el('span', 'k', zhEn('圖上的名稱', 'Name on the figure')));
      const inp = el('input'); inp.type = 'text'; inp.value = f.label; inp.addEventListener('input', () => { f.label = inp.value; renderFigures(); });
      lab.append(inp); card.append(lab);
    }
    if (f.ds.kind === 'ms') card.append(msControls(f));
    if (f.ds.kind === 'tga' && f.ds.series) card.append(seriesControls(f));
    box.append(card);
  }
}

function msControls(f) {
  const wrap = el('div', 'ms-ctl');
  const sel = el('select'); sel.setAttribute('aria-label', zhEn('掃描種類', 'Scan type'));
  for (const r of f.ds.ranges) { const o = el('option', '', zhEn(`m/z ${r.key.replace('-', ' 至 ')}(${r.count} 張)`, `m/z ${r.key.replace('-', ' to ')} (${r.count} ${r.count === 1 ? 'scan' : 'scans'})`)); o.value = r.key; sel.append(o); }
  sel.value = f.rangeKey;
  sel.addEventListener('change', () => { f.rangeKey = sel.value; renderFigures(); });
  const row = el('div', 'row');
  row.append(el('span', 'k', zhEn('掃描種類', 'Scan type')), sel);
  wrap.append(row);
  const row2 = el('div', 'row');
  const a = el('input'); a.type = 'number'; a.min = f.ds.first; a.max = f.ds.last; a.value = f.scanFrom; a.setAttribute('aria-label', zhEn('起始掃描', 'First scan'));
  const z = el('input'); z.type = 'number'; z.min = f.ds.first; z.max = f.ds.last; z.value = f.scanTo; z.setAttribute('aria-label', zhEn('結束掃描', 'Last scan'));
  const upd = () => { f.scanFrom = Math.max(f.ds.first, Math.min(+a.value || f.ds.first, +z.value || f.ds.last)); f.scanTo = Math.min(f.ds.last, Math.max(+z.value || f.ds.last, f.scanFrom)); a.value = f.scanFrom; z.value = f.scanTo; strip.innerHTML = ticStrip(f.ds.scans, [f.scanFrom, f.scanTo]); renderFigures(); };
  a.addEventListener('change', upd); z.addEventListener('change', upd);
  row2.append(el('span', 'k', zhEn('平均的掃描', 'Scans to average')), a, el('span', 'k', zhEn('至', 'to')), z);
  wrap.append(row2);
  const strip = el('div', 'tic');
  strip.title = zhEn('總離子流;在圖上拖一段就是要平均的掃描範圍', 'Total ion current; drag across it to choose the scans to average');
  strip.innerHTML = ticStrip(f.ds.scans, [f.scanFrom, f.scanTo]);
  let drag = null;
  const numAt = ev => {
    const r = strip.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
    return Math.round(f.ds.first + t * (f.ds.last - f.ds.first));
  };
  strip.addEventListener('pointerdown', ev => { drag = numAt(ev); strip.setPointerCapture(ev.pointerId); ev.preventDefault(); });
  strip.addEventListener('pointermove', ev => { if (drag === null) return; const n = numAt(ev); a.value = Math.min(drag, n); z.value = Math.max(drag, n); strip.innerHTML = ticStrip(f.ds.scans, [+a.value, +z.value]); });
  strip.addEventListener('pointerup', ev => { if (drag === null) return; const n = numAt(ev); a.value = Math.min(drag, n); z.value = Math.max(drag, n); drag = null; upd(); });
  wrap.append(strip);
  return wrap;
}

function seriesControls(f) {
  const wrap = el('div', 'series');
  wrap.append(el('p', 'k', zhEn('要畫的曲線(勾選)與圖上的名稱', 'Curves to draw (ticked) and their names on the figure')));
  f.ds.series.forEach((s, i) => {
    const row = el('label', 'row');
    const cb = el('input'); cb.type = 'checkbox'; cb.checked = f.seriesOn[i];
    cb.addEventListener('change', () => { f.seriesOn[i] = cb.checked; renderFigures(); });
    const inp = el('input'); inp.type = 'text'; inp.value = s.label || s.name; inp.setAttribute('aria-label', zhEn('曲線名稱', 'Curve name'));
    inp.addEventListener('input', () => { s.label = inp.value; renderFigures(); });
    const info = el('span', 'meta', (s.w0 !== null && s.w0 !== undefined ? s.w0.toFixed(2) + ' mg' : zhEn('已是 %', 'already in %')) + (s.extra ? zhEn('，升溫後另有 ' + s.extra + ' 列沒有溫度', `; ${s.extra} more ${s.extra === 1 ? 'row has' : 'rows have'} no temperature after heating`) : ''));
    row.append(cb, inp, info);
    wrap.append(row);
  });
  return wrap;
}

// ---------------------------------------------------------------- 選項表單
function field(labelText, input) {
  const lab = el('label', 'row');
  lab.append(el('span', 'k', labelText), input);
  return lab;
}
function textInput(obj, key, placeholder, type = 'text') {
  const inp = el('input'); inp.type = type; inp.value = obj[key]; if (placeholder) inp.placeholder = placeholder;
  if (type === 'number') inp.step = 'any';
  inp.addEventListener('change', () => { obj[key] = inp.value; renderFigures(); });
  return inp;
}
function check(obj, key) {
  const inp = el('input'); inp.type = 'checkbox'; inp.checked = !!obj[key];
  inp.addEventListener('change', () => { obj[key] = inp.checked; renderFigures(); });
  return inp;
}
function numPair(obj, k1, k2, ph1, ph2) {
  const wrap = el('span', 'pair');
  wrap.append(textInput(obj, k1, ph1, 'number'), el('span', 'k', zhEn('至', 'to')), textInput(obj, k2, ph2, 'number'));
  return wrap;
}

const AUTO = zhEn('自動', 'auto');   // 空白時的提示
function optionsForm(kind) {
  const o = state.opts[kind];
  const form = el('div', 'opts');
  if (kind === 'spectrum') {
    form.append(field(zhEn('X 範圍', 'X range'), numPair(o, 'xmin', 'xmax', AUTO, AUTO)), field(zhEn('X 軸由大到小', 'X axis from high to low'), check(o, 'reverse')),
      field(zhEn('每條的位移(空白為自動)', 'Offset between curves (blank = auto)'), textInput(o, 'step', AUTO, 'number')), field(zhEn('正規化(最高峰拉成 1)', 'Normalize (tallest peak to 1)'), check(o, 'normalize')),
      field(zhEn('標示的峰位(逗號分開)', 'Peak positions to mark (comma-separated)'), textInput(o, 'marks', zhEn('例如 1741, 1692, 990', 'e.g. 1741, 1692, 990'))), field(zhEn('X 軸名稱', 'X axis title'), textInput(o, 'xlabel')), field(zhEn('Y 軸名稱', 'Y axis title'), textInput(o, 'ylabel')));
  } else if (kind === 'dsc') {
    form.append(field(zhEn('下方加升溫與降溫圖', 'Add heating and cooling plots below'), check(o, 'showCool')), field(zhEn('升降溫接在一起(不去掉反轉處)', 'Join heating and cooling (keep the turnaround)'), check(o, 'connect')),
      field(zhEn('endo / exo 箭頭圖例', 'endo / exo arrow legend'), check(o, 'legend')), field(zhEn('右上角的量測條件', 'Measurement conditions (top right)'), textInput(o, 'cond', zhEn('例如 10 °C/min，30 至 350 °C', 'e.g. 10 °C/min, 30 to 350 °C'))),
      field(zhEn('每列幾個樣品', 'Samples per row'), textInput(o, 'cols', '', 'number')), field(zhEn('溫度範圍', 'Temperature range'), numPair(o, 'xmin', 'xmax', AUTO, AUTO)));
  } else if (kind === 'tga') {
    form.append(field(zhEn('溫度範圍', 'Temperature range'), numPair(o, 'xmin', 'xmax', '30', '800')), field(zhEn('畫 DTG', 'Draw DTG'), check(o, 'showDtg')),
      field(zhEn('DTG 平滑(前後各幾度)', 'DTG smoothing (degrees on each side)'), textInput(o, 'half', '', 'number')), field(zhEn('降溫段(藍色)', 'Cooling segment (blue)'), check(o, 'showCool')), field(zhEn('圖的標題', 'Figure title'), textInput(o, 'title', '')));
  } else if (kind === 'ms') {
    form.append(field(zhEn('m/z 範圍', 'm/z range'), numPair(o, 'xmin', 'xmax', AUTO, AUTO)), field(zhEn('標示幾個峰', 'Peaks to label'), textInput(o, 'nLabels', '', 'number')),
      field(zhEn('標示的最低相對強度(%)', 'Lowest relative intensity to label (%)'), textInput(o, 'minRel', '', 'number')), field(zhEn('合併視窗(± m/z)', 'Merge window (± m/z)'), textInput(o, 'h', '', 'number')),
      field(zhEn('寫出平均的掃描張數', 'Show the number of averaged scans'), check(o, 'showScans')));
  }
  return form;
}

// ---------------------------------------------------------------- 畫圖
const num = v => (v === '' || v === null || v === undefined || Number.isNaN(Number(v))) ? null : Number(v);
const range = (a, b) => (num(a) !== null && num(b) !== null) ? [num(a), num(b)] : null;

function buildSvg(kind, files) {
  const o = state.opts[kind];
  if (kind === 'spectrum') {
    return spectrumFigure(files.map(f => ({ label: f.label, x: f.ds.x, y: f.ds.y })),
      { xlim: range(o.xmin, o.xmax), reverse: o.reverse, step: num(o.step), normalize: o.normalize,
        marks: String(o.marks).split(/[,，\s]+/).map(Number).filter(Number.isFinite), xlabel: o.xlabel, ylabel: o.ylabel });
  }
  if (kind === 'dsc') {
    return dscFigure(files.map(f => ({ label: f.label, segments: f.ds.segments })),
      { showCool: o.showCool, connect: o.connect, legend: o.legend, cond: o.cond, cols: Math.max(1, Math.min(4, num(o.cols) || 3)), xlim: range(o.xmin, o.xmax) });
  }
  if (kind === 'tga') {
    const series = [];
    for (const f of files) {
      if (f.ds.series) f.ds.series.forEach((s, i) => { if (f.seriesOn[i]) series.push({ label: s.label || s.name, T: s.T, w: s.w }); });
      else {
        const ups = f.ds.segments.filter(s => s.kind === 'up'), downs = f.ds.segments.filter(s => s.kind === 'down');
        if (!ups.length) continue;
        const up = trimTurnarounds([ups[0]])[0];
        const w0 = up.y[0];
        const cool = downs.length ? { T: downs[0].T, w: downs[0].y.map(v => v / w0 * 100) } : null;
        series.push({ label: f.label, T: up.T, w: up.y.map(v => v / w0 * 100), cool });
      }
    }
    return tgaFigure(series, { xlim: range(o.xmin, o.xmax), showDtg: o.showDtg, half: Math.max(0, Math.round(num(o.half) ?? 8)), showCool: o.showCool, title: o.title });
  }
  if (kind === 'ms') {
    const items = files.map(f => {
      const r = msSticks(f.ds, f.scanFrom, f.scanTo, f.rangeKey, Math.max(0.05, num(o.h) || 0.65));
      return { label: f.label, sticks: r.sticks, n: r.n, nl: r.nl, nlText: fmtNL(r.nl) };
    });
    return msFigure(items, { xlim: range(o.xmin, o.xmax), nLabels: Math.max(0, Math.round(num(o.nLabels) ?? 6)), minRel: num(o.minRel) ?? 2, showScans: o.showScans });
  }
  return '';
}

const sections = new Map();   // kind -> {section, figBox}

function renderFigures() {
  const host = $('#figures');
  const groups = new Map();
  for (const f of state.files) if (f.enabled && f.ds) { const k = f.ds.kind; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(f); }
  for (const [kind, sec] of sections) if (!groups.has(kind)) { sec.section.remove(); sections.delete(kind); }
  for (const [kind, files] of groups) {
    let sec = sections.get(kind);
    if (!sec) {
      const section = el('section', 'figure');
      const h2 = el('h2', '', KIND_TITLE[kind] || kind);
      const tools = el('div', 'tools');
      const svgBtn = el('button', 'btn', zhEn('下載 SVG', 'Download SVG')); svgBtn.type = 'button';
      const pngBtn = el('button', 'btn', zhEn('下載 PNG', 'Download PNG')); pngBtn.type = 'button';
      tools.append(svgBtn, pngBtn);
      const head = el('div', 'fig-head'); head.append(h2, tools);
      const figBox = el('div', 'paper');
      const details = el('details', 'optbox'); details.open = true;
      const sum = el('summary', '', zhEn('圖的設定', 'Figure settings')); details.append(sum, optionsForm(kind));
      section.append(head, figBox, details);
      host.append(section);
      sec = { section, figBox };
      sections.set(kind, sec);
      svgBtn.addEventListener('click', () => download(kind, 'svg'));
      pngBtn.addEventListener('click', () => download(kind, 'png'));
    }
    try {
      sec.figBox.innerHTML = buildSvg(kind, files);
      sec.figBox.classList.remove('bad');
    } catch (e) {
      sec.figBox.textContent = zhEn('畫不出來:', 'Could not draw the figure: ') + (e.message || e);
      sec.figBox.classList.add('bad');
      console.error(e);
    }
  }
  $('#empty').hidden = groups.size > 0;
}

function render() { renderFiles(); renderFigures(); }

// ---------------------------------------------------------------- 匯出
function stamp() { const d = new Date(); return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }
function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
async function download(kind, fmt) {
  const sec = sections.get(kind);
  const svgEl = sec && sec.figBox.querySelector('svg');
  if (!svgEl) return;
  const svg = svgEl.outerHTML;
  const name = `${KIND_NAME[kind] || kind}_${stamp()}`;
  if (fmt === 'svg') { saveBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), name + '.svg'); return; }
  const scale = 300 / 72;    // 300 dpi
  const w = parseFloat(svgEl.getAttribute('width')), h = parseFloat(svgEl.getAttribute('height'));
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  canvas.toBlob(b => saveBlob(b, name + '.png'), 'image/png');
}

// ---------------------------------------------------------------- 綁定
function bind() {
  const zone = $('#drop'), input = $('#file-input');
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); input.click(); } });
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
  for (const evn of ['dragenter', 'dragover']) zone.addEventListener(evn, ev => { ev.preventDefault(); zone.classList.add('over'); });
  for (const evn of ['dragleave', 'drop']) zone.addEventListener(evn, ev => { ev.preventDefault(); zone.classList.remove('over'); });
  zone.addEventListener('drop', ev => { if (ev.dataTransfer && ev.dataTransfer.files.length) addFiles(ev.dataTransfer.files); });
  document.addEventListener('dragover', ev => ev.preventDefault());
  document.addEventListener('drop', ev => { ev.preventDefault(); if (ev.target.closest('#drop')) return; if (ev.dataTransfer && ev.dataTransfer.files.length) addFiles(ev.dataTransfer.files); });
  $('#clear').addEventListener('click', () => { state.files = []; render(); });
  render();
}

bind();
window.plotApp = { state, addFiles, render, buildSvg };
