// 生化原理教材共用的畫圖小工具(2026-10-26):DNA 單股與雙股、酵素、試管、箭頭、標籤、座標軸、曲線。
// 全部畫在 2D canvas 上,座標用播放器給的邏輯座標(預設 960 × 540),不管實際螢幕多大。
// 顏色:鹼基四色加字母(色弱也看得出來),新合成的股用薄荷綠,酵素用淡紫,引子用琥珀色。

export const FONT = '"Segoe UI","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif';
export const MONO = '"Cascadia Mono","Consolas","IBM Plex Mono",ui-monospace,monospace';
export const C = {
  bg: '#0f1716', panel: '#15201e', line: '#2b3b36', ink: '#f0f3ee', ink2: '#b9c7c0', muted: '#7d8f88',
  mint: '#a5f3cd', mintDim: '#4f8f74', amber: '#ffd166', lav: '#b8a4f4', red: '#ff7b7b', blue: '#7fb8ff',
  backbone: '#d5ddd9', hot: '#ff9a5c', cold: '#7fc8ff',
  A: '#5fd39a', T: '#f2a65a', G: '#f0718a', C: '#6fb2f5', U: '#e8cf5a', N: '#8a9a94',
};
export const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G', U: 'A', N: 'N' };
export const RNA_PAIR = { A: 'U', T: 'A', G: 'C', C: 'G', U: 'A', N: 'N' };

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const ease = (k) => { k = clamp(k); return k * k * (3 - 2 * k); };
// 0 到 1:時間 t 從 a 走到 b 的進度(之前是 0、之後是 1)
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const complement = (seq, rna = false) => [...seq].map((b) => (rna ? RNA_PAIR : PAIR)[b] || 'N').join('');

