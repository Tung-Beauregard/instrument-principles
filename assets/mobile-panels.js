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
// rotateHint  true 時,觸控手機直拿的話在 3D 畫面下方提示「建議轉成橫式觀看」,8 秒後或按 × 收起;
//             同一次瀏覽(sessionStorage)只出現一次,導覽中不出現
// 橫拿手機時(landscape)停靠區改放在右側,不再整條橫在底部,讓出中間的 3D 畫面。
// 傳回 { open(el), close(el), toggle(el), active() };open(el) 在停靠區裡會把那塊面板捲進畫面(例如按「掃描」後的光譜)。
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

export function createMobilePanels({ panels = [], dock = false, top = null, suspended = () => false, rotateHint = false, query = MOBILE_QUERY } = {}) {
  const root = document.documentElement;
  const mq = matchMedia(query);
  const portrait = matchMedia(PORTRAIT_PHONE);
  const $ = (s) => (typeof s === 'string' ? document.querySelector(s) : s);
  const list = panels.map((cfg, i) => ({ ...cfg, i, el: $(cfg.el), open: !!cfg.open })).filter((p) => p.el);
  let on = false, susp = false, dockEl = null, uid = 0;

  for (const p of list) {
    const tab = document.createElement('div');
    tab.className = 'mp-tab' + (p.action ? ' mp-act' : '') + (p.dir === 'down' ? ' mp-down' : '');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mp-toggle';
    b.innerHTML = `${svg(ICONS[p.icon] || ICONS.adjust, 'mp-ico')}<b class="mp-label"></b><span class="mp-items"></span>`;
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
    const label = val(p.label), items = val(p.items);
    const lb = p.btn.querySelector('.mp-label'), it = p.btn.querySelector('.mp-items');
    if (lb.textContent !== label) lb.textContent = label;
    if (it.textContent !== items) it.textContent = items;
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
    // the dock may go up to the top of the screen when it sits beside the title (landscape), else only to below it
    const d = dockEl.getBoundingClientRect();
    const beside = tr && (d.left >= tr.right || d.right <= tr.left);
    dockEl.style.maxHeight = `${Math.max(120, innerHeight - (beside ? 12 : y) - 12)}px`;
    // pages place things above the dock with this (e.g. the tour captions)
    root.style.setProperty('--mp-dock-h', `${Math.round(dockEl.offsetHeight)}px`);
  }
  // "turn the phone sideways" hint
  let hint = null, hintTimer = 0, hintShown = false;
  const born = performance.now();
  try { hintShown = sessionStorage.getItem(HINT_KEY) === '1'; } catch (e) { /* storage blocked: show once per page */ }
  function showHint() {
    if (!rotateHint || hintShown || !on || susp || !portrait.matches || performance.now() - born < 1500) return;
    hintShown = true;
    try { sessionStorage.setItem(HINT_KEY, '1'); } catch (e) { /* ignore */ }
    hint = document.createElement('div');
    hint.className = 'mp-rotate';
    hint.setAttribute('role', 'status');
    hint.innerHTML = `${svg('<rect x="4.5" y="1.5" width="7" height="13" rx="1.5"/><path d="M14.5 9.5a6 6 0 0 1-4 4.8M13 15l-2.5-.7.8-2.4"/>', 'mp-ico')}<span>建議轉成橫式觀看,3D 畫面比較大</span>`;
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'mp-rotate-x';
    x.setAttribute('aria-label', '關閉提示');
    x.innerHTML = svg('<path d="M4 4l8 8M12 4l-8 8"/>');
    x.addEventListener('click', hideHint);
    hint.append(x);
    document.body.append(hint);
    hintTimer = setTimeout(hideHint, 8000);
  }
  function hideHint() {
    clearTimeout(hintTimer);
    if (hint) { hint.remove(); hint = null; }
  }
  function enter() {
    on = true;
    root.classList.add('mp');
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
    if (hint && (susp || !on || !portrait.matches)) hideHint();
    else showHint();
  };
  mq.addEventListener('change', () => (mq.matches ? enter() : leave()));
  addEventListener('resize', () => { if (on) fitDock(); });
  setInterval(sync, 400);
  susp = !!suspended();
  root.classList.toggle('mp-suspended', susp);
  if (mq.matches) enter(); else apply();
  return {
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
  };
}
