import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const { categories, instruments } = JSON.parse(read('content/instruments.json'));
assert.ok(Array.isArray(categories) && categories.length, 'Category list is empty');
assert.equal(new Set(categories.map(cat => cat.id)).size, categories.length, 'Duplicate category id');
assert.ok(instruments.length, 'Catalogue is empty');
assert.equal(new Set(instruments.map(item => item.id)).size, instruments.length, 'Duplicate instrument id');
assert.ok(html.includes('https://tung-beauregard.github.io/w-studio/'), 'Missing studio return link');
// 靜態備援:每個有教材的分類都有一區,順序和清單相同
let lastSection = -1;
for (const cat of categories) {
  const at = html.indexOf(`id="cat-${cat.id}-title"`);
  if (!instruments.some(item => item.categories.includes(cat.id))) { assert.equal(at, -1, `Empty category in fallback: ${cat.id}`); continue; }
  assert.ok(at > lastSection, `Missing or misordered fallback section: ${cat.id}`);
  assert.ok(html.slice(at, html.indexOf('</h2>', at)).includes(cat.name), `Fallback category name out of sync: ${cat.id}`);
  lastSection = at;
}
for (const item of instruments) for (const catId of item.categories) {
  assert.match(item.id, /^[a-z0-9-]+$/);
  assert.ok(['ready', 'upcoming'].includes(item.status));
  assert.ok(categories.some(cat => cat.id === catId), `Unknown category ${catId} in ${item.id}`);
  const heading = html.indexOf(`id="${catId}-${item.id}-title"`);
  assert.ok(heading >= 0, `Missing static fallback: ${item.id} in ${catId}`);
  const sectionStart = html.lastIndexOf('<section', heading);
  assert.ok(html.slice(sectionStart, heading).includes(`aria-labelledby="cat-${catId}-title"`), `Fallback card in the wrong section: ${item.id} in ${catId}`);
  const articleStart = html.lastIndexOf('<article', heading);
  const articleEnd = html.indexOf('</article>', heading);
  const fallback = html.slice(articleStart, articleEnd);
  assert.ok(fallback.includes(item.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;')), `Fallback name out of sync: ${item.id}`);
  assert.ok(fallback.includes(`src="${item.image}"`), `Fallback image out of sync: ${item.id}`);
  assert.ok(fs.existsSync(path.join(root, item.image)), `Missing artwork ${item.image}`);
  if (item.status === 'ready') {
    assert.ok(item.href && item.href.startsWith('./'));
    assert.ok(fallback.includes(`href="${item.href}"`), `Wrong fallback link: ${item.id}`);
    assert.ok(fs.existsSync(path.join(root, item.href, 'index.html')), `Missing ready page: ${item.id}`);
  } else {
    assert.equal(item.href, null, 'Upcoming entries must not link to unfinished lessons');
    assert.ok(!fallback.includes('<a '), 'Upcoming fallback must not contain an entrance link');
  }
}
const ready = instruments.filter(item => item.status === 'ready').length;
const files = ['index.html', ...instruments.filter(item => item.status === 'ready').map(item => item.href.replace('./', '') + 'index.html')];
for (const file of files) {
  const source = read(file);
  for (const match of source.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1];
    if (/^(?:https?:|data:|mailto:)/.test(url)) continue;
    assert.ok(!url.startsWith('/'), `Root-relative path in ${file}: ${url}`);
    const target = path.resolve(root, path.dirname(file), url.split('?')[0]);
    assert.ok(target.startsWith(root + path.sep) || target === root, `Path leaves site: ${url}`);
    assert.ok(fs.existsSync(target), `Broken local link in ${file}: ${url}`);
  }
  if (file !== 'index.html') assert.match(source, /href="\.\.\/">← 儀器入口<\/a>/, `Missing return link in ${file}`);
  // 控制字元:node --check 會接受,但瀏覽器解析 HTML 時把 NUL 換成 U+FFFD,module 就壞了(踩過的坑)
  const ctl = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.exec(source);
  assert.equal(ctl, null, `Control character U+${ctl ? ctl[0].charCodeAt(0).toString(16).padStart(4, '0') : ''} in ${file}`);
}
console.log(`PASS: ${instruments.length} catalogue entries, ${ready} ready lessons, static fallback, local resources and navigation.`);
