import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { RenderBudget, FramePacer } from '../assets/render-quality.js';

const LESSONS = ['lcq', 'gc-ms', 'uv-vis', 'lcq-3d', 'nmr', 'mass-analyzers', 'spectroscopy', 'chromatography'];
for (const lesson of LESSONS) {
  const html = readFileSync(new URL(`../${lesson}/index.html`, import.meta.url), 'utf8');
  for (const [, code] of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) {
    const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: code, encoding: 'utf8' });
    assert.equal(result.status, 0, `${lesson}: ${result.stderr}`);
  }
}
const steady = new RenderBudget();
for (let t = 0; t <= 12000; t += 16.67) assert.equal(steady.sample(t), false);
assert.equal(steady.level, 'balanced');
const slow = new RenderBudget();
let changes = 0;
for (let t = 0; t <= 12000; t += 40) changes += Number(slow.sample(t));
assert.equal(changes, 1, 'sustained slow frames lower auto exactly once');
assert.equal(slow.level, 'smooth');
const software = new RenderBudget();
for (let t = 0; t <= 7000; t += 500) software.sample(t);
assert.equal(software.level, 'smooth', 'very slow visible frames still adapt');
slow.setMode('full');
for (let t = 0; t <= 12000; t += 50) assert.equal(slow.sample(t), false);
assert.equal(slow.level, 'full', 'manual full stays full');
const interrupted = new RenderBudget();
for (let t = 0; t < 1800; t += 40) interrupted.sample(t);
interrupted.sample(60000);
for (let t = 60017; t < 67000; t += 16.67) interrupted.sample(t);
assert.equal(interrupted.level, 'balanced', 'background gaps do not cause a downgrade');
for (const [mode, budget] of [['auto', 2e6], ['smooth', 1.2e6], ['full', 3.4e6]]) {
  const b = new RenderBudget(mode), dpr = b.pixelRatio(3840, 2160, 2, 2);
  assert.ok(3840 * 2160 * dpr * dpr <= budget + 0.001);
  assert.ok(b.pixelRatio(390, 844, 3, 2) <= (mode === 'full' ? 2 : mode === 'smooth' ? 1 : 1.25));
}
// Big screens (--ui from ui-scale.css, 2 on 4K): auto and full get ui² more pixels, so 4K draws close to one pixel per
// CSS pixel; smooth (the fallback for slow cards) keeps its budget; ui 1 changes nothing.
for (const [mode, budget] of [['auto', 2e6], ['full', 3.4e6]]) {
  const b = new RenderBudget(mode), dpr = b.pixelRatio(3840, 2160, 1, 1.5, 2);
  assert.ok(3840 * 2160 * dpr * dpr <= budget * 4 + 0.001);
  assert.ok(dpr > 0.9, `${mode} draws close to one pixel per CSS pixel on 4K`);
  assert.equal(b.pixelRatio(1920, 950, 1, 1.5, 1), b.pixelRatio(1920, 950, 1, 1.5));
}
assert.equal(new RenderBudget('smooth').pixelRatio(3840, 2160, 1, 1.5, 2), new RenderBudget('smooth').pixelRatio(3840, 2160, 1, 1.5, 1));
assert.equal(new RenderBudget('invalid').mode, 'auto');
for (const hz of [60, 120, 144, 240]) {
  const p = new FramePacer(); let frames = 0;
  for (let i = 0; i < hz * 10; i++) frames += Number(p.ready(i * 1000 / hz));
  assert.ok(Math.abs(frames - 600) <= 1, `${hz} Hz should render about 600 frames / 10s: ${frames}`);
}
console.log(`PASS: ${LESSONS.length} lesson module syntaxes; frame adaptation, explicit quality, background gaps and pixel budgets.`);
