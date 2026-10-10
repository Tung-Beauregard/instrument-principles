(() => {
  'use strict';
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const localPath = value => typeof value === 'string' && /^\.\/[a-zA-Z0-9_\-/.]+$/.test(value) && !value.split('/').includes('..');
  const validCategory = cat => cat && /^[a-z0-9-]+$/.test(cat.id) && typeof cat.name === 'string' && cat.name.trim();
  const valid = (item, catIds) => item && /^[a-z0-9-]+$/.test(item.id) &&
    ['ready', 'upcoming'].includes(item.status) && ['mint', 'blue', 'lavender'].includes(item.theme) &&
    ['name', 'imageAlt'].every(key => typeof item[key] === 'string' && item[key].trim()) &&
    Array.isArray(item.categories) && item.categories.length > 0 && item.categories.every(id => catIds.has(id)) &&
    localPath(item.image) && (item.status === 'ready' ? localPath(item.href) : item.href === null);

  // 同一份教材可以出現在兩個分類(例如 GC-MS 在質譜與層析),所以標題 id 加上分類
  function card(item, catId) {
    const ready = item.status === 'ready';
    const titleId = catId + '-' + item.id + '-title';
    const article = element('article', 'instrument-card ' + item.theme);
    article.setAttribute('aria-labelledby', titleId);
    const link = element(ready ? 'a' : 'div', ready ? '' : 'pending');
    if (ready) { link.href = item.href; link.setAttribute('aria-labelledby', titleId); }
    const img = element('img');
    Object.assign(img, { src: item.image, alt: item.imageAlt, width: 440, height: 260 });
    const label = element('div', 'card-label');
    const title = element('h3', '', item.name);
    title.id = titleId;
    const indicator = element('span', '', ready ? '↗' : '即將加入');
    if (ready) indicator.setAttribute('aria-hidden', 'true');
    label.append(title, indicator);
    link.append(img, label);
    article.append(link);
    return article;
  }

  function section(cat, items) {
    const node = element('section', 'category');
    const heading = element('h2', 'category-title', cat.name);
    heading.id = 'cat-' + cat.id + '-title';
    node.setAttribute('aria-labelledby', heading.id);
    const grid = element('div', 'instrument-grid');
    grid.append(...items.map(item => card(item, cat.id)));
    node.append(heading, grid);
    return node;
  }

  async function loadInstruments() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch('./content/instruments.json', { signal: controller.signal, cache: 'no-cache' });
      if (!response.ok) return;
      const { categories, instruments } = await response.json();
      if (!Array.isArray(categories) || !categories.length || !categories.every(validCategory)) return;
      const catIds = new Set(categories.map(cat => cat.id));
      if (catIds.size !== categories.length) return;
      if (!Array.isArray(instruments) || !instruments.length || !instruments.every(item => valid(item, catIds)) || new Set(instruments.map(item => item.id)).size !== instruments.length) return;
      const sections = categories.map(cat => [cat, instruments.filter(item => item.categories.includes(cat.id))]).filter(([, items]) => items.length);
      document.getElementById('catalogue').replaceChildren(...sections.map(([cat, items]) => section(cat, items)));
    } catch { /* Keep the complete static links when content cannot load. */ }
    finally { clearTimeout(timeout); }
  }

  async function loadVisits() {
    const visits = document.getElementById('visits');
    const number = document.getElementById('visits-number');
    // Share the original LCQ counter and browser marker; previews never add visits.
    const online = location.hostname === 'tung-beauregard.github.io' && location.pathname.startsWith('/instrument-principles/');
    let seen = false;
    let storageAvailable = false;
    try {
      seen = localStorage.getItem('lcq-visited') === '1';
      const probe = 'instrument-counter-check';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      storageAvailable = true;
    } catch { /* Read the count only when persistent storage is unavailable. */ }
    const operation = online && storageAvailable && !seen ? 'hit' : 'get';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch('https://abacus.jasoncameron.dev/' + operation + '/tung-beauregard-github-io/instrument-principles', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      if (!Number.isSafeInteger(data.value) || data.value < 0) throw new Error('Invalid count');
      if (operation === 'hit') { try { localStorage.setItem('lcq-visited', '1'); } catch { /* Storage may have become unavailable. */ } }
      number.textContent = data.value.toLocaleString('zh-TW');
      visits.title = '使用瀏覽器儲存記錄，同一瀏覽器重複開啟不重複計數。';
    } catch {
      number.textContent = '—';
      visits.title = '到站人數暫時無法載入。';
    } finally { clearTimeout(timeout); }
  }

  if (/^https?:$/.test(location.protocol)) {
    loadInstruments();
    loadVisits();
  }
})();
