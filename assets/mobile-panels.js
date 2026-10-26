// 手機版的面板收合(2026-10-22):窄螢幕或矮螢幕上,教材的面板預設收成一條有標籤的細條,
// 細條上寫這塊面板裡有什麼(例如「調整 · 樣品、波長、掃描」「吸收光譜 · DPPH 甲醇溶液」),點一下展開、再點收起。
// 桌機版面完全不變:不是手機尺寸時不加任何 class,細條也藏起來。樣式在 mobile-panels.css。
//
// 用法:const mp = createMobilePanels({ panels: [...], dock: true, top: '.hud', suspended: () => false });
// panels 的每一項:
//   el      面板元素或選擇器
//   label   細條上的名稱(字串或傳回字串的函式)
//   items   名稱後面的小字,說明裡面有什麼(字串或函式;函式每 0.4 秒更新一次)
//   icon    'adjust'(可以調的東西)、'chart'(圖表)、'text'(說明)
//   place   'prepend'(預設,細條放在面板裡最前面)或 'before'(放在面板前面;面板內容會被頁面整個換掉時用)
//   dir     'up'(預設,面板往上展開,用在底部)或 'down'(往下展開,用在上方)
//   keep    收起時仍要按得到的按鈕(選擇器陣列),收起時暫時搬到細條右邊,展開時搬回原處
//   action  有這個就不是收合用的細條,而是按了就執行 action() 的細條(例如打開頁面原本的設定面板)
//   open    一開始是否展開(預設 false,也就是預設收起)
//   onToggle(open)  使用者展開或收起之後呼叫(例如收起控制面板時一併關掉它叫出來的說明框)
// dock    true 時,手機上把面板依 panels 的順序(去掉 action 那些)搬進畫面底部的停靠區由上往下排,
//         離開手機尺寸時搬回原處。用在面板原本各自用 position: fixed 疊在底部的頁面。
// top     停靠區最高只到這個元素的下緣(加 8 px),兩塊都展開也不會蓋住標題
//         這個高度另外寫在 CSS 變數 --mp-free-top,停靠區自己的高度寫在 --mp-dock-h,頁面可以拿來排說明框與導覽字幕
// suspended() 傳回 true 時(導覽、影片)暫時全部展開、藏起細條,結束後恢復原本的收合狀態
// rotateHint  true 時,觸控手機直拿的話在 top 元素下方提示「建議轉成橫式觀看」(見下面的 createRotateHint),
//             8 秒後或按 × 收起;同一次瀏覽(sessionStorage)只出現一次,導覽中不出現
// 橫拿手機時(landscape)停靠區改放在右上角、面板往下展開,下面整條讓給 3D 畫面。
// rail    true(預設,2026-10-24 起)時,細條全部改成畫面右緣、垂直置中的「‹」小把手(直排兩個字:調整、圖譜、說明,
//         或 short 指定的字),收起的面板整個藏起來;點把手面板才彈出來(停靠區排在把手左邊),把手變成「›」,再點一次收回。
//         keep 的按鈕在收起時變成把手下方的小圓鈕。瀏覽器支援全螢幕(Android 的 Chrome 等;iPhone 的 Safari 不支援網頁全螢幕)
//         時,把手最下面另有全螢幕鈕。<html> 加上 mp-railed,CSS 變數 --mp-rail-w 是把手那一條的寬度(導覽中不算)。
// 傳回 { open(el), close(el), toggle(el), active(), applyView(camera), freeRect() };
//   open(el) 在停靠區裡會把那塊面板捲進畫面(例如按「掃描」後的光譜)。
//   applyView(camera) 給有停靠區的頁面在 render() 裡呼叫:手機上(不是導覽或影片)把 three.js 相機的投影中心
//     (鏡頭看的那一點)平順地移到標題與停靠區之外最大的那一塊空地中間,空地小時稍微縮小(camera.zoom 最小 0.62),
//     面板展開或收起時跟著移;傳回 true 表示這一格的投影由這裡處理,false 時(桌機、導覽、影片)
//     會先清掉自己設的偏移與縮放,頁面照原本的方式處理。空地每 0.4 秒與面板開關、視窗大小改變時重量,不在每一格量。
//   freeRect() 傳回目前量到的空地 {x, y, w, h, cx, cy}(px)。傳回的這個物件也放在 globalThis.__mobilePanels,方便除錯與測試。
export const MOBILE_QUERY = '(max-width: 760px), (max-height: 500px)';
const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 760px) and (pointer: coarse)';
const HINT_KEY = 'mp-rotate-hint';

