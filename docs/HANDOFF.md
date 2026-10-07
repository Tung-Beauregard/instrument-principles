# 維護交接紀錄

由新到舊排列。每次交付在「更新紀錄」最上方新增一段，並同步更新「目前缺口」與「下一步」。

## 目前缺口（截至 2026-10-07 最新一次更新）

- `lcq/MAINTENANCE.md`、`gc-ms/MAINTENANCE.md`、`uv-vis/MAINTENANCE.md`：已補上效能相關結構，完整模型座標、科學公式與時間軸仍待補。
- `lcq-3d/MAINTENANCE.md`：已有，2026-10-02 增量補上座標與模型階層、資訊框、導覽流程、網址參數與設計取捨。
- `nmr/MAINTENANCE.md`：2026-10-07 隨改版重寫，涵蓋分區、座標、S 與 W 狀態、收訊流程、自旋模擬、訊號路徑、譜圖螢幕、影片時間軸與錄影。
- `docs/VALIDATION.md`：已補四份教材的效能回歸步驟與實際結果；完整科學數值案例、全長錄影驗收仍待補。
- `INSTRUMENTS.md`：已有各教材功能與來源概述；完整的公式、參數、單位與來源頁碼仍需逐項核對。`lcq-3d` 段落列出了手冊與文獻名稱，頁碼未記錄。
- `lcq-3d` 的待確認資料：原始 LCQ Deca XP（非 Plus、非 MAX）的噴灑角度；主控台調諧參數是文獻示例值，不是某台儀器的實際設定。
- W AI Studio（`w-studio` 儲存庫）中本專案的卡片與介紹文字尚未加入 LCQ 離子之旅與 NMR 核磁共振（AGENTS.md 第 3 節第 6 點）。
- `nmr` 的推估資料：不是依某一台實際儀器建模，示例配置（AVANCE III 500、Ascend 500 磁鐵、5 mm BBO 探頭）是合理的組合；Ascend 500 的磁場中心離地高度手冊未填（目前用 UltraShield Plus 500 的站位規劃值 1.10 m）；香草醛 H-2 與 H-6 在 CDCl₃ 的個別位移是依文獻多重峰範圍推估，沒有和實測譜比對。
- 原始設計理由與未公開來源：僅記錄能取得並確認、且可公開的資訊；其餘列為待確認。

以上是文件與驗證缺口，不代表已確認儀器程式存在錯誤。

## 下一步

- 確認 GitHub Pages 部署後的正式網址（NMR 教材）。
- 使用 [維護資料更新提示詞](./AI-MAINTENANCE-PROMPT.md)，補齊 `lcq/`、`gc-ms/`、`uv-vis/` 維護文件中已列明的缺口。
- 決定是否在 `w-studio` 加入 LCQ 離子之旅與 NMR 核磁共振的卡片與介紹。
- 若取得 LCQ Deca XP 原廠資料，核對噴灑角度與 `INSTRUMENTS.md` 的來源頁碼。

## 更新紀錄

### 2026-10-06 至 10-07：新增 NMR 核磁共振（nmr）

