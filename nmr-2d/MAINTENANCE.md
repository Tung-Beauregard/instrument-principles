# 二維 NMR:維護說明

`nmr-2d/index.html` 是單一 HTML 檔,用 three.js 0.183.2(jsDelivr 的 ES module,經 importmap 載入)繪圖,元件標籤用 three.js 的 `CSS2DRenderer`,不需要建置。這一頁是 `nmr/`(「訊號怎麼來」)的續篇:同一類 500 MHz 核磁共振儀,換一組脈衝序列做二維實驗。畫面左邊是剖開的超導磁鐵與探頭(`nmr/` 磁鐵的簡化版),中間是立在桌上的脈衝序列(時間軸),右邊是資料堆疊:每一次 t1 收到的 FID 排成一片片薄片,沿 t2、t1 各做一次傅立葉轉換後攤平成桌上的二維圖。可以選實驗(COSY、HSQC、HMBC)、拖曳 t1 之後的脈衝或用滑桿改 t1、選 t1 增量次數(32、128、512)、切換堆疊或等高線、測量;滑鼠停在二維圖的峰上,左上的香草醛結構式會標出是哪兩個原子。「導覽」與影片共用同一條 99 秒、8 章的腳本(`?film`、`?rec`)。科學資料與來源見 `../INSTRUMENTS.md`,檢查步驟見 `../docs/VALIDATION.md`。

**正本:** 儲存庫裡的 `nmr-2d/index.html` 就是正本(2026-11-18 新增),直接改這個檔。版面與骨架從 `uv-vis/index.html` 複製後改寫(導覽、影片、手機版面、畫面大小、英文版的做法都相同,見 `../uv-vis/MAINTENANCE.md`);兩張圖的 console、`.zbtn`、桌機小螢幕與頁尾、導覽時分頁列的寬度照 `../ftir/`;讀值卡下面的小面板照 `../fluorescence/` 的 `.jab`;磁鐵的剖面工具(`latheParts()`、`cutCaps()`、玻璃與液體的著色器)取自 `../nmr/`。module 的大區以 `// ================= 名稱 =================`、小區以 `// ---------- 名稱 ----------` 標示。

**對應的儀器:** 頁面不寫型號;說明框的小字寫「以 Bruker AVANCE III 500 搭配 5 mm 探頭為例」,和 `nmr/` 頁同一類儀器。數字與來源見 INSTRUMENTS.md 的二維 NMR 一節。

## 分區與主要名稱

