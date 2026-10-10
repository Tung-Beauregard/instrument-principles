// 四種質量分析器的電場示意 assets/analyzer-fields.js 的檢查:
// 四極柱與離子阱的球,去留要和 Mathieu 方程式的穩定條件一致(畫面上說留得住的真的沒滑出去,說留不住的真的滑出去);
// 飛行時間:越輕越早到、反射鏡讓同一種離子幾乎同時到、關掉就散開、不同 m/z 落在同一個偵測器;
// Orbitrap:擺盪頻率和 m/z 的平方根成反比
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { _simFor, _tofRun, createFieldDemo, QWIN, AQ, TOF } from '../assets/analyzer-fields.js';

// 一格一格跑,記下每顆球每次滑出去的時間與方向
function run(kind) {
  const sim = _simFor(kind), outs = [];
  const seen = new Map();
  while (sim.t < sim.script.dur - 1e-6) {
    sim.step(1 / 60);
    for (const ion of sim.ions) {
      const was = seen.get(ion) || 'in';
      if (ion.st === 'out' && was !== 'out') outs.push({ id: ion.id, t: sim.t, axis: Math.abs(ion.u) > 1 ? 'u' : 'w' });
      seen.set(ion, ion.st);
    }
  }
  return { sim, outs };
}
const outsOf = (r, id, t0, t1) => r.outs.filter((o) => o.id === id && o.t >= t0 && o.t < t1);

// 離子阱
{
  const r = run('trap');
  assert.ok(outsOf(r, 'main', 0, 2).length > 0, '離子阱:不動的馬鞍上,球應該在 2 秒內滾下去');
  assert.ok(outsOf(r, 'main', 6, 9).length > 0, '離子阱:翻得太慢時,球應該滾下去');
  assert.equal(outsOf(r, 'main', 12.5, 26).length, 0, '離子阱:翻得夠快之後,主角不該滑出去');
  assert.equal(outsOf(r, 'heavy', 20, 26).length, 0, '離子阱:較重的離子應該留得住');
  assert.ok(outsOf(r, 'light', 20, 26).length > 0, '離子阱:太輕的離子(q > 0.908)應該留不住');
  const hits = r.sim.hits.map((h) => h.mz);
  assert.ok(hits.length >= 2, `離子阱:掃描時至少要有兩種離子打到偵測器(實際 ${hits.length})`);
  for (let i = 1; i < hits.length; i++) assert.ok(hits[i] > hits[i - 1], `離子阱:要由輕到重依序射出(實際 ${hits.join(', ')})`);
  for (const o of r.outs.filter((x) => x.t >= 26)) assert.equal(o.axis, 'u', '離子阱:掃描時要沿軸向(u)射出');
}

// 四極柱
{
  const r = run('quad');
  assert.ok(outsOf(r, 'main', 0, 2).length > 0, '四極柱:不動的馬鞍上,球應該滾下去');
  assert.equal(outsOf(r, 'main', 5.5, 22).length, 0, '四極柱:只加交流、加上直流之後,要的那種都該留得住');
  const lo = outsOf(r, 'light', 12.5, 22), hi = outsOf(r, 'heavy', 12.5, 22);
  assert.ok(lo.length > 0 && hi.length > 0, '四極柱:加上直流後,太輕和太重的都該被甩出去');
  assert.ok(lo.every((o) => o.axis === 'u'), '四極柱:太輕的應該沿著 u(交流甩出去的方向)出去');
  assert.ok(hi.every((o) => o.axis === 'w'), '四極柱:太重的應該沿著 w(直流拉走的方向)出去');
  // 掃描:每顆球「留得住」的時段要依 m/z 由輕到重輪流出現
  const s = (t) => 0.74 + (1.62 - 0.74) * Math.min(1, Math.max(0, (t - 22) / 14));
  const sim = r.sim, ions = sim.script.ions, ref = ions[1].mz, qref = (QWIN[0] + QWIN[1]) / 2;
  const centers = ions.map((o) => { const sMid = (o.mz / ref); return 22 + (sMid - 0.74) / (1.62 - 0.74) * 14; });
  for (let i = 0; i < 3; i++) {
    const id = ['light', 'main', 'heavy'][i], c = centers[i];
    assert.equal(outsOf(r, id, c - 0.4, c + 0.4).length, 0, `四極柱:掃到 ${ions[i].mz} 的時候它應該留得住`);
    assert.ok(Math.abs(qref * ref * s(c) / ions[i].mz - qref) < 1e-9, '四極柱:窗口中心的換算不一致');
  }
  assert.ok(AQ > 0 && QWIN[0] < QWIN[1]);
}

