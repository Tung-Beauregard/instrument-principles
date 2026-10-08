# 儀器原理

互動儀器教材入口。頁面只保留「儀器原理」、儀器圖與名稱連結、返回主頁及到站人數，色彩延續 W AI Studio。

- [儀器入口](https://tung-beauregard.github.io/instrument-principles/)
- [離子阱質譜](https://tung-beauregard.github.io/instrument-principles/lcq/)
- [UV-Vis 分光光度計](https://tung-beauregard.github.io/instrument-principles/uv-vis/)
- [GC-MS](https://tung-beauregard.github.io/instrument-principles/gc-ms/)
- [LCQ 離子之旅](https://tung-beauregard.github.io/instrument-principles/lcq-3d/)
- [NMR 核磁共振](https://tung-beauregard.github.io/instrument-principles/nmr/)
- [質譜儀-不同分析器比較](https://tung-beauregard.github.io/instrument-principles/mass-analyzers/)
- [W AI Studio 主頁](https://tung-beauregard.github.io/w-studio/)

目前共有六份教材：離子阱質譜、GC-MS、UV-Vis 分光光度計、LCQ 離子之旅、NMR 核磁共振、質譜儀-不同分析器比較。儀器型號與規格以各教材的來源說明為準。

## 專案結構

```text
index.html                 儀器入口；含完整靜態備援內容
assets/
  styles.css               入口頁樣式與響應式版面
  app.js                   教材清單載入、到站人數
  render-quality.js        教材共用畫質、幀率上限與可選效能顯示
  render-quality.css       畫質選單
  camera-nav.js            教材共用的視角操作：滾輪、觸控板、方向鍵與 WASD
  saddle-field.js          四極柱與離子阱共用的「翻轉的馬鞍」電場示意（GC-MS 與質譜儀-不同分析器比較）
  *.svg                    品牌與儀器概念示意
content/
  instruments.json         儀器名稱、順序、圖片、狀態與連結
lcq/index.html             原本根目錄的離子阱教材
gc-ms/index.html           GC-MS 教材
uv-vis/index.html          UV-Vis 分光光度計教材
lcq-3d/index.html          LCQ 離子之旅；LCQ Deca XP 拆解式 3D 導覽
lcq-3d/MAINTENANCE.md      LCQ 離子之旅的程式結構與修改方式
nmr/index.html             NMR 核磁共振；以 Bruker AVANCE III 500 為例，跟著訊號走一圈
nmr/MAINTENANCE.md         NMR 教材的程式結構與修改方式
mass-analyzers/index.html  質譜儀-不同分析器比較；四極柱、離子阱、飛行時間與 Orbitrap 的原理比較
mass-analyzers/MAINTENANCE.md  質譜儀-不同分析器比較教材的程式結構與修改方式
scripts/check-site.mjs     資料、相對連結與靜態備援檢查
scripts/check-render-quality.mjs  各教材的 module 語法與畫質、幀率邏輯檢查
scripts/check-camera-nav.mjs  共用視角操作的滾輪判斷與各教材接線檢查
scripts/check-saddle.mjs   馬鞍電場示意的穩定條件與兩份教材的接線檢查
.nojekyll                  GitHub Pages 靜態網站設定
README.md                  專案導覽與預覽方式
INSTRUMENTS.md             各儀器功能、數據與示意說明
AGENTS.md                  未來開發與維護規則
CLAUDE.md                  Claude Code 載入入口，引用 AGENTS.md
docs/
  HANDOFF.md               交接紀錄：最近變更、驗證結果、缺口與下一步
  VALIDATION.md            檢查命令與各教材的操作步驟、預期結果
  AI-MAINTENANCE-PROMPT.md 給其他 AI 的維護資料更新提示詞
```

根目錄現在是入口頁；原本位於根目錄的離子阱教學移至 `lcq/`。GC-MS 網址維持 `gc-ms/`，各教材都能返回入口並互相切換。教材本身的模型、科學計算與原有控制功能保留。

## 維護內容

HTTP 網站會載入 `content/instruments.json`；此檔是儀器卡片的主要資料來源。排列順序就是陣列順序。入口用安全 DOM API 填入純文字，資料載入失敗時保留 HTML 的完整卡片與連結。

- `status: "ready"`：教材已完成，必須填入有效相對網址 `href`。
- `status: "upcoming"`：僅顯示準備中狀態，不產生可點擊的教材連結。
- `theme`：`mint`、`blue` 或 `lavender`。
- `name`：儀器名稱，也是入口連結文字。
- `image`：本站 SVG 或其他靜態圖片相對路徑。
- 修改資料後，同步更新 `index.html` 的靜態備援卡片。執行檢查避免兩份內容不一致。

新增教材時，先以 `upcoming` 建立項目；完成獨立教材頁面並驗證後，更新名稱、連結與狀態。同時更新入口靜態備援，以及 W AI Studio 的卡片與介紹彈窗。

到站人數沿用 LCQ 教材的 Abacus 計數與 `lcq-visited` 儲存記錄，避免在入口與 LCQ 間重複計算同一瀏覽器。僅正式網站會新增計數；本機預覽或無法使用儲存空間時只讀取。服務暫時不可用時顯示「—」。清除瀏覽器資料或更換瀏覽器會重新計數，因此不是精確的不重複人數。

## 本機預覽與檢查

網站不需要 npm 套件或編譯。用任一靜態 HTTP 伺服器服務此目錄；例如已有 Python 時：

```sh
python -m http.server 8000
```

瀏覽 `http://localhost:8000/`。直接開啟 `index.html` 也可看到入口靜態內容；HTTP 預覽才能驗證 JSON 載入。3D 教材透過 CDN 載入 three.js 與字型，需要網路與支援 WebGL 的瀏覽器。

如已安裝 Node.js，可執行不需第三方套件的檢查：

```sh
node scripts/check-site.mjs
node --check assets/app.js
node scripts/check-render-quality.mjs
node scripts/check-camera-nav.mjs
node scripts/check-saddle.mjs
```

另需實際檢查：桌面與手機入口排版、每份教材的載入、入口與返回連結、鍵盤焦點、減少動態效果偏好。瀏覽器檢查才能確認外部 CDN 與 WebGL 的實際可用性。

## 3D 畫質與效能

發布沿用 `main` 的 GitHub Pages；推送後確認 Actions 的 `pages build and deployment` 成功，再開啟正式網址驗證。發布前先取得遠端最新版本，保留其他工作目錄的未提交變更，不使用強制推送。

各教材提供「自動／流暢／完整」畫質，選擇保存在同一瀏覽器。自動模式先減少後製負擔，連續掉幀時切到流暢；完整模式保留陰影、4 倍 MSAA 與後製。即時播放上限為 60 FPS，背景分頁不執行場景更新。畫質設定不改變科學公式、粒子數量或影片匯出的指定幀率。

教材網址加上 `?perf=1` 可查看 FPS、繪圖比例與瀏覽器回報的繪圖裝置；資料僅顯示在本頁，不上傳。例如 `lcq-3d/?perf=1`。若顯示軟體繪圖，先檢查瀏覽器圖形加速與顯示驅動；畫質模式不保證特定裝置的幀率。

六份 3D 教材共用 `assets/camera-nav.js` 的視角操作（參考 [The Plane of Focus](https://sael.net/plane-of-focus/)）：滑鼠拖曳旋轉、右鍵或 Shift 拖曳平移、滾輪縮放；觸控板雙指滑動平移、捏合縮放；觸控螢幕單指旋轉、雙指平移與縮放；方向鍵或 WASD 移動、+ − 縮放、Shift 加快。Q/E 轉向與 R 回到預設視角只在沒有和教材既有快捷鍵衝突的頁面開啟，各頁的說明視窗列出實際可用的按鍵。

維護索引：[離子阱](./lcq/MAINTENANCE.md)、[GC-MS](./gc-ms/MAINTENANCE.md)、[UV-Vis](./uv-vis/MAINTENANCE.md)、[離子之旅](./lcq-3d/MAINTENANCE.md)、[NMR](./nmr/MAINTENANCE.md)、[質譜儀-不同分析器比較](./mass-analyzers/MAINTENANCE.md)。

## 品牌與資料來源

品牌色沿用 [w-studio](https://github.com/Tung-Beauregard/w-studio) 的 `brand-guide.md`：背景 `#0B1111`、薄荷綠 `#A5F3CD`、主字色 `#F0F3EE`。入口插圖是結構或概念示意，不是儀器照片、真實量測訊號或精確光學配置。

教材來源及模擬限制見 [INSTRUMENTS.md](./INSTRUMENTS.md)。未來的維護約定見 [AGENTS.md](./AGENTS.md)。

## 跨 AI 維護

所有 AI 接手時遵循 [AGENTS.md](./AGENTS.md) 第 0 節的流程；第 8 節定義維護資料的內容、文件分工與更新責任。[CLAUDE.md](./CLAUDE.md) 引用同一份規則。

目前的文件缺口與交接狀態見 [docs/HANDOFF.md](./docs/HANDOFF.md)，檢查方法見 [docs/VALIDATION.md](./docs/VALIDATION.md)。要請 Claude 或其他 AI 首次補齊、或依最新程式更新維護資料，可直接使用 [文件更新提示詞](./docs/AI-MAINTENANCE-PROMPT.md)。
