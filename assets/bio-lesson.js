// 生化原理教材共用的播放器(2026-10-26)。每份教材提供「章節」與「自己調整的控制項」,這裡負責:
//   畫布(依實際大小與螢幕密度重設,畫面一律用邏輯座標 W × H 畫,等比例縮放置中)、
//   播放與暫停、上一章與下一章、進度列(每章一段,點一下跳到那一章的那個時間點)、字幕(依時間換句)、
//   章節清單、控制項(滑桿、選項、開關、按鈕,只在指定的章節出現)、網址 #章節代號(可以複製分享)、
//   鍵盤(空白鍵播放或暫停,左右鍵換章;焦點在輸入元件時不搶)、分頁藏起來時不畫、減少動態效果時不自動播放。
// 版面在 bio-lesson.css,畫圖小工具在 bio-draw.js。頁面上要有的元素見 createLesson 開頭的 need()。
//
// 用法:
//   createLesson({
//     W: 960, H: 540,                      // 邏輯座標
//     state: { anneal: 58 },               // 控制項的值都放在這裡,畫圖時讀
//     chapters: [{ key: 'denature', name: '變性', dur: 10,
//                  cues: [[0, '第一句字幕'], [4.5, '第二句']],
//                  draw(g, t, S) { ... },    // g 是 bio-draw.js 的 makeG(),t 是這一章的秒數
//                  enter(S) { ... } }],      // 進到這一章時(選用)
//     controls: [{ id: 'anneal', label: '黏合溫度', type: 'range', min: 45, max: 72, step: 1, unit: ' °C',
//                  chapters: ['anneal', 'gel'], restart: true }],
//   });
// 控制項的種類:range(滑桿,format(v) 可自訂顯示)、seg(幾個選項,options: [{ v, label }])、toggle(開關)、
//   button(onClick(S));onChange(v, S) 在值改變後呼叫。restart: true 時改了值這一章從頭播。
//   使用者在某一章動過控制項,這一章播完就停在最後,不自動跳到下一章(讓人看清楚自己調的結果)。
// 章節可以另外有 pointer(type, x, y, S):在畫面上按下(down)、移動(move,滑鼠或按住時)、放開(up)時呼叫,
//   x、y 是邏輯座標;傳回 true 表示使用者動過(這一章播完停住)。要在畫面上拖動的章節加 drag: true,
//   手指在畫布上才不會捲動頁面。畫面上的操作要改控制項的值時,用傳回的 api.set(id, v)(右邊的顯示會跟著更新)。
// 頁面有 #btnFs 時,瀏覽器支援全螢幕就顯示全螢幕鈕(和其他教材共用 mobile-panels.js 的判斷)。全螢幕是劇場模式
//   (html.bio-fs,版面在 bio-lesson.css),手機上順便鎖成橫向。觸控手機直拿時的轉向提示也由這裡顯示,頁面不用自己呼叫 createRotateHint。
// 手機(觸控的小螢幕)上講解一律全螢幕(2026-10-31):開頁不自動播放,畫面中間有「開始講解」;從播放鈕、「開始講解」、章節清單、
//   進度列或「自己調整」開始播放時先進全螢幕,離開全螢幕就暫停。iPhone 的 Safari 不支援網頁全螢幕,改用同一套劇場版面蓋滿畫面,
//   所以手機上一定有全螢幕鈕。
// 傳回的 api(也掛在 globalThis.__lesson,給測試與 scripts/make-og-images.mjs 用):go(第幾章或章節代號)、play()、pause()、
//   chapter(目前章節代號)、duration(這一章幾秒)、time(可讀可設)、state、redraw()、set(id, v, { restart })。
// 畫面縮得很小時(手機),畫圖的字會自動放大(g.boost,最多 1.3 倍),版面要留空間。
import { makeG, C } from './bio-draw.js';
// 分頁列排不下時捲到目前這一頁(模組載入就會做);全螢幕共用同一套判斷
import { fsSupported, fsElement, createRotateHint } from './mobile-panels.js';

