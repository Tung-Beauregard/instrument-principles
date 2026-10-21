// 數據畫圖:把數據畫成報告用的 SVG(白底、黑字、完整黑框線、刻度朝外)。
// 單位是 pt(1 pt = 1/72 吋),所以 SVG 貼進 PowerPoint 時大小就是圖上的尺寸。
// 版面沿用國科會進度報告裡的圖(原本以 300 dpi 像素畫,這裡換算成 pt:1 px = 0.24 pt)。

export const FONT = 'Arial, "Microsoft JhengHei", "Noto Sans TC", "PingFang TC", sans-serif';
const GRAY = '#8C8C8C';
export const HEAT = ['#C00000', '#E57373', '#F0A8A8'];   // 第 1、2、3 次升溫(紅,越後面越淺)
export const COOL = ['#1F4E9E', '#6C9BD8', '#A9C4EA'];   // 第 1、2、3 次降溫(藍,越後面越淺)

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = v => (Math.round(v * 100) / 100).toString();

// 估文字寬度(pt),只用來排版避讓;^{...} 是上標
export function textWidth(s, size) {
  let w = 0;
  for (const part of String(s).split(/(\^\{[^}]*\})/)) {
    if (!part) continue;
    const sup = part.startsWith('^{');
    const t = sup ? part.slice(2, -1) : part;
    const k = sup ? 0.62 : 1;
    for (const ch of t) {
      if (ch.charCodeAt(0) > 0x2e7f) w += 1.0 * k;
      else if (' .,:;|·\'()[]/!ilI1tfjr-'.includes(ch)) w += 0.33 * k;
      else if (/[A-Z]/.test(ch) || 'mwMW%@'.includes(ch)) w += 0.72 * k;
      else w += 0.56 * k;
    }
  }
  return w * size;
}

export class Fig {
  constructor(w, h) { this.w = w; this.h = h; this.parts = []; }

  poly(paths, o = {}) {
    if (paths.length && typeof paths[0][0] === 'number') paths = [paths];
    const d = paths.filter(p => p.length > 1).map(p => 'M' + p.map(q => f1(q[0]) + ' ' + f1(q[1])).join('L')).join('');
    if (!d) return;
    this.parts.push(`<path d="${d}" fill="none" stroke="${o.color || '#000'}" stroke-width="${o.w ?? 1.08}"` +
      (o.dash ? ` stroke-dasharray="${o.dash.join(' ')}"` : '') + ` stroke-linecap="${o.cap || 'round'}" stroke-linejoin="round"` +
      (o.cls ? ` class="${o.cls}"` : '') + '/>');
  }

  line(x1, y1, x2, y2, o = {}) {
    this.poly([[x1, y1], [x2, y2]], { cap: 'butt', ...o });
    if (o.arrow) {                       // 箭頭:終點處的實心三角
      const a = Math.atan2(y2 - y1, x2 - x1), L = 5.5, Wd = 2.6;
      const bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
      const px = -Math.sin(a) * Wd, py = Math.cos(a) * Wd;
      this.parts.push(`<path d="M${f1(x2)} ${f1(y2)}L${f1(bx + px)} ${f1(by + py)}L${f1(bx - px)} ${f1(by - py)}Z" fill="${o.color || '#000'}" stroke="none"/>`);
    }
  }