| 分區 | 內容 | 常改的地方 |
|---|---|---|
| `<head>` 與 CSS | `<title>`、meta description 與 og 標籤(圖在 `../assets/og/nmr-2d.jpg`,由主控產生);CSS 變數與範本相同;`.jab` 與 `#mol`(結構式);`#plot` 200 px 高(二維圖要高一點);`.zbtn`(「放大芳香區」);`html.touring`、`html.film`、`html.rec`、980 px 與 420 px 斷點、`html.mp` 手機版、手機導覽(2026-11-09 那一段)、桌機小螢幕(導言收起、`#mol` 80 px、`#plot` 150 px、標籤只留名稱)、981 到 1359 px 收起頁尾;最後一行 `zoom:var(--ui,1)` | 版面 |
| HTML | 左上 `.hud`(分頁列、`.k`「二維 NMR」、`.big`「誰和誰相連」、導言、讀值卡 `#cE` 實驗、`#cK` t1 增量、`#cX` 交叉峰、結構式 `.jab` 的 `#mol`、說明 `#note`);右上 `#ctl`(`#segExp`、`#t1` 與 `#t1v`、`#segN`、`#segView`、`#segShell`、`#btnScan`、`#btnTour`、`#btnHelp`,畫質選單由 `quality` 加在最後);說明框 `#help`;下方 `#console`(`#conTitle`、`#conSample`、`#btnZoom`、`#legend`、`#plot`、`#tip`;右邊 `#vT` `#mT` t1、`#vM` `#mM` 估計時間、`#vR` F1 解析度);`.foot`;字幕 `#cap`;字卡 `#titlecard`;`#tourExit` | 文案、按鈕 |
| 小工具 | `clamp`、`lerp`、`sstep`、`ease`、`win`、`MONO`、`SANS`、`EN`(英文版時為 true)、`fmtMs`、`fmtPpm`、`fmtMin` | |
| NMR 常數與二維實驗 | `NMR`(¹H 500.13 MHz、磁旋比、Ξ(¹³C))、`N_OPTS`、`EXP`(每種實驗的 F1 譜寬 `sw1`、頻率 `mhz1`、每個增量收幾條 FID `k`、每條掃幾次 `ns`、等待 `d1`、收訊 `aq`、二維圖的縱軸 `f1` 與放大時的 `zf1`、F1 的最小峰寬 `w1`、刻度間距);`F2R`、`ZF2`;`t1max()`、`runTime()`、`resPpm()`、`w1Of()`、`W2` | 實驗參數 |
| 香草醛 | `pk()`、`PEAKS`(三種實驗的峰:位置、強弱、名稱、說明、結構式上要標的路徑 `hl`)、`NCROSS`、一維譜 `H1`、`H1LAB`、`C13`、`lor()`、`h1At()`、`c13At()` | 化學位移、交叉峰 |
| 二維譜與資料堆疊的模型 | `cyc1()`、`cyc2()`、`peakSet()`(快取 `SETS`)、`modT1()`、`fidVal()`、`specVal()`、`NP`、`NVMAX`、`nvOf()`、`COLF2`、`stackOf()`(快取 `STACKS`)、`kOf()`、`RUN`、`FAST`、`runProg()` | 模型、測量的節奏 |
| 場景 | 同範本(renderer、CSS2D、霧、環境光、相機、OrbitControls、composer、bloom、三盞燈);直拿手機的相機另設;`TEXTS`、`canvasTex()`、`textTex()`、`redrawTexts()`;桌面、牆、三塊說明螢幕 `screenTex()`(一維譜 → 二維地圖、脈衝 · 等 t1 · 脈衝 · 收 FID、隔 3 個鍵 → 交叉峰) | 牆上說明 |
| 儀器 | `inst`、`MAT`(範本的材質加上 `nmr/` 磁鐵的 `mshell`、`mdark`、`steel`、`alu`、`cut`、`cutLight`、`mli`、`g10`)、`CUTMAT`、`mesh()`、`shellParts`、`shellPart()`、`shellBox()`、`glassMaterial()`、`liquidMaterial()`;超導磁鐵(`MX`、`MZ`、`MAG`、`CUT_CENTER`、`CUTS`、`latheParts()`、`cutCaps()`、`solid()`、`ringSolid()`、`vessel()`、`MG`、`coilMat`),組裝時補上剖開那一角的外殼;探頭與樣品管(`PRB`、電波線圈 `coilRF`) | 元件 |
| 脈衝序列 | `BZ`、`BX0`、`BX1`、`HY`、`CY`、`PX`、`GMAX`、`LF`、`SEQ`、`seqLayout()`、`C_RF`、`C_SIG`、`C_DATA`、`SEQG`(面板群組,繞中心轉 `BROT`)、`bw()`、`bwa()`(面板座標換世界座標)、`railMat`、`textPlane()`、`txt()`、`PERIODS`(準備期、發展期 t1、混合期、檢測期 t2)、`DIVS`、`t1Tag`、`tmTag`、`bracket`、`PULSES`、`playhead`、`fidLine` 與 `fidKey` | 時間軸 |
| 資料堆疊與二維圖 | `SX0`、`SX1`、`SZ0`、`SZ1`、`SB`、`SH`、`xOf()`、`zOf1()`、`zSlice()`;平台與格線;軸名 `STRIP`(`t2`、`f2`、`t1`、`f1H`、`f1C`);COSY 對角線 `diag`;堆疊的線 `stackMat`、`stackLines`、薄片 `plateMat`、`platesGeo()`、`plates`、一欄的起伏 `colLine`、`stackGeo()`;二維圖的小丘 `bumpGeo`、`bumpMat`、`bumps`、`setBumps()`;兩個機箱(組裝時蓋住時間軸與資料區) | 主角 |
| 訊號的路 | `PATH_TX`、`PATH_RX`、`dataPath()`、`buildRays()`(`seg()`、`polyline()`、`raysKey`)、光點 `flow()`、`buildPhotons()` | 電波與資料 |
| 標籤 | `LBL`、`label()`、`labelOp()`、`labelText()`、`labelMove()`、`LBL_KEYS`(mag、probe、tube、seq、fid、stack、map) | |
| 影片腳本 | `FILM_DUR`、`CAMK`、`CAPS`、`LBL_WIN`、`camAt()` | 導覽 |
| 狀態 | `S`、`W`、`film(t)`、`frameCommon(t)`、`kReal()`、`updateBoard()`、`updateData()`、`selPeaks()`、`hoverPk`、`pinPk` | |
| 介面 | `KIND`、`noteHTML()`、`updateDOM()`、`ghostShown()`;結構式 `molLayout()`、`LABELED`、`BONDS`、`wrapText()`、`drawMol()`;譜圖 `LEV`、`contours()`(快取 `CONT`)、`prepCanvas()`、`drawPlot()`、`spec1()`、`plot1D()`、`plotStack()`、`plotMap()`、`pickPeak()` 與提示框;控制 `segOn()`、`setBtn()`、`stopRun()`、`setU()`、`keepGhost()`、`finishRun()`;拖曳脈衝 `pick()`、`drag`;導覽 `tour`、`startTour()`、`endTour()`;視角操作 `nav` | 互動流程 |
| 迴圈 | `interactive(dt, now)`、`fv`、`render()`、`resize()`;除錯物件 `window.N2D`;等字型後 `redrawTexts()`;`?rec` 的 `window.__seek`;主迴圈與分頁切換時的時間平移 | |

