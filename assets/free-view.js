// 桌機小螢幕的取景(2026-11-06,使用者要求 1024×768 也要看得清楚主體):1024×768、1366×768 這類視窗裡,
// 左上的標題與說明、右上的控制面板、下方的譜圖會蓋到 3D 主角。這裡把 three.js 相機的投影中心(鏡頭看的那一點)
// 平順地移到這些面板之間最大的那一塊空地中間,空地小時稍微拉遠(camera.zoom,最小 minZoom);鏡頭位置不動,
// 拖曳、縮放與鍵盤操作照舊。做法和 mobile-panels.js 的 applyView 相同(那邊管手機,這裡管桌機),兩者不會同時作用。
// 1280×900 以上(含 1080P 與放大後的 2K、4K)不作用,畫面和原本一樣。
//
// 用法:const fv = createFreeView({ panels: ['.hud', '#ctl', '#console'], active: () => !FILM && !tour.on });
//       render() 裡:if (!mp.applyView(camera) && !fv.apply(camera)) applyShift();
// panels  會擋到 3D 的面板(選擇器或元素);藏起來(display none、visibility hidden、透明)的不算
// active  傳回 false 時(導覽、影片、手機版)不作用,先清掉自己設的偏移與縮放
// query   作用的視窗大小(預設 SMALL_DESKTOP)
// 傳回 { apply(camera), freeRect() }:apply 傳回 true 表示這一格的投影由這裡處理;freeRect() 是目前量到的空地 {x, y, w, h, cx, cy}。
// 空地每 0.4 秒與視窗大小改變時重量,不在每一格量。
export const SMALL_DESKTOP = '(max-width: 1279px), (max-height: 899px)';

// 不和任何面板重疊的最大長方形(候選邊界取自面板的邊);面積最大的勝出,上一次的位置附近稍微加分,避免來回跳
export function largestFreeRect(rects, w, h, prev = null, margin = 10) {
  const obs = rects.filter((o) => o && o.width > 0 && o.height > 0)
    .map((o) => ({ left: o.left - margin, top: o.top - margin, right: o.right + margin, bottom: o.bottom + margin }));
  const hit = (r, o) => r[0] < o.right - 1 && r[2] > o.left + 1 && r[1] < o.bottom - 1 && r[3] > o.top + 1;
  const xs0 = [0, ...obs.map((o) => o.right)].filter((v) => v >= 0 && v < w), xs1 = [w, ...obs.map((o) => o.left)].filter((v) => v > 0 && v <= w);
  const ys0 = [0, ...obs.map((o) => o.bottom)].filter((v) => v >= 0 && v < h), ys1 = [h, ...obs.map((o) => o.top)].filter((v) => v > 0 && v <= h);
  let best = null, bs = -Infinity;
  for (const x0 of xs0) for (const x1 of xs1) for (const y0 of ys0) for (const y1 of ys1) {
    const r = [x0, y0, x1, y1];
    if (x1 - x0 < 80 || y1 - y0 < 80 || obs.some((o) => hit(r, o))) continue;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    let sc = (x1 - x0) * (y1 - y0);
    if (prev && Math.abs(prev.cx - cx) < 40 && Math.abs(prev.cy - cy) < 40) sc *= 1.12;
    if (sc > bs) { bs = sc; best = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx, cy }; }
  }
  return best || prev || { x: 0, y: 0, w, h, cx: w / 2, cy: h / 2 };
}

export function createFreeView({ panels = [], active = () => true, query = SMALL_DESKTOP, minZoom = 0.72 } = {}) {
  const mq = typeof matchMedia === 'function' ? matchMedia(query) : { matches: false };
  let free = null, measuredAt = -Infinity, dirty = true;
  addEventListener('resize', () => { dirty = true; });
  function measure(now) {
    const rects = [];
    for (const p of panels) {
      const el = typeof p === 'string' ? document.querySelector(p) : p;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
      rects.push(el.getBoundingClientRect());
    }
    const next = largestFreeRect(rects, innerWidth, innerHeight, free);
    // 說明文字長短一變,面板就高一點矮一點:空地的中心移動不到 24 px、面積差不到一成時沿用原本的,主角才不會跟著微動
    const same = free && !dirty && Math.abs(next.cx - free.cx) < 24 && Math.abs(next.cy - free.cy) < 24 && Math.abs(next.w * next.h / (free.w * free.h) - 1) < 0.1;
    if (!same) free = next;
    measuredAt = now; dirty = false;
  }
  const view = { x: 0, y: 0, z: 1, set: false, last: 0 };
  function apply(camera) {
    const now = performance.now(), dt = view.last ? Math.min(0.1, (now - view.last) / 1000) : 0;
    view.last = now;
    if (!mq.matches || !active()) {
      if (view.set) { camera.clearViewOffset(); camera.zoom = 1; camera.updateProjectionMatrix(); view.set = false; }
      view.x = 0; view.y = 0; view.z = 1; free = null; dirty = true;
      return false;
    }
    if (dirty || now - measuredAt > 400) measure(now);
    const w = innerWidth, h = innerHeight, F = free;
    const tx = w / 2 - F.cx, ty = h / 2 - F.cy;
    // 空地占畫面的比例越小拉得越遠;占一半以上就不拉遠
    const tz = Math.min(1, Math.max(minZoom, Math.sqrt((F.w * F.h) / (w * h)) / 0.7));
    const k = view.set ? 1 - Math.exp(-7 * dt) : 1; // 約三分之一秒移到位;第一格直接到位
    view.x += (tx - view.x) * k; view.y += (ty - view.y) * k; view.z += (tz - view.z) * k;
    camera.zoom = view.z;
    // setViewOffset 會用完整大小設 aspect 並更新投影矩陣
    camera.setViewOffset(w, h, view.x, view.y, w, h);
    view.set = true;
    return true;
  }
  const api = { apply, freeRect: () => free };
  globalThis.__freeView = api;
  return api;
}