  rect(x, y, w, h, o = {}) {
    this.parts.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${o.fill || 'none'}"` +
      (o.lw > 0 ? ` stroke="${o.color || '#000'}" stroke-width="${o.lw}"` : ' stroke="none"') + '/>');
  }

  // anchor:第一碼 l/m/r,第二碼 b(基線)/m(大寫字高中央)/t(大寫字高頂端);rot=90 由下往上讀
  text(x, y, s, o = {}) {
    const size = o.size || 10, anchor = o.anchor || 'lb';
    const cap = size * 0.716;
    const base = anchor[1] === 'b' ? y : (anchor[1] === 'm' ? y + cap / 2 : y + cap);
    const ta = anchor[0] === 'l' ? 'start' : (anchor[0] === 'm' ? 'middle' : 'end');
    let inner = '';
    for (const part of String(s).split(/(\^\{[^}]*\})/)) {
      if (!part) continue;
      if (part.startsWith('^{')) inner += `<tspan dy="${f1(-size * 0.36)}" font-size="${f1(size * 0.68)}">${esc(part.slice(2, -1))}</tspan><tspan dy="${f1(size * 0.36)}" font-size="0">&#8203;</tspan>`;
      else inner += esc(part);
    }
    const bx = o.rot ? x + cap / 2 : x;     // 旋轉時以 (x, y) 為文字中心
    const by = o.rot ? y : base;
    this.parts.push(`<text x="${f1(bx)}" y="${f1(by)}" text-anchor="${ta}" font-size="${f1(size)}"` +
      (o.bold ? ' font-weight="bold"' : '') + (o.color ? ` fill="${o.color}"` : '') +
      (o.rot ? ` transform="rotate(${-o.rot} ${f1(bx)} ${f1(by)})"` : '') + `>${inner}</text>`);
  }

  svg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${f1(this.w)}pt" height="${f1(this.h)}pt" viewBox="0 0 ${f1(this.w)} ${f1(this.h)}" ` +
      `font-family='${FONT}' fill="#000"><rect width="${f1(this.w)}" height="${f1(this.h)}" fill="#fff"/>${this.parts.join('')}</svg>`;
  }
}

