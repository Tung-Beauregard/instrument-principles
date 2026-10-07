# NMR 訊號怎麼來:維護說明

`nmr/index.html` 是單一 HTML 檔,用 three.js 0.183.2(jsDelivr ES module,經 importmap 載入)繪圖,不需要建置。版型和 `uv-vis/` 相同:左上是標題、讀值卡與說明,右上是控制面板,下方是譜圖螢幕,場景裡是 CSS2D 零件標籤;「導覽」與錄影共用同一條 100 秒的時間軸。檔案由作者電腦上的原始碼片段串接而成,串接時保留了分區標記,在檔案裡搜尋 `// ==== ` 就能跳到各區。

**正本:** 儲存庫裡的 `nmr/index.html` 是正本,其他電腦或 AI 直接修改這個檔即可。原始碼片段不在儲存庫中;若改用片段重新產生,必須先把儲存庫裡的修改併回片段,避免覆蓋別人的變更。

## 分區與主要名稱

| 分區 | 內容 | 常改的地方 |
|---|---|---|
| `00_core.js` | 匯入、畫質模組 `quality`、網址參數 `FILM`/`REC`、小工具(`clamp`、`lerp`、`sstep`、五次緩動 `ease`、時間窗 `win`、`approach`)、雜訊表 `NOISE_TAB` 與 `noiseAt()`、功能色 `COL`、NMR 常數 `NMR`、擷取參數 `ACQ`、`ppm2hz()`、小型自旋系統 `jacobiEigen()` 與 `spinSystem()`、溶劑峰 `SOLVENT_LINES`、示範樣品 `SAMPLES`(`van` 香草醛、`ea` 乙酸乙酯:群組、偶合常數、放大範圍 `zooms`、峰標記 `marks`、結構式位置 `structAt`)、譜線 `buildLines()`、譜高 `specAt()`、區間最高點 `specValue()`、峰頂 `peakTop()`、雜訊大小 `NOISE0`、訊雜比 `snr()`、`specNoiseAt()`、FID `fidCompute()` | 樣品的化學位移、偶合常數、放大範圍 |
| `10_scene.js` | 算圖器、CSS2D 標籤層 `labelR`、相機、`OrbitControls`、`fitClip()`(依看的距離調整近平面)、bloom 後製、燈光、地台、牆與三張示意螢幕 | 預設鏡頭、燈光、牆上螢幕 |
| `20_magnet.js` | 材質 `MAT`、剖面材質 `CUTMAT`、玻璃 `glassMaterial()`、液體 `liquidMaterial()`、切口方向 `CUT_CENTER`、旋轉體 `solidOfRevolution()`、`ringSolid()`、`vesselSolid()`、管線 `tube()`(`floor` 選項把落地的曲線夾在地面上);磁鐵尺寸 `MAG`、`MAGNET`(`full` 是補切口的弧形外殼、`cut` 是剖開的本體、`hinge` 門軸、`liquids`、`coilMats`、`turretTop`)、`onCutFace()`;磁力線 `ellipKE()`、`loopField()`、`COIL_LOOPS`、`fieldAt()`、`traceLine()`、`FIELD_SEEDS`、`FIELD_BOX`、`fieldMat`;地上的 5 高斯線 | 磁鐵外形、內部各層、磁力線條數 |
| `22_bore.js` | 孔道零件尺寸 `BORE`、`BORE_CUT`、探頭特寫時要淡出的 `ISO_GROUPS`;勻場管 `SHIM`(`SHIM.mat` 會發琥珀色光)、探頭 `PROBE`(接頭、同軸線、梯度線圈、鞍形射頻線圈 `coilMats`、`b1` 磁力線)、`PROBE_CON`、`COAX_A`、樣品管與轉子 `SAMPLE3D`(溶液 `solMat`)、`SAMPLE_TOP_DY`、升降管 `UPPER`、升降氣流 `AIR` 與 `updateAir()` | 探頭、樣品管 |
| `24_signal.js` | 主控台 `CON`(模組 sgu、ipso、rx、bla、bsms、vt 與指示條 `CON.mods`)、前置放大器 `PRE`、`wpt()`、各接頭位置、電纜 `CABLE`(patch、tx、rx、prb、shim、air)、探頭內同軸線 `COAX_PTS`;發光管 `glowMaterial()`、`chain()`、發射路徑 `TXP`(琥珀)與接收路徑 `RXP`(薄荷綠)、沿路光點 `photons`/`pMat`/`flowChain()`、每格更新 `updateSignal()` | 訊號路徑與顏色 |
| `30_spins.js` | 放大鏡玻璃球 `BUB`、`SPIN`(轉速縮放 `K`、顯示用 `T1` 與 `lwNat`、每群幾支 `ISO_PER`、順逆支數)、個別自旋 `spinMesh`(順著青、逆著紫)、同頻群 `isoMesh`(依化學環境上色)、`mArrow`/`b0Arrow`/`b1Arrow` 與字 `BLBL`、`isoVec()`、`computeIso()`、`drawSpins()`、`placeBubble()` | 自旋顯示 |
| `40_labels.js` | `label(key, comp, anchor, title, sub, parent)`、`labelOp()`、`labelText()`;互動時外殼剖開與組裝各自顯示的 `LBL_OPEN`、`LBL_SHUT` | 標籤文字與位置 |
| `50_film.js` | 互動設定 `S`、這一格的狀態 `W`、`sigmaOf()`;影片腳本 `FILM_DUR`、鏡頭 `CAMK`、字幕 `CAPS`、標籤時段 `LBL_WIN`、`track()`、`camAt()`、實驗室座標轉角 `LAB`/`labPhaseAt()`、影片的脈衝 `FILM_PULSE`、`film(t)` | 字幕、運鏡、時間軸 |
| `60_state.js` | 收訊 `startRun()`、`stopRun()`、`STATIC_PULSE`、`interactive(dt, now)`;探頭特寫淡出 `applyIso()`;把 `W` 套到場景的 `frameCommon(t)` | 互動流程 |
| `70_ui.js` | 說明文字 `noteHTML()`、讀值與字幕 `updateDOM()`;譜圖螢幕 `drawPlot()`、`drawFidPlot()`、`drawSpecPlot()`、放大 `specRange()`、結構式 `drawStructure()`、放大後的標註 `SAMPLES.*.notes`;控制項;導覽 `tour`、`startTour()`、`endTour()` | 圖表樣式、標註、控制項 |
| `75_nav.js` | 以共用的 `../assets/camera-nav.js` 建立視角操作 `nav`;觀察點範圍 `NAV_BOX` | 觀察點範圍(速度與觸控板判斷在共用檔) |
| `80_loop.js` | `render()`、`resize()`、錄影用的 `window.__seek`、主迴圈、除錯用的 `window.NMR` | |

