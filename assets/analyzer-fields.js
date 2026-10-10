// 四種質量分析器的電場示意(gc-ms/、mass-analyzers/ 引用)。電場一律畫成「地形」:對帶正電的離子來說,
// 高的地方把它推開、低的地方讓它滑過去,和把球放在起伏的地面上一樣。
//  四極柱、離子阱:電極之間是一張會翻轉的馬鞍,球照 Mathieu 方程式一步一步算,翻得太慢、離子太輕或太重,球就真的滑出去。
//    翻轉放慢到每秒 1.6 次(太慢的一段每秒 0.42 次),和 lcq/ 第 07 段相同;真實儀器每秒翻轉幾十萬到上百萬次。
//  飛行時間:沿著飛行方向是陡坡(推斥區)、平地(飛行管)、上坡(反射鏡),球照牛頓運動定律一步一步算。
//  Orbitrap:紡錘把離子往內吸、繞著轉,沿著紡錘方向像一個碗,擺盪的頻率只看 m/z(用公式直接算)。
//
// 用法:
//   const demo = createFieldDemo('quad' | 'trap' | 'tof' | 'orb', { ions, cues, font, colors });
//   demo.seek(t)      從頭算到第 t 秒(固定步長:同一個 t 永遠得到同一個畫面)
//   demo.advance(dt)  往後算 dt 秒(到結尾就停在最後一格)
//   demo.draw(ctx, { bare })  畫在 600 × 340 的虛擬座標裡,呼叫端先設好縮放;bare 只畫地形與球(海報用)
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

function createSaddleDemo(kind, opts = {}) {
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

// ================= 飛行時間與 Orbitrap =================
// 共用:文字、箭頭、球、投影
function makeKit(opts) {
  const font = opts.font || '"Noto Sans TC", system-ui, sans-serif';
  const C = Object.assign({}, DEF_COLORS, opts.colors);
  const text = (c, s, x, y, o = {}) => {
    c.font = `${o.weight || 600} ${o.size || 15}px ${o.mono ? 'ui-monospace, Consolas, monospace' : font}`;
    c.fillStyle = o.color || C.ink2; c.textAlign = o.align || 'left'; c.textBaseline = 'middle'; c.fillText(s, x, y);
  };
  const arrow = (c, x0, y0, x1, y1, color, w = 2) => {
    const a = Math.atan2(y1 - y0, x1 - x0), L = 8;
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = w;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(a) * L * 0.6, y1 - Math.sin(a) * L * 0.6); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - L * Math.cos(a - 0.5), y1 - L * Math.sin(a - 0.5)); c.lineTo(x1 - L * Math.cos(a + 0.5), y1 - L * Math.sin(a + 0.5)); c.closePath(); c.fill();
  };
  const col = (k, a) => `rgba(${Math.round(lerp(C.lo[0], C.hi[0], k))},${Math.round(lerp(C.lo[1], C.hi[1], k))},${Math.round(lerp(C.lo[2], C.hi[2], k))},${a})`;
  const ball = (c, x, y, r, color, a = 1, ring = false) => {
    if (a <= 0.01) return;
    c.globalAlpha = a * 0.3; c.fillStyle = color; c.beginPath(); c.arc(x, y, r * 2.1, 0, TAU); c.fill();
    c.globalAlpha = a;
    const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, color); g.addColorStop(1, color);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    if (ring) { c.strokeStyle = '#ffffff'; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, r + 2.5, 0, TAU); c.stroke(); }
    c.globalAlpha = 1;
  };
  return { font, C, text, arrow, col, ball };
}
function projector(cam) {
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  return (u, w, h, out) => {
    const X = u * cy - w * sy, Z = u * sy + w * cy, Y = h * cam.hs;
    const yv = Y * cp - Z * sp, zv = cam.dist - (Y * sp + Z * cp);
    out[0] = cam.cx + cam.f * X / zv; out[1] = cam.cy - cam.f * yv / zv; out[2] = zv;
    return out;
  };
}
const cueAtOf = (cues) => (t) => { let s = cues[0][1]; for (const [at, txt] of cues) if (t >= at) s = txt; return s; };
const cueIndexOf = (cues) => (t) => { let k = 0; cues.forEach(([at], i) => { if (t >= at) k = i; }); return k; };