## 二維譜與資料的模型

### 實驗參數與讀值

- `EXP` 的典型值照查證筆記 §2.6(假設):COSY 的 F1 譜寬 10 ppm、HSQC 200 ppm(要含 191 ppm 的醛基碳)、HMBC 222 ppm;等待 2.0 s;收訊 COSY 0.25 s、HSQC 0.15 s、HMBC 0.30 s;COSY 每個增量 1 條 FID 掃 1 次,HSQC 2 條各 2 次,HMBC 1 條 4 次。
- 每次 t1 加長 `dt1` = 1 / (`sw1` × `mhz1`):COSY 199.95 µs、HSQC 39.76 µs、HMBC 35.82 µs。t1 最長 `t1max()` = (N − 1) × `dt1`。估計時間 `runTime()` = N × k × ns × (d1 + aq)。F1 解析度 `resPpm()` = `sw1` ÷ N。用 Node 跑這些式子(2026-11-18):

| 實驗 | N | t1 最長 | F1 解析度 | 估計時間 |
|---|---|---|---|---|
| COSY | 32 / 128 / 512 | 6.20 / 25.39 / 102.17 ms | 0.313 / 0.078 / 0.020 ppm | 1.2 / 4.8 / 19.2 分 |
| HSQC | 32 / 128 / 512 | 1.23 / 5.05 / 20.32 ms | 6.25 / 1.56 / 0.39 ppm | 4.6 / 18.3 / 73.4 分 |
| HMBC | 32 / 128 / 512 | 1.11 / 4.55 / 18.30 ms | 6.94 / 1.73 / 0.43 ppm | 4.9 / 19.6 / 78.5 分 |

- 讀值:讀值卡 `#cK` 是 `kReal()`(畫面上收到第幾片換算成實際的增量)/ N,`#cX` 是 `NCROSS`(COSY「1 對」、HSQC 5、HMBC 14);`#vT` 是這一次的 t1(`W.u` × `t1max()`),`#vM` 是「已完成的比例 × 估計時間 / 估計時間」,`#vR` 是 F1 解析度(第三格的公式「F1 解析度 = 譜寬 ÷ 增量次數」)。

### 峰的位置與寬度

