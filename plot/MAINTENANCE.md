# 數據畫圖:維護說明

`plot/` 不是儀器教材,是一個工具頁:把儀器匯出的檔案放進來,在瀏覽器裡讀檔、畫成報告用的圖,下載 SVG 或 PNG。純 HTML、CSS 與 ES module,沒有外部依賴、不連網路、檔案不上傳。2026-10-22 建立,做法沿用作者在國科會進度報告裡畫圖的程式(Python 版),改寫成 JavaScript。

## 檔案與分工

| 檔案 | 內容 | 常改的地方 |
|---|---|---|
| `index.html` | 版面、樣式、分頁列、說明文字;只有 `<script type="module" src="./app.js">` 一支程式 | 文字、支援格式的說明、CSS |
| `parsers.js` | 讀檔:`parseSpc`、`parseAsp`、`parsePeCsv`(DSC 與 TGA csv)、`parseTgaXlsx`(含最小的 zip 與 xlsx 讀取 `unzipEntries`、`readXlsxSheet`)、`parseLcqRaw`、`parseXyText`;`detectType` 與 `parseFile` 是總入口;`trimTurnarounds`、`msSticks`、`fmtNL` 是數據整理 | 新格式、欄位名稱、平均算法 |
| `figure.js` | 畫圖:`Fig`(SVG 畫布)、`Axes`(座標軸)、`spectrumFigure`、`dscFigure`、`tgaFigure`(含 `dtg`)、`msFigure`、`ticStrip`、`niceTicks`、`clipPolyline`、`simplify` | 版面尺寸、線寬字型、圖例 |
| `app.js` | 頁面邏輯:`state`(檔案清單與各圖的選項)、`addFiles`、檔案卡片(`renderFiles`、`msControls`、`seriesControls`)、選項表單(`optionsForm`)、`buildSvg`、`renderFigures`、下載(`download`)、拖放綁定(`bind`);`window.plotApp` 給測試用 | 選項、預設值、介面文字 |
| `../scripts/check-plot.mjs` | Node 檢查:在程式裡合成各格式的小檔案,讀回核對數值,再畫成 SVG 檢查 | 新格式要加對應的合成檔與斷言 |

`parsers.js` 與 `figure.js` 不碰 DOM,Node 18 以上可以直接 `import`(xlsx 需要 `DecompressionStream`,Node 18 與現代瀏覽器都有)。

## 資料模型

`parseFile(name, arrayBuffer)` 依副檔名與內容判斷格式(`detectType`),回傳一個「資料集」:

- `spectrum`:`{x, y, xlabel, ylabel, meta}`。.spc、.asp、兩欄文字都是這種;FTIR 的 x 是波數。
- `dsc` / `tga`(PerkinElmer csv):`{segments:[{kind:'up'|'down', T, y, t, P}], all, meta}`。`T` 是 Sample Temperature,`P` 是 Program Temperature,`y` 是 Unsubtracted Heat Flow(mW)或 Unsubtracted Weight(mg)。分段依程式溫度的升降,等溫段略過;長度 50 點以下的段不算。
- `tga`(xlsx):`{series:[{name, T, w, w0, percentGiven, extra}]}`。第一列是表頭;表頭含 Temperature(或溫度)的欄是溫度欄,後面的數值欄都配它,直到下一個溫度欄;重量以第一點為 100%,表頭有 % 的視為已是百分比。`extra` 是該欄比溫度欄多出的列數(例如升溫結束後還在記錄、但沒有溫度的部分)。
- `ms`(LCQ .RAW):`{scans:[{num, time, tic, bpi, bpmz, lo, hi, npk, off}], peaks(scan), ranges, bad, empty}`。`peaks(scan)` 按需讀出 `[[m/z, 強度], …]`;`ranges` 是掃描種類(依質量範圍 lo-hi 分組,full scan 與 MS/MS 不同);`bad` 是算出的基峰或 TIC 與檔內索引不符的掃描數(應為 0)。

`app.js` 把每個檔案存成 `{id, name, label, enabled, ds, error, …}`;質譜檔另有 `rangeKey`、`scanFrom`、`scanTo`,xlsx 另有 `seriesOn`(每條曲線的勾選)。畫圖時依 `ds.kind` 分組,每一種各畫一張。

## 檔案格式(讀檔的依據)

