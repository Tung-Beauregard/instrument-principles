// 中英切換(使用者 2026-11-06 要求,全站)。每一頁在 <head> 最前面同步載入(不加 defer、不是 module),畫面出來之前決定語言:
//   網址 ?lang=en 或 ?lang=zh 優先(順便記在 localStorage 的 ip-lang),沒有就用上次的選擇,預設中文。
//   英文時 <html lang="en">、網址帶 ?lang=en(複製網址給別人,打開也是英文),站內連結也帶上;中文時網址拿掉 lang。
// 頁面怎麼寫英文:
//   1. 有連結、上下標或好幾段的內容:中文放 lang="zh-Hant" 的元素,緊接著放一個 lang="en" 的元素寫英文;這裡注入的樣式只顯示目前語言的那一份。
//   2. 只含文字的元素:加 data-en="English",英文時換掉文字(整頁讀完、頁面自己的程式執行之前)。<title> 也一樣。
//   3. 屬性:data-en-aria-label、data-en-title、data-en-alt、data-en-placeholder…,英文時換掉同名的屬性。
//   4. 程式裡的字串:zhEn('中文', 'English')。語言在載入時就決定,切換語言會重新載入頁面,所以在哪裡呼叫都可以。
//   scripts/check-i18n.mjs 檢查每一段給人看的中文都有英文。
// 切換鈕放在分頁列(nav.sitenav 或 nav#sitenav)的「← 儀器入口」後面(中文頁寫 EN、英文頁寫中文);頁面有 [data-lang-slot] 時放在那裡(入口的標題列)。
(function () {
  'use strict';
  var KEY = 'ip-lang';
  var url = new URL(location.href);
  var q = url.searchParams.get('lang');
  var lang = q === 'en' || q === 'zh' ? q : null;
  if (lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 不能存時只看網址 */ }
  } else {
    try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'; } catch (e) { lang = 'zh'; }
  }
  var en = lang === 'en';
  var root = document.documentElement;
  if (en) root.lang = 'en';
  // 網址跟著語言:英文帶 ?lang=en,中文不帶
  if (en ? q !== 'en' : q !== null) {
    if (en) url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    try { history.replaceState(history.state, '', url.pathname + url.search + url.hash); } catch (e) { /* file:// 這類網址不能改 */ }
  }

  function zhEn(zh, english) { return en ? english : zh; }

  // 站內的頁面連結帶上 ?lang=en(存不了選擇的瀏覽器換頁後也維持英文);外站、同頁的 # 不動
  function link(href) {
    if (!en || typeof href !== 'string' || /^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return href;
    var hash = '', query = '', path = href;
    var h = path.indexOf('#'); if (h >= 0) { hash = path.slice(h); path = path.slice(0, h); }
    var s = path.indexOf('?'); if (s >= 0) { query = path.slice(s + 1); path = path.slice(0, s); }
    if (!/(^|\/)$|\.html$|^\.\.?$/.test(path)) return href; // 只改指向頁面的連結(資料夾或 .html)
    var p = new URLSearchParams(query); p.set('lang', 'en');
    return path + '?' + p.toString() + hash;
  }

  // 切換語言:記住選擇,換成另一個語言的網址(保留其他參數與 #)
  function hrefFor(next) {
    var u = new URL(location.href);
    u.searchParams.set('lang', next);
    return u.pathname + u.search + u.hash;
  }
  function switchTo(next) {
    try { localStorage.setItem(KEY, next); } catch (e) { /* 網址帶著 lang,一樣切得過去 */ }
    location.href = hrefFor(next);
  }

  // 只顯示目前語言的那一份;切換鈕的樣式(其他沿用各頁分頁列 a 的樣式)
  var css = (en ? '[lang|="zh"]:not(html):not(.lang-sw){display:none!important}' : '[lang="en"]:not(html):not(.lang-sw){display:none!important}') +
    // 分頁列排不下要橫向捲動時(手機),切換鈕黏在左邊一直看得到;往左多畫 6 px 的底色,蓋住捲過去的字
    '.lang-sw{position:sticky;left:0;z-index:1;flex:none;margin:0 2px;padding-left:8px!important;padding-right:8px!important;color:#a5f3cd!important;box-shadow:inset 0 0 0 1px rgba(165,243,205,.38),-6px 0 0 #0f1716;' +
    'background:#0f1716;font-weight:600!important;letter-spacing:0;text-decoration:none;white-space:nowrap}' +
    '.lang-sw:hover{background:rgba(165,243,205,.14)!important;color:#c8fbe2!important}' +
    '.lang-sw:focus-visible{outline:2px solid #a5f3cd;outline-offset:2px}' +
    'html.i18n-pending [data-en]{visibility:hidden}';
  var style = document.createElement('style');
  style.id = 'i18n-style';
  style.textContent = css;
  (document.head || root).appendChild(style);
  if (en) root.classList.add('i18n-pending');

  function apply() {
    if (en) {
      var title = document.querySelector('title[data-en]');
      if (title) document.title = title.getAttribute('data-en');
      var els = document.querySelectorAll('[data-en]');
      for (var i = 0; i < els.length; i++) if (els[i].tagName !== 'TITLE') els[i].textContent = els[i].getAttribute('data-en');
      var all = document.body ? document.body.getElementsByTagName('*') : [];
      for (var j = 0; j < all.length; j++) {
        var at = all[j].attributes;
        for (var k = at.length - 1; k >= 0; k--) {
          var name = at[k].name;
          if (name.length > 8 && name.indexOf('data-en-') === 0) all[j].setAttribute(name.slice(8), at[k].value);
        }
      }
      var links = document.querySelectorAll('a[href]');
      for (var m = 0; m < links.length; m++) {
        var a = links[m], h = a.getAttribute('href'), nh = link(h);
        if (nh !== h) a.setAttribute('href', nh);
      }
    }
    addSwitch();
    root.classList.remove('i18n-pending');
  }

  function addSwitch() {
    if (document.querySelector('.lang-sw')) return;
    var slot = document.querySelector('[data-lang-slot]') || document.querySelector('nav.sitenav, nav#sitenav');
    if (!slot) return;
    var next = en ? 'zh' : 'en';
    var a = document.createElement('a');
    a.className = 'lang-sw';
    a.href = hrefFor(next);
    a.hreflang = en ? 'zh-Hant' : 'en';
    a.lang = en ? 'zh-Hant' : 'en';
    // 切換鈕寫的是要換過去的那個語言,所以英文頁上的「中文」本來就是中文。中文頁寫短的 EN:
    // 分頁列只多一點寬,不會壓到 3D 教材右上的控制面板(拆開探索在 1366×768 寫 English 就會壓到)
    a.textContent = en ? '中文' : 'EN'; // zh-only
    a.setAttribute('aria-label', en ? '中文版' : 'English version'); // zh-only
    // 播放器換章時會改網址的 #,所以按下去的那一刻才算網址
    var refresh = function () { a.href = hrefFor(next); };
    a.addEventListener('pointerenter', refresh);
    a.addEventListener('focus', refresh);
    a.addEventListener('pointerdown', refresh);
    a.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      switchTo(next);
    });
    // 放在分頁列的「← 儀器入口」後面:放最後的話,3D 教材在 1024×768 這類寬度會被右上的控制面板蓋住
    var back = slot.tagName === 'NAV' ? slot.querySelector(':scope > a') : null;
    if (back) back.after(a); else slot.appendChild(a);
  }

  window.zhEn = zhEn;
  window.I18N = { lang: lang, en: en, zhEn: zhEn, link: link, switchTo: switchTo, apply: apply };

  // 整頁讀完(readyState 變成 interactive)時套用:比 module 程式早,頁面自己的程式讀到的已經是目前語言的文字
  if (document.readyState === 'loading') {
    document.addEventListener('readystatechange', function onReady() {
      if (document.readyState === 'loading') return;
      document.removeEventListener('readystatechange', onReady);
      try { apply(); } finally { root.classList.remove('i18n-pending'); }
    });
  } else {
    try { apply(); } finally { root.classList.remove('i18n-pending'); }
  }
})();