- `PEAKS`:COSY 7 個(5 個對角峰、1 對交叉峰 H-5 ↔ H-6)、HSQC 5 個、HMBC 14 個(查證筆記 §3.6 建議的清單;強、中、弱用 `ST` 1、`MD` 0.6、`WK` 0.3)。沒有畫:COSY 的 H-2/H-6(在對角峰裡、而且 1.8 Hz 的小偶合會抵銷)、HMBC 的四鍵峰與一鍵殘留雙峰、OH 的 HMBC 相關。甲氧基在 HSQC 的強度是 3(三個氫)。
- 每個峰在 F2 與 F1 都是高斯。F2 寬 `W2` = 0.085 ppm(示意,實際更細);F1 寬 `w1Of()` = max(`w1`, 1.6 × 譜寬 ÷ N)(t1 只收到 t1 最長,峰沿 F1 被拉寬;1.6 是加窗函數後的示意倍數)。`w1` 是畫面上的最小寬度:COSY 0.02 ppm、碳 0.8 ppm。所以 32 次時峰沿 F1 拉長(COSY 0.50 ppm、HSQC 10 ppm、HMBC 11.1 ppm),512 次時很細;COSY 32 次時 H-5 的交叉峰(F1 7.43)和對角峰(F1 7.04)只差 0.39 ppm,會糊在一起。OH 的對角峰另設 0.25 ppm 寬。
- 一維譜(投影與 02 章):`H1` 是 [ppm, 氫的數目, 峰寬],H-2 與 H-6 相差 0.01 ppm、峰寬 0.012 ppm,所以疊成一根;`C13` 的高度是示意(帶氫的碳高、沒有氫的碳矮,照猶他大學一維碳譜的趨勢)。

### 堆疊(示意)

- 堆疊最多畫 64 片(`NVMAX`;32 次時 32 片,128 與 512 次時 64 片,每片代表幾次增量)。`stackOf()` 每片算 `NP` = 300 點的 FID(`fidVal()`)與沿 t2 轉換後的譜(`specVal()`),依整疊的最大值正規化,結果快取。
- 沿 t1 的起伏 `modT1()` = cos(2π × `c1` × u) × e^(−0.35u),u 是這一片的 t1 佔最長 t1 的比例;`c1` = `cyc1()` = 2 + 7 × (F1 在縱軸上的位置比例),所以縱軸越高的峰起伏越快,這就是第二次傅立葉轉換把「起伏的快慢」換成 F1 位置的意思。FID 沿 t2 的振盪 `cyc2()` = 3 + 9 × (F2 的位置比例) 圈,衰減 e^(−2.6τ)。真實的頻率高得多,這裡的圈數是示意。同一欄有兩個以上的峰時(COSY 7.04、HSQC 7.43、HMBC 7.04,`COLF2`),沿 t1 看得到兩種起伏疊在一起;05 章拿出來看的就是這一欄。

### 一次測量 `runProg(el, T, nv)`

依經過的秒數回傳 `{ k, ph, morph, col, flat, rise, acq, phase }`。互動的 `RUN` = 收訊 4.0 s、沿 t2 轉 0.8 s、看一欄 0.6 s、沿 t1 轉並攤平 1.2 s,共 6.6 秒;影片裡 07、08 章用 `FAST`(3.0、0.6、0.3、1.2)。收訊時 `kOf()` 讓前兩片佔 22% 的時間(時間軸上看得到播放線走過、脈衝一個個亮),其餘快轉。

## 座標、尺度與模型

