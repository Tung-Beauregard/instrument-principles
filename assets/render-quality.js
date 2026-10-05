// Rendering only: never changes scientific calculations, particle counts or export timing.
export class RenderBudget {
  constructor(mode = 'auto') { this.setMode(mode); }
  setMode(mode) {
    this.mode = ['auto', 'smooth', 'full'].includes(mode) ? mode : 'auto';
    this.level = this.mode === 'auto' ? 'balanced' : this.mode;
    this.reset();
  }
  reset() { this.last = null; this.elapsed = 0; this.slow = 0; this.count = 0; }
  sample(now) {
    const dt = this.last === null ? 0 : now - this.last;
    this.last = now;
    if (dt <= 0 || dt > 2000) { this.elapsed = this.slow = this.count = 0; return false; }
    if (this.mode !== 'auto' || this.level === 'smooth') return false;
    this.elapsed += dt;
    // Allow initial shader compilation / first paint to settle.
    if (this.elapsed < 2000) return false;
    this.count++;
    if (dt > 28) this.slow++;
    if (this.elapsed < 5000) return false;
    const lower = this.count > 0 && this.slow / this.count > 0.6;
    this.reset();
    if (lower) this.level = 'smooth';
    return lower;
  }
  pixelRatio(w, h, device = 1, fullCap = 1.5) {
    const full = this.level === 'full', smooth = this.level === 'smooth';
    const cap = full ? fullCap : smooth ? 1 : 1.25;
    const pixels = full ? 3.4e6 : smooth ? 1.2e6 : 2e6;
    return Math.min(device || 1, cap, Math.sqrt(pixels / Math.max(1, w * h)));
  }
}

export class FramePacer {
  constructor() { this.next = null; }
  ready(now) {
    const interval = 1000 / 60;
    if (this.next === null) this.next = now;
    if (now < this.next - 0.5) return false;
    this.next += interval;
    if (this.next < now) this.next = now + interval;
    return true;
  }
}

export function createQualityControls({ host, onChange }) {
  let saved;
  try { saved = localStorage.getItem('instrument-render-quality'); } catch { /* optional */ }
  const budget = new RenderBudget(saved);
  const pacer = new FramePacer();
  const label = document.createElement('label');
  label.className = 'quality-control';
  const caption = document.createElement('span'); caption.textContent = '畫質';
  const select = document.createElement('select'); select.setAttribute('aria-label', '3D 畫質');
  for (const [value, text] of [['auto', '自動'], ['smooth', '流暢'], ['full', '完整']]) {
    const option = document.createElement('option'); option.value = value; option.textContent = text; select.append(option);
  }
  select.value = budget.mode;
  select.disabled = true;
  label.append(caption, select);
  document.querySelector(host).append(label);
  const sync = () => {
    select.options[0].textContent = budget.level === 'smooth' && budget.mode === 'auto' ? '自動・流暢' : '自動';
    label.title = '自動會依播放狀況降低特效；流暢優先保留旋轉與動畫；完整保留陰影與後製。';
  };
  select.addEventListener('change', () => {
    budget.setMode(select.value);
    try { localStorage.setItem('instrument-render-quality', budget.mode); } catch { /* optional */ }
    sync(); onChange();
  });
  sync();
  // Explicit, local-only diagnostic view. No telemetry or hardware data is sent.
  const diagnostic = new URLSearchParams(location.search).has('perf');
  const output = diagnostic ? document.createElement('output') : null;
  if (output) { output.id = 'render-performance'; document.body.append(output); }
  let rendererRef, diagnosticAt = 0, diagnosticFrames = 0, gpu = '';
  document.addEventListener('visibilitychange', () => {
    budget.reset(); pacer.next = null; diagnosticAt = 0; diagnosticFrames = 0;
  });
  return {
    budget,
    shouldRender: now => pacer.ready(now),
    pixelRatio: (w, h, cap) => budget.pixelRatio(w, h, devicePixelRatio, cap),
    configure(renderer, composer, bloom, { recording = false, ao = null } = {}) {
      const full = recording || budget.level === 'full';
      rendererRef = renderer;
      select.disabled = recording;
      renderer.shadowMap.enabled = full;
      renderer.shadowMap.needsUpdate = true;
      bloom.enabled = full || budget.level !== 'smooth';
      if (ao) ao.enabled = full;
      for (const target of [composer.renderTarget1, composer.renderTarget2]) {
        const samples = full ? 4 : 0;
        if (target.samples !== samples) { target.samples = samples; target.dispose(); }
      }
      if (output && !gpu) {
        const gl = renderer.getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
        gpu = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      }
    },
    observe(now) {
      if (budget.sample(now)) { sync(); onChange(); }
      if (!output || !rendererRef) return;
      if (!diagnosticAt) diagnosticAt = now;
      diagnosticFrames++;
      if (now - diagnosticAt >= 1000) {
        const fps = Math.round(diagnosticFrames * 1000 / (now - diagnosticAt));
        output.textContent = `${fps} FPS · ${budget.level} · DPR ${rendererRef.getPixelRatio().toFixed(2)} · ${gpu}`;
        diagnosticAt = now; diagnosticFrames = 0;
      }
    },
  };
}