const ICONS = {
  adjust: '<path d="M2 4h7M12 4h2M2 8h2M7 8h7M2 12h9M14 12h0"/><circle cx="10.5" cy="4" r="1.6"/><circle cx="5.5" cy="8" r="1.6"/><circle cx="12.5" cy="12" r="1.6"/>',
  chart: '<path d="M2 13.5h12"/><path d="M3 11l3-4 2.5 2.5L13 3.5"/>',
  text: '<path d="M3 4h10M3 8h10M3 12h6"/>',
};
const svg = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CHEV = '<path d="M4 10l4-4 4 4"/>';
const val = (v) => (typeof v === 'function' ? v() : v) || '';
// 收在右緣的把手上直排的兩個字
const SHORT = { adjust: '調整', chart: '圖譜', text: '說明' };
// 全螢幕:按鈕觸發才能進入(瀏覽器的規定);Safari 舊版用 webkit 前綴,iPhone 不支援網頁全螢幕
const FS_IN = '<path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"/>';
const FS_OUT = '<path d="M6 2.5V6H2.5M10 2.5V6h3.5M13.5 10H10v3.5M2.5 10H6v3.5"/>';
// 匯出給生化原理的播放器(bio-lesson.js)用,播放列上另有自己樣式的全螢幕鈕
export const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
export const fsSupported = () => typeof document !== 'undefined' && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
export function toggleFullscreen() {
  if (fsElement()) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) { const r = exit.call(document); if (r && r.catch) r.catch(() => {}); }
    return;
  }
  const el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (req) { const r = req.call(el, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => {}); }
}
function makeFullscreenButton() {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'mp-fs';
  const sync = () => {
    const fs = !!fsElement();
    b.innerHTML = svg(fs ? FS_OUT : FS_IN);
    b.setAttribute('aria-label', fs ? '結束全螢幕' : '全螢幕');
    b.setAttribute('aria-pressed', String(fs));
  };
  b.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  sync();
  return b;
}

// 網站分頁列(.sitenav / #sitenav)比畫面窄、要左右捲時,把目前這一頁的分頁捲到分頁列中間。
// 手機上分頁列常常排不下,不捲的話目前這一頁會被擠到看不到的地方(GC-MS 橫拿時省掉標題,就靠分頁列標出所在的頁面)。
// 載入完成、字型載好與視窗大小改變(含轉向)時各捲一次;載入這個模組的頁面都會自動做,不用另外呼叫。
export function revealCurrentNav() {
  const a = document.querySelector('.sitenav a[aria-current="page"], #sitenav a[aria-current="page"]');
  const nav = a && a.closest('.sitenav, #sitenav');
  if (!nav || nav.scrollWidth <= nav.clientWidth + 1) return;
  const r = a.getBoundingClientRect(), n = nav.getBoundingClientRect();
  nav.scrollLeft += r.left + r.width / 2 - (n.left + n.width / 2);
}
if (typeof document !== 'undefined') {
  let raf = 0;
  const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(revealCurrentNav); };
  if (document.readyState === 'complete') later(); else addEventListener('load', later, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  addEventListener('resize', later);
}