- 單位約 1 cm,y 朝上,桌面頂面 y = 0;預設相機 `(46, 118, 190)` 看 `(-34, 8, -18)`(磁鐵、時間軸、堆疊由左上往右下排在面板之間的空地);直拿的手機(寬小於高的 0.9 倍)改成 `(14, 330, 470)` 看 `(-8, 0, -10)`。牆上三塊說明螢幕放在 y = 150(比範本高):預設視角(1024×768 到 2560×1440、手機)與影片每一格都完全看不到它們,不會只露出一半;轉動視角往上看才看得到。
- **磁鐵:** 軸在 `(MX, MZ)` = `(-56, -16)`,外殼半徑 14.5、高 9 到 47(縮小的示意,`nmr/` 的磁鐵是實際大小),磁場中心 `MAG.yc` = 27。由外到內:白色外殼與隔熱膜、液態氮槽(液體 `#7fc4ff`)、擋熱輻射的屏蔽、液態氦槽(液體 `#d6f0ff`)、銅色的超導線圈與玻璃纖維骨架、室溫孔道(半徑 1.75)。剖開那一角朝 `CUT_CENTER` = 0.62 rad(預設相機的方向),各層剖開的角度在 `CUTS`(外層開得多)。剖面用黃銅色(`CUTMAT`)。頂上四個塔(液氦黃環、液氮綠環)與三支腳。組裝時一塊同外形的弧形外殼補上剖開的那一角,展開時往外飛並淡出。
- **探頭與樣品管:** 探頭從磁鐵底部插進室溫孔道,上端是玻璃套,裡面是電波線圈(兩個環加四根直條,打脈衝時發出琥珀色的光,`coilRF.emissiveIntensity` = 2.6 × `W.tx`)與樣品管(玻璃、香草醛溶液 `#7fd6ff`、藍色管蓋),管子從孔道頂端伸出來。
- **脈衝序列面板 `SEQG`:** 面板座標的 x 從 `BX0` = −36 到 `BX1` = 8,¹H 軌道在 `HY` = 14、¹³C 軌道在 `CY` = 6,面板在 `BZ` = −16;整塊繞中心轉 `BROT` = 0.32 rad 朝向預設相機。面板上的東西都用面板座標;要畫到世界座標(訊號的路、標籤)時用 `bw()`、`bwa()`。
- **資料平台:** x 從 `SX0` = 18 到 `SX1` = 66(F2 從 10.4 到 3.4 ppm,`xOf()`,照 NMR 慣例左大右小),z 從 `SZ0` = −26 到 `SZ1` = 14(堆疊的 t1 往前變大;攤平後是 F1,`zOf1()`,往前變大,和下方二維圖由上往下遞增一致)。薄片的基線 `SB` = 7.4、最大高度 `SH` = 5.4。
- **外殼:** 三塊 `shellParts`:磁鐵剖開那一角、蓋住時間軸的主控台(面板一起轉 `BROT`)、蓋住資料區的工作站。`frameCommon()` 用 `traverse` 隱藏淡出的外殼(主控台的箱子包在子群組裡)。

## 訊號的路

- `PATH_TX`(琥珀色 `#ffc261`,和 `nmr/` 的電波同色):面板左端 → 桌面 → 探頭底座 → 沿探頭往上到電波線圈。`PATH_RX`(薄荷綠 `#5dffb0`,`nmr/` 的訊號色):同一條路反過來、稍微錯開。`dataPath(zNew)`:面板右端 → 桌面 → 堆疊左緣最新那一片的位置。
- 亮度由 `updateBoard()` 算:播放線經過脈衝時 `W.tx` 亮,在檢測期時 `W.rx` 亮,收訊時播放線走到 FID 尾端 `W.dat` 亮;快轉收訊時三條都維持一半的亮度。`buildRays()` 以 `${tx}|${rx}|${dat}|${zNew}`(亮度取到 0.05)為鍵,相同就不重建;光點 `buildPhotons()` 每格算。

## 時間軸

- `SEQ` 每種實驗的元素 `[軌道, 錨點, 位移, 種類]`:錨點 `p` 第一個脈衝、`s` t1 起點、`m` t1 中間、`e` t1 終點、`f` 收訊起點;種類 90(寬 1)、180(寬 2)、`dec`(HSQC 收訊時 ¹³C 的去偶,一條低的長條)。`pre`、`post` 是 t1 前後的固定段(HSQC 的轉移、HMBC 的低通濾波與等長程偶合都簡化在裡面)。COSY 只用 ¹H 軌道(¹³C 軌道變暗);HSQC、HMBC 的 t1 放在 ¹³C 的兩個 90° 脈衝之間,中間有一個 ¹H 的 180°,最後收的都是 ¹H 的 FID(查證筆記 §8.4)。
- `seqLayout(ek, u)`:t1 的長度是 u × `GMAX`(13,放大、不按比例)。`updateBoard()` 每格只改 `PULSES`(10 個固定的方塊)的位置、大小與亮度、t1 括號、四個時期名稱與分隔線、播放線;FID 的點只在實驗、次數、u 或收訊起點改變時重算(`fidKey`),畫到哪由 `setDrawRange` 決定。
- 拖曳:`PULSES` 裡錨點是 `e` 或 `m` 的方塊(t1 之後的脈衝與 t1 中間的 180°)可以拖,往右每 320 像素 t1 從 0 拉到最長。

