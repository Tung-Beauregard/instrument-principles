// 馬鞍形電場的平面示意:四極柱與離子阱共用(gc-ms/、mass-analyzers/ 引用)。
// 電極之間的電場畫成一張會翻轉的網格曲面:對帶正電的離子來說,高的地方把它推開、低的地方讓它滑過去,
// 和把球放在馬鞍上一樣。球照 Mathieu 方程式一步一步算,不是事先畫好的路徑:翻得太慢、離子太輕或太重,球就真的滑出去。
// 翻轉放慢到每秒 1.6 次(太慢的一段每秒 0.42 次),和 lcq/ 第 07 段相同;真實儀器每秒翻轉幾十萬到上百萬次。
//
// 用法:
//   const demo = createSaddleDemo('trap' | 'quad', { ions, cues, font, colors });
//   demo.seek(t)      從頭算到第 t 秒(固定步長:同一個 t 永遠得到同一個畫面)
//   demo.advance(dt)  往後算 dt 秒(到結尾就停在最後一格)
//   demo.draw(ctx, { bare })  畫在 600 × 340 的虛擬座標裡,呼叫端先設好縮放;bare 只畫曲面與球(海報用)
//   demo.cueAt(t)     這一刻的說明文字;demo.dur 總長(秒);demo.marks 各段開始的秒數
// 這支檔案只用 2D 畫布,不需要 three.js。

const TAU = Math.PI * 2;
export const OM_FAST = TAU * 1.6; // 翻得夠快的角頻率(每秒 1.6 次)
export const OM_SLOW = TAU * 0.42; // 翻得太慢
export const Q_EJECT = 0.908; // 離子阱(只有交流電壓,a = 0)的穩定邊界
// 四極柱的掃描線 a = 0.3 q(直流 ÷ 交流的比例固定):第一穩定區在這條線上的範圍,用 Mathieu 特徵曲線算出
export const AQ = 0.3;
export const QWIN = [0.625, 0.725];
const QREF = (QWIN[0] + QWIN[1]) / 2; // 要的那種離子落在窗口正中間
const H = 1 / 600; // 積分步長(秒)
const FRAME = 1 / 60; // seek 時一格的長度

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

const DEF_COLORS = {
  ink: '#eaf3f6', ink2: '#a8bcc6', muted: '#71858f', lo: [41, 140, 255], hi: [255, 133, 56],
  push: '#5dffb0', pull: '#ffc261', plus: '#ff8a6b', minus: '#6fb3ff', zero: '#71858f', win: 'rgba(93,255,176,.16)', winLine: '#5dffb0',
};

// ---------- 兩種腳本 ----------
// 每顆離子用 rel(m/z 和參考離子的比)決定反應快慢:同樣的電場,越輕的 q 越大
const TRAP_CUES = [
  [0, '離子阱裡的電場像一個馬鞍:一個方向往中間推,另一個方向往外拉。把球放在不動的馬鞍上,它一定會滾下去。'],
  [6, '讓馬鞍翻來翻去,剛剛往外拉的方向就變成往中間推。可是翻得太慢,球在翻過來之前就滾遠了。'],
  [12, '翻得夠快,球還沒滾遠就被推回來,離子就這樣被關在中間。真正的離子阱每秒翻轉幾十萬次。'],
  [16.5, '平均下來,離子就像待在碗底。圖上的碗是翻轉的平均效果,不是真的有一個碗。'],
  [20, '同樣的翻轉速度,越輕的離子反應越快。太輕的(橙色)越擺越大,一樣留不住,所以離子阱關得住的 m/z 有下限。'],
  [26, '量的時候把電壓慢慢調高:每顆球都被推得更用力,最輕的先撐不住,沿著軸向被甩出去打到偵測器,接著是下一種。依序打到偵測器的順序,就排成一張質譜。'],
];
const QUAD_CUES = [
  [0, '四根桿子之間的電場像一個馬鞍:一個方向往中間推,另一個方向往外拉。不動的話,球一定會滾下去。'],
  [5, '桿子上的電壓快速正負交替,馬鞍跟著翻來翻去。翻得夠快,球還沒滾遠就被推回來,離子就能沿著中間一路往前走。'],
  [11, '再加上一個不變的直流電壓,馬鞍往一邊偏。這時只有一種 m/z 留得住:太輕的跟著翻轉越擺越大,被甩出去;太重的反應太慢,被直流慢慢拉走。'],
  [22, '把兩種電壓按固定比例一起調高,留得住的 m/z 就往上換:輕的先通過,接著是下一種。一路掃過去,每種 m/z 輪流穿過、打到偵測器,就量出一張質譜。'],
];

