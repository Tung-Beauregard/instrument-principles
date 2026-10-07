# UV-Vis 教材維護

本文件先涵蓋 2026-10-05 的效能變更；完整光學模型座標、科學公式與影片時間軸仍待補齊。科學資料見 `../INSTRUMENTS.md`。

- `index.html` 內嵌 module，`S` 為互動目標，`W` 為動畫狀態。`interactive()` 或 `film()` → `frameCommon()` → `render()`；`FILM_DUR` 與 `CAMK/LAM/SBWK/CAPS` 管理原有影片。
- 共用 `quality` 控制 renderer/composer 比例、陰影、MSAA 與 bloom；取消預設 framebuffer 的重複抗鋸齒，完整模式在 composer 保留 4 倍 MSAA。CSS2D 標籤仍以 CSS 像素排版。
- `buildRays()` 的 `raysKey` 依精確的波長、閃爍、頻寬與透射率決定是否重建光線；不能省略這些依賴。`buildPhotons()` 與 shader 的 `uT` 仍逐格更新，光點持續移動。
- `drawPlot()` 即時最高每秒 30 次；`previewValues` 只在樣品、頻寬或繪圖寬度改變時計算，仍用原 `absorbAt()`，不量化科學參數。掃描曲線與游標保持動態。
- 即時最高 60 FPS。隱藏分頁暫停場景工作；恢復時平移 `filmStart`、`tour.t0`、`S.scanT0`，不跳過掃描或導覽。
- `?film` 為影片展示；`?rec` 提供既有 `window.__seek` 固定時間畫格。REC 強制完整畫質、DPR 1，繞過圖表節流與即時幀率上限。可用 `?film&rec&t=64` 人工檢查一格。
- 視角操作（2026-10-07）：導覽段落之後建立 `nav`（共用的 `../assets/camera-nav.js`），互動模式每格在 `controls.update()` 之前呼叫 `nav.step(dt)`；`startTour()` 會 `nav.cancel()`。滑鼠滾輪縮放，觸控板雙指平移、捏合縮放，方向鍵或 WASD 移動、Q/E 轉向、+/− 縮放，R 回到預設視角；導覽與 `?film` 中不作用。觀察點限制在預設觀察點半徑 120 的球內。拖曳主光柵改波長的操作不受影響。
- 檢查：樣品、頻寬、波長、掃描、前後光譜、外殼、導覽開始/退出、390/768/桌面、REC 固定畫格、視角操作。結果見 `../docs/VALIDATION.md`。