## 堆疊與二維圖

- `stackGeo()` 為每組(實驗、次數)建一次 `LineSegments`:每個頂點存 FID 與轉換後的高度(`aY`)與片號(`aK`)。著色器用 `uMorph` 混合兩者、`uCount` 決定顯示幾片(最新那片較亮)、`uFlat` 讓整疊倒平、`uHi` 標亮滑桿的那一片;顏色由薄荷綠(FID)換成青色(譜)。薄片 `plates` 與一欄的起伏 `colLine` 也一樣只換 uniform。
- 二維圖的小丘:`InstancedBufferGeometry`,每個峰一個實例(位置、σ、強弱、編號),`setBumps()` 只在峰的組合改變時重設;高度 = √強弱 × 3.4 × `uRise`,σ 至少 0.75(看得到),著色器畫等高線圈(`fwidth`)並發光;沒有測量時是灰色的預覽;選到的峰較亮。COSY 另有一條對角線。
- 平台邊上的軸名在轉換時換掉:前緣 t2 → F2(`W.morph`),右緣 t1 → F1(`W.flat`,碳或氫兩種刻度)。

## 譜圖與結構式

- `drawPlot()` 每秒最多 30 次,依 `W.conMode` 畫三種:`plot1D()`(02 章的一維氫譜,標出「H-2 + H-6 疊在一起」)、`plotStack()`(堆疊圖:由右上往左下每一片多等一點,FID 薄荷綠、譜青色,滑桿那一片較亮,05 章那一欄的起伏畫白線;還沒測量時畫這一次 t1 的 FID 灰色點線)、`plotMap()`(二維圖)。
- `plotMap()`:F2 在下(左大右小)、F1 在右(由上往下遞增,COSY 的對角線由左下到右上);上方是 ¹H 一維譜,左方是 ¹H(COSY)或 ¹³C 一維譜(HSQC、HMBC,8 個碳都有);等高線 `contours()` 在 2 像素一格的網格上加總每個峰、用 marching squares 畫 `LEV` 各層,以(峰組、範圍、大小)為鍵快取。這一次是青色實線、上一次是琥珀色虛線(只在縱軸是同一種原子時畫,`ghostShown()`)、沒有測量時是灰色點線預覽;滑鼠位置畫十字虛線;選到的峰畫白圈,導覽與影片裡另外畫名稱框。「放大芳香區」:F2 6.85 到 7.75 ppm,F1 用 `EXP[].zf1`。
- 提示框:`pickPeak()` 找 13 像素內最近的峰,寫「F2 · F1 ppm · 名稱(說明)」;點一下(`pointerdown`)把那個峰固定為 `pinPk`(觸控螢幕沒有 hover)。換實驗時清掉。
- 結構式 `drawMol()`:苯環平放,C-1(接醛基)在左、C-4(接 OH)在右,環裡標 1 到 6;選到的峰依 `hl` 的路徑把鍵標成青色、氫那一端青色、碳那一端淡紫色(HSQC、HMBC 的 F1 原子);右邊寫名稱與說明。以(大小、實驗、選到的峰、字型是否載入)為鍵,相同就不重畫。

## 操作與連動

