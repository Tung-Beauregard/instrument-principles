# 離子阱教材維護

本文件先涵蓋 2026-10-05 的效能變更；完整模型座標、公式來源與章節時間軸仍待補齊，請同時讀 `../INSTRUMENTS.md`。

- `index.html` 是單一 HTML 與內嵌 module，Three.js 版本與 addon 路徑在 importmap。
- `boot()` → `resize()` → `seek()/applyFrame()/updateCamera()` → `renderer.setAnimationLoop(loop)`。`APP` 管理播放、手動操作與錄影；`view` 保存尺寸、比例與 AO 開關。
- `loop()` 只在前景且非錄影時執行，先通過共用 `quality.shouldRender()` 的 60 FPS 上限，再用實際時間差推進原本動畫。
- `resize()` 套用 `../assets/render-quality.js` 的畫質、解析度預算與 AO。`renderFrame()` 保留相機、粒子尺寸、composer 與文字疊圖；畫質控制在 `#sitenav` 下方，不擠壓手機播放列。
- 自動模式取代舊的 90 格單向降畫質邏輯，避免視窗 resize 把已降低的畫質重設。
- `record()` 強制完整後製，使用原有固定時間步與尺寸；`finally` 的 `resize()` 恢復使用者畫質。錄影不經即時節流器。
- 視角操作（2026-10-07）：共用的 `../assets/camera-nav.js`，由 `createCameraNav()` 建立的 `nav` 在 `updateCamera()` 的使用者鏡頭分支、`controls.update()` 之前呼叫 `nav.step(dt)`。只在 `camFree()`（暫停或「自己操作」）且不在錄影時作用：滑鼠滾輪縮放，觸控板雙指平移、捏合縮放，方向鍵或 WASD 移動、Q/E 轉向、+/− 縮放；一操作就把 `APP.userCam` 設為 true。R 在故事模式把 `APP.blendFrom` 設好、`APP.userCam` 設回 false，鏡頭平滑回到動畫的鏡頭；在操作台飛回 `enterLab()` 的預設視角。播放中方向鍵仍是切換章節；時間軸自己處理過的方向鍵（`e.defaultPrevented`）不再由全域的鍵盤處理重複切換。縮放範圍 0.03 到 6，觀察點限制在 (0, 0.32, 0) 半徑 2 的球內。
- 檢查：畫質切換、自己操作、重新裝填、自動掃描、章節播放、390px 播放列、錄影完成與失敗後的畫質恢復；暫停與操作台中的視角操作、播放中方向鍵切換章節。共用命令與實際結果見 `../docs/VALIDATION.md`。