export function createLesson({ chapters, state = {}, controls = [], W = 960, H = 540, autoplay = true }) {
  const need = (s) => { const e = document.querySelector(s); if (!e) throw new Error(`bio-lesson: 頁面缺少 ${s}`); return e; };
  const canvas = need('#stage'), ctx = canvas.getContext('2d');
  const capNo = need('#cap .cap-no'), capCh = need('#cap .cap-ch'), capTx = need('#cap .cap-tx');
  const btnPrev = need('#btnPrev'), btnPlay = need('#btnPlay'), btnNext = need('#btnNext'), prog = need('#prog'), chName = need('#chName');
  const list = need('#chapters'), ops = need('#ops'), opsBody = need('#ops .ops-body');
  const S = state;
  const g = makeG(ctx, W, H);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 手機:觸控而且畫面小(直拿寬 760 px 以下,或橫拿高 500 px 以下)
  const phone = matchMedia('(pointer: coarse) and (max-width: 760px), (pointer: coarse) and (max-height: 500px)');
  let ci = 0, t = 0, playing = false, last = performance.now(), touched = false, lastCue = -2;
  const view = { s: 1, ox: 0, oy: 0 };
  // 手機上畫面中間的「開始講解」:沒在播、也不在全螢幕時出現,按了等於按播放(會先進全螢幕)
  const startBtn = document.createElement('button');
  startBtn.type = 'button'; startBtn.className = 'bio-start'; startBtn.hidden = true;
  startBtn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.6v10.8L13.2 8z" fill="currentColor"/></svg><span>開始講解</span><small>全螢幕</small>';
  canvas.parentElement.append(startBtn);

  // 章節清單與進度列
  const items = chapters.map((c, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span class="no"></span><span class="nm"></span>';
    b.querySelector('.no').textContent = String(i + 1).padStart(2, '0');
    b.querySelector('.nm').textContent = c.name;
    b.addEventListener('click', () => { go(i); userPlay(); });
    li.append(b); list.append(li);
    const sgm = document.createElement('button');
    sgm.type = 'button'; sgm.className = 'sg'; sgm.style.flexGrow = String(c.dur);
    sgm.setAttribute('aria-label', `第 ${i + 1} 章:${c.name}`);
    sgm.innerHTML = '<i></i>';
    sgm.addEventListener('click', (e) => {
      const r = sgm.getBoundingClientRect();
      const k = Math.min(0.98, Math.max(0, (e.clientX - r.left) / r.width));
      go(i, k * c.dur); userPlay();
    });
    prog.append(sgm);
    return { b, sgm, fill: sgm.querySelector('i') };
  });

  // 控制項
  const ctl = controls.map((c) => {
    if (c.type !== 'button' && S[c.id] === undefined) S[c.id] = c.value;
    const box = document.createElement('div');
    box.className = 'op op-' + c.type;
    const id = 'op-' + c.id;
    const lab = document.createElement('label');
    lab.className = 'op-k';
    if (c.type === 'range') {
      lab.htmlFor = id;
      const nm = document.createElement('span'); nm.textContent = c.label;
      const out = document.createElement('output'); out.className = 'op-v';
      lab.append(nm, out);
      const inp = document.createElement('input');
      Object.assign(inp, { type: 'range', id, min: c.min, max: c.max, step: c.step || 1, value: S[c.id] });
      const show = () => { out.textContent = c.format ? c.format(S[c.id], S) : `${S[c.id]}${c.unit || ''}`; inp.style.setProperty('--p', `${((S[c.id] - c.min) / (c.max - c.min)) * 100}%`); };
      inp.addEventListener('input', () => { S[c.id] = Number(inp.value); show(); changed(c); });
      box.append(lab, inp); show();
      return { c, box, sync: () => { inp.value = S[c.id]; show(); } };
    }
    if (c.type === 'seg') {
      lab.textContent = c.label;
      const seg = document.createElement('div'); seg.className = 'seg'; seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', c.label);
      const btns = c.options.map((o) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = o.label;
        b.addEventListener('click', () => { S[c.id] = o.v; sync(); changed(c); });
        seg.append(b); return { b, o };
      });
      const sync = () => btns.forEach(({ b, o }) => b.setAttribute('aria-pressed', String(S[c.id] === o.v)));
      box.append(lab, seg); sync();
      return { c, box, sync };
    }
    if (c.type === 'toggle') {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tg'; b.textContent = c.label;
      const sync = () => b.setAttribute('aria-pressed', String(!!S[c.id]));
      b.addEventListener('click', () => { S[c.id] = !S[c.id]; sync(); changed(c); });
      box.append(b); sync();
      return { c, box, sync };
    }
    const b = document.createElement('button'); b.type = 'button'; b.className = 'tg'; b.textContent = c.label;
    b.addEventListener('click', () => { if (c.onClick) c.onClick(S); changed(c); });
    box.append(b);
    return { c, box, sync: () => {} };
  });
  ctl.forEach((x) => opsBody.append(x.box));
  function changed(c) {
    touched = true;
    if (c.onChange && c.type !== 'button') c.onChange(S[c.id], S);
    // 一個控制項改了,其他看得到的控制項也重新顯示(它們的 format 可能用到這個值)
    for (const x of ctl) if (x.c !== c && !x.box.hidden) x.sync();
    if (c.restart) { t = 0; lastCue = -2; userPlay(); }
  }
  const refreshControls = () => {
    const key = chapters[ci].key;
    let any = false;
    for (const x of ctl) { const show = !x.c.chapters || x.c.chapters.includes(key); x.box.hidden = !show; if (show) { any = true; x.sync(); } }
    ops.hidden = !any;
  };

  function go(i, at = 0) {
    ci = Math.max(0, Math.min(chapters.length - 1, i));
    t = at; touched = false; lastCue = -2;
    const c = chapters[ci];
    if (c.enter) c.enter(S);
    // 看過的章節由 .done 補滿;其他章節的進度歸零(往回跳時,後面的章節不能留著上次播到的長度)
    items.forEach((it, k) => { it.b.setAttribute('aria-current', k === ci ? 'step' : 'false'); it.sgm.classList.toggle('on', k === ci); it.sgm.classList.toggle('done', k < ci); if (k !== ci) it.fill.style.width = '0%'; });
    capNo.textContent = String(ci + 1).padStart(2, '0');
    capCh.textContent = c.name;
    chName.textContent = `${ci + 1} / ${chapters.length}・${c.name}`;
    canvas.setAttribute('aria-label', `第 ${ci + 1} 章:${c.name}`);
    refreshControls();
    if (typeof cursor === 'function') cursor();
    if (location.hash.slice(1) !== c.key) history.replaceState(null, '', `#${c.key}`);
  }
  function setPlaying(p) {
    playing = !!p;
    btnPlay.setAttribute('aria-pressed', String(playing));
    btnPlay.setAttribute('aria-label', playing ? '暫停' : '播放');
    btnPlay.querySelector('.lbl').textContent = playing ? '暫停' : '播放';
    btnPlay.classList.toggle('playing', playing);
    syncStart();
  }
  // 使用者按了要播放(播放鈕、「開始講解」、章節清單、進度列、「自己調整」):手機上先進全螢幕,講解不在頁面裡的小框播
  function userPlay() {
    if (phone.matches) enterTheater();
    setPlaying(true);
  }
  btnPlay.addEventListener('click', () => {
    if (playing) { setPlaying(false); return; }
    if (ci === chapters.length - 1 && t >= chapters[ci].dur - 0.01) go(0);
    else if (t >= chapters[ci].dur - 0.01) t = 0;
    userPlay();
  });
  startBtn.addEventListener('click', () => btnPlay.click());
  btnPrev.addEventListener('click', () => { go(t > 1.5 ? ci : ci - 1); });
  // 全螢幕(劇場模式):html 加上 .bio-fs(版面在 bio-lesson.css),只留動畫、字幕、播放列與自己調整,動畫盡量大。
  // 瀏覽器支援網頁全螢幕時用真的全螢幕;手機直拿時動畫只有螢幕寬,圖上的小字只剩 6 px 左右,所以手機進入全螢幕時順便鎖成橫向
  // (Android 的 Chrome 只有全螢幕時能鎖),離開時解除。不支援的(iPhone 的 Safari)用同一套版面蓋滿瀏覽器的畫面(pseudo),
  // 網址列還在,也不能替使用者轉向。要求真的全螢幕被拒絕時也退回這一種。
  const root = document.documentElement;
  const btnFs = document.querySelector('#btnFs');
  const orient = typeof screen !== 'undefined' ? screen.orientation : null;
  let pseudo = false, locked = false, wasOn = false;
  const theaterOn = () => !!fsElement() || pseudo;
  function syncTheater() {
    const on = theaterOn();
    root.classList.toggle('bio-fs', on);
    if (btnFs) { btnFs.setAttribute('aria-pressed', String(on)); btnFs.setAttribute('aria-label', on ? '結束全螢幕' : '全螢幕'); btnFs.classList.toggle('on', on); }
    if (fsElement() && phone.matches && orient && orient.lock) orient.lock('landscape').then(() => { locked = true; }, () => {});
    if (!fsElement() && locked) { locked = false; try { orient.unlock(); } catch (e) { /* already unlocked */ } }
    // 手機上離開全螢幕(按鈕、返回鍵)就暫停
    if (wasOn && !on && phone.matches) setPlaying(false);
    wasOn = on;
    syncStart();
  }
  function enterTheater() {
    if (theaterOn()) return;
    const usePseudo = () => { if (!fsElement() && !pseudo) { pseudo = true; syncTheater(); } };
    const req = fsSupported() && (root.requestFullscreen || root.webkitRequestFullscreen);
    if (!req) { usePseudo(); return; }
    try { const r = req.call(root, { navigationUI: 'hide' }); if (r && r.catch) r.catch(usePseudo); } catch (e) { usePseudo(); }
  }
  function exitTheater() {
    if (pseudo) { pseudo = false; syncTheater(); }
    const exit = fsElement() && (document.exitFullscreen || document.webkitExitFullscreen);
    if (exit) { try { const r = exit.call(document); if (r && r.catch) r.catch(() => {}); } catch (e) { /* already out */ } }
  }
  function syncStart() { startBtn.hidden = !(phone.matches && !playing && !theaterOn()); }
  if (btnFs) {
    // 支援網頁全螢幕的瀏覽器都有這顆;不支援的只在手機上出現(用蓋滿畫面的版面)
    const showFs = () => { btnFs.hidden = !(fsSupported() || phone.matches); };
    showFs();
    phone.addEventListener('change', showFs);
    btnFs.addEventListener('click', () => { if (theaterOn()) exitTheater(); else enterTheater(); });
  }
  phone.addEventListener('change', syncStart);
  document.addEventListener('fullscreenchange', syncTheater);
  document.addEventListener('webkitfullscreenchange', syncTheater);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && pseudo) exitTheater(); });
  syncTheater();
  btnNext.addEventListener('click', () => { if (ci < chapters.length - 1) go(ci + 1); });
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'select', 'textarea'].includes(tag) || e.target.isContentEditable) return;
    if (e.key === ' ' && tag !== 'button') { e.preventDefault(); btnPlay.click(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); btnNext.click(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); btnPrev.click(); }
  });
  addEventListener('hashchange', () => { const k = chapters.findIndex((c) => c.key === location.hash.slice(1)); if (k >= 0 && k !== ci) go(k); });

  // 畫布:實際像素跟著元素大小與螢幕密度,內容用邏輯座標等比例縮放置中
  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    view.s = Math.min(w / W, h / H); view.ox = (w - W * view.s) / 2; view.oy = (h - H * view.s) / 2;
    // 畫面縮得很小時(手機)字放大一點:每個邏輯像素小於 0.5 個 CSS 像素時開始放大,最多 1.3 倍
    g.boost = Math.min(1.3, Math.max(1, 0.5 / (view.s / dpr)));
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  // 點畫面:章節有 pointer(type, x, y, S) 時,把 down / move / up 換成邏輯座標交給它;傳回 true 表示使用者動過(這一章播完停住)
  let dragging = false;
  const pointer = (type, e) => {
    const c = chapters[ci];
    if (!c.pointer || (type === 'move' && !dragging && e.pointerType !== 'mouse')) return;
    const r = canvas.getBoundingClientRect(), k = canvas.width / r.width;
    const x = ((e.clientX - r.left) * k - view.ox) / view.s, y = ((e.clientY - r.top) * k - view.oy) / view.s;
    if (c.pointer(type, x, y, S) === true) touched = true;
  };
  canvas.addEventListener('pointerdown', (e) => { dragging = true; pointer('down', e); });
  canvas.addEventListener('pointermove', (e) => pointer('move', e));
  addEventListener('pointerup', (e) => { if (dragging) { dragging = false; pointer('up', e); } });
  // 章節要在畫面上拖動(drag: true)時,手指在畫布上不捲動頁面;其他時候手指在畫布上滑動照樣捲頁面
  const cursor = () => { const c = chapters[ci]; canvas.style.cursor = c.pointer ? 'pointer' : ''; canvas.style.touchAction = c.pointer && c.drag ? 'none' : ''; };

  function caption() {
    const cues = chapters[ci].cues || [];
    let k = -1;
    for (let i = 0; i < cues.length; i++) if (cues[i][0] <= t + 1e-6) k = i;
    if (k !== lastCue) { lastCue = k; capTx.textContent = k >= 0 ? cues[k][1] : ''; }
  }
  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.s, 0, 0, view.s, view.ox, view.oy);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    try { chapters[ci].draw(g, t, S); } catch (err) { if (!draw.err) { draw.err = true; console.error(err); } }
    ctx.restore();
    caption();
    const c = chapters[ci];
    items[ci].fill.style.width = `${Math.min(100, (t / c.dur) * 100)}%`;
  }
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (document.hidden) return;
    if (playing) {
      t += dt;
      const c = chapters[ci];
      if (t >= c.dur) {
        if (!touched && ci < chapters.length - 1) go(ci + 1);
        else { t = c.dur; setPlaying(false); }
      }
    }
    draw();
  }
  const start = chapters.findIndex((c) => c.key === decodeURIComponent(location.hash.slice(1)));
  go(start >= 0 ? start : 0);
  // 手機上不自動播放:進全螢幕一定要使用者按一下(瀏覽器的規定),講解又只在全螢幕播,所以等使用者按「開始講解」或播放鈕
  setPlaying(autoplay && !reduce && !phone.matches);
  requestAnimationFrame(frame);
  // set(id, v):從畫面上的操作改控制項的值(例如在圖上拖門檻),右邊的顯示跟著更新;restart 預設不從頭播
  const setValue = (id, v, { restart = false } = {}) => {
    const x = ctl.find((k) => k.c.id === id);
    S[id] = v; touched = true;
    if (x) { x.sync(); if (x.c.onChange) x.c.onChange(v, S); for (const k of ctl) if (k !== x && !k.box.hidden) k.sync(); }
    if (restart) { t = 0; lastCue = -2; setPlaying(true); }
  };
  const api = { go: (k) => go(typeof k === 'number' ? k : chapters.findIndex((c) => c.key === k)), play: () => setPlaying(true), pause: () => setPlaying(false),
    get chapter() { return chapters[ci].key; }, get duration() { return chapters[ci].dur; }, get time() { return t; }, set time(v) { t = v; lastCue = -2; }, state: S, redraw: draw, set: setValue };
  globalThis.__lesson = api; // 除錯與測試用
  // 觸控手機直拿時提示一次(mobile-panels.js 的 createRotateHint),排在播放列下面,不擋播放鈕。
  // 直拿與一般橫拿時動畫都被約 200 px 的高度限住,只有全螢幕而且橫拿才真的變大:能全螢幕的瀏覽器(Android 的 Chrome 等)
  // 進全螢幕時會自動轉成橫的;不能的(iPhone 的 Safari)只能請使用者自己把手機轉成橫的。
  createRotateHint({ top: '.bar', suspended: theaterOn, text: fsSupported() ? '按播放會全螢幕,動畫轉成橫的、放到最大' : '按播放會全螢幕;手機轉成橫的,動畫更大' });
  return api;
}