function trapScript(ions) {
  // ions:[主角, 較重, 太輕, 掃描用 ×3](沒給就用預設的標籤)
  const I = (i, d) => Object.assign({}, d, ions && ions[i]);
  const main = I(0, { mz: 195, label: 'm/z 195', color: '#74e4ff', ld: [1, -1] });
  const heavy = I(1, { mz: 350, label: 'm/z 350', color: '#5dffb0', ld: [1, 1] });
  const light = I(2, { mz: 76, label: 'm/z 76', color: '#ffc261', ld: [-1, -1] });
  const scan = [I(3, { mz: 130, label: 'm/z 130', color: '#ffc261', ld: [-1, -1] }), I(4, { mz: 165, label: 'm/z 165', color: '#74e4ff', ld: [1, -1] }), I(5, { mz: 205, label: 'm/z 205', color: '#5dffb0', ld: [1, 1] })];
  const Q_MAIN = 0.45;
  // 掃描用的三顆依 m/z 換算 q(最輕的 0.66);電壓每秒調高 14%,最輕的約 3 秒後越過 0.908
  const qs = scan.map((o) => 0.66 * scan[0].mz / o.mz);
  return {
    kind: 'trap', dur: 38, marks: [0, 6, 12, 16.5, 20, 26], scanIons: scan,
    setup(sim) { sim.addIon('main', main, Q_MAIN, 0.05, 0.22); },
    direct(sim, t) {
      const P = sim.P;
      P.mix = t < 16.5 ? 0 : t < 20 ? smooth(16.5, 17.6, t) * (1 - smooth(19, 20, t)) : 0;
      P.damp = t >= 26 ? 0.1 : t >= 12 ? 0.22 : 0;
      P.s = t < 26 ? 1 : 1 + 0.14 * (t - 26);
      if (t < 6) { P.omega = 0; P.status = '電場不動'; sim.respawn = { main: [0.05, 0.22] }; }
      else if (t < 12) { P.omega = OM_SLOW; P.status = '翻轉:太慢'; sim.respawn = { main: [0.06, 0.2] }; }
      else if (t < 20) { P.omega = OM_FAST; P.status = t < 16.5 ? '翻轉:夠快' : '翻轉:夠快(平均像一個碗)'; sim.respawn = { main: [0.3, 0.32] }; }
      else if (t < 26) { P.omega = OM_FAST; P.status = '太輕的留不住'; sim.respawn = { light: [0.12, 0.1] }; }
      else { P.omega = OM_FAST; P.status = '電壓慢慢調高'; sim.respawn = {}; }
      sim.once(6, () => sim.place('main', 0.06, 0.2));
      sim.once(12, () => sim.place('main', 0.3, 0.32));
      sim.once(20, () => { sim.addIon('heavy', heavy, Q_MAIN * main.mz / heavy.mz, -0.18, 0.25); sim.addIon('light', light, Q_MAIN * main.mz / light.mz, 0.12, 0.1); });
      sim.once(26, () => {
        sim.clearIons();
        scan.forEach((o, i) => sim.addIon('s' + i, o, qs[i], [0.1, -0.12, 0.05][i], [0.08, 0.1, -0.14][i]));
        sim.detect = true;
      });
    },
  };
}

