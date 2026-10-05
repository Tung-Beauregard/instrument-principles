# 離子阱教材維護

本文件先涵蓋 2026-10-05 的效能變更；完整模型座標、公式來源與章節時間軸仍待補齊，請同時讀 `../INSTRUMENTS.md`。

- `index.html` 是單一 HTML 與內嵌 module，Three.js 版本與 addon 路徑在 importmap。
- `boot()` → `resize()` → `seek()/applyFrame()/updateCamera()` → `renderer.setAnimationLoop(loop)`。`APP` 管理播放、手動操作與錄影；`view` 保存尺寸、比例與 AO 開關。
- `loop()` 只在前景且非錄影時執行，先通過共用 `quality.shouldRender()` 的 60 FPS 上限，再用實際時間差推進原本動畫。
- `resize()` 套用 `../assets/render-quality.js` 的畫質、解析度預算與 AO。`renderFrame()` 保留相機、粒子尺寸、composer 與文字疊圖；畫質控制在 `#sitenav` 下方，不擠壓手機播放列。
- 自動模式取代舊的 90 格單向降畫質邏輯，避免視窗 resize 把已降低的畫質重設。
- `record()` 強制完整後製，使用原有固定時間步與尺寸；`finally` 的 `resize()` 恢復使用者畫質。錄影不經即時節流器。
- 檢查：畫質切換、自己操作、重新裝填、自動掃描、章節播放、390px 播放列、錄影完成與失敗後的畫質恢復。共用命令與實際結果見 `../docs/VALIDATION.md`。
