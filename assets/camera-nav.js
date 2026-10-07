// 3D 教材共用的視角操作,參考 The Plane of Focus(https://sael.net/plane-of-focus/)的操作方式。
// 拖曳旋轉、右鍵或 Shift + 拖曳平移、觸控螢幕的單指旋轉與雙指平移縮放,OrbitControls 本身就有;這裡補上:
//  滾輪:滑鼠滾輪縮放;觸控板雙指滑動平移、捏合縮放(瀏覽器把捏合送成帶 Ctrl 的滾輪)
//  鍵盤:方向鍵或 W A S D 移動(左右平移、上下沿著看的方向前後)、Q E 轉向、+ − 縮放,按住 Shift 加快;R 回到預設視角
// 用法:const nav = createCameraNav({ camera, controls, ... });每一格在 controls.update() 之前呼叫 nav.step(dt)。
// 只改相機與 controls.target,不碰場景、科學計算或畫質設定。

// 滾輪事件是觸控板滑動還是滑鼠滾輪:觸控板的事件以像素為單位、小而連續,常帶水平分量;
// 滑鼠滾輪一格約 100 px(Firefox 用行為單位)、只有垂直。同一串事件(間隔 220 ms 內)沿用第一下的判斷
export function wheelKind(e, prev = null, now = 0) {
  if (e.ctrlKey) return 'pinch';
  if (prev && now - prev.at <= 220) return prev.kind;
  const dy = e.deltaY;
  return e.deltaMode === 0 && (e.deltaX !== 0 || Math.abs(dy) < 40 || !Number.isInteger(dy)) ? 'pan' : 'zoom';
}