分頁列樣式是 `.sitenav`,和其他教材相同。

## 座標、尺度與模型

- 場景單位為 1 cm。地板 y = 0,磁鐵中心軸在 x = 0、z = 0,y 軸朝上。磁場中心(線圈中心、樣品溶液中心)在 `MAG.yc` = 110。
- 磁鐵外形依 Ascend 500 使用手冊的外觀尺寸(見 `INSTRUMENTS.md`);杜瓦瓶內部各層的半徑與高度、線圈分段、探頭、主控台與前置放大器的外形都是示意。
- 旋轉體一律繞 y 軸(`LatheGeometry`),方位角 0 朝 +z。剖面切口固定在 `CUT_CENTER` 方向,各層切開的角度不同(`MAG.cuts`,外層開得多)。
- 組裝時用一片同外形的弧形外殼(`MAGNET.full`)把切口補起來;剖開時這片外殼繞切口右邊那條邊(`MAGNET.hinge`)像門一樣往外打開,開到底才淡出,邊緣短暫發青光。
- 樣品依 `W.sampleIn` 在升降管口與探頭之間移動(`SAMPLE_TOP_DY`)。
- 放大鏡玻璃球在 `BUB.home`,用光錐連到樣品(`placeBubble()`)。球裡的向量用 three 的座標 (x, y, z) = (x′, z, −y′)。