export function makeG(ctx, W, H) {
  // boost:畫面縮得很小時(手機),播放器把字放大一點(最多 1.3 倍),版面要留得下
  const g = { ctx, W, H, boost: 1 };
  g.font = (size, weight = 500, mono = false) => { ctx.font = `${weight} ${size * g.boost}px ${mono ? MONO : FONT}`; };
  g.text = (x, y, s, { size = 16, weight = 500, color = C.ink, align = 'left', base = 'middle', mono = false, alpha = 1, max } = {}) => {
    ctx.save(); ctx.globalAlpha *= alpha; g.font(size, weight, mono); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
    if (max) ctx.fillText(s, x, y, max); else ctx.fillText(s, x, y);
    ctx.restore();
  };
  // 帶底色的小標籤
  g.tag = (x, y, s, { size = 14, color = C.ink, bg = 'rgba(15,23,22,.88)', border = C.line, align = 'center', alpha = 1, pad = 7 } = {}) => {
    ctx.save(); ctx.globalAlpha *= alpha; g.font(size, 600);
    const w = ctx.measureText(s).width + pad * 2, h = size * g.boost + pad * 1.2;
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    g.rrect(x0, y - h / 2, w, h, h / 2, bg, border);
    ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x0 + pad, y + 0.5);
    ctx.restore();
    return w;
  };
  g.rrect = (x, y, w, h, r, fill, stroke, lw = 1.5) => {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
  };
  g.circle = (x, y, r, fill, stroke, lw = 1.5) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
  };
  g.line = (x1, y1, x2, y2, color = C.ink2, lw = 2, dash) => {
    ctx.save(); ctx.beginPath(); if (dash) ctx.setLineDash(dash); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  };
  g.arrow = (x1, y1, x2, y2, { color = C.mint, lw = 2.5, head = 9, alpha = 1, dash } = {}) => {
    ctx.save(); ctx.globalAlpha *= alpha;
    const a = Math.atan2(y2 - y1, x2 - x1);
    g.line(x1, y1, x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6, color, lw, dash);
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.45), y2 - head * Math.sin(a - 0.45));
    ctx.lineTo(x2 - head * Math.cos(a + 0.45), y2 - head * Math.sin(a + 0.45));
    ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  };
  // 一個鹼基:圓角方塊加字母。dir = 1 朝下(上面那一股),-1 朝上(下面那一股)
  g.base = (x, y, b, { w = 16, h = 22, dir = 1, alpha = 1, letter = true, glow = false } = {}) => {
    ctx.save(); ctx.globalAlpha *= alpha;
    const col = C[b] || C.N;
    if (glow) { ctx.shadowColor = col; ctx.shadowBlur = 12; }
    g.rrect(x - w / 2, dir > 0 ? y : y - h, w, h, 4, col);
    ctx.shadowBlur = 0;
    // 鹼基方塊裡的字母不跟著放大(放大會撐出方塊)
    if (letter && w >= 12) { ctx.font = `700 ${Math.min(13, w * 0.8)}px ${FONT}`; ctx.fillStyle = '#0b1111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b, x, dir > 0 ? y + h * 0.55 : y - h * 0.55); }
    ctx.restore();
  };
  // 一股 DNA(或 RNA):骨架是一條線,鹼基一個一個掛在上面。x0 是第一個鹼基的位置,step 是間距
  g.strand = (x0, y, seq, { step = 20, dir = 1, color = C.backbone, lw = 4, alpha = 1, from = 0, to = seq.length, letter = true, bw, bh, ends } = {}) => {
    if (to <= from) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    const xa = x0 + from * step - step * 0.4, xb = x0 + (to - 1) * step + step * 0.4;
    g.line(xa, y, xb, y, color, lw);
    for (let i = from; i < to; i++) g.base(x0 + i * step, y + (dir > 0 ? lw / 2 : -lw / 2), seq[i], { w: bw || step * 0.72, h: bh || step * 1.05, dir, letter });
    // 5' 與 3' 端標示
    if (ends) {
      g.text(xa - 8, y, ends[0], { size: 12, color: C.muted, align: 'right', mono: true });
      g.text(xb + 8, y, ends[1], { size: 12, color: C.muted, align: 'left', mono: true });
    }
    ctx.restore();
  };
  // 酵素這類蛋白質:圓滾滾的一團,中間寫名字
  g.blob = (x, y, rx, ry, color, name, { alpha = 1, size = 14, wobble = 0, t = 0 } = {}) => {
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const k = 1 + wobble * (0.06 * Math.sin(a * 3 + t * 2) + 0.04 * Math.sin(a * 5 - t * 3));
      const px = x + Math.cos(a) * rx * k, py = y + Math.sin(a) * ry * k;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath();
    const gr = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 2, x, y, Math.max(rx, ry));
    gr.addColorStop(0, color); gr.addColorStop(1, shade(color, -0.35));
    ctx.fillStyle = gr; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.stroke();
    if (name) g.text(x, y, name, { size, weight: 700, color: '#0b1111', align: 'center' });
    ctx.restore();
  };
  // 試管:fill 是 0 到 1 的液面高度
  g.tube = (x, y, w, h, { liquid = 'rgba(165,243,205,.35)', fill = 0.6, label, color = C.ink2 } = {}) => {
    ctx.save();
    const r = w / 2;
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r, y + h - r); ctx.arc(x, y + h - r, r, Math.PI, 0, true); ctx.lineTo(x + r, y);
    ctx.save(); ctx.clip();
    ctx.fillStyle = liquid; ctx.fillRect(x - r, y + h * (1 - fill), w, h * fill + 2);
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke();
    g.line(x - r - 4, y, x + r + 4, y, color, 2);
    if (label) g.text(x, y + h + 16, label, { size: 13, color: C.ink2, align: 'center' });
    ctx.restore();
  };
  // 溫度計:value 在 lo 到 hi 之間
  g.thermo = (x, y, h, value, { lo = 20, hi = 100, label = true } = {}) => {
    const k = clamp((value - lo) / (hi - lo));
    const col = mix(C.cold, C.hot, k);
    g.rrect(x - 7, y, 14, h, 7, '#101a18', C.line);
    g.rrect(x - 4, y + h - 4 - (h - 8) * k, 8, (h - 8) * k + 2, 4, col);
    g.circle(x, y + h + 8, 11, col, C.line);
    if (label) g.text(x + 18, y + h - (h - 8) * k, `${Math.round(value)} °C`, { size: 15, weight: 700, color: col, mono: true });
  };
  // 座標軸:回傳把資料座標換成畫面座標的函式
  g.axes = (x, y, w, h, { xmin = 0, xmax = 1, ymin = 0, ymax = 1, xlab = '', ylab = '', xticks = [], yticks = [], ylog = false, fmtX = String, fmtY = String } = {}) => {
    const ly = (v) => (ylog ? Math.log10(v) : v);
    const X = (v) => x + ((v - xmin) / (xmax - xmin)) * w;
    const Y = (v) => y + h - ((ly(v) - ly(ymin)) / (ly(ymax) - ly(ymin))) * h;
    ctx.save();
    g.line(x, y + h, x + w, y + h, C.ink2, 1.6); g.line(x, y, x, y + h, C.ink2, 1.6);
    for (const v of xticks) { g.line(X(v), y + h, X(v), y + h + 5, C.ink2, 1.4); g.text(X(v), y + h + 16, fmtX(v), { size: 12, color: C.muted, align: 'center', mono: true }); }
    let tw = 0;
    for (const v of yticks) {
      g.line(x - 5, Y(v), x, Y(v), C.ink2, 1.4); g.line(x, Y(v), x + w, Y(v), 'rgba(255,255,255,.06)', 1);
      g.text(x - 9, Y(v), fmtY(v), { size: 12, color: C.muted, align: 'right', mono: true });
      g.font(12, 500, true); tw = Math.max(tw, ctx.measureText(fmtY(v)).width);
    }
    if (xlab) g.text(x + w / 2, y + h + 36, xlab, { size: 13, color: C.ink2, align: 'center' });
    // y 軸標題放在最寬的刻度字左邊(刻度字長或手機放大字時不會疊在一起)
    if (ylab) { ctx.save(); ctx.translate(x - Math.max(44, tw + 9 + 8 + 9 * g.boost), y + h / 2); ctx.rotate(-Math.PI / 2); g.text(0, 0, ylab, { size: 13, color: C.ink2, align: 'center' }); ctx.restore(); }
    ctx.restore();
    return { X, Y };
  };
  g.curve = (pts, color = C.mint, lw = 2.5, { alpha = 1, dash } = {}) => {
    if (pts.length < 2) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.beginPath(); if (dash) ctx.setLineDash(dash);
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  };
  // 帶標題的框(用來把畫面分區)
  g.panel = (x, y, w, h, title, { color = C.line } = {}) => {
    g.rrect(x, y, w, h, 12, 'rgba(21,32,30,.6)', color);
    if (title) g.text(x + 14, y + 18, title, { size: 13, weight: 700, color: C.ink2 });
  };
  return g;
}

// 顏色工具
export function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
  if (k < 0) { r *= 1 + k; gg *= 1 + k; b *= 1 + k; } else { r += (255 - r) * k; gg += (255 - gg) * k; b += (255 - b) * k; }
  return `rgb(${r | 0},${gg | 0},${b | 0})`;
}
export function mix(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
  const [r1, g1, b1] = ch(pa), [r2, g2, b2] = ch(pb);
  return `rgb(${Math.round(lerp(r1, r2, k))},${Math.round(lerp(g1, g2, k))},${Math.round(lerp(b1, b2, k))})`;
}
// 可重現的亂數(同一個種子每次畫出來一樣)
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