| 操作 | 程式 | 一起改變的東西 |
|---|---|---|
| 實驗 `#segExp` | `stopRun()`;`keepGhost()`(這一次的結果變成上一次);`S.exp`;`setU()` | 時間軸的脈衝、¹³C 軌道、縱軸與投影、讀值、說明、標籤的小字;提示框清掉 |
| t1 滑桿 `#t1` | `stopRun()`;`setU()` | 時間軸的 t1 空隙與 FID、`#t1v`、`#vT`、堆疊標亮的那一片 |
| 拖曳 t1 之後的脈衝 | `pick()`;同上,不緩動 | 同上;導覽與影片中不作用 |
| t1 增量次數 `#segN` | `stopRun()`;`keepGhost()`;`S.n` | 堆疊片數、F1 峰寬、讀值(t1 最長、時間、解析度) |
| 顯示 `#segView` | `S.view` | 3D 堆疊立起或攤平(`W.flat`、`W.rise` 約 1 秒緩動)、下方的圖 |
| 外殼 `#segShell` | `S.explode` | 三塊外殼、標籤、bloom |
| 「測量」`#btnScan` | 已有結果時先變成上一次;`S.run`;外殼切到展開;按鈕變「停止」 | 約 6.6 秒:收 FID、沿 t2 轉、看一欄、攤平;完成後 `finishRun()` 把顯示切到等高線 |
| 「放大芳香區」`#btnZoom` | `S.zoom` | 二維圖的範圍 |
| 二維圖上 hover 或點一下 | `hoverPk`、`pinPk` | 提示框、結構式、3D 小丘與二維圖上的圈 |
| 「導覽」、Esc、「結束導覽」 | `startTour()`、`endTour()` | 存下與還原 `S` 與相機 |

## 導覽與影片

`film(t)`,`t` 是 0 到 `FILM_DUR` = 99 秒,只依 `t` 算整格狀態(07、08 章的測量也是用 `runProg()` 從時間算)。

| 章 | 字幕(秒) | 標籤 | 畫面 |
|---|---|---|---|
| 片頭 | 0.2 到 5.6 秒字卡 | | 外殼蓋著;相機和預設視角相近 |
| 01 展開 | 5.8 到 12.4 | mag、seq、stack | 6.2 到 9.6 秒外殼展開 |
| 02 擠在一起 | 12.8 到 19.2 | probe、tube | 剖開的磁鐵近看;下方(影片在右上)是一維氫譜 |
| 03 兩個脈衝 | 19.6 到 25.6、25.8 到 31.8 | seq、fid | COSY 單一增量慢動作兩次(t1 比例 0.14、0.42),播放線走過、脈衝一個個亮、FID 畫出來 |
| 04 改變 t1 | 32.2 到 38.2、38.4 到 44.4 | stack | 33.0 到 43.6 秒收 128 次(前兩片慢動作);37.4 秒起下方出現堆疊圖 |
| 05 傅立葉轉換 | 44.8 到 50.8、51 到 57 | stack、map | 45.2 到 47.0 沿 t2 轉;47.2 到 54.0 白線拿出 7.04 ppm 那一欄;52.6 到 55.4 攤平,53.4 到 56.2 小丘升起,53.8 秒起下方是二維圖 |
| 06 氫對氫 COSY | 57.4 到 63.4、63.6 到 69.6 | | 先標 H-2 + H-6 的對角峰,再標 H-5 ↔ H-6 一對交叉峰並放大芳香區;69.2 到 69.8 秒地圖沉下去 |
| 07 氫對碳 HSQC | 70 到 76、76.2 到 82.2 | seq | 70.2 秒起 HSQC 快一點測完(看時間軸的 ¹³C 軌道),76.4 秒起標 H-2/C-2 與 H-6/C-6 |
| 08 隔鍵的碳 HMBC | 82.6 到 88.6、88.8 到 93.8 | stack | 82.6 秒起 HMBC 測完,上一次 HSQC 留著當琥珀色虛線;89 秒起標甲氧基的氫 ↔ C-3 |
| 片尾 | 94.2 到 95.2 秒字卡淡入 | | 93.4 到 96.6 秒外殼合上 |

## 修改的切入點