function quadScript(ions) {
  const I = (i, d) => Object.assign({}, d, ions && ions[i]);
  const light = I(0, { mz: 77, label: 'm/z 77', color: '#ffc261', ld: [-1, -1] });
  const main = I(1, { mz: 93, label: 'm/z 93', color: '#74e4ff', ld: [1, -1] });
  const heavy = I(2, { mz: 136, label: 'm/z 136', color: '#5dffb0', ld: [1, 1] });
  const q = (o) => QREF * main.mz / o.mz;
  return {
    kind: 'quad', dur: 36, marks: [0, 5, 11, 22], ions: [light, main, heavy],
    setup(sim) { sim.addIon('main', main, q(main), 0.05, 0.22); },
    direct(sim, t) {
      const P = sim.P;
      P.dc = t < 11 ? 0 : smooth(11, 12.5, t);
      P.s = t < 22 ? 1 : lerp(0.74, 1.62, clamp((t - 22) / 14, 0, 1));
      P.omega = t < 5 ? 0 : OM_FAST;
      P.status = t < 5 ? '電場不動' : t < 11 ? '只有交流電壓:翻來翻去' : t < 22 ? '加上直流電壓:只留一種 m/z' : '兩種電壓一起調高';
      P.win = t >= 11;
      sim.respawn = t < 5 ? { main: [0.05, 0.22] } : t < 11 ? { main: [0.18, 0.14] } : { light: [0.06, 0.05], main: [0.05, -0.06], heavy: [-0.06, 0.05] };
      sim.once(5, () => sim.place('main', 0.18, 0.14));
      sim.once(11, () => { sim.place('main', 0.05, -0.06); sim.addIon('light', light, q(light), 0.06, 0.05); sim.addIon('heavy', heavy, q(heavy), -0.06, 0.05); });
    },
  };
}