## 狀態:S 與 W

- `S` 是互動模式的設定(樣品、脈衝角、線寬、累加次數、外殼、收訊中的流程、本次與上一次的譜、放大段數)。`W` 是這一格要畫的樣子。
- 每一格:影片與導覽由 `film(t)` 直接從時間算出 `W`;互動模式由 `interactive(dt, now)` 讓 `W` 平滑趨近 `S`。接著 `frameCommon(t)` 把 `W` 套到場景(外殼、磁力線、樣品、自旋、線圈發光、訊號路徑、標籤),最後 `updateDOM()` 更新讀值、譜圖螢幕與字幕。
- 自旋、訊號與譜都只由時間決定,沒有逐格累積的狀態,所以錄影時跳到任何一格結果都一樣。

## 收訊(互動模式)

- 「收訊」呼叫 `startRun()`:依累加次數排好每一次的弛豫、脈衝、收訊時段;前兩次照慢動作播,之後不管累加幾次都在約 2.4 秒內跑完,最後做傅立葉轉換。收完時 `S.spec` 記下樣品、累加次數、脈衝角與線寬,譜用這些值畫。
- 同一個樣品再收一次時,上一張譜變成 `S.ghost`,以琥珀色虛線留著比較。換樣品會清掉兩張譜;改脈衝角、勻場或累加次數會停止收訊。
- 沒有收訊時,放大鏡顯示「剛被目前脈衝角翻倒」的磁化向量(`STATIC_PULSE`);拖曳脈衝角時 B₁ 與發射路徑亮起。按勻場的按鈕時勻場管短暫發光。

## 視角操作

五份 3D 教材共用 `../assets/camera-nav.js`(參考 The Plane of Focus 的操作方式),本頁在 `75_nav.js` 建立,只在互動模式作用,導覽與錄影時不理會;`startTour()` 會 `nav.cancel()`,主迴圈在 `controls.update()` 之前呼叫 `nav.step(dt)`。

- 滑鼠拖曳旋轉、右鍵或 Shift + 拖曳平移,以及觸控螢幕的單指旋轉、雙指平移與捏合縮放,都是 `OrbitControls` 本身的功能。
- 共用檔在畫布上以捕獲階段先接走滾輪,不交給 `OrbitControls`:帶 Ctrl 的滾輪(觸控板捏合)縮放;觸控板雙指滑動平移;滑鼠滾輪縮放。判斷在 `wheelKind()`:像素單位且有水平分量、小於 40 px 或不是整數的算觸控板;同一串事件(間隔 220 ms 內)沿用第一下的判斷。少數把滾動行數調成 1 行的滑鼠會被當成觸控板,這時可以用 + − 縮放。
- 鍵盤:←/→ 或 A/D 在畫面上左右平移(每秒 420 px),↑/↓ 或 W/S 沿著看的方向水平前後移動(每秒約目前距離的 0.45 倍),Q/E 繞觀察點轉動(每秒 1.1 rad),+/− 縮放,Shift 加快 2.4 倍,R 平滑回到開頁時的視角。焦點在輸入元件(例如脈衝角滑桿)或已被其他處理接走的按鍵不處理;按著 Ctrl、Alt 或 Cmd 時也不處理。
- 平移與前後移動時相機和觀察點一起移,觀察點限制在 `NAV_BOX` 裡;縮放受 `controls.minDistance` 與 `maxDistance` 限制。
- 主控台的 `__cameraNav` 可以看到這一頁的相機與觀察點(除錯與自動測試用)。

## 自旋模擬