// 飛行時間
{
  const s = _tofRun(), on = s.hits.filter((h) => h.run === 0), off = s.hits.filter((h) => h.run === 1);
  assert.equal(on.length, 3, '飛行時間:反射鏡開著時三顆都要回到偵測器');
  assert.equal(off.length, 3, '飛行時間:反射鏡關掉時三顆都要飛到最後面');
  const d195 = (hs) => Math.abs(hs.filter((h) => h.mz === 195).map((h) => h.dt).reduce((a, b) => a - b));
  const t = (hs, mz) => hs.find((h) => h.mz === mz).dt;
  assert.ok(t(on, 195) < t(on, 524) && t(off, 195) < t(off, 524), '飛行時間:越輕要越早到');
  assert.ok(d195(on) < 0.08, `飛行時間:有反射鏡時同一種離子要幾乎同時到(實際差 ${d195(on).toFixed(3)} 秒)`);
  assert.ok(d195(off) > 3 * d195(on), '飛行時間:關掉反射鏡時同一種離子的到達時間要明顯散開');
  // 不同 m/z 落在同一個偵測器:橫向速度和 √m 成反比,飛行時間和 √m 成正比
  const ratio = t(on, 524) / t(on, 195), want = Math.sqrt(524 / 195);
  assert.ok(Math.abs(ratio - want) < 0.03, `飛行時間:到達時間比要是 √(m/z) 比(實際 ${ratio.toFixed(3)},應為 ${want.toFixed(3)})`);
  assert.ok(TOF.R0 > TOF.P && TOF.VR > 1, '飛行時間:反射鏡要在飛行管後面、而且要比推出的能量高,離子才會折返');
}

// Orbitrap:頻率 ∝ 1/√(m/z)
{
  const o = createFieldDemo('orb');
  for (const [k, mz] of [[1, 300], [2, 524]]) {
    const r = o.freqOf(0) / o.freqOf(k), want = Math.sqrt(mz / 195);
    assert.ok(Math.abs(r - want) < 1e-9, `Orbitrap:m/z 195 和 ${mz} 的擺盪頻率比要是 √(m/z) 比`);
  }
}

// 畫圖的 API 可以用(不需要瀏覽器:給一個假的 2D context)
{
  const noop = () => {};
  const grad = () => ({ addColorStop: noop });
  const ctx = new Proxy({ createRadialGradient: grad, createLinearGradient: grad }, { get: (t, k) => (k in t ? t[k] : noop), set: () => true });
  for (const kind of ['trap', 'quad', 'tof', 'orb']) {
    const d = createFieldDemo(kind);
    for (const t of [0, 3, 8, 14, 18, 24, 30, d.dur]) { d.seek(t); d.draw(ctx); d.draw(ctx, { bare: true }); assert.ok(d.cueAt(t).length > 10); }
    d.seek(5); const a = JSON.stringify(d.status()); d.seek(30); d.seek(5); assert.equal(JSON.stringify(d.status()), a, '同一個 t 要得到同一個狀態');
  }
}

// 兩份教材都有接上
for (const lesson of ['gc-ms', 'mass-analyzers']) {
  const html = fs.readFileSync(new URL(`../${lesson}/index.html`, import.meta.url), 'utf8');
  assert.ok(html.includes("from '../assets/analyzer-fields.js'"), `${lesson}: 沒有載入 assets/analyzer-fields.js`);
}
console.log('PASS: analyzer fields (trap and quadrupole stability, ejection order, TOF arrivals and focusing, Orbitrap frequencies, deterministic seek) wired into gc-ms and mass-analyzers.');