export function createCameraNav({
  camera, controls,
  active = () => true, // 現在能不能操作(導覽、錄影、說明視窗開著時傳回 false)
  onInput = () => {}, // 使用者用了這些操作:停掉自動鏡頭、結束導覽等
  arrows = () => true, // 方向鍵要不要拿來移動(例如播放中留給切換章節)
  turn = true, // Q E 轉向;和教材既有的快捷鍵衝突時關掉
  reset = true, // R:true 回到 home;函式則改呼叫它;false 不處理(教材已有自己的 R)
  home = null, // { p, t } 預設視角;沒給就用建立時的相機
  limit = null, // (target) => void,把觀察點限制在場景內;沒給就用以預設觀察點為中心、radius 為半徑的球
  radius = Infinity,
  minDistance = null, maxDistance = null, // 沒給就用 controls 的設定
  panSpeed = 420, // 方向鍵左右平移,每秒幾個畫面像素
} = {}) {
  const V = camera.position.constructor;
  const H = home || { p: camera.position.clone(), t: controls.target.clone() };
  const st = { keys: new Set(), zoom: 0, fly: null, wheel: null };
  const a = new V(), b = new V(), c = new V(), q = new V(), UPV = new V(0, 1, 0);
  const el = controls.domElement;
  const minD = () => minDistance ?? controls.minDistance, maxD = () => maxDistance ?? controls.maxDistance;

  function clampTarget(t) {
    if (limit) { limit(t); return; }
    if (radius === Infinity) return;
    q.copy(t).sub(H.t);
    const L = q.length();
    if (L > radius) t.copy(H.t).addScaledVector(q, radius / L);
  }
  // 相機與觀察點一起移動
  function shift(v) {
    const t = controls.target;
    b.copy(t).add(v); clampTarget(b);
    v.copy(b).sub(t); t.add(v); camera.position.add(v);
  }
  // 平移:dx、dy 是畫面像素,方向和拖曳相同(畫面內容跟著手指走)
  function pan(dx, dy) {
    const d = camera.position.distanceTo(controls.target);
    const wpp = (2 * d * Math.tan(((camera.fov / 2) * Math.PI) / 180)) / Math.max(1, el.clientHeight) / (camera.zoom || 1);
    a.set(1, 0, 0).applyQuaternion(camera.quaternion).multiplyScalar(-dx * wpp);
    b.set(0, 1, 0).applyQuaternion(camera.quaternion).multiplyScalar(dy * wpp);
    shift(a.add(b));
  }
  // 繞觀察點水平轉動
  function spin(ang) { a.copy(camera.position).sub(controls.target).applyAxisAngle(UPV, ang); camera.position.copy(controls.target).add(a); }
  function flyTo(p, t) { st.fly = { p: p.clone(), t: t.clone() }; st.zoom = 0; }
  function cancel() { st.keys.clear(); st.zoom = 0; st.fly = null; }

  el.addEventListener('wheel', (e) => {
    if (!active()) return;
    e.preventDefault(); e.stopImmediatePropagation(); // 不交給 OrbitControls 的滾輪縮放
    const now = performance.now(), kind = wheelKind(e, st.wheel, now);
    st.wheel = { kind, at: now };
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
    st.fly = null; onInput();
    if (kind === 'pinch') st.zoom += e.deltaY * k * 0.01;
    else if (kind === 'pan') pan(-e.deltaX * k, -e.deltaY * k);
    else st.zoom += e.deltaY * k * 0.0015;
  }, { passive: false, capture: true });
  controls.addEventListener('start', () => { st.fly = null; });

  const KEYS = ['a', 'd', 'w', 's', '=', '+', '-', '_'];
  const ARROWS = ['arrowleft', 'arrowright', 'arrowup', 'arrowdown'];
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || !active()) return;
    const tg = e.target;
    if (tg && tg.closest && (tg.closest('input, select, textarea, [contenteditable], dialog[open]'))) return;
    const key = e.key.toLowerCase();
    if (key === 'shift') { st.keys.add('shift'); return; }
    if (key === 'r' && reset) {
      e.preventDefault(); onInput();
      if (typeof reset === 'function') reset(); else flyTo(H.p, H.t);
      return;
    }
    const ok = KEYS.includes(key) || (turn && (key === 'q' || key === 'e')) || (ARROWS.includes(key) && arrows());
    if (!ok) return;
    e.preventDefault();
    if (!st.keys.has(key)) { st.fly = null; onInput(); }
    st.keys.add(key);
  });
  addEventListener('keyup', (e) => { st.keys.delete(e.key.toLowerCase()); if (e.key === 'Shift') st.keys.delete('shift'); });
  addEventListener('blur', () => st.keys.clear());

  function step(dt) {
    if (!active()) { cancel(); return; }
    if (st.fly) {
      const u = 1 - Math.exp(-7 * dt), F = st.fly;
      camera.position.lerp(F.p, u); controls.target.lerp(F.t, u);
      const tol = 0.002 * F.p.distanceTo(F.t);
      if (camera.position.distanceTo(F.p) < tol && controls.target.distanceTo(F.t) < tol) { camera.position.copy(F.p); controls.target.copy(F.t); st.fly = null; }
    }
    if (Math.abs(st.zoom) > 1e-4) {
      const s = st.zoom * (1 - Math.exp(-14 * dt));
      st.zoom -= s;
      a.copy(camera.position).sub(controls.target);
      const d = a.length(), nd = Math.min(maxD(), Math.max(minD(), d * Math.exp(s)));
      camera.position.copy(controls.target).addScaledVector(a, nd / d);
    } else st.zoom = 0;
    const K = st.keys;
    if (!K.size) return;
    const has = (...x) => x.some((k) => K.has(k)), sp = (K.has('shift') ? 2.4 : 1) * dt, arr = arrows();
    let sx = 0, fw = 0;
    if (K.has('a') || (arr && K.has('arrowleft'))) sx += 1;
    if (K.has('d') || (arr && K.has('arrowright'))) sx -= 1;
    if (K.has('w') || (arr && K.has('arrowup'))) fw += 1;
    if (K.has('s') || (arr && K.has('arrowdown'))) fw -= 1;
    if (sx) pan(sx * sp * panSpeed, 0);
    if (fw) { // 沿著看的方向(水平)前後移動,每秒約目前距離的 0.45 倍
      const d = camera.position.distanceTo(controls.target);
      c.copy(controls.target).sub(camera.position).setY(0);
      if (c.lengthSq() > 1e-12) shift(c.normalize().multiplyScalar(fw * sp * 0.45 * d));
    }
    if (turn && K.has('q')) spin(sp * 1.1);
    if (turn && K.has('e')) spin(-sp * 1.1);
    if (has('=', '+')) st.zoom -= sp * 1.3;
    if (has('-', '_')) st.zoom += sp * 1.3;
  }
  const api = { step, flyTo, cancel, pan, state: st, home: H, camera, controls };
  globalThis.__cameraNav = api; // 除錯與自動測試用:在主控台看相機與觀察點
  return api;
}