- 兩種畫法:`W.spinMode` 為 0 是個別自旋排在 54.7° 的兩個錐面上(順著磁場 40 支、逆著 32 支,比例誇大);1 是每個化學環境 18 支同頻群,從球心出發。
- `isoVec()` 用解析式算每支同頻群的方向:脈衝期間繞 x′ 轉;之後自由進動,頻率 = 化學位移 × `SPIN.K` + 磁場不均勻的散佈(依線寬,常態分布分位數 `erfinv`);橫向以 `SPIN.lwNat` 衰減、縱向以 `SPIN.T1` 回復(顯示用,比實際慢);下一次脈衝前的弛豫段把上一次的結果拉回 z 軸。
- `labPhaseAt()`:放大鏡出現後整組以實驗室座標轉動,影片在 53.4 到 55 秒之間慢慢停下(轉滿 6 圈,x′ 回到正向),之後是旋轉座標。

## 訊號路徑

- 發射 `TXP`:patch → tx → prb → 探頭內同軸線,琥珀色;接收 `RXP`:同軸線 → prb → rx,薄荷綠。發光管 `glowMaterial()` 的 `uFront` 遮住訊號還沒走到的部分,`flowChain()` 沿同一條長度座標放光點。
- 收訊時的亮度用淨橫向磁化與 FID 包絡(`W.rxEnv`)取大者:各種氫的頻率不同,淨橫向磁化會一下就變小,只用它的話路徑會太早變暗。
- 電纜曲線在轉角會往下衝到地板底下;`tube()` 的 `floor` 選項重新取樣後把高度夾在地面上,否則地上那段發光管看不到。
- `glowMaterial()` 的面向係數先夾在 0 到 1 再開方。內插後的極小負數用 `pow` 會變成 NaN,經過 bloom 擴散成整片黑畫面(踩過的坑);其他自訂著色器的 `pow`、反向 `smoothstep` 也都改成不會產生 NaN 的寫法。

## 譜圖螢幕

- FID:`fidCompute()` 用真實的取樣間隔(1/SWH)由譜線直接算 32768 點,每個畫素的上下包絡快取在 `FIDENV`,雜訊依累加次數縮小。
- 氫譜:每個畫素取區間最高點 `specValue()`(區間中點與落在區間裡的每條譜線中心);擠在一起的譜線不會因為各自取最大值再相加而畫得太高。縱軸固定用「勻場調好、90° 脈衝」時這一段的最高峰當滿刻度,勻場差或脈衝角小時峰會變矮。雜訊固定在每個資料點上(`specNoiseAt()`),放大時看到的是同一組雜訊被拉開。
- 放大:`specRange()` 在相鄰兩段之間繞一個固定點縮放,要放大的那一段一直留在畫面裡;下一段不在上一段範圍內時(乙酸乙酯從 OCH₂ 到 CH₃)直接平移。刻度間距依寬度自動選。
- 標註:整張譜的峰標記 `marks`(窄於 360 px 時省略次要的);放大後的標註 `notes` 每一段各自排好標籤位置,細線接到 `peakTop()` 找到的峰頂;結構式畫在 `structAt` 指定的空白處,窄圖不畫。
- 即時最多每秒畫 30 次;錄影時每格都畫。

## 導覽與影片的時間軸

