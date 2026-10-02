# 儀器框

互動儀器教材入口。頁面只保留「儀器框」、儀器圖與名稱連結、返回主頁及到站人數，色彩延續 W AI Studio。

- [儀器入口](https://tung-beauregard.github.io/instrument-principles/)
- [離子阱質譜](https://tung-beauregard.github.io/instrument-principles/lcq/)
- [UV-Vis 分光光度計](https://tung-beauregard.github.io/instrument-principles/uv-vis/)
- [GC-MS](https://tung-beauregard.github.io/instrument-principles/gc-ms/)
- [W AI Studio 主頁](https://tung-beauregard.github.io/w-studio/)

目前共有三份教材：離子阱質譜、GC-MS、UV-Vis 分光光度計。儀器型號與規格以各教材的來源說明為準。

## 專案結構

```text
index.html                 儀器入口；含完整靜態備援內容
assets/
  styles.css               入口頁樣式與響應式版面
  app.js                   教材清單載入、到站人數
  *.svg                    品牌與儀器概念示意
content/
  instruments.json         儀器名稱、順序、圖片、狀態與連結
lcq/index.html             原本根目錄的離子阱教材
gc-ms/index.html           GC-MS 教材
uv-vis/index.html          UV-Vis 分光光度計教材
scripts/check-site.mjs     資料、相對連結與靜態備援檢查
.nojekyll                  GitHub Pages 靜態網站設定
README.md                  專案導覽與預覽方式
INSTRUMENTS.md             各儀器功能、數據與示意說明
AGENTS.md                  未來開發與維護規則
```

根目錄現在是入口頁；原本位於根目錄的離子阱教學移至 `lcq/`。GC-MS 網址維持 `gc-ms/`，三份教材都能返回入口並互相切換。教材本身的模型、科學計算與原有控制功能保留。

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
```

另需實際檢查：桌面與手機入口排版、三個教材的載入、入口與返回連結、鍵盤焦點、減少動態效果偏好。瀏覽器檢查才能確認外部 CDN 與 WebGL 的實際可用性。

## 品牌與資料來源

品牌色沿用 [w-studio](https://github.com/Tung-Beauregard/w-studio) 的 `brand-guide.md`：背景 `#0B1111`、薄荷綠 `#A5F3CD`、主字色 `#F0F3EE`。入口插圖是結構或概念示意，不是儀器照片、真實量測訊號或精確光學配置。

教材來源及模擬限制見 [INSTRUMENTS.md](./INSTRUMENTS.md)。未來的維護約定見 [AGENTS.md](./AGENTS.md)。
