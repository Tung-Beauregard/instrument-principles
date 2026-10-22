# 儀器原理

互動儀器教材入口。頁面只保留「儀器原理」、儀器圖與名稱連結、返回主頁及到站人數，色彩延續 W AI Studio。

- [儀器入口](https://tung-beauregard.github.io/instrument-principles/)
- [離子阱質譜](https://tung-beauregard.github.io/instrument-principles/lcq/)（動畫講解；另一個畫面是[拆開探索](https://tung-beauregard.github.io/instrument-principles/lcq-3d/)）
- [UV-Vis 分光光度計](https://tung-beauregard.github.io/instrument-principles/uv-vis/)
- [GC-MS](https://tung-beauregard.github.io/instrument-principles/gc-ms/)
- [NMR 核磁共振](https://tung-beauregard.github.io/instrument-principles/nmr/)
- [質譜儀-不同分析器比較](https://tung-beauregard.github.io/instrument-principles/mass-analyzers/)
- [層析-GC 與 HPLC](https://tung-beauregard.github.io/instrument-principles/chromatography/)
- [光譜-光與分子](https://tung-beauregard.github.io/instrument-principles/spectroscopy/)
- [數據畫圖](https://tung-beauregard.github.io/instrument-principles/plot/)（工具：把儀器匯出的檔案畫成報告用的圖）
- [W AI Studio 主頁](https://tung-beauregard.github.io/w-studio/)

目前共有七份教材，入口依質譜、層析、光譜、NMR 分區（2026-10-08 起）：質譜有離子阱質譜、質譜儀-不同分析器比較、GC-MS；層析有層析-GC 與 HPLC、GC-MS（兩區都列）；光譜有光譜-光與分子、UV-Vis 分光光度計；NMR 有 NMR 核磁共振。儀器型號與規格以各教材的來源說明為準。另有「工具」區（2026-10-22 起）放數據畫圖：把 FTIR、DSC、TGA、LCQ 質譜的檔案放進瀏覽器就畫成黑白的報告用圖，可下載 SVG 或 PNG；它不是教材，檔案只在瀏覽器裡處理。

離子阱質譜有兩個畫面：「動畫講解」（`lcq/`）與「拆開探索」（`lcq-3d/`）。拆開探索原本是另一份教材「LCQ 離子之旅」，2026-10-13 併入；入口只列一張卡片，兩個畫面由分頁列的「離子阱質譜」一組互相切換，網址都沒有變。

## 專案結構

```text
index.html                 儀器入口；含完整靜態備援內容
assets/
  styles.css               入口頁樣式與響應式版面
  app.js                   教材清單載入、到站人數
  render-quality.js        教材共用畫質、幀率上限與可選效能顯示
  render-quality.css       畫質選單
  camera-nav.js            教材共用的視角操作：滾輪、觸控板、方向鍵與 WASD
  mobile-panels.js         手機版的面板收合：控制面板、譜與說明收成有標籤的細條，直拿時建議轉成橫式
  mobile-panels.css        收合細條、底部停靠區與轉向提示的樣式（只在手機尺寸作用）
  analyzer-fields.js       四種質量分析器的電場示意：四極柱與離子阱是翻轉的馬鞍、飛行時間是坡道地形、Orbitrap 是紡錘與碗（GC-MS 與質譜儀-不同分析器比較）
  og/*.jpg                 各頁的分享預覽圖（1200 × 630），由 scripts/make-og-images.mjs 產生
  *.svg                    品牌與儀器概念示意
content/
  instruments.json         儀器名稱、順序、圖片、狀態與連結
lcq/index.html             離子阱質譜的「動畫講解」（原本根目錄的離子阱教材）
lcq/MAINTENANCE.md         動畫講解的程式結構、物理數值、章節時間軸與修改方式
gc-ms/index.html           GC-MS 教材
uv-vis/index.html          UV-Vis 分光光度計教材
lcq-3d/index.html          離子阱質譜的「拆開探索」；不在入口清單，由分頁列進入
lcq-3d/MAINTENANCE.md      拆開探索的程式結構與修改方式
nmr/index.html             NMR 核磁共振；以 Bruker AVANCE III 500 為例，跟著訊號走一圈
nmr/MAINTENANCE.md         NMR 教材的程式結構與修改方式
mass-analyzers/index.html  質譜儀-不同分析器比較；四極柱、離子阱、飛行時間與 Orbitrap 的原理比較
mass-analyzers/MAINTENANCE.md  質譜儀-不同分析器比較教材的程式結構與修改方式
spectroscopy/index.html    光譜-光與分子；無線電波到 X 光、螢光與拉曼，各自讓分子做什麼
spectroscopy/MAINTENANCE.md  光譜-光與分子教材的程式結構與修改方式
chromatography/index.html  層析-GC 與 HPLC；從茨維特的色素管柱到氣相與液相層析
chromatography/MAINTENANCE.md  層析-GC 與 HPLC 教材的程式結構與修改方式
plot/index.html            數據畫圖（工具）；放進儀器檔案就畫成報告用的黑白圖，可下載 SVG 或 PNG
plot/parsers.js            數據畫圖的讀檔：.spc、.asp、PerkinElmer 的 DSC 與 TGA csv、xlsx、LCQ .RAW、兩欄文字
plot/figure.js             數據畫圖的 SVG 繪圖：座標軸、光譜疊圖、DSC、TGA 與 DTG、質譜棒狀圖
plot/app.js                數據畫圖的頁面邏輯：拖放、檔案清單、各圖的設定、匯出
plot/MAINTENANCE.md        數據畫圖的程式結構、檔案格式、算法與修改方式
scripts/check-site.mjs     資料、相對連結與靜態備援檢查
scripts/check-render-quality.mjs  各教材的 module 語法與畫質、幀率邏輯檢查
scripts/check-camera-nav.mjs  共用視角操作的滾輪判斷與各教材接線檢查
scripts/check-mobile-panels.mjs  手機版面板收合的樣式範圍（只在手機尺寸作用）與六份教材的接線檢查
scripts/check-fields.mjs   四種電場示意的物理（穩定條件、射出順序、飛行時間的聚焦、Orbitrap 的頻率）與兩份教材的接線檢查
scripts/make-og-images.mjs 重產 assets/og/ 的分享預覽圖（用本機的 Chrome 或 Edge 無頭截圖）
scripts/check-plot.mjs     數據畫圖的讀檔與畫圖檢查（在程式裡合成各種格式的小檔案，不需要真實數據）
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
- `categories`：所屬分類的 `id`，可以填好幾個（GC-MS 同時屬於質譜與層析）。分類本身列在檔案最上方的 `categories`，依那裡的順序分區；同一分類裡依教材陣列的順序。分類裡沒有教材時不顯示那一區。「工具」分類（`tools`，2026-10-22 起）放數據畫圖這類不是教材的頁面。
- `name`：儀器名稱，也是入口連結文字。
- `image`：本站 SVG 或其他靜態圖片相對路徑。
- 修改資料後，同步更新 `index.html` 的靜態備援卡片。執行檢查避免兩份內容不一致。

新增教材時，先以 `upcoming` 建立項目；完成獨立教材頁面並驗證後，更新名稱、連結與狀態。同時更新入口靜態備援（每個分類一區，卡片標題的 `id` 是「分類-教材-title」）。W AI Studio 只有本站入口這一張卡片，不為各教材另加卡片。各教材上方的分頁列也要加上新教材的連結。

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
node scripts/check-mobile-panels.mjs
node scripts/check-fields.mjs
node scripts/check-plot.mjs
```

另需實際檢查：桌面與手機入口排版、每份教材的載入、入口與返回連結、鍵盤焦點、減少動態效果偏好。瀏覽器檢查才能確認外部 CDN 與 WebGL 的實際可用性。

## 分享預覽圖

入口與每個教材頁的 `<head>` 都有 Open Graph 標籤（2026-10-20 起），網址貼到 LINE、Facebook、Slack 這類地方時會顯示標題、說明與一張 1200 × 630 的圖。`og:url` 與 `og:image` 必須是完整的正式網址（`https://tung-beauregard.github.io/instrument-principles/…`），社群網站不接受相對路徑；這是 AGENTS.md 第 6 節相對連結規則的例外。教材頁的 `og:title`、`og:description` 照抄該頁的 `<title>` 與 meta description（入口的 `og:description` 是另寫的短版），改了其中一邊要一起看。`scripts/check-site.mjs` 會檢查每頁的 `og:url` 是自己的網址、圖檔存在、寬高 1200 × 630。

圖是從頁面本身截的：先用任一靜態伺服器服務這個目錄，再執行

```sh
node scripts/make-og-images.mjs http://127.0.0.1:8000/
```

網址省略時用 `http://127.0.0.1:4378/`；後面加名稱（`portal`、`lcq`、`lcq-3d`、`gc-ms`…）只重產那幾張。預設用 `C:/Program Files/Google/Chrome/Application/chrome.exe`，其他位置用環境變數 `OG_BROWSER` 指定（Edge 也可以）。截圖用深色模式與 GPU、關掉擴充功能，截圖前會移除擴充功能塞進頁面的元素（例如翻譯工具的浮動按鈕）。各頁等待的秒數與網址在腳本的 `SHOTS`：動畫講解截 `lcq/?paused&t=3.6` 的片頭並隱藏介面，拆開探索截 `lcq-3d/?view=asm` 的組裝視圖，其他頁截打開後的第一個畫面。教材的開頭畫面改了就重產那一張。

## 3D 畫質與效能

發布沿用 `main` 的 GitHub Pages；推送後確認 Actions 的 `pages build and deployment` 成功，再開啟正式網址驗證。發布前先取得遠端最新版本，保留其他工作目錄的未提交變更，不使用強制推送。

各教材提供「自動／流暢／完整」畫質，選擇保存在同一瀏覽器。自動模式先減少後製負擔，連續掉幀時切到流暢；完整模式保留陰影、4 倍 MSAA 與後製。即時播放上限為 60 FPS，背景分頁不執行場景更新。畫質設定不改變科學公式、粒子數量或影片匯出的指定幀率。

教材網址加上 `?perf=1` 可查看 FPS、繪圖比例與瀏覽器回報的繪圖裝置；資料僅顯示在本頁，不上傳。例如 `lcq-3d/?perf=1`。若顯示軟體繪圖，先檢查瀏覽器圖形加速與顯示驅動；畫質模式不保證特定裝置的幀率。

八個 3D 頁面（七份教材，離子阱質譜有兩個畫面）共用 `assets/camera-nav.js` 的視角操作（參考 [The Plane of Focus](https://sael.net/plane-of-focus/)）：滑鼠拖曳旋轉、右鍵或 Shift 拖曳平移、滾輪縮放；觸控板雙指滑動平移、捏合縮放；觸控螢幕單指旋轉、雙指平移與縮放；方向鍵或 WASD 移動、+ − 縮放、Shift 加快。Q/E 轉向與 R 回到預設視角只在沒有和教材既有快捷鍵衝突的頁面開啟，各頁的說明視窗列出實際可用的按鍵。

手機上（寬度 760 px 以下，或高度 500 px 以下的橫拿畫面），UV-Vis、NMR、質譜儀-不同分析器比較、光譜-光與分子、層析-GC 與 HPLC、GC-MS 六份教材用 `assets/mobile-panels.js` 把控制面板、譜與說明收成有標籤的細條（2026-10-22）。細條寫著這一塊叫什麼、裡面有什麼可以看或調整，例如「調整 · 樣品、波長、波長寬度…」「吸收光譜 · DPPH 甲醇溶液」，點一下展開、再點收起；按「掃描」「收訊」這類按鈕時譜會自動展開。面板展開時，3D 的主角會移到沒被擋住的地方；橫拿時標題縮成一行、細條掛在右上角（GC-MS 是上下各一條），下面整片留給 3D；直拿的觸控手機會提示一次建議轉成橫式。導覽中細條藏起來，結束後回到原本的收合狀態。桌機與平板的版面不變。離子阱質譜的兩個畫面直拿時只多了轉向提示，版面照舊；手機橫拿時，拆開探索的控制面板收成右上角的「調整」細條，動畫講解在播放中幾秒沒操作就讓出上下兩條（點一下就回來）。

維護索引：[離子阱質譜：動畫講解](./lcq/MAINTENANCE.md)、[離子阱質譜：拆開探索](./lcq-3d/MAINTENANCE.md)、[GC-MS](./gc-ms/MAINTENANCE.md)、[UV-Vis](./uv-vis/MAINTENANCE.md)、[NMR](./nmr/MAINTENANCE.md)、[質譜儀-不同分析器比較](./mass-analyzers/MAINTENANCE.md)、[光譜-光與分子](./spectroscopy/MAINTENANCE.md)、[層析-GC 與 HPLC](./chromatography/MAINTENANCE.md)、[數據畫圖](./plot/MAINTENANCE.md)。

## 品牌與資料來源

品牌色沿用 [w-studio](https://github.com/Tung-Beauregard/w-studio) 的 `brand-guide.md`：背景 `#0B1111`、薄荷綠 `#A5F3CD`、主字色 `#F0F3EE`。入口插圖是結構或概念示意，不是儀器照片、真實量測訊號或精確光學配置。

教材來源及模擬限制見 [INSTRUMENTS.md](./INSTRUMENTS.md)。未來的維護約定見 [AGENTS.md](./AGENTS.md)。

## 跨 AI 維護

所有 AI 接手時遵循 [AGENTS.md](./AGENTS.md) 第 0 節的流程；第 8 節定義維護資料的內容、文件分工與更新責任。[CLAUDE.md](./CLAUDE.md) 引用同一份規則。

目前的文件缺口與交接狀態見 [docs/HANDOFF.md](./docs/HANDOFF.md)，檢查方法見 [docs/VALIDATION.md](./docs/VALIDATION.md)。要請 Claude 或其他 AI 首次補齊、或依最新程式更新維護資料，可直接使用 [文件更新提示詞](./docs/AI-MAINTENANCE-PROMPT.md)。
