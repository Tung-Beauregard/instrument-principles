# 維護交接紀錄

由新到舊排列。每次交付在「更新紀錄」最上方新增一段，並同步更新「目前缺口」與「下一步」。

## 目前缺口（截至 2026-10-02 最新一次更新）

- `lcq/MAINTENANCE.md`、`gc-ms/MAINTENANCE.md`、`uv-vis/MAINTENANCE.md`：仍缺，需依實際程式建立。
- `lcq-3d/MAINTENANCE.md`：已有，2026-10-02 增量補上座標與模型階層、資訊框、導覽流程、網址參數與設計取捨。
- `docs/VALIDATION.md`：已建立網站共用檢查與 `lcq-3d/` 段落；`lcq/`、`gc-ms/`、`uv-vis/` 的操作步驟、預期結果與數值案例待補。
- `INSTRUMENTS.md`：已有各教材功能與來源概述；完整的公式、參數、單位與來源頁碼仍需逐項核對。`lcq-3d` 段落列出了手冊與文獻名稱，頁碼未記錄。
- `lcq-3d` 的待確認資料：原始 LCQ Deca XP（非 Plus、非 MAX）的噴灑角度；主控台調諧參數是文獻示例值，不是某台儀器的實際設定。
- W AI Studio（`w-studio` 儲存庫）中本專案的卡片與介紹文字尚未加入 LCQ 離子之旅（AGENTS.md 第 3 節第 6 點）。
- 原始設計理由與未公開來源：僅記錄能取得並確認、且可公開的資訊；其餘列為待確認。

以上是文件與驗證缺口，不代表已確認儀器程式存在錯誤。

## 下一步

- 使用 [維護資料更新提示詞](./AI-MAINTENANCE-PROMPT.md)，補齊 `lcq/`、`gc-ms/`、`uv-vis/` 的 `MAINTENANCE.md` 與 `VALIDATION.md` 段落。
- 決定是否在 `w-studio` 加入 LCQ 離子之旅的卡片與介紹。
- 若取得 LCQ Deca XP 原廠資料，核對噴灑角度與 `INSTRUMENTS.md` 的來源頁碼。

## 更新紀錄

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