- `FILM_DUR` = 100 秒。`CAMK` 是 [秒, 相機位置, 看的點],相鄰關鍵格用五次緩動內插,每個關鍵格速度歸零;25.4 到 30.6 秒另外混入從切口看進孔道、跟著樣品往下的鏡頭。
- 時間軸(秒):0 開場標題;5.9 剖開(6.2 到 9.8 外殼打開);13.2 杜瓦瓶各層;18.8 超導線圈與磁力線;24.9 放入樣品;30 鎖場與勻場(探頭特寫,磁鐵與升降管淡出,勻場管發光);35.2 個別自旋;46.8 射頻從主控台沿電纜送到探頭;52.6 換成旋轉座標,55.4 到 57.4 打 90° 脈衝;58.8 FID 經前置放大器送回主控台;64.2 散開與衰減;70.6 傅立葉轉換(NS 1);76.4 累加 16 次;82.8 勻場變差(線寬 5 Hz)、放大芳香區;87.6 勻場調好,90 秒再放大到 H-2 與 H-6;94.4 結尾標題;95.2 到 98.4 外殼關上。
- 影片版面(`html.film`):讀值卡在左上、譜圖螢幕在右上、字幕在下方中央。鏡頭構圖配合這個版面,譜出現時把主角擺在左下。
- 「導覽」按鈕用同一條時間軸即時播放。寬螢幕(1100 px 以上且橫向)時譜圖螢幕和影片一樣放右上角;窄螢幕譜在下方,字幕上移。按 Esc、「結束導覽」或播完,回到原本的樣品、外殼、譜與鏡頭。

## 網址參數

- `?film`:影片版面,自動循環播放;`?t=秒數` 從某一秒開始。
- `?film&rec`:錄影用。`window.__seek(t)` 畫出第 t 秒(完整畫質、DPR 1、不節流),`window.__dur` 是全長;`?film&rec&t=64` 可直接看一格。
- `?perf=1`:顯示每秒幀數與繪圖裝置(共用的畫質模組)。
- 除錯:主控台的 `window.NMR`(`scene`、`camera`、`S`、`W`、`film`、`frameCommon`、`render`、`tour`、`startTour` 等)。

## 錄影

頁面本身沒有錄影按鈕。影片用作者電腦上的 `record.mjs`(和 UV-Vis 的錄影程式同一套做法):啟動本機伺服器提供網站根目錄,用無頭 Chrome 或 Edge 開 `nmr/index.html?film=1&rec=1`,逐格呼叫 `__seek` 並截圖,交給 ffmpeg(Python 套件 imageio-ffmpeg 內附)編成 1920×1080、30 fps 的 H.264 MP4;每 200 格重開一次瀏覽器。錄好的影片不要提交進網站。

## 修改後的檢查

- 在網站根目錄執行 `node scripts/check-site.mjs` 與 `node scripts/check-render-quality.mjs`(後者包含本頁的 module 語法檢查)。
- 用 HTTP 預覽打開 `nmr/`,確認畫面有動、console 沒有錯誤、分頁列能回到入口與其他教材,並在 390px、768px 與桌面寬度各看一次。
- 改了影片腳本時,用 `?film&rec&t=秒數` 抽幾格,確認字幕、鏡頭、標籤與譜圖螢幕對得上;鏡頭在兩個關鍵格之間是直線移動,也要看移動途中有沒有穿過物體。
- 改了科學計算時,對照 `docs/VALIDATION.md` 的數值案例。

## 設計取捨(可確認的部分)

- 不是依某一台實際儀器建模;示例配置(AVANCE III 500 主控台、Ascend 500 磁鐵、5 mm BBO 探頭)見 `INSTRUMENTS.md`。型號只放在右下角的一行小字、說明視窗與片尾小字,標題與字幕不強調型號(和其他教材一致)。
- 香草醛:木質素相關、氫的種類少,在 500 MHz 下 H-2 與 H-6 只差約 5 Hz,看得到強偶合的屋頂效應與 1.8 Hz 的間位偶合,所以芳香區用三自旋的哈密頓量精確計算。乙酸乙酯:乙基的四重峰與三重峰是一階偶合的典型例子,用五個自旋精確計算。
- 放大鏡裡的轉速、順逆比例、弛豫與雜訊都經過調整,方便觀察;FID 與譜線位置則用真實的頻率、取樣間隔與線寬計算。訊號沿電纜走的速度是放慢的示意。
- 探頭特寫時把磁鐵剖面與升降管淡出(`ISO_GROUPS`),勻場管留著,標籤才指得到。
- 鏡頭轉去看電纜時把放大鏡收起來,否則連到樣品的光錐會在畫面邊緣變成一大片青光。