// ---------- 模擬 ----------
class Sim {
  constructor(script, seed) {
    this.script = script; this.seed = seed; this.reset();
  }
  reset() {
    this.t = 0; this.phi = 0; this.ions = []; this.done = new Set(); this.respawn = {}; this.detect = false; this.hits = []; this.r = rng(this.seed);
    this.P = { omega: 0, s: 1, dc: 0, mix: 0, damp: 0, status: '', win: false };
    this.script.setup(this);
  }
  once(at, fn) { if (this.t >= at - 1e-9 && !this.done.has(at)) { this.done.add(at); fn(); } }
  addIon(id, o, q0, u, w) { this.ions = this.ions.filter((i) => i.id !== id); this.ions.push({ id, o, q0, u, w, vu: 0, vw: 0, st: 'in', k: 0, trail: [] }); }
  clearIons() { for (const i of this.ions) if (i.st === 'in') { i.st = 'fade'; i.k = 0; } }
  place(id, u, w) { const i = this.ions.find((x) => x.id === id); if (i) Object.assign(i, { u, w, vu: 0, vw: 0, st: 'in', k: 0, trail: [] }); }
  // 這顆離子此刻的 q 與 a(參考的是「夠快」的翻轉頻率;電壓固定時,翻得慢 q 就變大,和真的一樣)
  qa(ion) {
    const q = ion.q0 * this.P.s;
    return [q, this.script.kind === 'quad' ? AQ * q * this.P.dc : 0];
  }
  accel(ion, u, w, c) {
    const [q, a] = this.qa(ion), K = OM_FAST * OM_FAST;
    if (this.script.kind === 'quad') {
      const f = K / 4 * a - K / 2 * q * c; // 桿子 x 那一對:直流往中間推,交流一下推一下拉
      return [-f * u, f * w];
    }
    // 離子阱(環電極加交流、端蓋接地):軸向(u)的力是徑向(w)的兩倍,方向相反
    return [K / 2 * q * c * u, -K / 4 * q * c * w];
  }
  step(dt) {
    let n = Math.max(1, Math.round(dt / H));
    const h = dt / n;
    for (; n > 0; n--) {
      this.script.direct(this, this.t);
      const P = this.P;
      this.phi += P.omega * h;
      const c = Math.cos(this.phi);
      for (const ion of this.ions) {
        if (ion.st !== 'in') continue;
        const [au, aw] = this.accel(ion, ion.u, ion.w, c);
        ion.vu += (au - P.damp * ion.vu) * h; ion.vw += (aw - P.damp * ion.vw) * h;
        ion.u += ion.vu * h; ion.w += ion.vw * h;
        if (Math.abs(ion.u) > 1 || Math.abs(ion.w) > 1) {
          ion.st = 'out'; ion.k = 0;
          const sp = Math.hypot(ion.vu, ion.vw) || 1, cap = Math.min(1, 1.6 / sp);
          ion.vu *= cap; ion.vw *= cap;
          if (this.detect && Math.abs(ion.u) > 1) this.hits.push({ t: this.t, mz: ion.o.mz, color: ion.o.color, side: Math.sign(ion.u) });
        }
      }
      for (const ion of this.ions) {
        if (ion.st === 'out') {
          ion.k += h; ion.u += ion.vu * h; ion.w += ion.vw * h;
          if (ion.k > 0.7) { ion.st = 'wait'; ion.k = 0; }
        } else if (ion.st === 'wait') {
          ion.k += h;
          const at = this.respawn[ion.id];
          if (at && ion.k > 0.45) {
            const j = 0.04;
            Object.assign(ion, { u: at[0] + (this.r() - 0.5) * j, w: at[1] + (this.r() - 0.5) * j, vu: 0, vw: 0, st: 'in', k: 0, trail: [] });
          }
        } else if (ion.st === 'fade') ion.k += h;
      }
      this.ions = this.ions.filter((i) => !(i.st === 'fade' && i.k > 0.6));
      this.t += h;
    }
    // 軌跡:每一格記一點
    for (const ion of this.ions) { if (ion.st === 'in') { ion.trail.push(ion.u, ion.w); if (ion.trail.length > 80) ion.trail.splice(0, 2); } }
  }
}

// ---------- 畫圖 ----------
const VW = 600, VH = 340;
const CAM = { cx: 300, cy: 160, yaw: -0.68, pitch: 0.6, dist: 4.4, f: 520, hs: 1.3 };

