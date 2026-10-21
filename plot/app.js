// 數據畫圖:頁面邏輯。檔案只在瀏覽器裡讀,不上傳。
import { parseFile, msSticks, fmtNL, trimTurnarounds } from './parsers.js';
import { spectrumFigure, dscFigure, tgaFigure, msFigure, ticStrip } from './figure.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

const state = { files: [], seq: 0, opts: {
  spectrum: { step: '', xmin: '', xmax: '', reverse: true, normalize: false, marks: '', xlabel: 'Wavenumber (cm^{-1})', ylabel: 'Absorbance' },
  dsc: { showCool: true, connect: true, legend: true, cond: '', cols: 3, xmin: '', xmax: '' },
  tga: { showDtg: true, half: 8, xmin: '30', xmax: '800', showCool: false, title: '' },
  ms: { xmin: '', xmax: '', nLabels: 6, minRel: 2, showScans: false, h: 0.65 },
} };

const KIND_NAME = { spectrum: '光譜', dsc: 'DSC', tga: 'TGA', ms: '質譜' };
const KIND_TITLE = { spectrum: '光譜疊圖(FTIR 等)', dsc: 'DSC 升溫與降溫', tga: 'TGA 失重與 DTG', ms: '質譜(平均掃描)' };

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
  if (!state.files.length) { box.append(el('p', 'muted', '還沒有檔案。')); return; }
  for (const f of state.files) {
    const card = el('article', 'file' + (f.error ? ' bad' : ''));
    const head = el('div', 'file-head');
    const on = el('input'); on.type = 'checkbox'; on.checked = f.enabled; on.disabled = !!f.error; on.title = '畫進圖裡';
    on.setAttribute('aria-label', '畫進圖裡:' + f.name);
    on.addEventListener('change', () => { f.enabled = on.checked; renderFigures(); });
    const name = el('span', 'file-name', f.name);
    const kind = el('span', 'tag', f.error ? '讀不出來' : KIND_NAME[f.ds.kind] || f.ds.kind);
    const rm = el('button', 'icon', '×'); rm.type = 'button'; rm.title = '移除'; rm.setAttribute('aria-label', '移除 ' + f.name);
    rm.addEventListener('click', () => removeFile(f.id));
    head.append(on, name, kind, rm);
    card.append(head);
    if (f.error) { card.append(el('p', 'err', f.error)); box.append(card); continue; }
    const meta = Object.entries(f.ds.meta || {}).filter(([, v]) => v !== '' && v !== undefined).map(([k, v]) => k + ' ' + v).join('　');
    card.append(el('p', 'meta', meta));
    if (f.ds.kind !== 'tga' || !f.ds.series) {
      const lab = el('label', 'row'); lab.append(el('span', 'k', '圖上的名稱'));
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
  const sel = el('select'); sel.setAttribute('aria-label', '掃描種類');
  for (const r of f.ds.ranges) { const o = el('option', '', `m/z ${r.key.replace('-', ' 至 ')}(${r.count} 張)`); o.value = r.key; sel.append(o); }
  sel.value = f.rangeKey;
  sel.addEventListener('change', () => { f.rangeKey = sel.value; renderFigures(); });
  const row = el('div', 'row');
  row.append(el('span', 'k', '掃描種類'), sel);
  wrap.append(row);
  const row2 = el('div', 'row');
  const a = el('input'); a.type = 'number'; a.min = f.ds.first; a.max = f.ds.last; a.value = f.scanFrom; a.setAttribute('aria-label', '起始掃描');
  const z = el('input'); z.type = 'number'; z.min = f.ds.first; z.max = f.ds.last; z.value = f.scanTo; z.setAttribute('aria-label', '結束掃描');
  const upd = () => { f.scanFrom = Math.max(f.ds.first, Math.min(+a.value || f.ds.first, +z.value || f.ds.last)); f.scanTo = Math.min(f.ds.last, Math.max(+z.value || f.ds.last, f.scanFrom)); a.value = f.scanFrom; z.value = f.scanTo; strip.innerHTML = ticStrip(f.ds.scans, [f.scanFrom, f.scanTo]); renderFigures(); };
  a.addEventListener('change', upd); z.addEventListener('change', upd);
  row2.append(el('span', 'k', '平均的掃描'), a, el('span', 'k', '至'), z);
  wrap.append(row2);
  const strip = el('div', 'tic');
  strip.title = '總離子流;在圖上拖一段就是要平均的掃描範圍';
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
  wrap.append(el('p', 'k', '要畫的曲線(勾選)與圖上的名稱'));
  f.ds.series.forEach((s, i) => {
    const row = el('label', 'row');
    const cb = el('input'); cb.type = 'checkbox'; cb.checked = f.seriesOn[i];
    cb.addEventListener('change', () => { f.seriesOn[i] = cb.checked; renderFigures(); });
    const inp = el('input'); inp.type = 'text'; inp.value = s.label || s.name; inp.setAttribute('aria-label', '曲線名稱');
    inp.addEventListener('input', () => { s.label = inp.value; renderFigures(); });
    const info = el('span', 'meta', (s.w0 !== null && s.w0 !== undefined ? s.w0.toFixed(2) + ' mg' : '已是 %') + (s.extra ? '，升溫後另有 ' + s.extra + ' 列沒有溫度' : ''));
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
  wrap.append(textInput(obj, k1, ph1, 'number'), el('span', 'k', '至'), textInput(obj, k2, ph2, 'number'));
  return wrap;
}

function optionsForm(kind) {
  const o = state.opts[kind];
  const form = el('div', 'opts');
  if (kind === 'spectrum') {
    form.append(field('X 範圍', numPair(o, 'xmin', 'xmax', '自動', '自動')), field('X 軸由大到小', check(o, 'reverse')),
      field('每條的位移(空白為自動)', textInput(o, 'step', '自動', 'number')), field('正規化(最高峰拉成 1)', check(o, 'normalize')),
      field('標示的峰位(逗號分開)', textInput(o, 'marks', '例如 1741, 1692, 990')), field('X 軸名稱', textInput(o, 'xlabel')), field('Y 軸名稱', textInput(o, 'ylabel')));
  } else if (kind === 'dsc') {
    form.append(field('下方加升溫與降溫圖', check(o, 'showCool')), field('升降溫接在一起(不去掉反轉處)', check(o, 'connect')),
      field('endo / exo 箭頭圖例', check(o, 'legend')), field('右上角的量測條件', textInput(o, 'cond', '例如 10 °C/min，30 至 350 °C')),
      field('每列幾個樣品', textInput(o, 'cols', '', 'number')), field('溫度範圍', numPair(o, 'xmin', 'xmax', '自動', '自動')));
  } else if (kind === 'tga') {
    form.append(field('溫度範圍', numPair(o, 'xmin', 'xmax', '30', '800')), field('畫 DTG', check(o, 'showDtg')),
      field('DTG 平滑(前後各幾度)', textInput(o, 'half', '', 'number')), field('降溫段(藍色)', check(o, 'showCool')), field('圖的標題', textInput(o, 'title', '')));
  } else if (kind === 'ms') {
    form.append(field('m/z 範圍', numPair(o, 'xmin', 'xmax', '自動', '自動')), field('標示幾個峰', textInput(o, 'nLabels', '', 'number')),
      field('標示的最低相對強度(%)', textInput(o, 'minRel', '', 'number')), field('合併視窗(± m/z)', textInput(o, 'h', '', 'number')),
      field('寫出平均的掃描張數', check(o, 'showScans')));
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
      const svgBtn = el('button', 'btn', '下載 SVG'); svgBtn.type = 'button';
      const pngBtn = el('button', 'btn', '下載 PNG'); pngBtn.type = 'button';
      tools.append(svgBtn, pngBtn);
      const head = el('div', 'fig-head'); head.append(h2, tools);
      const figBox = el('div', 'paper');
      const details = el('details', 'optbox'); details.open = true;
      const sum = el('summary', '', '圖的設定'); details.append(sum, optionsForm(kind));
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
      sec.figBox.textContent = '畫不出來:' + (e.message || e);
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