// ---------------------------------------------------------------- 幾何
export function clipPolyline(pts, x0, y0, x1, y1) {
  const code = (x, y) => (x < x0 ? 1 : x > x1 ? 2 : 0) | (y < y0 ? 4 : y > y1 ? 8 : 0);
  const clipSeg = (ax, ay, bx, by) => {
    let ca = code(ax, ay), cb = code(bx, by);
    for (;;) {
      if (!(ca | cb)) return [ax, ay, bx, by];
      if (ca & cb) return null;
      const c = ca || cb;
      let x, y;
      if (c & 4) { x = ax + (bx - ax) * (y0 - ay) / (by - ay); y = y0; }
      else if (c & 8) { x = ax + (bx - ax) * (y1 - ay) / (by - ay); y = y1; }
      else if (c & 1) { x = x0; y = ay + (by - ay) * (x0 - ax) / (bx - ax); }
      else { x = x1; y = ay + (by - ay) * (x1 - ax) / (bx - ax); }
      if (c === ca) { ax = x; ay = y; ca = code(x, y); } else { bx = x; by = y; cb = code(x, y); }
    }
  };
  const out = [];
  let cur = [];
  for (let i = 1; i < pts.length; i++) {
    const r = clipSeg(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    if (!r) { if (cur.length > 1) out.push(cur); cur = []; continue; }
    const a = [r[0], r[1]], b = [r[2], r[3]];
    if (cur.length && cur[cur.length - 1][0] === a[0] && cur[cur.length - 1][1] === a[1]) cur.push(b);
    else { if (cur.length > 1) out.push(cur); cur = [a, b]; }
  }
  if (cur.length > 1) out.push(cur);
  return out;
}

export function simplify(pts, tol = 0.08) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const ax = pts[a][0], ay = pts[a][1], dx = pts[b][0] - ax, dy = pts[b][1] - ay, n2 = dx * dx + dy * dy;
    let best = 0, bi = -1;
    for (let i = a + 1; i < b; i++) {
      const px = pts[i][0] - ax, py = pts[i][1] - ay;
      const d = n2 === 0 ? px * px + py * py : (dy * px - dx * py) ** 2 / n2;
      if (d > best) { best = d; bi = i; }
    }
    if (best > tol * tol) { keep[bi] = 1; stack.push([a, bi], [bi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

export function niceTicks(lo, hi, target = 5) {
  const span = hi - lo;
  if (!(span > 0)) return { ticks: [lo], step: 1 };
  const raw = span / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].reduce((b, m) => Math.abs(m * mag - raw) < Math.abs(b * mag - raw) ? m : b, 1) * mag;
  // 範圍差一點點就到整數刻度時(例如 3999.4 對 4000)也標出來
  const eps = 0.003 * span;
  const ticks = [];
  for (let t = Math.ceil((lo - eps) / step - 1e-9) * step; t <= hi + eps + 1e-9; t += step) ticks.push(Math.round(t * 1e9) / 1e9);
  return { ticks, step };
}

const fmtTick = (v, step) => {
  const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  return v.toFixed(d);
};

export function niceCeil(v) {    // 往上取到 1、2、2.5、5 × 10^n
  if (!(v > 0)) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= v - 1e-12) return m * mag;
  return 10 * mag;
}

// ---------------------------------------------------------------- 座標軸
export class Axes {
  constructor(fig, x0, y0, x1, y1, xlim, ylim, o = {}) {
    Object.assign(this, { fig, x0, y0, x1, y1, xlim, ylim });
    this.frame = o.frame ?? 0.72;
    this.fs = o.fs ?? 10;
  }
  px(x) { return this.x0 + (x - this.xlim[0]) / (this.xlim[1] - this.xlim[0]) * (this.x1 - this.x0); }
  py(y) { return this.y1 - (y - this.ylim[0]) / (this.ylim[1] - this.ylim[0]) * (this.y1 - this.y0); }
  drawFrame() { this.fig.rect(this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0, { lw: this.frame }); }
  xticks(ticks, fmt, labels = true, len = 2.9) {
    this.fig.poly(ticks.map(t => [[this.px(t), this.y1], [this.px(t), this.y1 + len]]), { w: this.frame, cap: 'butt' });
    if (labels) for (const t of ticks) this.fig.text(this.px(t), this.y1 + len + 5.8, fmt(t), { size: this.fs, anchor: 'mm' });
  }
  yticks(ticks, fmt, labels = true, len = 2.9) {
    this.fig.poly(ticks.map(t => [[this.x0 - len, this.py(t)], [this.x0, this.py(t)]]), { w: this.frame, cap: 'butt' });
    if (labels) for (const t of ticks) this.fig.text(this.x0 - len - 2.9, this.py(t), fmt(t), { size: this.fs, anchor: 'rm' });
  }
  xlabel(s, dy = 26.9, size) { this.fig.text((this.x0 + this.x1) / 2, this.y1 + dy, s, { size: size || this.fs * 1.1, anchor: 'mm' }); }
  ylabel(s, dx = 32.4, size) { this.fig.text(this.x0 - dx, (this.y0 + this.y1) / 2, s, { size: size || this.fs * 1.1, anchor: 'mm', rot: 90 }); }
  vlines(xs, o = {}) { for (const x of xs) this.fig.line(this.px(x), this.y0, this.px(x), this.y1, { w: 0.48, color: '#B0B0B0', dash: [2.2, 1.7], ...o }); }
  plot(xs, ys, o = {}) {
    const pts = [];
    for (let i = 0; i < xs.length; i++) if (Number.isFinite(xs[i]) && Number.isFinite(ys[i])) pts.push([this.px(xs[i]), this.py(ys[i])]);
    const segs = clipPolyline(pts, this.x0, this.y0, this.x1, this.y1).map(s => simplify(s, o.tol ?? 0.08));
    this.fig.poly(segs, { w: 1.08, ...o });
  }
}

// 圖例:一段線 + 文字,回傳結束的 x
function legend(fig, x, y, entries, size = 10, seg = 18.2, gap = 13.9) {
  for (const e of entries) {
    fig.line(x, y, x + seg, y, { w: 1.08, color: e.color, dash: e.dash, cap: 'butt' });
    fig.text(x + seg + 4.3, y, e.label, { size, anchor: 'lm' });
    x += seg + 4.3 + textWidth(e.label, size) + gap;
  }
  return x;
}

const STYLES = [
  { color: '#000', dash: null }, { color: '#000', dash: [5.3, 2.4] }, { color: '#000', dash: [1.2, 1.7] },
  { color: GRAY, dash: null }, { color: GRAY, dash: [5.3, 2.4] }, { color: GRAY, dash: [1.2, 1.7] },
];
export const styleOf = i => STYLES[i % STYLES.length];

// 上方峰位標示:相鄰太近的往上錯開一排
function markLabels(fig, ax, marks, size = 9, gapMin = 25.2) {
  let lastBase = null;
  for (const m of marks.slice().sort((a, b) => b - a)) {
    const px = ax.px(m);
    if (px < ax.x0 - 1 || px > ax.x1 + 1) continue;
    const up = lastBase !== null && Math.abs(px - lastBase) < gapMin;
    if (!up) lastBase = px;
    fig.text(px, ax.y0 - 4.8 - (up ? 10.8 : 0), String(m), { size, anchor: 'mb' });
  }
}

// ---------------------------------------------------------------- 光譜疊圖(FTIR 等)
// items: [{label, x, y}],由上到下。o: {xlim, reverse, step, normalize, marks, xlabel, ylabel, width, height}
export function spectrumFigure(items, o = {}) {
  const W = o.width || 597.6, H = o.height || 388.8;
  const fig = new Fig(W, H);
  if (!items.length) return fig.svg();
  const x0 = 58.8, y0 = 35.8, x1 = W - 13, y1 = H - 52.1;
  let xmin = Infinity, xmax = -Infinity;
  for (const it of items) for (const v of it.x) { if (v < xmin) xmin = v; if (v > xmax) xmax = v; }
  let xlim = o.xlim && o.xlim[0] !== o.xlim[1] ? o.xlim : [xmin, xmax];
  const reverse = o.reverse ?? (/wavenumber/i.test(o.xlabel || '') );
  if ((xlim[0] < xlim[1]) === reverse) xlim = [xlim[1], xlim[0]];
  const lo = Math.min(...xlim), hi = Math.max(...xlim);
  // 每條曲線在範圍內的 min/max
  const prepared = items.map(it => {
    const xs = [], ys = [];
    for (let i = 0; i < it.x.length; i++) if (it.x[i] >= lo - 1e-9 && it.x[i] <= hi + 1e-9) { xs.push(it.x[i]); ys.push(it.y[i]); }
    let mn = Infinity, mx = -Infinity;
    for (const v of ys) { if (v < mn) mn = v; if (v > mx) mx = v; }
    let yy = ys;
    if (o.normalize && mx > mn) yy = ys.map(v => (v - mn) / (mx - mn));
    else if (o.zero) yy = ys.map(v => v - mn);
    let mn2 = Infinity, mx2 = -Infinity;
    for (const v of yy) { if (v < mn2) mn2 = v; if (v > mx2) mx2 = v; }
    return { label: it.label, xs, ys: yy, min: mn2, max: mx2 };
  }).filter(p => p.xs.length > 1);
  const n = prepared.length;
  const span = Math.max(...prepared.map(p => p.max - p.min));
  const step = o.step > 0 ? o.step : (n > 1 ? niceCeil(span * 1.15) : 0);
  const ymaxData = Math.max(...prepared.map((p, i) => p.max + step * (n - 1 - i)));
  const ymin = Math.min(0, ...prepared.map(p => p.min));
  const ymax = n > 1 ? step * (n - 1) + Math.max(prepared[0].max, step * 0.9) * 1.04 : niceCeil(ymaxData * 1.08);
  const pad = 0.013 * (ymax - ymin);
  const ax = new Axes(fig, x0, y0, x1, y1, xlim, [ymin - pad, ymax]);
  const marks = (o.marks || []).filter(m => Number.isFinite(m));
  ax.vlines(marks);
  prepared.forEach((p, i) => {
    const off = step * (n - 1 - i);
    ax.plot(p.xs, p.ys.map(v => v + off), { color: '#000', w: 1.08 });
    if (o.labels !== false && p.label) {
      // 標示放在曲線左端上方:取左端一小段內的最大值
      const left = reverse ? hi : lo;
      const spanX = (textWidth(p.label, 11) + 19) / (x1 - x0) * (hi - lo);
      let top = -Infinity;
      for (let k = 0; k < p.xs.length; k++) if (Math.abs(p.xs[k] - left) <= spanX && p.ys[k] > top) top = p.ys[k];
      if (!Number.isFinite(top)) top = p.min;
      fig.text(x0 + 6.5, ax.py(off + top) - 12.5, p.label, { size: 11, anchor: 'lm' });
    }
  });
  ax.drawFrame();
  const xt = niceTicks(lo, hi, 7);
  ax.xticks(xt.ticks, t => fmtTick(t, xt.step));
  if (n > 1 && step > 0) {
    const yt = [];
    for (let t = 0; t <= ymax + 1e-9; t += step) yt.push(Math.round(t * 1e6) / 1e6);
    ax.yticks(yt, t => fmtTick(t, step));
  } else {
    const yt = niceTicks(ymin, ymax, 5);
    ax.yticks(yt.ticks, t => fmtTick(t, yt.step));
  }
  ax.xlabel(o.xlabel || 'Wavenumber (cm^{-1})');
  ax.ylabel(o.normalize ? 'Normalized' : (o.ylabel || 'Absorbance'));
  markLabels(fig, ax, marks);
  return fig.svg();
}

// ---------------------------------------------------------------- DSC
function endoExo(fig, xc, yc) {
  fig.text(xc, yc - 50.9, 'endo', { size: 9, bold: true, anchor: 'mm' });
  fig.line(xc, yc - 18.7, xc, yc - 42.7, { w: 1.2, arrow: true });
  fig.text(xc, yc - 5.8, 'Heat Flow', { size: 9, bold: true, anchor: 'mm' });
  fig.text(xc, yc + 6.2, '(mW)', { size: 9, bold: true, anchor: 'mm' });
  fig.line(xc, yc + 18.7, xc, yc + 42.7, { w: 1.2, arrow: true });
  fig.text(xc, yc + 50.9, 'exo', { size: 9, bold: true, anchor: 'mm' });
}

function trimSeg(s) {
  const i = s.kind === 'up' ? s.T.indexOf(Math.min(...s.T)) : s.T.indexOf(Math.max(...s.T));
  return { ...s, T: s.T.slice(i), y: s.y.slice(i) };
}

// items: [{label, segments:[{kind:'up'|'down', T, y}]}]
// o: {showCool, connect, legend, cond, cols, xlim}
export function dscFigure(items, o = {}) {
  const cols = Math.max(1, Math.min(4, o.cols || 3, items.length));
  const blocks = [];
  for (let i = 0; i < items.length; i += cols) blocks.push(items.slice(i, i + cols));
  const showCool = o.showCool !== false;
  const W = 648, blockH = showCool ? 388.8 : 205;
  const H = blockH * blocks.length;
  const fig = new Fig(W, H);
  const XL = o.legend === false ? 46 : 76.3, XR = 637.4;
  const gap = cols <= 3 ? 37.9 : 30.7;
  const w = (XR - XL - (cols - 1) * gap) / cols;
  const xlim = o.xlim && o.xlim[0] < o.xlim[1] ? o.xlim : null;
  let ncyc = 0;
  blocks.forEach((block, bi) => {
    const top = bi * blockH;
    const rowA = [top + 26.9, top + 160.3], rowB = [top + 203, top + 336.5];
    block.forEach((it, k) => {
      const ups = it.segments.filter(s => s.kind === 'up').map(trimSeg);
      const downsRaw = it.segments.filter(s => s.kind === 'down');
      const downs = o.connect ? downsRaw : downsRaw.map(trimSeg);
      const upsB = o.connect ? it.segments.filter(s => s.kind === 'up') : ups;
      ncyc = Math.max(ncyc, ups.length, downs.length);
      const x0 = XL + k * (w + gap);
      const rows = showCool ? [rowA, rowB] : [rowA];
      rows.forEach(([y0, y1], row) => {
        const curves = row === 0 ? ups : upsB.concat(downs);
        if (!curves.length) return;
        let lo = Infinity, hi = -Infinity, tmin = Infinity, tmax = -Infinity;
        for (const s of curves) for (let i = 0; i < s.T.length; i++) {
          if (xlim && (s.T[i] < xlim[0] || s.T[i] > xlim[1])) continue;
          if (s.y[i] < lo) lo = s.y[i]; if (s.y[i] > hi) hi = s.y[i];
          if (s.T[i] < tmin) tmin = s.T[i]; if (s.T[i] > tmax) tmax = s.T[i];
        }
        if (!(hi > lo)) { lo -= 1; hi += 1; }
        const pad = (hi - lo) * 0.07;
        const ylim = [lo - pad, hi + pad + (hi - lo) * 0.16];
        const xr = xlim || [tmin - (tmax - tmin) * 0.03, tmax + (tmax - tmin) * 0.03];
        const ax = new Axes(fig, x0, y0, x0 + w, y1, xr, ylim, { fs: 9.6 });
        if (row === 0) {
          const sty = [{ color: '#000' }, { color: GRAY }, { color: '#000', dash: [3.8, 2.2] }];
          ups.forEach((s, i) => ax.plot(s.T, s.y, { w: 0.96, ...sty[Math.min(i, 2)] }));
        } else {
          for (let i = Math.max(upsB.length, downs.length) - 1; i >= 0; i--) {   // 後面的循環先畫,第 1 次在最上層
            if (downs[i]) ax.plot(downs[i].T, downs[i].y, { w: 0.96, color: COOL[Math.min(i, 2)] });
            if (upsB[i]) ax.plot(upsB[i].T, upsB[i].y, { w: 0.96, color: HEAT[Math.min(i, 2)] });
          }
        }
        ax.drawFrame();
        const xt = niceTicks(xr[0], xr[1], cols <= 3 ? 7 : 4);
        ax.xticks(xt.ticks, t => fmtTick(t, xt.step));
        const yt = niceTicks(ylim[0], ylim[1], 4);
        ax.yticks(yt.ticks, t => fmtTick(t, yt.step));
        fig.text(x0 + 3.8, y0 + 9.6, it.label, { size: 10.5, bold: true, anchor: 'lm' });
        if (row === rows.length - 1) ax.xlabel('Temperature (°C)', 25.4, 10.5);
      });
    });
    const legA = [{ label: '第 1 次升溫', color: '#000' }, { label: '第 2 次升溫', color: GRAY }, { label: '第 3 次升溫', color: '#000', dash: [3.8, 2.2] }].slice(0, Math.max(1, ncyc));
    legend(fig, XL, top + 13.4, legA, 9.6);
    if (o.cond) fig.text(XR, top + 13.4, o.cond, { size: 9, anchor: 'rm' });
    if (showCool) {
      const legB = [];
      for (let i = 0; i < Math.max(1, ncyc); i++) legB.push({ label: `第 ${i + 1} 次升溫`, color: HEAT[Math.min(i, 2)] }, { label: `第 ${i + 1} 次降溫`, color: COOL[Math.min(i, 2)] });
      legend(fig, XL, top + 189.6, legB, 9.6, 16.8, 10.6);
    }
    if (o.legend !== false) {
      endoExo(fig, 24, (rowA[0] + rowA[1]) / 2);
      if (showCool) endoExo(fig, 24, (rowB[0] + rowB[1]) / 2);
    } else {
      fig.text(XL - 30, (rowA[0] + rowA[1]) / 2, 'Heat flow (mW)', { size: 10, anchor: 'mm', rot: 90 });
      if (showCool) fig.text(XL - 30, (rowB[0] + rowB[1]) / 2, 'Heat flow (mW)', { size: 10, anchor: 'mm', rot: 90 });
    }
  });
  return fig.svg();
}

// ---------------------------------------------------------------- TGA
// -dW/dT:內插到等距溫度格,中央差分後做移動平均
export function dtg(T, W, t0, t1, grid = 1, half = 8) {
  const ts = [], ws = [];
  let j = 0;
  for (let t = t0; t <= Math.min(t1, T[T.length - 1]) + 1e-9; t += grid) {
    while (j + 1 < T.length && T[j + 1] < t) j++;
    let w;
    if (t < T[0]) w = W[0];
    else if (j + 1 < T.length && T[j + 1] !== T[j]) w = W[j] + (W[j + 1] - W[j]) * (t - T[j]) / (T[j + 1] - T[j]);
    else w = W[j];
    ts.push(t); ws.push(w);
  }
  const d = ts.map((_, i) => {
    const a = Math.max(0, i - 1), b = Math.min(ts.length - 1, i + 1);
    return b > a ? -(ws[b] - ws[a]) / (ts[b] - ts[a]) : 0;
  });
  const sm = d.map((_, i) => {
    const a = Math.max(0, i - half), b = Math.min(d.length, i + half + 1);
    let s = 0;
    for (let k = a; k < b; k++) s += d[k];
    return s / (b - a);
  });
  return { ts, dtg: sm };
}

// series: [{label, T, w, style, cool:{T,w}|null}];o: {xlim, showDtg, half, title, showCool, width, height}
export function tgaFigure(series, o = {}) {
  const W = o.width || 554.4, H = o.height || 381.6;
  const fig = new Fig(W, H);
  if (!series.length) return fig.svg();
  const x0 = 61.2, x1 = W - 14.4;
  const showDtg = o.showDtg !== false;
  const wy = showDtg ? [51.6, 214.1] : [51.6, H - 49.2];
  const dy = [232.8, H - 49.2];
  let tmin = Infinity, tmax = -Infinity, wmin = Infinity, wmax = -Infinity;
  for (const s of series) for (let i = 0; i < s.T.length; i++) {
    if (s.T[i] < tmin) tmin = s.T[i]; if (s.T[i] > tmax) tmax = s.T[i];
    if (s.w[i] < wmin) wmin = s.w[i]; if (s.w[i] > wmax) wmax = s.w[i];
  }
  const xlim = o.xlim && o.xlim[0] < o.xlim[1] ? o.xlim : [Math.floor(tmin / 10) * 10, Math.ceil(tmax / 10) * 10];
  const wlo = Math.min(0, Math.floor(Math.max(wmin, -100) / 20) * 20);
  const wlim = [wlo, Math.max(105, Math.min(wmax, 200) * 1.02)];
  const axw = new Axes(fig, x0, wy[0], x1, wy[1], xlim, wlim);
  const curves = series.map((s, i) => {
    const st = s.style || styleOf(i);
    axw.plot(s.T, s.w, { w: 1.08, ...st });
    if (s.cool && o.showCool) axw.plot(s.cool.T, s.cool.w, { w: 1.08, color: COOL[0] });
    // 重量讀值開始亂跳之後(相鄰兩點差超過 3%)不再算 DTG
    let cut = s.T.length;
    for (let i = 1; i < s.T.length; i++) if (Math.abs(s.w[i] - s.w[i - 1]) > 3) { cut = i; break; }
    const r = dtg(s.T.slice(0, cut), s.w.slice(0, cut), xlim[0], xlim[1], 1, o.half ?? 8);
    return { st, ...r };
  });
  axw.drawFrame();
  const xt = niceTicks(xlim[0], xlim[1], 7);
  const wt = [];
  for (let t = wlo; t <= 100 + 1e-9; t += 20) wt.push(t);
  axw.yticks(wt, t => String(t));
  axw.ylabel('Weight (%)', 36, 10);
  if (showDtg) {
    axw.xticks(xt.ticks, t => fmtTick(t, xt.step), false);
    let dmax = 0;
    for (const c of curves) for (const v of c.dtg) if (v > dmax) dmax = v;
    const dlim = [0, niceCeil(Math.max(dmax, 1e-6) * 1.12)];
    const axd = new Axes(fig, x0, dy[0], x1, dy[1], xlim, dlim);
    curves.forEach(c => axd.plot(c.ts, c.dtg, { w: 1.08, ...c.st }));
    axd.drawFrame();
    axd.xticks(xt.ticks, t => fmtTick(t, xt.step));
    const dt = niceTicks(0, dlim[1], 3);
    axd.yticks(dt.ticks, t => fmtTick(t, dt.step));
    axd.ylabel('DTG (%/°C)', 36, 10);
    axd.xlabel('Temperature (°C)', 25.4);
  } else {
    axw.xticks(xt.ticks, t => fmtTick(t, xt.step));
    axw.xlabel('Temperature (°C)', 25.4);
  }
  const entries = series.map((s, i) => ({ label: s.label, ...(s.style || styleOf(i)) }));
  if (o.showCool && series.some(s => s.cool)) entries.push({ label: '降溫', color: COOL[0] });
  legend(fig, x0, 14.9, entries, 10);
  if (o.title) fig.text(x0, wy[0] - 8.2, o.title, { size: 10.5, bold: true, anchor: 'lm' });
  return fig.svg();
}

// ---------------------------------------------------------------- 質譜(棒狀圖)
// items: [{label, sticks:[[mz, I]], n, nl}];o: {xlim, nLabels, minRel, showScans, width}
export function msFigure(items, o = {}) {
  const W = o.width || 597.6;
  const panelH = 104.6, gapH = 14.4, top = 8.4;
  const H = top + items.length * panelH + (items.length - 1) * gapH + 52;
  const fig = new Fig(W, H);
  if (!items.length) return fig.svg();
  const x0 = 57.4, x1 = W - 15.8;
  let lo = Infinity, hi = -Infinity;
  for (const it of items) for (const s of it.sticks) { if (s[0] < lo) lo = s[0]; if (s[0] > hi) hi = s[0]; }
  const xlim = o.xlim && o.xlim[0] < o.xlim[1] ? o.xlim : [Math.floor(lo / 50) * 50, Math.ceil(hi / 50) * 50];
  items.forEach((it, k) => {
    const y0 = top + k * (panelH + gapH), y1 = y0 + panelH;
    const ax = new Axes(fig, x0, y0, x1, y1, xlim, [0, 138.4], { fs: 10 });
    const nl = it.nl || 1;
    const paths = [];
    for (const [mz, I] of it.sticks) if (mz >= xlim[0] && mz <= xlim[1] && I / nl >= 0.002) paths.push([[ax.px(mz), y1], [ax.px(mz), ax.py(100 * I / nl)]]);
    fig.poly(paths, { w: 0.53, color: '#000', cap: 'butt' });
    ax.drawFrame();
    ax.yticks([0, 50, 100], t => String(t));
    const xt = niceTicks(xlim[0], xlim[1], 8);
    ax.xticks(xt.ticks, t => fmtTick(t, xt.step), k === items.length - 1);
    fig.text(x0 + 6.2, y0 + 10.1, it.label, { size: 11, bold: true, anchor: 'lm' });
    const sub = (o.showScans && it.n ? `平均 ${it.n} 張掃描，` : '') + 'NL ' + (it.nlText || '');
    fig.text(x0 + 6.2, y0 + 24, sub, { size: 9, anchor: 'lm' });
    // 峰標示:由強到弱挑,同一區只標最強的那根;放不下就左右移開
    const cand = it.sticks.filter(s => s[0] >= xlim[0] && s[0] <= xlim[1] && 100 * s[1] / nl >= (o.minRel ?? 2)).sort((a, b) => b[1] - a[1]);
    const chosen = [];
    for (const s of cand) {
      if (chosen.length >= (o.nLabels ?? 6)) break;
      if (chosen.some(c => Math.abs(c[0] - s[0]) < (xlim[1] - xlim[0]) * 0.012)) continue;
      chosen.push(s);
    }
    const placed = [];
    const tall = it.sticks.filter(s => s[0] >= xlim[0] && s[0] <= xlim[1]).map(s => [ax.px(s[0]), ax.py(100 * s[1] / nl)]);
    for (const s of chosen) {
      const txt = s[0].toFixed(1), wTxt = textWidth(txt, 9.6);
      const px = ax.px(s[0]), topY = ax.py(100 * s[1] / nl);
      let choice = null;
      for (const [dx, dyy] of [[0, 0], [-wTxt * 0.62, 0], [wTxt * 0.62, 0], [-wTxt * 0.62, -2], [wTxt * 0.62, -2], [0, -10.6], [-wTxt * 0.8, 4.8], [wTxt * 0.8, 4.8]]) {
        const cx = px + dx, by = topY - 3.4 + dyy;
        const box = [cx - wTxt / 2 - 1, by - 8.6, cx + wTxt / 2 + 1, by + 1];
        if (box[0] < x0 + 1.4 || box[2] > x1 - 1.4 || box[1] < y0) continue;
        if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
        if (tall.some(([tx, ty]) => box[0] < tx && tx < box[2] && ty < box[3] && Math.abs(tx - px) > 0.5)) continue;
        choice = [cx, by, box];
        break;
      }
      if (!choice) { const cx = px, by = topY - 3.4; choice = [cx, by, [cx - wTxt / 2, by - 8.6, cx + wTxt / 2, by + 1]]; }
      placed.push(choice[2]);
      fig.text(choice[0], choice[1], txt, { size: 9.6, anchor: 'mb' });
    }
  });
  fig.text(17.3, (top + (H - 52 + top)) / 2, 'Relative abundance (%)', { size: 11, anchor: 'mm', rot: 90 });
  fig.text((x0 + x1) / 2, H - 52 + 26.9, 'm/z', { size: 11, anchor: 'mm' });
  return fig.svg();
}

// 小張的 TIC 層析圖(給選掃描範圍用)。scans: [{num, time, tic}];sel: [a, z]
export function ticStrip(scans, sel, w = 300, h = 44) {
  const fig = new Fig(w, h);
  fig.parts.length = 0;
  if (!scans.length) return fig.svg();
  const tmax = Math.max(...scans.map(s => s.tic), 1e-9);
  const n0 = scans[0].num, n1 = scans[scans.length - 1].num;
  const px = num => 2 + (num - n0) / Math.max(n1 - n0, 1) * (w - 4);
  if (sel) fig.rect(px(sel[0]), 1, Math.max(px(sel[1]) - px(sel[0]), 1), h - 2, { fill: '#D9F2E6' });
  const pts = scans.map(s => [px(s.num), h - 2 - s.tic / tmax * (h - 6)]);
  fig.poly([pts], { w: 0.8, color: '#000', cap: 'butt' });
  const body = fig.parts.join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none" font-family='${FONT}'><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`;
}