// ---------- 飛行時間 ----------
// 沿飛行方向 x(0 到 1)的電位,以推斥區的高度 V0 為 1:推斥區 [0, P] 從 1 線性降到 0,飛行管 [P, R0] 是 0,
// 反射鏡 [R0, 1] 線性升到 VR。這組長度讓同一種離子在推斥區的起點差一點(得到的能量差約兩成)時,
// 經過反射鏡幾乎同時回到偵測器(差 0.05 秒),關掉反射鏡則差 0.3 秒。
// 離子在橫向(y)本來就有一點速度,和 m/z 的平方根成反比,飛行時間又和平方根成正比,所以不同 m/z 都落在同一個偵測器上。
export const TOF = { P: 0.1, R0: 0.66, VR: 1.3, V0: 0.06, XD: 0.12, VY: 0.22, Y0: -0.75 };
const TOF_CUES = [
  [0, '飛行時間裡的電場畫成地形:推斥區是一道陡坡,飛行管是平地(沒有電場),反射鏡是一道上坡。'],
  [4, '推斥極一推,離子從陡坡滑下來,每一個都得到一樣多的能量;越輕的跑得越快,在平地上一直維持同樣的速度。'],
  [9, '反射鏡是上坡:跑得快的衝得比較高、多繞一點路,所以同一種離子不管快慢,幾乎同時回到偵測器。'],
  [16, '把反射鏡關掉,離子直直飛到最後面:同一種離子有快有慢,到達的時間就散開,峰變寬,只差一點點的 m/z 就分不開。'],
];
function tofScript(ions) {
  const I = (i, d) => Object.assign({}, d, ions && ions[i]);
  // 兩顆 m/z 一樣(其中一顆在推斥區的起點遠一點、得到的能量少兩成,畫白框),一顆重的
  const a = I(0, { mz: 195, label: 'm/z 195', color: '#74e4ff', x0: 0.01 });
  const b = I(1, { mz: 195, label: 'm/z 195(能量少一點)', color: '#74e4ff', x0: 0.03, ring: true });
  const h = I(2, { mz: 524, label: 'm/z 524', color: '#ffc261', x0: 0.01 });
  return { ions: [a, b, h], push: [4.5, 18], dur: 26, marks: [0, 4, 9, 16] };
}
class TofSim {
  constructor(script) { this.s = script; this.reset(); }
  reset() { this.t = 0; this.refl = 1; this.reflOn = true; this.run = -1; this.ions = []; this.hits = []; this.pushAt = -9; }
  launch(run) {
    this.run = run; this.pushAt = this.t;
    const ref = this.s.ions[0].mz;
    this.ions = this.s.ions.map((o, i) => ({ i, o, m: o.mz / ref, x: o.x0, v: 0, y: TOF.Y0, st: 'fly', t0: this.t, k: 0, back: false, trail: [] }));
  }
  accel(x, m) {
    if (x < TOF.P) return TOF.V0 / TOF.P / m;
    if (x < TOF.R0 || !this.reflOn) return 0;
    return -TOF.V0 * TOF.VR / (1 - TOF.R0) / m;
  }
  step(dt) {
    let n = Math.max(1, Math.round(dt / H));
    const h = dt / n;
    for (; n > 0; n--) {
      const t = this.t;
      // 第一輪反射鏡開著;16 秒起把反射鏡收平,18 秒再推一次(這時反射鏡已經關掉)
      this.refl = 1 - smooth(16, 17.4, t); this.reflOn = t < 17;
      this.s.push.forEach((at, k) => { if (this.run < k && t >= at) this.launch(k); });
      for (const ion of this.ions) {
        if (ion.st !== 'fly') { ion.k += h; continue; }
        ion.v += this.accel(ion.x, ion.m) * h; ion.x += ion.v * h;
        ion.y = TOF.Y0 + TOF.VY / Math.sqrt(ion.m) * (t + h - ion.t0);
        if (ion.v < 0) ion.back = true;
        if (this.run === 0 ? ion.back && ion.x <= TOF.XD : ion.x >= 1) {
          ion.st = 'hit'; ion.k = 0;
          this.hits.push({ run: this.run, mz: ion.o.mz, color: ion.o.color, ring: !!ion.o.ring, dt: t + h - ion.t0, at: t + h });
        }
      }
      this.t += h;
    }
    for (const ion of this.ions) if (ion.st === 'fly') { ion.trail.push(ion.x, ion.y); if (ion.trail.length > 1600) ion.trail.splice(0, 2); }
  }
}
function createTofDemo(opts) {
  const { C, text, arrow, col, ball } = makeKit(opts);
  const script = tofScript(opts.ions), cues = opts.cues || TOF_CUES, sim = new TofSim(script);
  const cam = { cx: 300, cy: 132, yaw: -0.2, pitch: 0.62, dist: 4.4, f: 640, hs: 1.3 }, proj = projector(cam);
  const U = (x) => (x - 0.5) * 2.6, Wd = (y) => y * 0.6;
  const NX = 50, NY = 8, verts = new Float32Array((NX + 1) * (NY + 1) * 4), tmp = [0, 0, 0], tmp2 = [0, 0, 0];
  const HMAX = 0.32 * TOF.VR;
  const hOf = (x) => (x < TOF.P ? 0.32 * (1 - x / TOF.P) : x < TOF.R0 ? 0 : 0.32 * sim.refl * TOF.VR * (x - TOF.R0) / (1 - TOF.R0));
  const P = (x, y, dh = 0) => proj(U(x), Wd(y), hOf(clamp(x, 0, 1)) + dh, tmp);
  function drawLand(c) {
    for (let i = 0; i <= NX; i++) for (let j = 0; j <= NY; j++) {
      const x = i / NX, y = -1 + 2 * j / NY, k = (i * (NY + 1) + j) * 4;
      P(x, y); verts[k] = tmp[0]; verts[k + 1] = tmp[1]; verts[k + 2] = tmp[2]; verts[k + 3] = hOf(x);
    }
    const quads = [];
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
      const a = (i * (NY + 1) + j) * 4, b = a + 4, d = a + (NY + 1) * 4, e = d + 4;
      quads.push([verts[a + 2] + verts[b + 2] + verts[d + 2] + verts[e + 2], a, b, e, d]);
    }
    quads.sort((p, q) => q[0] - p[0]);
    for (const [, a, b, e, d] of quads) {
      const h = (verts[a + 3] + verts[b + 3] + verts[d + 3] + verts[e + 3]) / 4;
      c.fillStyle = col(clamp(0.5 + 0.5 * h / HMAX, 0, 1), 0.2);
      c.beginPath(); c.moveTo(verts[a], verts[a + 1]); c.lineTo(verts[b], verts[b + 1]); c.lineTo(verts[e], verts[e + 1]); c.lineTo(verts[d], verts[d + 1]); c.closePath(); c.fill();
    }
    c.lineWidth = 1.1;
    for (let j = 0; j <= NY; j++) for (let i = 0; i < NX; i++) {
      const p = (i * (NY + 1) + j) * 4, q = ((i + 1) * (NY + 1) + j) * 4, h = (verts[p + 3] + verts[q + 3]) / 2;
      c.strokeStyle = col(clamp(0.5 + 0.5 * h / HMAX, 0, 1), j === 0 || j === NY ? 0.9 : 0.55);
      c.beginPath(); c.moveTo(verts[p], verts[p + 1]); c.lineTo(verts[q], verts[q + 1]); c.stroke();
    }
    for (let i = 0; i <= NX; i += 2) for (let j = 0; j < NY; j++) {
      const p = (i * (NY + 1) + j) * 4, q = p + 4, h = verts[p + 3];
      c.strokeStyle = col(clamp(0.5 + 0.5 * h / HMAX, 0, 1), 0.45);
      c.beginPath(); c.moveTo(verts[p], verts[p + 1]); c.lineTo(verts[q], verts[q + 1]); c.stroke();
    }
  }
  function drawParts(c, bare) {
    // 推斥板(陡坡頂端)與推出去那一下的閃光
    P(0, -1, 0.02); const x0 = tmp[0], y0 = tmp[1]; P(0, 1, 0.02);
    c.strokeStyle = C.plus; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(tmp[0], tmp[1]); c.stroke(); c.lineCap = 'butt';
    const fl = sim.t - sim.pushAt;
    if (fl >= 0 && fl < 0.5) { P(0, 0, 0.05); c.globalAlpha = 1 - fl / 0.5; c.strokeStyle = C.plus; c.lineWidth = 2.4; c.beginPath(); c.arc(tmp[0], tmp[1], 10 + 40 * fl, 0, TAU); c.stroke(); c.globalAlpha = 1; }
    // 偵測器:反射鏡開著時在推斥區旁邊(離子折返後落在這裡),關掉時在最後面
    const r = sim.refl;
    c.fillStyle = 'rgba(160,190,205,.75)';
    if (r > 0.02) { c.globalAlpha = r; P(TOF.XD, 0.5); const a0 = tmp[0], b0 = tmp[1]; P(TOF.XD, 1); c.lineWidth = 7; c.strokeStyle = 'rgba(160,190,205,.85)'; c.beginPath(); c.moveTo(a0, b0); c.lineTo(tmp[0], tmp[1]); c.stroke(); c.globalAlpha = 1; }
    if (r < 0.98) { c.globalAlpha = 1 - r; P(1, -0.45); const a0 = tmp[0], b0 = tmp[1]; P(1, 0.45); c.lineWidth = 7; c.strokeStyle = 'rgba(160,190,205,.85)'; c.beginPath(); c.moveTo(a0, b0); c.lineTo(tmp[0], tmp[1]); c.stroke(); c.globalAlpha = 1; }
    if (bare) return;
    // 標示
    P(0.0, -1, 0.04); text(c, '推斥區:陡坡', tmp[0] + 26, tmp[1] + 4, { color: '#ff8a6b', size: 13.5, weight: 700 });
    P(0.4, -1, 0.02); text(c, '飛行管:平地,沒有電場', tmp[0], tmp[1] - 14, { color: C.ink2, size: 13.5, weight: 700, align: 'center' });
    if (r > 0.05) { c.globalAlpha = r; P(0.86, -1, 0.06); text(c, '反射鏡:上坡', tmp[0], tmp[1] - 16, { color: '#ffc261', size: 13.5, weight: 700, align: 'center' }); c.globalAlpha = 1; }
    if (r > 0.5) { P(TOF.XD, 1.05); text(c, '偵測器', tmp[0] + 4, tmp[1] + 14, { color: C.ink2, size: 12.5, align: 'center' }); }
    else { P(1, 0.5); text(c, '偵測器', tmp[0] + 10, tmp[1] + 10, { color: C.ink2, size: 12.5 }); }
    // 推出去的方向
    P(0.16, 0.0, 0.03); const ax = tmp[0], ay = tmp[1]; P(0.3, 0.0, 0.03); arrow(c, ax, ay, tmp[0], tmp[1], 'rgba(234,243,246,.55)', 1.8);
  }
  function drawIons(c, bare) {
    const list = [];
    for (const ion of sim.ions) {
      if (ion.st === 'hit' && ion.k > 0.8) continue;
      P(ion.x, ion.y, 0.07); list.push([tmp[2], tmp[0], tmp[1], ion]);
    }
    list.sort((p, q) => q[0] - p[0]);
    for (const [z, x, y, ion] of list) {
      if (!bare && ion.trail.length > 4) {
        c.lineWidth = 1.5; c.strokeStyle = ion.o.color;
        const n = ion.trail.length / 2;
        for (let k = 3; k < n; k += 3) {
          P(ion.trail[2 * k - 6], ion.trail[2 * k - 5], 0.07); const a0 = tmp[0], b0 = tmp[1];
          P(ion.trail[2 * k], ion.trail[2 * k + 1], 0.07);
          c.globalAlpha = 0.45 * (k / n); c.beginPath(); c.moveTo(a0, b0); c.lineTo(tmp[0], tmp[1]); c.stroke();
        }
        c.globalAlpha = 1;
      }
      const a = ion.st === 'hit' ? 1 - ion.k / 0.8 : 1;
      ball(c, x, y, 8 * cam.dist / z, ion.o.color, a, !!ion.o.ring);
      if (ion.st === 'hit' && ion.k < 0.6) { c.globalAlpha = 1 - ion.k / 0.6; c.strokeStyle = ion.o.color; c.lineWidth = 2.2; c.beginPath(); c.arc(x, y, 8 + 26 * ion.k, 0, TAU); c.stroke(); c.globalAlpha = 1; }
    }
  }
  // 底下:推出去之後幾秒到達偵測器,上排反射鏡開、下排反射鏡關
  function drawArrivals(c) {
    const X0 = 150, X1 = 560, T = 12, xOf = (s) => X0 + (X1 - X0) * s / T;
    text(c, '到達偵測器的時間', 22, 250, { color: C.ink, size: 13.5, weight: 700 });
    for (const [run, y, lab] of [[0, 278, '反射鏡開'], [1, 314, '反射鏡關']]) {
      const on = sim.run >= run;
      c.globalAlpha = on ? 1 : 0.35;
      text(c, lab, 22, y, { color: run ? '#ffc261' : C.ink2, size: 13 });
      c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, y + 10); c.lineTo(X1, y + 10); c.stroke();
      for (const h of sim.hits) if (h.run === run) {
        const k = clamp((sim.t - h.at) / 0.3, 0, 1), x = xOf(h.dt);
        c.fillStyle = h.color; c.fillRect(x - 1.6, y + 10 - 22 * k, 3.2, 22 * k);
        if (h.ring) { c.strokeStyle = '#ffffff'; c.lineWidth = 1; c.strokeRect(x - 2.6, y + 10 - 22 * k, 5.2, 22 * k); }
      }
      c.globalAlpha = 1;
    }
    for (let s = 0; s <= T; s += 2) text(c, String(s), xOf(s), 333, { color: C.muted, size: 11, align: 'center' });
    text(c, '秒', X1 + 14, 333, { color: C.muted, size: 11 });
  }
  return {
    kind: 'tof', dur: script.dur, marks: script.marks, cues,
    get t() { return sim.t; },
    seek(t) { t = clamp(t, 0, script.dur); if (t < sim.t - 1e-6) sim.reset(); while (sim.t < t - 1e-6) sim.step(Math.min(FRAME, t - sim.t)); },
    advance(dt) { const to = Math.min(script.dur, sim.t + dt); while (sim.t < to - 1e-6) sim.step(Math.min(FRAME, to - sim.t)); },
    reset() { sim.reset(); },
    cueAt: cueAtOf(cues), cueIndex: cueIndexOf(cues),
    status() { return sim.t < script.push[0] ? '電場畫成地形' : sim.t < 16 ? '反射鏡開著' : '反射鏡關掉'; },
    draw(c, o = {}) {
      drawLand(c); drawParts(c, o.bare); drawIons(c, o.bare);
      if (o.bare) return;
      drawArrivals(c);
      text(c, this.status(), 22, 22, { color: '#74e4ff', size: 17, weight: 800 });
      // 圖例:同一種 m/z 的兩顆用白框分
      const L = [['#74e4ff', 'm/z 195', false, 196], ['#74e4ff', 'm/z 195(能量少一點)', true, 278], ['#ffc261', 'm/z 524', false, 444]];
      for (const [cc, s, ring, x] of L) { ball(c, x, 250, 5, cc, 1, ring); text(c, s, x + 12, 250.5, { color: cc, size: 12.5, weight: 700 }); }
    },
  };
}