// 「建議轉成橫式觀看」提示:手機尺寸(query)的觸控手機直拿時,開頁 1.5 秒後出現在 top 元素下方(沒有就離頂端 120 px),
// 8 秒後或按 × 收起;同一次瀏覽(sessionStorage 的 mp-rotate-hint)只出現一次。suspended() 為 true 時
// (導覽、錄影、還在載入)先不出現,出現後變成 true 或轉成橫的就收起。樣式是 mobile-panels.css 的 .mp-rotate。
// createMobilePanels({ rotateHint: true }) 會呼叫它;沒有收合面板的頁面(離子阱質譜的兩頁、生化原理)直接呼叫。
// text 是提示的文字(生化原理是 2D 動畫,傳自己的說法)。
export function createRotateHint({ top = null, suspended = () => false, query = MOBILE_QUERY, text = '建議轉成橫式觀看,3D 畫面比較大' } = {}) {
  const mq = matchMedia(query), portrait = matchMedia(PORTRAIT_PHONE);
  const pick = (x) => (typeof x === 'string' ? document.querySelector(x) : x);
  const born = performance.now();
  let hint = null, timer = 0, shown = false;
  try { shown = sessionStorage.getItem(HINT_KEY) === '1'; } catch (e) { /* storage blocked: show once per page */ }
  const ready = () => mq.matches && portrait.matches && !suspended();
  function place() {
    const t = top && pick(top), r = t ? t.getBoundingClientRect() : null;
    hint.style.top = `${Math.round(r && r.height ? r.bottom + 8 : 120)}px`;
  }
  function show() {
    shown = true;
    try { sessionStorage.setItem(HINT_KEY, '1'); } catch (e) { /* ignore */ }
    hint = document.createElement('div');
    hint.className = 'mp-rotate';
    hint.setAttribute('role', 'status');
    hint.innerHTML = svg('<rect x="4.5" y="1.5" width="7" height="13" rx="1.5"/><path d="M14.5 9.5a6 6 0 0 1-4 4.8M13 15l-2.5-.7.8-2.4"/>', 'mp-ico');
    const msg = document.createElement('span');
    msg.textContent = text;
    hint.append(msg);
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'mp-rotate-x';
    x.setAttribute('aria-label', '關閉提示');
    x.innerHTML = svg('<path d="M4 4l8 8M12 4l-8 8"/>');
    x.addEventListener('click', hide);
    hint.append(x);
    document.body.append(hint);
    place();
    timer = setTimeout(hide, 8000);
  }
  function hide() {
    clearTimeout(timer);
    if (hint) { hint.remove(); hint = null; }
  }
  const iv = setInterval(() => {
    if (hint) { if (ready()) place(); else hide(); return; }
    if (shown) { clearInterval(iv); return; }
    if (performance.now() - born >= 1500 && ready()) show();
  }, 400);
  return { hide };
}