- **文字:** 字幕 `CAPS`;片頭片尾字卡在 `updateDOM()`;標籤在 `label()` 與 `frameCommon()` 的 `labelText()`;說明 `noteHTML()` 與 `KIND`;峰的名稱與說明在 `PEAKS`;結構式的提示在 `drawMol()`;軸名在 `STRIP`、`plotStack()`、`plotMap()`;時間軸的字在 `PERIODS`、`tmTag`;牆上說明 `screenTex()`。中英一起改。
- **化學位移與交叉峰:** `PEAKS`、`H1`、`C13`;加峰時 `hl` 路徑的原子名稱要在 `molLayout()` 裡(C1 到 C8、O3、O4、O7、H2、H5、H6、H7)。改了要同步 INSTRUMENTS.md。
- **實驗參數:** `EXP`;估計時間與解析度的表要重算(本文件與 INSTRUMENTS.md、VALIDATION.md)。
- **脈衝序列:** `SEQ` 的元素與 `pre`、`post`;方塊最多 10 個(`PULSES`)。
- **元件位置:** 磁鐵 `MX`、`MZ`、`MAG`;面板 `BZ`、`BX0`、`BX1`、`BROT`;平台 `SX0` 到 `SZ1`。標籤的兩組座標、`CAMK` 看的點、`PATH_TX`、`dataPath()` 是另外寫的,移動元件時一起看。
- **導覽:** `FILM_DUR`、`CAMK`、`CAPS`、`LBL_WIN`,以及 `film()` 裡寫死的秒數。影片版面左上是讀值、右上是圖,主角要擺在畫面中間偏下。

## 設計取捨

- 頁面上的二維譜是依化學位移「畫」出來的(每個峰兩個方向的高斯),不是從模擬的 FID 做傅立葉轉換;堆疊裡的 FID 與起伏是示意,頻率縮小成看得到的圈數。用意是讓「一疊 FID → 沿 t2 轉 → 沿 t1 轉 → 二維圖」的流程看得清楚,而解析度的差別(32、128、512 次)用 F1 峰寬照實際的譜寬 ÷ 次數表現。
- 磁鐵縮小放在桌上,孔道、探頭與樣品管放大;t1 與整條時間軸放大、不按比例(說明框、標籤小字與時間軸上都寫了)。
- 堆疊最多 64 片,512 次時一片代表 8 次;幾何每組只建一次,收訊時只改 uniform。
- 上一次只在縱軸是同一種原子時畫(COSY 是氫、HSQC 與 HMBC 是碳),不同的縱軸疊在一起沒有意義。
- HMBC 的提示框寫的鍵數是照結構數的(說明框寫明 HMBC 本身分不出 2 或 3 個鍵)。

## 修改後要檢查

- 切出 module 跑 `node --check`(module 語法與破折號)、`node scripts/check-i18n.mjs --list nmr-2d/index.html`、字幕速度、`node scripts/check-i18n-film.mjs nmr-2d`。`check-ui-scale`、`check-render-quality`、`check-camera-nav`、`check-mobile-panels` 的清單裡還沒有 nmr-2d(主控整合時加入)。
- HTTP 預覽開 `nmr-2d/`:console 沒有錯誤;開頭是 COSY、128 次、等高線(灰色預覽)、t1 6.35 ms;按「測量」約 6.6 秒後二維圖出現,讀值卡「128 / 128」。換 HSQC 再測,換 HMBC 再測:琥珀色虛線是 HSQC。
- 導覽:`?film&rec&t=秒` 抽 3、10、17、23、29、36、42、48、53、56、60、66、72、75、79、85、87、91、96 秒。
- 1024×768、1366×768、1920×1080、2560×1440、390×844 與 844×390;英文版(`?lang=en`)。

## 網址參數與除錯

- `?film`、`?rec`、`?t=` 同範本。`window.__err`、`window.__gl`、`window.__ready`。
- `window.N2D`:`S`、`W`、`EXP`、`PEAKS`、`CAMK`、`peakSet`、`stackOf`、`runTime`、`t1max`、`resPpm`、`film`、`frameCommon`、`render`、`camera`、`controls`、`tour`、`startTour`、`endTour`(給檢查與調鏡頭用)。