// ---------- Orbitrap ----------
// 擺盪頻率 f = F0 × √(195 ÷ m/z):軸向是簡諧運動,頻率和擺幅、能量都無關。畫面放慢到 m/z 195 每秒擺 0.9 次
const ORB_F0 = 0.9;
const ORB_CUES = [
  [0, 'Orbitrap 中間是一根紡錘形的電極,外面包著兩半的外殼。紡錘把帶正電的離子往內吸,離子繞著它轉,像衛星繞地球,不會撞上去。'],
  [6, '沿著紡錘的方向,電場像一個碗:離中間越遠,被推回來越用力,所以離子會左右來回擺盪。'],
  [13, '擺盪的快慢只看 m/z:越輕擺得越快,和離子帶多少能量、一開始在哪裡都沒有關係。'],
  [21, '外殼的兩半記下離子擺來擺去造成的訊號;混在一起的擺動再拆成各種頻率,一種頻率就是一種 m/z。'],
];
function createOrbDemo(opts) {
  const { C, text, arrow, ball } = makeKit(opts);
  const I = (i, d) => Object.assign({}, d, opts.ions && opts.ions[i]);
  const ions = [I(0, { mz: 195, label: 'm/z 195', color: '#74e4ff', ph: 0 }), I(1, { mz: 300, label: 'm/z 300', color: '#5dffb0', ph: 1.9 }), I(2, { mz: 524, label: 'm/z 524', color: '#ffc261', ph: 3.6 })];
  const born = [0.5, 13, 13.4], DUR = 28, cues = opts.cues || ORB_CUES;
  const freq = (k) => ORB_F0 * Math.sqrt(ions[0].mz / ions[k].mz);
  let t = 0;
  // 軸向位置(−1 到 1):第一顆先小幅擺動,2 秒後被推開到全幅;後兩顆一出現就長到全幅
  function zOf(k, tt) {
    const tb = tt - born[k]; if (tb < 0) return null;
    const A = 0.8 * smooth(0, 1.2, tb) * (k === 0 ? 0.2 + 0.8 * smooth(2, 3.2, tt) : 1);
    return A * Math.cos(TAU * freq(k) * tb + ions[k].ph);
  }
  const thOf = (k, tt) => TAU * freq(k) * 2.2 * (tt - born[k]) + ions[k].ph * 0.7;
  const CX = 300, CY = 104, LZ = 205, RV = 32;
  const spR = (zn) => 5 + 15 * (1 - zn * zn), outR = (zn) => 52 - 16 * zn * zn;
  const xy = (k, tt) => { const zn = zOf(k, tt); if (zn === null) return null; const th = thOf(k, tt); return [CX + zn * LZ * 0.92, CY + RV * Math.cos(th) * (1 - 0.25 * zn * zn), Math.sin(th), zn]; };
  function drawElectrodes(c, front) {
    if (!front) {
      // 外殼:左右兩半,中間有縫
      c.lineWidth = 2; c.strokeStyle = 'rgba(160,190,205,.55)'; c.fillStyle = 'rgba(160,190,205,.06)';
      for (const [a, b] of [[-1, -0.03], [0.03, 1]]) {
        c.beginPath();
        for (let i = 0; i <= 40; i++) { const zn = lerp(a, b, i / 40), x = CX + zn * LZ, y = CY - outR(zn); i ? c.lineTo(x, y) : c.moveTo(x, y); }
        for (let i = 40; i >= 0; i--) { const zn = lerp(a, b, i / 40); c.lineTo(CX + zn * LZ, CY + outR(zn)); }
        c.closePath(); c.fill(); c.stroke();
      }
      return;
    }
    // 紡錘(中心電極)
    const g = c.createLinearGradient(0, CY - 20, 0, CY + 20);
    g.addColorStop(0, '#dfe8ee'); g.addColorStop(0.5, '#8a9aa6'); g.addColorStop(1, '#3e4c55');
    c.fillStyle = g; c.beginPath();
    for (let i = 0; i <= 60; i++) { const zn = -1 + 2 * i / 60, x = CX + zn * LZ * 1.02, y = CY - spR(zn); i ? c.lineTo(x, y) : c.moveTo(x, y); }
    for (let i = 60; i >= 0; i--) { const zn = -1 + 2 * i / 60; c.lineTo(CX + zn * LZ * 1.02, CY + spR(zn)); }
    c.closePath(); c.fill();
  }
  function drawIon(c, k, inFront) {
    const p = xy(k, t); if (!p) return;
    const [x, y, s] = p; if ((s > 0) !== inFront) return;
    const a = smooth(0, 0.6, t - born[k]) * (inFront ? 1 : 0.55);
    // 軌跡:最近 1.4 秒的螺旋
    c.lineWidth = 1.4; c.strokeStyle = ions[k].color;
    let prev = null;
    for (let i = 0; i <= 42; i++) {
      const tt = t - 1.4 + i / 30, q = xy(k, tt); if (!q) { prev = null; continue; }
      if (prev && (q[2] > 0) === inFront) { c.globalAlpha = 0.5 * (i / 42) * a; c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(q[0], q[1]); c.stroke(); }
      prev = q;
    }
    c.globalAlpha = 1;
    ball(c, x, y, 7, ions[k].color, a);
  }
  // 左下:沿著紡錘方向的電場,像一個碗
  function drawBowl(c) {
    const a = smooth(6, 7, t); if (a <= 0) return;
    c.globalAlpha = a;
    const X = 155, Y = 318, SX = 112, SY = 84;
    text(c, '沿著紡錘方向:像一個碗', 30, 210, { color: C.ink, size: 13.5, weight: 700 });
    c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath();
    for (let i = 0; i <= 40; i++) { const zn = -1 + 2 * i / 40, x = X + zn * SX, y = Y - SY * zn * zn; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
    arrow(c, X - SX + 4, Y - SY + 18, X - SX + 30, Y - SY + 40, C.push, 1.8); arrow(c, X + SX - 4, Y - SY + 18, X + SX - 30, Y - SY + 40, C.push, 1.8);
    text(c, '推回中間', X + SX - 24, Y - SY + 6, { color: C.push, size: 12 });
    c.setLineDash([3, 4]); c.strokeStyle = 'rgba(160,190,205,.35)'; c.beginPath(); c.moveTo(X, Y - SY); c.lineTo(X, Y + 4); c.stroke(); c.setLineDash([]);
    for (let k = 0; k < 3; k++) { const zn = zOf(k, t); if (zn === null) continue; ball(c, X + zn * SX, Y - SY * zn * zn - 6, 6, ions[k].color, smooth(0, 0.6, t - born[k]) * a); }
    c.globalAlpha = 1;
  }
  // 右下:外殼記下的訊號(三種擺動加在一起),再拆成頻率
  function drawSignal(c) {
    const a = smooth(21, 22, t); if (a <= 0) return;
    c.globalAlpha = a;
    const X0 = 316, X1 = 466, Y = 270, A = 22;
    text(c, '外殼記下的訊號', X0, 210, { color: C.ink, size: 13.5, weight: 700 });
    for (let k = 0; k < 3; k++) {
      c.strokeStyle = ions[k].color; c.lineWidth = 1; c.globalAlpha = a * 0.45; c.beginPath();
      for (let i = 0; i <= 90; i++) { const tt = t - 2.5 + 2.5 * i / 90, zn = zOf(k, tt) || 0, x = X0 + (X1 - X0) * i / 90, y = Y + 34 + A * 0.55 * zn; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke();
    }
    c.globalAlpha = a; c.strokeStyle = C.ink; c.lineWidth = 1.8; c.beginPath();
    for (let i = 0; i <= 120; i++) { const tt = t - 2.5 + 2.5 * i / 120; let s = 0; for (let k = 0; k < 3; k++) s += zOf(k, tt) || 0; const x = X0 + (X1 - X0) * i / 120, y = Y - A * s / 2; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
    text(c, '加在一起', X0, Y - A - 10, { color: C.muted, size: 11.5 });
    // 拆成頻率:一根線一種 m/z(由輕到重排)
    const b = smooth(24.5, 25.5, t);
    if (b > 0) {
      c.globalAlpha = a * b;
      const F0 = 482, F1 = 588, base = 318;
      text(c, '拆成頻率', F0, 210, { color: C.ink, size: 13.5, weight: 700 });
      c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(F0, base); c.lineTo(F1, base); c.stroke();
      for (let k = 0; k < 3; k++) {
        const x = lerp(F0 + 14, F1 - 14, k / 2), h = 70 * b;
        c.fillStyle = ions[k].color; c.fillRect(x - 3, base - h, 6, h);
        text(c, String(ions[k].mz), x, base + 12, { color: ions[k].color, size: 11.5, weight: 700, align: 'center' });
      }
    }
    c.globalAlpha = 1;
  }
  return {
    kind: 'orb', dur: DUR, marks: [0, 6, 13, 21], cues,
    get t() { return t; },
    seek(tt) { t = clamp(tt, 0, DUR); },
    advance(dt) { t = Math.min(DUR, t + dt); },
    reset() { t = 0; },
    cueAt: cueAtOf(cues), cueIndex: cueIndexOf(cues),
    status() { return t < 6 ? '紡錘把離子往內吸' : t < 13 ? '沿著紡錘:像一個碗' : t < 21 ? '越輕擺得越快' : '記下訊號,拆成頻率'; },
    freqOf: (k) => freq(k),
    draw(c, o = {}) {
      drawElectrodes(c, false);
      for (let k = 0; k < 3; k++) drawIon(c, k, false);
      drawElectrodes(c, true);
      for (let k = 0; k < 3; k++) drawIon(c, k, true);
      if (o.bare) return;
      text(c, '紡錘(中心電極)', CX, CY + 68, { color: C.ink2, size: 12.5, align: 'center' });
      text(c, '外殼左半', CX - LZ * 0.62, CY + 68, { color: C.muted, size: 12, align: 'center' });
      text(c, '外殼右半', CX + LZ * 0.62, CY + 68, { color: C.muted, size: 12, align: 'center' });
      drawBowl(c); drawSignal(c);
      text(c, this.status(), 22, 22, { color: '#74e4ff', size: 17, weight: 800 });
      // 圖例:相對的擺盪快慢,剛好是 m/z 比值開根號的倒數
      const vis = [0, 1, 2].filter((k) => t >= born[k]);
      if (vis.length > 1) vis.forEach((k, i) => { ball(c, 432, 22 + i * 20, 5, ions[k].color); text(c, `${ions[k].label}:快慢 ${(freq(k) / freq(0)).toFixed(2)}`, 446, 22.5 + i * 20, { color: ions[k].color, size: 12.5, weight: 700 }); });
    },
  };
}

// ---------- 入口 ----------
export function createFieldDemo(kind, opts = {}) {
  if (kind === 'tof') return createTofDemo(opts);
  if (kind === 'orb') return createOrbDemo(opts);
  return createSaddleDemo(kind, opts);
}
// 給檢查腳本用:飛行時間跑完一次,傳回每次到達的紀錄
export function _tofRun() { const s = new TofSim(tofScript()); while (s.t < s.s.dur - 1e-6) s.step(FRAME); return s; }