export function createMobilePanels({ panels = [], dock = false, top = null, suspended = () => false, rotateHint = false, rail = true, query = MOBILE_QUERY } = {}) {
  const root = document.documentElement;
  const mq = matchMedia(query);
  const landscape = matchMedia('(orientation: landscape)');
  const $ = (s) => (typeof s === 'string' ? document.querySelector(s) : s);
  const list = panels.map((cfg, i) => ({ ...cfg, i, el: $(cfg.el), open: !!cfg.open })).filter((p) => p.el);
  let on = false, susp = false, dockEl = null, uid = 0;
  // the handles on the right edge (see the header comment); built once, attached while on
  const railEl = rail ? document.createElement('div') : null;
  if (railEl) railEl.className = 'mp-rail';
  const fsBtn = railEl && fsSupported() ? makeFullscreenButton() : null;

  for (const p of list) {
    const tab = document.createElement('div');
    tab.className = 'mp-tab' + (p.action ? ' mp-act' : '') + (p.dir === 'down' ? ' mp-down' : '');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mp-toggle';
    b.innerHTML = `${svg(ICONS[p.icon] || ICONS.adjust, 'mp-ico')}<b class="mp-label"></b><b class="mp-short" aria-hidden="true"></b><span class="mp-items"></span>`;
    const keep = document.createElement('span');
    keep.className = 'mp-keep';
    const chev = document.createElement('span');
    chev.className = 'mp-chev';
    chev.innerHTML = svg(CHEV);
    tab.append(b, keep);
    b.append(chev);
    if (!p.action) {
      if (!p.el.id) p.el.id = `mp-panel-${++uid}`;
      b.setAttribute('aria-controls', p.el.id);
    }
    b.addEventListener('click', () => { if (p.action) p.action(); else toggle(p); });
    p.tab = tab; p.btn = b; p.keepBox = keep; p.kept = [];
    if (p.place === 'before') p.el.parentNode.insertBefore(tab, p.el);
    else {
      // after the tabs already added to this panel, so the order on screen follows `panels`
      let ref = p.el.firstChild;
      while (ref && ref.classList && ref.classList.contains('mp-tab')) ref = ref.nextSibling;
      p.el.insertBefore(tab, ref);
    }
    refreshText(p);
  }
  const collapsible = list.filter((p) => !p.action);

  function refreshText(p) {
    const label = val(p.label), items = val(p.items), short = val(p.short) || SHORT[p.icon] || label;
    const lb = p.btn.querySelector('.mp-label'), it = p.btn.querySelector('.mp-items'), sh = p.btn.querySelector('.mp-short');
    if (lb.textContent !== label) lb.textContent = label;
    if (it.textContent !== items) it.textContent = items;
    if (sh.textContent !== short) sh.textContent = short;
    const verb = p.action ? '打開' : p.open ? '收起' : '展開';
    const aria = `${verb}${label}${items ? `:${items}` : ''}`;
    if (p.btn.getAttribute('aria-label') !== aria) p.btn.setAttribute('aria-label', aria);
  }
  // keep buttons: move into the bar while collapsed, back home when open or off
  function park(p, inBar) {
    if (!p.keep) return;
    if (inBar && !p.kept.length) {
      for (const s of p.keep) {
        const e = $(s);
        if (!e) continue;
        p.kept.push({ e, parent: e.parentNode, next: e.nextSibling });
        p.keepBox.append(e);
      }
    } else if (!inBar && p.kept.length) {
      for (const k of p.kept.reverse()) k.parent.insertBefore(k.e, k.next && k.next.parentNode === k.parent ? k.next : null);
      p.kept = [];
    }
  }
  function apply() {
    for (const p of collapsible) {
      const closed = on && !susp && !p.open;
      const hideEl = p.place === 'before';
      p.el.classList.toggle('mp-closed', closed && !hideEl);
      p.el.classList.toggle('mp-hidden', closed && hideEl);
      p.el.classList.toggle('mp-open', on && !closed);
      p.tab.classList.toggle('mp-is-open', !closed);
      p.btn.setAttribute('aria-expanded', String(!closed));
      park(p, closed);
      refreshText(p);
    }
    fitDock();
    // let the page re-measure its canvases and the free area for the 3D view
    requestAnimationFrame(() => dispatchEvent(new Event('resize')));
  }
  function fitDock() {
    if (!on) return;
    const t = top && $(top);
    const tr = t ? t.getBoundingClientRect() : null;
    const y = tr ? tr.bottom + 8 : 120;
    root.style.setProperty('--mp-free-top', `${Math.round(y)}px`);
    if (!dockEl) return;
    // landscape: the dock hangs from the top right, beside the title, and may reach the bottom of the screen;
    // portrait: it sits on the bottom and may grow only up to below the title
    const d = dockEl.getBoundingClientRect();
    const fromTop = landscape.matches; // mobile-panels.css hangs the dock from the top in landscape
    const beside = tr && (d.left >= tr.right || d.right <= tr.left);
    const room = fromTop ? innerHeight - d.top - 12 : innerHeight - (beside ? 12 : y) - 12;
    dockEl.style.maxHeight = `${Math.max(120, room)}px`;
    // pages place things above the dock with this (e.g. the tour captions)
    root.style.setProperty('--mp-dock-h', `${Math.round(dockEl.offsetHeight)}px`);
    const R = railEl && railEl.isConnected && !susp ? railEl.getBoundingClientRect() : null;
    free = measureFree([tr, dockEl.getBoundingClientRect(), R]);
  }
  // the biggest empty rectangle left by the title, the dock and the handles (candidates are built from their edges);
  // the biggest area wins (the instruments are wide: below the title is better than the narrow column beside it),
  // and the previous choice is kept unless another one is clearly bigger
  let free = null;
  function measureFree(rects) {
    const w = innerWidth, h = innerHeight;
    const obs = rects.filter((o) => o && o.width > 0 && o.height > 0);
    const hit = (r, o) => r[0] < o.right - 1 && r[2] > o.left + 1 && r[1] < o.bottom - 1 && r[3] > o.top + 1;
    const xs0 = [0, ...obs.map((o) => o.right)], xs1 = [w, ...obs.map((o) => o.left)];
    const ys0 = [0, ...obs.map((o) => o.bottom)], ys1 = [h, ...obs.map((o) => o.top)];
    const prev = free;
    let best = null, bs = -Infinity;
    for (const x0 of xs0) for (const x1 of xs1) for (const y0 of ys0) for (const y1 of ys1) {
      const r = [x0, y0, x1, y1];
      if (x1 - x0 < 60 || y1 - y0 < 60 || obs.some((o) => hit(r, o))) continue;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      let sc = (x1 - x0) * (y1 - y0);
      if (prev && Math.abs(prev.cx - cx) < 40 && Math.abs(prev.cy - cy) < 40) sc *= 1.12;
      if (sc > bs) { bs = sc; best = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx, cy }; }
    }
    // nothing left (both panels open up to the title): keep the last place rather than jumping to the middle
    return best || prev || { x: 0, y: 0, w, h, cx: w / 2, cy: h / 2 };
  }
  // keep the 3D subject in the free area (see the header comment)
  const view = { x: 0, y: 0, z: 1, set: false, last: 0 };
  function applyView(camera) {
    const now = performance.now(), dt = view.last ? Math.min(0.1, (now - view.last) / 1000) : 0;
    view.last = now;
    if (!on || !dockEl || suspended()) {
      if (view.set) { camera.clearViewOffset(); camera.zoom = 1; camera.updateProjectionMatrix(); view.set = false; }
      view.x = 0; view.y = 0; view.z = 1;
      return false;
    }
    const w = innerWidth, h = innerHeight, F = free || measureFree([]);
    const tx = w / 2 - F.cx, ty = h / 2 - F.cy, tz = Math.min(1, Math.max(0.62, Math.sqrt((F.w * F.h) / (w * h)) / 0.62));
    const k = view.set ? 1 - Math.exp(-7 * dt) : 1; // about a third of a second to settle; the first frame jumps
    view.x += (tx - view.x) * k; view.y += (ty - view.y) * k; view.z += (tz - view.z) * k;
    camera.zoom = view.z;
    // setViewOffset sets the aspect from the full size and updates the projection matrix
    camera.setViewOffset(w, h, view.x, view.y, w, h);
    view.set = true;
    return true;
  }
  function enter() {
    on = true;
    root.classList.add('mp');
    if (railEl) {
      // every bar becomes a handle on the right edge; a comment marks where it lived, to put it back on desktop sizes
      root.classList.add('mp-railed');
      document.body.append(railEl);
      for (const p of list) {
        if (!p.ph) p.ph = document.createComment('mp-tab');
        p.tab.before(p.ph);
        railEl.append(p.tab);
      }
      if (fsBtn) railEl.append(fsBtn);
    }
    if (dock) {
      if (!dockEl) { dockEl = document.createElement('div'); dockEl.className = 'mp-dock'; }
      document.body.append(dockEl);
      for (const p of collapsible) {
        p.home = { parent: p.el.parentNode, next: p.el.nextSibling };
        dockEl.append(p.el);
      }
    }
    apply();
  }
  function leave() {
    on = false;
    root.classList.remove('mp');
    if (dock && dockEl) {
      for (const p of [...collapsible].reverse()) {
        const h = p.home;
        if (h) h.parent.insertBefore(p.el, h.next && h.next.parentNode === h.parent ? h.next : null);
      }
      dockEl.remove();
    }
    if (railEl) {
      for (const p of list) if (p.ph && p.ph.parentNode) p.ph.replaceWith(p.tab);
      railEl.remove();
      root.classList.remove('mp-railed');
    }
    apply();
  }
  function toggle(p, force) {
    p.open = force === undefined ? !p.open : !!force;
    apply();
    if (p.onToggle) p.onToggle(p.open);
  }
  const find = (el) => collapsible.find((p) => p.el === $(el));
  const sync = () => {
    const s = !!suspended();
    if (s !== susp) { susp = s; root.classList.toggle('mp-suspended', s); apply(); }
    if (on) { for (const p of list) refreshText(p); fitDock(); }
  };
  mq.addEventListener('change', () => (mq.matches ? enter() : leave()));
  addEventListener('resize', () => { if (on) fitDock(); });
  setInterval(sync, 400);
  susp = !!suspended();
  root.classList.toggle('mp-suspended', susp);
  if (mq.matches) enter(); else apply();
  if (rotateHint) createRotateHint({ top, suspended, query });
  const api = {
    open: (el) => {
      const p = find(el);
      if (!p) return;
      if (!p.open) toggle(p, true);
      // both panels open can be taller than the dock: scroll so the one just opened is fully in view
      if (on && dockEl && dockEl.contains(p.el)) requestAnimationFrame(() => p.el.scrollIntoView({ block: 'nearest' }));
    },
    close: (el) => { const p = find(el); if (p && p.open) toggle(p, false); },
    toggle: (el) => { const p = find(el); if (p) toggle(p); },
    active: () => on,
    applyView,
    freeRect: () => free,
  };
  // 除錯與測試用(和 camera-nav.js 的 globalThis.__cameraNav 一樣)
  globalThis.__mobilePanels = api;
  return api;
}