export function createSaddleDemo(kind, opts = {}) {
  const script = kind === 'trap' ? trapScript(opts.ions) : quadScript(opts.ions);
  const cues = opts.cues || (kind === 'trap' ? TRAP_CUES : QUAD_CUES);
  const font = opts.font || '"Noto Sans TC", system-ui, sans-serif';
  const C = Object.assign({}, DEF_COLORS, opts.colors);
  const sim = new Sim(script, opts.seed || 7);
  const N = 14, verts = new Float32Array((N + 1) * (N + 1) * 4);
  const cy = Math.cos(CAM.yaw), sy = Math.sin(CAM.yaw), cp = Math.cos(CAM.pitch), sp = Math.sin(CAM.pitch);

  // 曲面高度:四極柱 (直流 − 交流) × (u² − w²);離子阱 交流 × (w² − 2u²) ÷ 2,和平均的碗混合
  function height(u, w) {
    const P = sim.P, c = Math.cos(sim.phi);
    const vs = 1 + 0.45 * (P.s - 1);
    if (kind === 'quad') return 0.29 * vs * (AQ / 2 * P.dc - c) * (u * u - w * w);
    const sad = 0.36 * vs * c * (w * w - 2 * u * u) / 2, bowl = 0.3 * (u * u + w * w / 4);
    return lerp(sad, bowl, P.mix);
  }
  function proj(u, w, h, out) {
    const X = u * cy - w * sy, Z = u * sy + w * cy, Y = h * CAM.hs;
    const yv = Y * cp - Z * sp, zv = CAM.dist - (Y * sp + Z * cp);
    out[0] = CAM.cx + CAM.f * X / zv; out[1] = CAM.cy - CAM.f * yv / zv; out[2] = zv;
    return out;
  }
  const tmp = [0, 0, 0], tmp2 = [0, 0, 0];
  function col(k, a) {
    const r = Math.round(lerp(C.lo[0], C.hi[0], k)), g = Math.round(lerp(C.lo[1], C.hi[1], k)), b = Math.round(lerp(C.lo[2], C.hi[2], k));
    return `rgba(${r},${g},${b},${a})`;
  }
  function text(c, s, x, y, o = {}) {
    c.font = `${o.weight || 600} ${o.size || 15}px ${font}`; c.fillStyle = o.color || C.ink2; c.textAlign = o.align || 'left'; c.textBaseline = 'middle'; c.fillText(s, x, y);
  }
  function arrow(c, x0, y0, x1, y1, color, w = 2.2) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = 8;
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = w;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(a) * L * 0.6, y1 - Math.sin(a) * L * 0.6); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - L * Math.cos(a - 0.5), y1 - L * Math.sin(a - 0.5)); c.lineTo(x1 - L * Math.cos(a + 0.5), y1 - L * Math.sin(a + 0.5)); c.closePath(); c.fill();
  }

  function drawSurface(c) {
    let hmax = 1e-6;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const u = -1 + 2 * i / N, w = -1 + 2 * j / N, h = height(u, w), k = (i * (N + 1) + j) * 4;
      proj(u, w, h, tmp); verts[k] = tmp[0]; verts[k + 1] = tmp[1]; verts[k + 2] = tmp[2]; verts[k + 3] = h;
      hmax = Math.max(hmax, Math.abs(h));
    }
    const scale = Math.max(hmax, 0.12);
    const quads = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const a = (i * (N + 1) + j) * 4, b = a + 4, d = a + (N + 1) * 4, e = d + 4;
      quads.push([verts[a + 2] + verts[b + 2] + verts[d + 2] + verts[e + 2], a, b, e, d]);
    }
    quads.sort((p, q) => q[0] - p[0]);
    for (const [, a, b, e, d] of quads) {
      const h = (verts[a + 3] + verts[b + 3] + verts[d + 3] + verts[e + 3]) / 4, k = clamp(0.5 + 0.5 * h / scale, 0, 1);
      c.fillStyle = col(k, 0.2);
      c.beginPath(); c.moveTo(verts[a], verts[a + 1]); c.lineTo(verts[b], verts[b + 1]); c.lineTo(verts[e], verts[e + 1]); c.lineTo(verts[d], verts[d + 1]); c.closePath(); c.fill();
    }
    // 網格線:遠的淡、近的亮
    c.lineWidth = 1.1;
    for (let dir = 0; dir < 2; dir++) for (let i = 0; i <= N; i++) {
      for (let j = 0; j < N; j++) {
        const p = (dir ? (j * (N + 1) + i) : (i * (N + 1) + j)) * 4, q = (dir ? ((j + 1) * (N + 1) + i) : (i * (N + 1) + j + 1)) * 4;
        const h = (verts[p + 3] + verts[q + 3]) / 2, k = clamp(0.5 + 0.5 * h / scale, 0, 1), depth = (verts[p + 2] + verts[q + 2]) / 2;
        const edge = i === 0 || i === N;
        c.strokeStyle = col(k, clamp((edge ? 0.95 : 0.62) * (1.25 - (depth - (CAM.dist - 1.4)) / 2.8), 0.18, 0.95));
        c.beginPath(); c.moveTo(verts[p], verts[p + 1]); c.lineTo(verts[q], verts[q + 1]); c.stroke();
      }
    }
  }
  // 四個方向的箭頭:往中間推(綠)或往外拉(橙),跟著翻轉
  function drawArrows(c) {
    const P = sim.P, cc = Math.cos(sim.phi);
    let cu, cw;
    if (kind === 'quad') { cu = AQ / 2 * P.dc - cc; cw = -cu; } else { cu = lerp(-cc, 1, P.mix); cw = lerp(cc / 2, 0.25, P.mix); }
    for (const [u, w, cv] of [[1, 0, cu], [-1, 0, cu], [0, 1, cw], [0, -1, cw]]) {
      const m = Math.min(1, Math.abs(cv)); if (m < 0.08) continue;
      const inward = cv > 0, r0 = inward ? 1.3 : 1.08, r1 = inward ? 1.08 : 1.3;
      proj(u * r0, w * r0, height(u, w), tmp); proj(u * r1, w * r1, height(u, w), tmp2);
      c.globalAlpha = 0.35 + 0.65 * m; arrow(c, tmp[0], tmp[1], tmp2[0], tmp2[1], inward ? C.push : C.pull); c.globalAlpha = 1;
    }
  }
  // 電極:四極柱是四根桿子的截面(正負跟著翻);離子阱是環電極(加交流)與兩片端蓋(接地)
  function drawElectrodes(c) {
    const P = sim.P, cc = Math.cos(sim.phi);
    const sign = (v) => (Math.abs(v) < 0.12 ? 0 : Math.sign(v));
    const items = kind === 'quad'
      ? [[1.5, 0, sign(AQ / 2 * P.dc - cc)], [-1.5, 0, sign(AQ / 2 * P.dc - cc)], [0, 1.5, -sign(AQ / 2 * P.dc - cc)], [0, -1.5, -sign(AQ / 2 * P.dc - cc)]]
      : [[0, 1.5, sign(cc)], [0, -1.5, sign(cc)], [1.5, 0, 0], [-1.5, 0, 0]];
    for (const [u, w, sg] of items) {
      proj(u, w, 0, tmp);
      if (kind === 'trap' && w === 0) {
        // 端蓋:接地的金屬板
        proj(u, -0.32, 0, tmp2); const x0 = tmp2[0], y0 = tmp2[1]; proj(u, 0.32, 0, tmp2);
        c.strokeStyle = C.zero; c.lineWidth = 5 * CAM.dist / tmp[2]; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(tmp2[0], tmp2[1]); c.stroke(); c.lineCap = 'butt';
        continue;
      }
      const r = 11 * CAM.dist / tmp[2], colr = sg > 0 ? C.plus : sg < 0 ? C.minus : C.zero;
      c.fillStyle = colr; c.globalAlpha = 0.85;
      c.beginPath(); c.arc(tmp[0], tmp[1], r, 0, TAU); c.fill(); c.globalAlpha = 1;
      text(c, sg > 0 ? '+' : sg < 0 ? '−' : '0', tmp[0], tmp[1] + 0.5, { color: '#0b1220', size: 15, weight: 800, align: 'center' });
    }
  }
  function drawIons(c, bare) {
    const list = [];
    for (const ion of sim.ions) {
      if (ion.st === 'wait') continue;
      let h = height(clamp(ion.u, -1, 1), clamp(ion.w, -1, 1)), a = 1;
      if (ion.st === 'out') { h -= 1.6 * ion.k * ion.k; a = 1 - ion.k / 0.7; }
      if (ion.st === 'fade') a = 1 - ion.k / 0.6;
      proj(ion.u, ion.w, h + 0.06, tmp);
      list.push([tmp[2], tmp[0], tmp[1], ion, clamp(a, 0, 1)]);
    }
    list.sort((p, q) => q[0] - p[0]);
    // 只有一顆球時標在球旁邊;好幾顆時改看角落的圖例(或底下的 m/z 尺),標籤才不會疊在一起
    const solo = list.length === 1;
    for (const [z, x, y, ion, a] of list) {
      // 軌跡
      if (!bare && ion.trail.length > 4 && ion.st === 'in') {
        c.lineWidth = 1.6;
        const n = ion.trail.length / 2;
        for (let k = 1; k < n; k++) {
          const u0 = ion.trail[2 * k - 2], w0 = ion.trail[2 * k - 1], u1 = ion.trail[2 * k], w1 = ion.trail[2 * k + 1];
          proj(u0, w0, height(u0, w0) + 0.06, tmp); proj(u1, w1, height(u1, w1) + 0.06, tmp2);
          c.strokeStyle = ion.o.color; c.globalAlpha = 0.5 * (k / n) * a;
          c.beginPath(); c.moveTo(tmp[0], tmp[1]); c.lineTo(tmp2[0], tmp2[1]); c.stroke();
        }
        c.globalAlpha = 1;
      }
      const r = 8.5 * CAM.dist / z;
      c.globalAlpha = a * 0.3; c.fillStyle = ion.o.color; c.beginPath(); c.arc(x, y, r * 2.1, 0, TAU); c.fill();
      c.globalAlpha = a;
      const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, ion.o.color); g.addColorStop(1, ion.o.color);
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
      c.globalAlpha = 1;
      if (!bare && solo && ion.o.label && a > 0.3) {
        const [lx, ly] = ion.o.ld || [1, -1];
        c.globalAlpha = a; text(c, ion.o.label, x + lx * (r + 5), y + ly * (r + 5), { color: ion.o.color, size: 13.5, weight: 700, align: lx < 0 ? 'right' : 'left' }); c.globalAlpha = 1;
      }
    }
  }
  // 好幾顆球、又沒有 m/z 尺或偵測器圖時,右上角列出顏色對應的 m/z
  function drawLegend(c) {
    if (sim.P.win || sim.detect) return;
    const ions = sim.ions.filter((i) => i.st !== 'fade').map((i) => i.o).sort((a, b) => a.mz - b.mz);
    if (ions.length < 2) return;
    ions.forEach((o, k) => {
      const y = 26 + k * 22;
      c.fillStyle = o.color; c.beginPath(); c.arc(500, y, 5.5, 0, TAU); c.fill();
      text(c, o.label, 512, y + 0.5, { color: o.color, size: 13.5, weight: 700 });
    });
  }
  // 四極柱:底下的 m/z 尺,亮的那一段是此刻穿得過的範圍
  function drawWindow(c) {
    const P = sim.P; if (!P.win) return;
    const ions = script.ions, lo = ions[0].mz * 0.72, hi = ions[2].mz * 1.22, X0 = 330, X1 = 578, Y = 304;   // 底下的 m/z 數字要留在 340 以內
    const xOf = (m) => X0 + (X1 - X0) * (Math.log(m / lo) / Math.log(hi / lo));
    // 窗口:q 落在 QWIN 裡的 m/z(q = QREF × 參考 m/z × s ÷ m/z)
    const ref = ions[1].mz, m0 = QREF * ref * P.s / QWIN[1], m1 = QREF * ref * P.s / QWIN[0];
    const a = smooth(0, 1, P.dc);
    c.globalAlpha = a;
    c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X0, Y); c.lineTo(X1, Y); c.stroke();
    const xa = clamp(xOf(m0), X0, X1), xb = clamp(xOf(m1), X0, X1);
    if (xb > xa) { c.fillStyle = C.win; c.fillRect(xa, Y - 13, xb - xa, 26); c.strokeStyle = C.winLine; c.lineWidth = 1.4; c.strokeRect(xa, Y - 13, xb - xa, 26); }
    for (const o of ions) {
      const x = xOf(o.mz), inside = o.mz >= m0 && o.mz <= m1;
      c.fillStyle = o.color; c.beginPath(); c.arc(x, Y, inside ? 5.5 : 3.8, 0, TAU); c.fill();
      text(c, String(o.mz), x, Y + 20, { color: inside ? C.ink : C.muted, size: 12.5, weight: inside ? 800 : 600, align: 'center' });
    }
    text(c, '穿得過的 m/z', X0, Y - 22, { color: C.winLine, size: 12.5, weight: 700 });
    c.globalAlpha = 1;
  }
  // 離子阱掃描:打到偵測器的離子依序排成譜
  function drawHits(c) {
    if (!sim.detect) return;
    const X0 = 474, X1 = 588, Y0 = 84, Hh = 40;
    c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X0, Y0); c.lineTo(X1, Y0); c.stroke();
    text(c, '偵測器收到的順序', X1, Y0 - Hh - 12, { color: C.ink2, size: 12.5, weight: 700, align: 'right' });
    const all = script.scanIons.map((o) => o.mz), lo = Math.min(...all), hi = Math.max(...all);
    for (const o of script.scanIons) text(c, String(o.mz), lerp(X0 + 16, X1 - 16, (o.mz - lo) / (hi - lo)), Y0 + 13, { color: o.color, size: 12, weight: 700, align: 'center' });
    for (const m of new Set(sim.hits.map((h) => h.mz))) {
      const h = sim.hits.find((x) => x.mz === m), x = lerp(X0 + 16, X1 - 16, (m - lo) / (hi - lo));
      const k = clamp((sim.t - h.t) / 0.4, 0, 1);
      c.fillStyle = h.color; c.fillRect(x - 5, Y0 - Hh * k, 10, Hh * k);
    }
    // 偵測器:沿軸向(u)的兩端
    for (const s of [1, -1]) {
      proj(1.75 * s, 0, 0, tmp);
      c.fillStyle = 'rgba(160,190,205,.55)'; c.fillRect(tmp[0] - 3, tmp[1] - 14, 6, 28);
      const hit = sim.hits.filter((h) => h.side === s && sim.t - h.t < 0.6).pop();
      if (hit) { const k = (sim.t - hit.t) / 0.6; c.globalAlpha = 1 - k; c.strokeStyle = hit.color; c.lineWidth = 2.4; c.beginPath(); c.arc(tmp[0], tmp[1], 6 + 22 * k, 0, TAU); c.stroke(); c.globalAlpha = 1; }
    }
    proj(1.75, 0, 0, tmp); text(c, '偵測器', tmp[0], tmp[1] + 26, { color: C.ink2, size: 12.5, align: 'center' });
  }

  return {
    kind, dur: script.dur, marks: script.marks,
    get t() { return sim.t; },
    seek(t) {
      t = clamp(t, 0, script.dur);
      if (t < sim.t - 1e-6) sim.reset();
      while (sim.t < t - 1e-6) sim.step(Math.min(FRAME, t - sim.t));
    },
    advance(dt) { const to = Math.min(script.dur, sim.t + dt); while (sim.t < to - 1e-6) sim.step(Math.min(FRAME, to - sim.t)); },
    reset() { sim.reset(); },
    cueAt(t) { let s = cues[0][1]; for (const [at, txt] of cues) if (t >= at) s = txt; return s; },
    cueIndex(t) { let k = 0; cues.forEach(([at], i) => { if (t >= at) k = i; }); return k; },
    cues,
    status() { return sim.P.status; },
    draw(c, o = {}) {
      drawSurface(c);
      if (!o.bare) { drawArrows(c); drawElectrodes(c); }
      drawIons(c, o.bare);
      if (!o.bare) {
        drawWindow(c); drawLegend(c); if (kind === 'trap') drawHits(c);
        text(c, sim.P.status, 22, 22, { color: '#74e4ff', size: 17, weight: 800 });
        // 圖例
        c.fillStyle = C.push; c.fillRect(22, 318, 14, 3); text(c, '往中間推', 42, 319.5, { size: 12.5 });
        c.fillStyle = C.pull; c.fillRect(110, 318, 14, 3); text(c, '往外拉', 130, 319.5, { size: 12.5 });
      }
    },
  };
}

// 給檢查腳本用:不畫圖,只跑物理
export function _simFor(kind, ions) { return new Sim(kind === 'trap' ? trapScript(ions) : quadScript(ions), 7); }
