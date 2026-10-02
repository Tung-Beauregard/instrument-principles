(() => {
  'use strict';
  const motion = document.getElementById('motion-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const updateMotion = () => {
    document.body.classList.toggle('motion-paused', paused);
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? '播放首頁動畫 ▷' : '暫停首頁動畫 Ⅱ';
    motion.hidden = reduced.matches;
  };
  motion.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; updateMotion(); });
  updateMotion();
  document.getElementById('year').textContent = String(new Date().getFullYear());

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const localPath = (value) => typeof value === 'string' && /^\.\/[a-zA-Z0-9_\-/\.]+$/.test(value) && !value.split('/').includes('..');
  const valid = (item) => item && /^[a-z0-9-]+$/.test(item.id) &&
    ['ready', 'upcoming'].includes(item.status) && ['mint', 'blue', 'lavender'].includes(item.theme) &&
    ['imageAlt', 'visualLabel', 'category', 'description', 'actionLabel'].every(key => typeof item[key] === 'string' && item[key].trim()) &&
    localPath(item.image) && Array.isArray(item.titleLines) && item.titleLines.length > 0 && item.titleLines.every(line => typeof line === 'string') &&
    Array.isArray(item.tags) && item.tags.every(tag => typeof tag === 'string') &&
    (item.status !== 'ready' || localPath(item.href));
  function card(item, index) {
    const ready = item.status === 'ready';
    const article = element('article', `instrument-card${ready ? '' : ' upcoming'}`);
    article.setAttribute('aria-labelledby', `${item.id}-title`);
    const visual = element('div', `card-visual ${item.theme}`);
    const meta = element('div', 'visual-meta');
    meta.append(element('span', '', `INSTRUMENT ${String(index + 1).padStart(2, '0')}`), element('span', 'visual-tag', ready ? '3D 互動' : '即將加入'));
    const img = element('img');
    Object.assign(img, { src: item.image, alt: item.imageAlt, width: 440, height: 260, loading: 'lazy' });
    visual.append(meta, img, element('span', 'visual-foot', item.visualLabel));
    const body = element('div', 'card-body');
    const title = element('h3');
    title.id = `${item.id}-title`;
    item.titleLines.forEach((line, i) => { if (i) title.append(document.createElement('br')); title.append(document.createTextNode(line)); });
    const tags = element('div', 'card-tags');
    item.tags.forEach(tag => tags.append(element('span', '', tag)));
    body.append(element('p', 'card-kicker', item.category), title, element('p', 'card-description', item.description), tags);
    const action = element(ready ? 'a' : 'p', ready ? 'card-action' : 'card-pending');
    if (ready) action.href = item.href;
    const arrow = element('span', '', ready ? '↗' : '＋');
    arrow.setAttribute('aria-hidden', 'true');
    const label = element('span', '', item.actionLabel);
    if (!ready) { const dot = element('i'); dot.setAttribute('aria-hidden', 'true'); label.prepend(dot); }
    action.append(label, arrow); body.append(action); article.append(visual, body);
    return article;
  }
  // The checked-in HTML remains usable without JavaScript, HTTP, or a successful fetch.
  if (!/^https?:$/.test(location.protocol)) return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  fetch('./content/instruments.json', { signal: controller.signal, cache: 'no-cache' })
    .then(response => { if (!response.ok) throw new Error('Instrument content unavailable'); return response.json(); })
    .then(({ instruments }) => {
      if (!Array.isArray(instruments) || !instruments.length || !instruments.every(valid) || new Set(instruments.map(item => item.id)).size !== instruments.length) throw new Error('Invalid instrument content');
      document.getElementById('instrument-grid').replaceChildren(...instruments.map(card));
      const count = instruments.filter(item => item.status === 'ready').length;
      const dot = element('i'); dot.setAttribute('aria-hidden', 'true');
      const availability = document.getElementById('availability');
      availability.replaceChildren(dot, document.createTextNode(`${count} 個教材已開放`));
      if (instruments.length > count) availability.append(element('span', '', `/ ${instruments.length - count} 個即將加入`));
    })
    .catch(() => { /* Retain the complete, accessible static fallback. */ })
    .finally(() => clearTimeout(timeout));
})();