- 執行者：Claude，在作者電腦上工作。
- 基準：遠端 `3a10539`；以獨立工作目錄與分支 `nmr-lesson` 處理，原工作目錄與其他教材的內容不動。
- 起因：使用者要求仿照 [The Plane of Focus](https://sael.net/plane-of-focus/)，以 Bruker AVANCE III 500 MHz NMR 做類似的影片。製作前先查證原廠手冊（硬體手冊、站位規劃、Ascend 500 使用手冊、Probes、BSMS、TopShim、TopSpin 基本實驗）與文獻，來源列在 INSTRUMENTS.md。
- 儀器配置：不對應某一台實際儀器，訂為 AVANCE III 500 主控台、Ascend 500 磁鐵與 5 mm BBO 探頭的示例組合，寫在說明視窗與 INSTRUMENTS.md。
- 經過：10-06 先做了仿 `lcq-3d` 版型的第一版（「自旋之旅」，173 秒導覽、頁內錄影、可拖動的示波窗）；使用者看過後要求改成和 UV-Vis 相同的版型，10-07 重做。第一版沒有上線，以下只描述目前的版本。
- 完成：
  - `nmr/index.html`（頁名「訊號怎麼來」）與 `nmr/MAINTENANCE.md`：版型、控制面板、下方螢幕、CSS2D 標籤與影片時間軸的寫法都和 UV-Vis 相同。內容是跟著訊號走一圈：剖開的超導磁鐵與由線圈電流算出的磁力線、樣品從頂端降進探頭、主控台的射頻沿電纜送進線圈（琥珀色）、旋轉座標裡的 90° 脈衝、FID 經前置放大器送回主控台（薄荷綠）、傅立葉轉換、累加與勻場對譜的影響。樣品可選香草醛（芳香區三自旋精確計算）或乙酸乙酯（乙基五自旋）。100 秒的導覽與影片共用同一條時間軸。
  - 視角操作（使用者要求參考原作）：除了 `OrbitControls` 原有的拖曳旋轉、右鍵平移與觸控雙指平移，另加觸控板雙指平移與捏合縮放、方向鍵或 WASD 移動、Q/E 轉向、+/− 縮放、R 回到預設視角。
  - 入口：`content/instruments.json` 與 `index.html` 靜態備援新增「NMR 核磁共振」卡片與 `assets/nmr.svg`。
  - `lcq/`、`gc-ms/`、`uv-vis/`、`lcq-3d/` 的分頁列加上「NMR」連結，每頁只改這一行。
  - `scripts/check-render-quality.mjs` 納入 `nmr`；`AGENTS.md` 的穩定路徑清單加上 `nmr/`；`README.md`、`INSTRUMENTS.md`、`docs/VALIDATION.md` 補上新教材。
  - 新頁不另開到站人數計數。頁面沒有錄影按鈕；影片在作者電腦上用無頭瀏覽器逐格錄製（和 UV-Vis 同一套做法），依 AGENTS.md 沒有提交進網站。
- 驗證（本機 HTTP 預覽，無頭 Edge 與 Chrome，硬體 GPU 繪圖）：
  - 通過：`node scripts/check-site.mjs`（5 個教材項目）、`node scripts/check-render-quality.mjs`（五份教材的 module 語法）、`git diff --check`。
  - 通過：VALIDATION.md 的 NMR 操作步驟（樣品、脈衝角 30° 與 180°、收訊 NS 16 與 64、上一張譜的比較、勻場、譜的兩段放大與乙酸乙酯的平移、外殼組裝與剖開、說明、導覽開始與 Esc 結束）；390、820、1600 px 寬；console 沒有錯誤。
  - 通過：以 DevTools Protocol 送出的滑鼠滾輪、觸控板滾動與捏合、方向鍵、Q、+、Shift、R、右鍵拖曳、Shift 拖曳、觸控雙指平移與捏合，相機與觀察點都照預期移動；焦點在滑桿時方向鍵只改滑桿；導覽中不作用。真實觸控板與觸控螢幕尚未實機測試。
  - 通過：1600×900 即時播放 60 FPS（待機、收訊、導覽中），每格 CPU 約 1.3 ms。
  - 通過：影片 1920×1080、30 fps、100 秒，逐格算圖約 8 分鐘，檔案約 62 MB；抽格檢查字幕、鏡頭、標籤與螢幕。
  - 修正過的問題：發光管著色器在內插出極小負數時產生 NaN，經過 bloom 讓整個畫面變黑；落地電纜的曲線在轉角沉到地板下，地上那段發光看不到。
  - 未執行：Safari、Firefox 與真實觸控裝置；W AI Studio 的卡片與介紹。GitHub Pages 的部署結果在推送後補記。

### 2026-10-05：3D 即時播放減負與畫質選擇

- 基準：遠端 `ed761e6`；以獨立工作目錄處理，保留其他工作目錄的未提交教材，僅修改目前公開的四份教材。
- 加入共用 `assets/render-quality.js/.css`：自動/流暢/完整、60 FPS 上限、背景略過與可選本頁效能顯示。完整畫質與錄影保留陰影和後製，未更動科學公式或粒子數。
- 離子之旅快取靜態穩定圖；UV-Vis 快取不變光線和預覽光譜；GC-MS 與離子之旅圖表最多每秒更新 30 次。保留先前的浮動資訊框更新。
- 通過：網站資料與連結檢查、四份 module 語法、畫質/節流邏輯測試；390/768/桌面走查、主要互動與鍵盤、主頁/入口/各教材返回鏈、UV-Vis REC 固定畫格。
- 限制：本次瀏覽器為軟體繪圖環境，不能據此宣稱硬體 GPU 的效能增幅；完整 MP4 匯出與全長影片逐格驗收未執行，詳見 `VALIDATION.md`。
- 公開資料不含任何使用者上傳的裝置報告或本機路徑。入口、教材清單、計數與 W AI Studio 內容未修改。

### 2026-10-02：lcq-3d 資訊框可拖動與縮放、導覽版面不重疊、補交接資料

- 執行者：Claude，在作者電腦上工作；提交者 tung-beauregard。
- 基準提交：`770bce0`。
- 起因：使用者回報瀏覽器放大後，導覽時右上角的控制面板和示波窗重疊，要求資訊框可以縮放、拖動；並要求整理讓其他 Claude 接手的紀錄。
- 完成：
  - `lcq-3d/index.html`：新增 `91_float.js` 區塊。標題說明、控制面板、穩定圖、質譜、導覽字幕五個資訊框可拖動與縮放，位置與大小存在瀏覽器的 `localStorage`（`lcq3d-panels-v1`）；工具列新增「重設版面」。
  - 導覽時字幕與兩個示波窗改用 DOM 資訊框顯示（錄影仍以固定版面畫在畫面上）；控制面板只留一列按鈕；示波窗預設排在右側；窄螢幕與矮視窗預設縮小示波窗；操作提示限寬，避免壓到穩定圖。
  - `lcq-3d/MAINTENANCE.md`：增量補上座標、尺度與模型階層、資訊框、導覽流程、網址參數、設計取捨，並註明儲存庫裡的 `index.html` 是正本。
  - `INSTRUMENTS.md`：LCQ 離子之旅的功能列表加入資訊框。
  - `docs/VALIDATION.md`：新建，含共用檢查命令、網站走查與 `lcq-3d` 的操作步驟、預期結果、數值案例。
  - `README.md`：專案結構與文件索引加入 `CLAUDE.md` 與 `docs/` 文件。
  - 本檔：改為由新到舊的更新紀錄，保留先前內容。
- 驗證：
  - 通過：`node scripts/check-site.mjs`；`node --check assets/app.js`；`lcq-3d/index.html` 內嵌模組程式碼另存暫存檔後以 `node --check` 檢查。
  - 通過（本機 HTTP 預覽）：在 1280×640（模擬瀏覽器放大）、860×700、390×844 播放導覽，控制面板、示波窗與字幕互不重疊；1440×900 一般模式的預設版面與先前相同；以程式模擬拖動、縮放、在按鈕上拖曳（不應移動）與「重設版面」，結果符合預期；console 沒有錯誤。
  - 未執行：Safari、Firefox 與真實觸控裝置；`lcq/`、`gc-ms/`、`uv-vis/` 的互動（本次未修改）。
  - 以上為本機預覽結果；GitHub Pages 部署後的狀態以交付回報為準。

### 2026-10-02：共用接手規則、工具載入入口與文件索引

- 執行者：Desktop-Lab-W。
- 起始基準提交：`9be62ad`；工作期間已整合並檢查遠端新增教材提交 `e6cdf7b`。
- 範圍：共用接手規則、工具載入入口、維護資料更新提示詞與文件索引。網頁功能、科學計算、3D 模型及發布設定未在該次修改。
- 完成：
  - `AGENTS.md` 第 0 節定義所有 AI 接手的閱讀與修改流程。
  - `AGENTS.md` 第 8 節定義維護文件分工、內容、同步更新與驗證責任。
  - `CLAUDE.md` 透過 `@AGENTS.md` 引用共用規則。
  - `docs/AI-MAINTENANCE-PROMPT.md` 提供首次補齊或增量更新，以及日常修改用的提示詞。
  - `README.md` 加入規則與交接文件的索引。
  - 保留遠端新增的 `lcq-3d/` 教材及其維護文件；共用規則改為依教材清單盤點，包含後續新增的儀器。
- 驗證：
  - 通過：整合後 `node scripts/check-site.mjs`，確認 4 個教材項目、靜態備援、本機資源與導覽連結。
  - 通過：該次 5 份維護文件中的相對 Markdown 連結均指向存在的檔案。
  - 通過：`git diff --check`，未發現差異格式問題。
  - 未執行：3D 模型、瀏覽器互動、科學計算與影片匯出（該次僅修改維護文件）；Claude Code 自動載入未實測。

### 2026-10-02：新增 LCQ 離子之旅（lcq-3d）

- 執行者：Claude，在作者電腦上工作；提交 `e6cdf7b`，提交者 tung-beauregard。
- 背景：使用者要求仿照 [The Plane of Focus](https://sael.net/plane-of-focus/) 的拆解式 3D 頁，做 LCQ Deca XP 的版本與影片。製作前先查證硬體資料（LCQ Deca Hardware Manual、LCQ Series Hardware Manual、LCQ Deca XP Plus 規格表、Wong 與 Cooks），以 three.js 單一 HTML 完成互動頁與 141 秒的自動導覽；影片在作者電腦上逐格輸出成 1080p MP4（約 112 MB）。依 AGENTS.md，影片沒有提交進網站。
- 使用者的選擇：新增成另一頁 `lcq-3d/`，原本的 `lcq/` 內容不動；影片只留在作者電腦。
- 完成：
  - `lcq-3d/index.html` 與 `lcq-3d/MAINTENANCE.md`。
  - 入口：`content/instruments.json` 與 `index.html` 靜態備援新增「LCQ 離子之旅」卡片與 `assets/lcq-3d.svg`；入口卡片改為桌面四欄、平板兩欄。
  - `lcq/`、`gc-ms/`、`uv-vis/` 的分頁列加上「離子之旅」連結，每頁只改這一行。
  - `README.md`、`INSTRUMENTS.md` 補上新教材的功能、數值來源與示意說明。
  - 新頁不另開到站人數計數。
- 驗證（當時）：
  - 通過：`node scripts/check-site.mjs`，4 個教材項目。
  - 通過：390、768、1440 px 寬度沒有溢出或重疊；入口與新頁來回連結正常；console 沒有錯誤。
  - 通過：推送後正式網址 `https://tung-beauregard.github.io/instrument-principles/lcq-3d/` 可開啟，入口出現新卡片。
