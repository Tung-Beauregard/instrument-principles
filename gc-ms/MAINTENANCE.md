# GC-MS 教材維護

本文件先涵蓋 2026-10-05 的效能變更；完整模型座標、科學公式、鏡頭與導覽時間軸仍待補齊。科學資料見 `../INSTRUMENTS.md`。

- `index.html` 內嵌 module；`initUI()` 與 `init3D()` 初始化介面與 Three.js，`G.ready` 表示模型可繪製。3D 載入失敗仍保留圖表與控制。
- `frame()` → `step()` → `tick()` / `update3D()` / `G.composer.render()`；背景分頁略過，前景最高 60 FPS。
- `tick()` 中圖表由 `chartClock` 限制最高每秒 30 次；時間、成分、質譜、粒子和鏡頭的原本計算不改。`drawChrom/drawOver/drawMS/drawOven` 保留原資料與公式。
- `resize3D()` 同步 renderer 與 composer 的繪圖比例，再更新粒子尺寸。`quality.configure()` 設定陰影、MSAA 與 bloom，完整模式保留原後製。
- 畫質選單在 `.ctl`；手機和平板用原有「設定」開啟控制面板。選單等 renderer 初始化後才啟用。
- 拆解由 `S.explode` / `S.explodeTarget` 與 `update3D()` 管理；不要因效能調整改寫 `rebuildColumn` 管柱位置。導覽由 `tourTick/tourCamera` 管理。
- 視角操作（2026-10-07）：`init3D()` 建立 `G.nav`（共用的 `../assets/camera-nav.js`），`update3D()` 在非導覽分支、`G.fly` 之後呼叫 `G.nav.step(dt)`。滑鼠滾輪縮放，觸控板雙指平移、捏合縮放，方向鍵或 WASD 移動、+/− 縮放。Q（質譜面板）與 R（`resetView()`）維持本頁原有功能，所以不開 Q/E 轉向、不接管 R。使用者一操作就和拖曳一樣接手鏡頭：清掉 `G.fly`、`G.injCam`，設 `G.userMoved`，導覽中則經 `userTakesOver()` 結束導覽。說明視窗開著時不作用。觀察點限制在 `DEF_VIEW.tgt` 半徑 380 的球內。
- 檢查：進樣、播放/暫停、拆開/組裝、設定與鍵盤、各畫質、TIC 與 MS 圖、390/768/桌面；視角操作與 Q、R 等原有快捷鍵。細節見 `../docs/VALIDATION.md`。