- **Galactic SPC(新格式,fversn 0x4B)**:512 位元組主檔頭(位移 0 旗標、1 版本、3 Y 指數、4 點數 int32、8 與 16 起訖 X double、28 與 29 X/Y 的單位代碼),可選的 X 陣列(旗標 0x80),32 位元組子檔頭(位移 1 是子檔的指數),然後 Y 陣列:指數 −128 為 float32,否則為整數乘 2^(指數−32)(旗標 0x01 時為 16 位元、2^(指數−16))。只讀第一個子檔。依據 Galactic 的 SPC 檔案格式說明;實際以 Agilent MicroLab 匯出的檔驗證。
- **Agilent ASP**:純文字。第 1 行點數(後面可能跟著解析度),第 2、3 行起訖波數,再三行儀器參數,然後每行一個 Y 值;有的版本每行是「Y、X」兩欄(以最後 N 行當數據,有第二欄就用它當 X)。
- **PerkinElmer csv**(Pyris 匯出):表頭有 `Time`、`Unsubtracted Heat Flow`(DSC)或 `Unsubtracted Weight`(TGA)、`Program Temperature`、`Sample Temperature`;欄位用開頭比對。
- **xlsx**:自己讀 zip(中央目錄、stored 與 deflate,deflate 用 `DecompressionStream('deflate-raw')`),用正規表達式讀 `xl/worksheets/sheet1.xml` 的儲存格與 `xl/sharedStrings.xml`;只取第一張工作表。
- **Thermo LCQ Deca XP .RAW(版本 62)**:位移 2000 之後有 13 個間隔 520 位元組的 UTF-16 路徑欄位,其前 592 位元組是 run header(12 個 uint32:第 3、4 個是起訖掃描編號,第 8 個是掃描索引位址,第 9 個是數據位址)。索引每筆 72 位元組(uint32 位移、uint32 序號、uint16、uint16、uint32、uint32、uint32 峰數;位移 24 起六個 double:時間、TIC、基峰強度、基峰 m/z、low m/z、high m/z)。數據每個峰 8 位元組:uint32 強度字、uint16 m/z 整數、uint16 m/z 小數(除以 65536);強度 = (強度字 >> 8) × 8^(強度字 & 255)。這個版面是從檔案逆向推得的,沒有原廠文件;讀完會用索引裡的基峰與 TIC 逐張核對,不符的張數記在 `bad`。大檔(LC 的全程紀錄)的 run header 在檔尾附近,所以整個檔都要搜。

## 算法

- **光譜疊圖**(`spectrumFigure`):原檔的 Y 值,只加固定位移,不正規化(可選「正規化」把每條的最高峰拉成 1)。位移預設是「所有曲線的最大落差 × 1.15」往上取到 1、2、2.5、5 × 10ⁿ。曲線標示放在左端上方,標示的峰位畫灰色虛線、標在框上方,相鄰太近的往上錯一排。X 軸是波數時由大到小。
- **DSC**(`dscFigure`):上排只畫升溫段(第 1 次黑、第 2 次灰、第 3 次黑虛線),下排畫升溫(紅)與降溫(藍),第 2 次以後用淺色。升溫段從樣品溫度最低點起算、降溫段從最高點起算(`trimTurnarounds`,程式溫度剛反轉時樣品溫度還在往原方向走);「升降溫接在一起」時下排不修剪,兩段共用反轉處的點,所以會連成一圈。每格的縱軸各自依數據決定,上方多留 16% 放標題。左側的 endo ↑ / exo ↓ 圖例是作者要求的畫法。
- **TGA**(`tgaFigure`、`dtg`):重量以第一點為 100%;DTG 是 −dW/dT,先內插到 1 °C 格點,中央差分後做前後各 `half`(預設 8)點的移動平均;相鄰兩點重量差超過 3% 之後(讀值亂跳)不再算 DTG。csv 有降溫段時可以用藍色接在後面。
- **質譜**(`msSticks`、`msFigure`):把選定掃描(同一種掃描範圍)的峰疊在一起,中心每 0.1 取 ±h(預設 0.65)的視窗加總,除以掃描張數;局部極大是一根棒,m/z 取視窗內的強度加權平均;NL 是最高那根。這是作者在國科會報告裡的做法,與 Xcalibur 的平均圖譜在峰位與 NL 上一致(見 `docs/VALIDATION.md`)。峰標示由強到弱挑,同一區只標最強的,放不下就左右移開。

## 版面與單位

SVG 以 pt 為單位(`width="597.6pt"`),貼進 PowerPoint 就是這個尺寸;數值是把報告裡 300 dpi 像素版的圖換算來的(1 px = 0.24 pt):光譜 597.6 × 388.8、DSC 每列 648 × 388.8、TGA 554.4 × 381.6、質譜每格 104.6 高。線寬:曲線 1.08、框線與刻度 0.72、參考線 0.48;字:刻度 10、軸名 11、標示 9 至 11。字型 `Arial, "Microsoft JhengHei", "Noto Sans TC"`;上標用 `^{…}`,`Fig.text` 轉成 `tspan`。曲線先裁到框內(`clipPolyline`)再簡化(`simplify`,0.08 pt)。

PNG 是把 SVG 畫到 canvas 再輸出,解析度 300 dpi(`app.js` 的 `download`)。

## 修改與新增

- 新格式:在 `parsers.js` 加一個 `parseXxx`,回傳上面任一種資料集;在 `detectType`、`parseFile` 接上;`index.html` 的說明與 `scripts/check-plot.mjs` 的合成檔各加一段。
- 改版面:改 `figure.js` 各圖函式開頭的尺寸常數;選項從 `app.js` 的 `state.opts` 與 `optionsForm` 進。
- 介面文字在 `index.html` 與 `app.js` 的 `KIND_NAME`、`KIND_TITLE`、`optionsForm`。
- 改完跑 `node scripts/check-plot.mjs`、`node scripts/check-site.mjs`,再用瀏覽器放幾個真實檔案看(`window.plotApp.addFiles([File, …])` 可以從主控台餵檔案)。

## 已知限制

- .spc 只支援新格式(0x4B)與第一個子檔;舊格式(0x4D)與多子檔沒有實際檔案可以驗證。
- xlsx 只讀第一張工作表,儲存格要是數值(公式要有快取的值)。
- 質譜只讀 LCQ Deca XP 版本 62 的 .RAW;其他 Thermo 機型的 .RAW 版面不同。
- 瀏覽器必須支援 ES module、`DecompressionStream`、`File`/`Blob`(2023 以後的 Chrome、Edge、Firefox、Safari)。
