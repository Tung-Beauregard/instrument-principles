# 離子阱質譜原理(動畫講解):維護說明

`lcq/index.html` 是單一 HTML 檔,用 three.js 0.183.2(jsDelivr ES module,經 importmap 載入)繪圖,不需要建置。內容是一段 16 章、394 秒的自動播放解說(附字幕,可拖時間軸、暫停後自己轉視角),另有「自己操作」的離子阱操作台、字幕文字稿、章節連結與頁內錄影。

「離子阱質譜」這份教材有兩個畫面(2026-10-13 合併):本目錄是「動畫講解」,`../lcq-3d/` 是「拆開探索」(維護說明見 `../lcq-3d/MAINTENANCE.md`)。兩頁的程式各自獨立,不共用模型或模擬。入口只有一張卡片(`content/instruments.json` 的 `lcq`);拆開探索不在清單裡,由兩頁分頁列的「離子阱質譜」一組互相連結,`scripts/check-site.mjs` 的 `extraPages` 一樣檢查它的連結。

**正本:** 儲存庫裡的 `lcq/index.html` 是正本,直接修改這個檔。它最初由六個原始碼片段(core、models、sim、overlay、story、app)和頁面外殼串接而成,片段只在作者電腦的暫存資料夾裡,沒有進儲存庫;之後的修改都直接改在 `index.html`,片段已經過時,不要再用它重新產生。串接時留下的分區標記還在,在檔案裡搜尋 `// ---- ` 可以跳到各區。

## 分區與主要名稱

`<head>` 最前面有一小段 script 先讀 `localStorage` 的 `lcq-theme`,設定 `<html data-theme>`,避免淺色模式先閃深色;之後是 meta description 與分享預覽的 og 標籤(圖在 `../assets/og/lcq.jpg`,見 README「分享預覽圖」)。CSS 的顏色都是 `:root` 的變數,深淺兩組;分頁列是 `#sitenav`(其他教材是 `.sitenav`),「離子阱質譜」一組的樣式是 `.sn-lesson` 與 `.sn-name`。分頁列和畫質選單的容器 `#qhost` 一起包在固定於左上角的 `#topnav` 裡(縱向排列、靠右對齊,選單在分頁列右端下方);`#topnav` 本身 `pointer-events:none`,只有子元素接收滑鼠,分頁列下方的空白處仍然可以拖曳畫面。module 開頭先載入共用的 `../assets/render-quality.js` 與 `../assets/camera-nav.js`,`quality` 的選單掛在 `#qhost`。

注意 class 撞名:`.seg` 是播放列的分段進度條(高 6 px、`overflow:hidden`),操作台的成對按鈕用 `.pair`,新增樣式時不要再用 `.seg`。

| 分區 | 內容 | 常改的地方 |
|---|---|---|
| `core.js` | 小工具(`clamp`、`lerp`、`smooth`、`ease`、`sstep`、時間窗 `win`、可重現亂數 `makeRng`、`gauss`、`V3`);物理常數 `PHYS`、`qOf()`、`vEjectOf()`、`betaExact()`、查表 `BETA_LUT` 與 `betaOf()`、`BETA_EJECT`;樣品 `SAMPLES`(`cal` 校正液、`np` 天然物、`rutin` 蘆丁標準品)與負離子的 `SAMPLES_NEG`;碎片表 `PRODUCTS`、`productsOf()`、`pickProduct()`;二價的例子 `BRADYKININ`;同位素 `ISO`、`isotopePattern()`、`isotopeSpecies()`;依 m/z 上色的 `MZ_STOPS`、`colorForMz()`、`cssForMz()`;主題 `PALETTE`、`computeDark()`;算圖器、相機、環境光、天空與地板、四盞燈;後製 `composer`(RenderPass、GTAOPass、UnrealBloomPass、OutputPass、`finish` 暗角與顆粒);`view`、`setRenderSize()`、`applyViewOffset()`、`applyTheme()`;粒子 `PointCloud`、`LineCloud` | 物理數值、樣品、碎片、顏色、燈光與 bloom |
| `models.js` | 材質 `MAT` 與 `initMaterials()`(`rodA`、`rodB`、`ring`、`capIn`、`capOut` 用自發光表示電壓;`ghostA`、`ghostB` 是半透明的前排桿子);剖半旋轉體 `latheSolid()` 與 `ring2`、`cyl2`、`axisX`、`mesh`、`tube`、`canvasTex`、`plateX`;機殼 `CAB` 與 `buildCabinet()`、`setCabinetFade()`;離子路徑組件 `IP` 與 `buildAssembly()` | 零件尺寸與位置、材質、標籤錨點 |
| `sim.js` | 顏色 `COL`(`posIon` 是負離子模式下轉換電極撞出的正離子);目前的樣品 `sampleState`、`setSample(key, pol)`、`pickSpecies()`;電灑 `EsiSim`;傳輸 `TRANSPORT_SPEED` 與 `TransportSim`;背景氣體 `GasSim`;離子阱 `TRAP`、`OMEGA_V`、`TrapSim`;馬鞍面 `SaddleSim`;質譜累加 `Spectrum` | 粒子數量、速度、阱內運動參數 |
| `overlay.js` | 疊圖畫布 `OV`(含 `navRight`、`navBottom`,面板避開分頁列用)、`OV_COL`、`ovResize()`、`ovTheme()`;字型 `FONT_SANS`、`FONT_MONO`;字幕標記 `parseRich()`、斷行 `layoutRich()`(`NO_START` 避頭字元)、`drawRichLines()`;3D 標籤 `projectPx()`、`drawLabel()`;儀表面板 `panelBox()`、`drawRF()`、`drawQ()`、`drawScope()`、`drawSpectrum()`、`drawWell()`、`drawSteps()`;整格疊圖 `OVS`、`drawOverlay()`、片頭片尾 `drawEndCard()`、重點整理 `drawRecap()`、`fitText()`、`drawWrapped()` | 面板文字與版面、片頭片尾 |
| `story.js` | 放大模型的擺放 `DIO`、機殼內的擺放 `CABPOSE`、座標換算 `D()`;鏡頭關鍵格 `K()`、`KP()`、`HUDX`;每格狀態 `F` 與 `resetF()`;`labels()`、`caption()`;掃描游標 `warpScan()`、`scanKeys()`、`windowKeys()`、`M_START`;重點整理 `RECAP_LINES`;三個看質譜的章節共用的 `readSpecUpdate()`;章節 `CHAPTERS`、`TOTAL`、`chapterAt()`、`storyCamera()` | 字幕、標籤、運鏡、章節長度 |
| `app.js` | 建立場景物件與 `ST`;`OrbitControls`;播放狀態 `APP`;`simStep()`、`storyUpdate()`、`storyStep()`、`seek()`;把狀態套到場景的 `applyFrame()`;`adjFov()`、`updateCamera()`、`renderFrame()`、主迴圈 `loop()`;播放列(`updateBar()`、`railTime()`、`jumpChapter()`、`setPlaying()`、`showHint()`);視角操作 `camFree()`、`nav`;鍵盤、主題、說明視窗;章節連結與文字稿 `linkTarget()`、`syncHash()`、`goChapter()`、`buildTranscript()`、`updateLiveCaption()`;操作台 `LAB`、`labFill()`、`labControls()`、`labMsUpdate()`、`labStartMsms()`、`labSeqStep()`、`labStartZoom()`、`labZoomResult()`、`enterLab()`、`exitLab()`、`labStep()`;`resize()`;錄影 `record()` 與支援檢查 `canRecord()`;到站人數 `loadVisits()`;`boot()`;除錯用的 `shot()`、`run()`、`window.lcq` | 互動流程、錄影、計數 |

## 座標、尺度與模型

- 世界座標的單位是公尺。地板 y = 0,機殼放在原點,正面朝 +z。機殼 `CAB` 寬 79、高 56、深 76 cm(LCQ Deca XP Plus 規格表);門、LED、注射幫浦與內部的電腦、電路板、風扇是示意。
- 離子路徑組件 `asm.group` 用毫米建模:離子沿 +x 前進,+y 朝上,剖面朝 +z(朝著看的人)。旋轉體都用 `latheSolid()` 只留 z ≤ 0 的後半,切面用 `MAT.steelCut` 這類材質封口;`axisX()` 把旋轉軸從 y 轉到 x。
- 沿離子軸的位置在 `IP`(毫米):噴針 (−12, 10, 0),毛細管 −3.2 到 107(軸心比主軸高 `IP.capY` = 1.5 mm,107 到 119.5 之間降回主軸),管狀透鏡 108 到 116,截取錐尖 119.5,四極桿 136 到 187,第二道隔板 190 到 194(桿間透鏡 191.4 到 192.6),八極桿 196 到 247,離子阱中心 `IP.trapX` = 266,轉換電極與電子倍增器在 x = 298,渦輪幫浦在 x = 252 的下方。真空腔 `IP.mf` 只做後半。
- 離子阱:環形電極內面依 r² = r₀² + 2z²、端帽內面依 z² = z₀² + r²/2 生成(r₀ = 7.07、z₀ = 7.85 mm,取自 `PHYS`),中心孔半徑 0.75 mm。石英間隔環、出入口透鏡、氦氣管與陶瓷支柱的尺寸是示意。
- 組件有兩種擺法,由 `applyFrame()` 依 `F.pose` 內插:`CABPOSE` 是放在機殼裡(1 mm = 0.001 m,繞 y 轉 90°),`DIO` 是浮在機殼左上方的放大模型(位置 (−0.42, 0.66, 0),1 mm = 0.003 m,也就是放大 3 倍),搬移途中往上拱 0.22 m。故事裡用 `D(x, y, z)` 把組件的毫米座標換成放大模型的世界座標,鏡頭關鍵格都用它定位。
- 拆機由 `F.cover`(上蓋抬起)、`F.door`(左門打開)、`F.cab`(機殼淡出,`setCabinetFade()` 會替機殼換上自己的材質複本再調透明度)、`F.cabSlide`(機殼往後 1.5 m、往下 0.08 m)控制。離子阱章節的 `F.explode` 把端帽、石英環與透鏡沿 x 拉開,同時讓桿子變透明。
- 電壓用自發光表示:`F.rfGuide` 讓四極桿與八極桿的兩組桿子交替發青光,`F.ring` 讓環形電極發藍光(掃描時隨電壓變亮),`F.acGlow` 讓兩片端帽以 β(0.83) 對應的頻率輪流發琥珀色光,`F.heater` 讓加熱匣發橘光。
- 示意與放大:毛細管長度、桿子粗細、孔徑、偵測器形狀與位置;截取錐錯開約 1.5 mm 是從零件標示推定的;離子源畫成探針從上方噴入(XP Plus 的正交離子源是從側面水平噴入,XP MAX 的 Ion Max 約 60 度)。液滴、離子雲與振盪幅度都放大,時間放慢;實機約快 10⁴ 到 10⁵ 倍,模擬保留 q、β 與射出順序這些比例。
- 燈光、霧、bloom、暗角與顆粒每個主題一組(`PALETTE.dark`、`PALETTE.light`),`applyTheme()` 套用,也通知粒子換混合方式。粒子大小 `uScale` 在 `renderFrame()` 依投影矩陣與組件縮放每格更新,放大模型與機殼內看起來一樣大。

## 物理與數值

- `PHYS`:r₀ 7.07 mm、z₀ 7.85 mm(March 1999,Encyclopedia of Spectroscopy and Spectrometry 的〈Ion Trap Mass Spectrometers〉,原文寫 LCQ 與 GCQ 的離子阱 r0 = 0.707 cm、z0 = 0.785 cm),射頻 760 kHz、振幅 0 到 8500 V 零到峰值(LCQ Series Hardware Manual),共振射出點 q = 0.83(Wong & Cooks 1997),a = 0 的穩定邊界 q = 0.908,掃描速率每秒 5500 m/z 單位。
- q_z = 8eV / (m (r₀² + 2z₀²) Ω²),整理成 `qOf(V, mz) = V / (kV · mz)`,`kV` = 5.1175 V。**`kV` 是寫死的常數**,不會隨 r₀、z₀、射頻頻率自動重算;改這三個值時要自己重算 kV(用上面的數值與 1 Th = 1.66054×10⁻²⁷ kg / e,得 q = 0.19541 × V / (m/z))。q 只看 m/z,所以二價離子、負離子都用同一條式子。
- `vEjectOf(mz) = 0.83 × kV × mz`,每 m/z 約 4.2475 V:m/z 195.09 約 829 V、524.26 約 2227 V、1222 約 5190 V(字幕寫 830、2230、5190);8500 V 能射出的最大 m/z 約 2001,若等到 0.908 才排出只到約 1829。
- β:`betaExact(q)` 以 a = 0 的連分數迭代(展開到 k = 10),`betaOf()` 用 0 到 0.908 之間 2048 格的查表內插,q ≥ 0.908 回傳 1。β(0.83) ≈ 0.736,對應的軸向振盪頻率 β × 760 / 2 ≈ 280 kHz,也就是端帽交流電壓的頻率(計算值,手冊沒有直接寫,字幕與標籤都註明)。MS/MS 活化時 β(0.25) ≈ 0.179,約 68 kHz。
- 低質量截止:留得住的最小 m/z = V / (kV × 0.908)。操作台讀值直接顯示這個值;500 V 時約 108,MS/MS 把 611 放到 q = 0.25 的 782 V 時約 168。
- 「平均下來的碗」`drawWell()`:深度 D = q × V / 8(a = 0 的擬位能近似),在「為什麼困得住」一章固定用 V = 400 V,三種離子約 20、7.5、3.2 V。
- 偵測與掃描的字幕數字:轉換二次發射電極 −15 kV(負離子模式 +15 kV)、倍增器增益約 3×10⁵、m/z 150 掃到 2000 約 0.34 秒(1850 / 5500)。
- 峰寬:事件的 m/z 加上標準差 `trap.res` 的常態雜訊。一般掃描 0.19(半高寬約 0.45,比照 LCQ Fleet 規格表每秒 5,000 的「Enhanced」;LCQ Deca XP 的每秒 5,500 與它相近),放大掃描 0.13(半高寬約 0.3,比照同一張表的 Zoom)。

### 樣品、加成離子與碎片

所有 m/z 都是單一同位素(monoisotopic)值,存到小數兩位;`f` 是離子的化學式,給同位素計算用。修改時用化學式重算 m/z 核對(H⁺ 1.007276、Na⁺ 22.989218、K⁺ 38.963158、HCOO⁻ 44.998201,依 Fiehn 實驗室的 ESI 加成離子表),2026-10-20 全部核對過。

- `SAMPLES.cal`:咖啡因 195.09、MRFA 524.26、Ultramark 取 1222.0 一根(沒有化學式,不能放大掃描)。
- `SAMPLES.np`:檜木醇 165.09、兒茶素 291.09、槲皮素 303.05、扁柏脂素 355.12、蘆丁 611.16,都是 [M+H]⁺。
- `SAMPLES.rutin`(蘆丁標準品,M = 610.1534):[M+H]⁺ 611.16、[M+Na]⁺ 633.14、[M+K]⁺ 649.12、團簇 [2M+H]⁺ 1221.31、[2M+Na]⁺ 1243.30。
- `SAMPLES_NEG`:`np` 的 [M−H]⁻(163.08、289.07、301.04、353.10、609.15;扁柏脂素沒有酸性的 OH,豐度只給 0.04),`rutin` 的 [M−H]⁻ 609.15、[M+HCOO]⁻ 655.15、[2M−H]⁻ 1219.30。校正液沒有負離子清單,操作台的「負離子」在校正液時停用。
- 豐度 `ab` 都是示意。蘆丁標準品的小峰(K⁺、團簇)比例刻意給大一點,裝填 28 顆的章節裡才每根都看得到。
- `PRODUCTS`(依前驅 m/z 的 `toFixed(2)` 查):咖啡因 195.09 → 138.07(少 57);蘆丁 611.16 → 465.10(少鼠李糖 146,55%)與 303.05(少芸香糖 308,45%);MS³ 465.10 → 303.05(少葡萄糖 162);蘆丁 [M−H]⁻ 609.15 → 300.03 與 301.04 各半(兩者都見於已發表的 LC-MS/MS 資料,高低依儀器與碰撞能量而定)。`label` 是掉了多少,畫在碎片峰上。這些是黃酮苷常見的裂解方式,不是這台儀器的實測。
- `BRADYKININ`:緩激肽 [M+2H]²⁺ 530.79(M = 1059.5614,ChEBI),放大掃描時示範間距 0.5。
- 同位素:`isotopePattern(f)` 依 `ISO`(IUPAC 的代表性同位素豐度:¹³C 1.07%、²H 0.0115%、¹⁵N 0.364%、¹⁷O 0.038%、¹⁸O 0.205%、硫與鉀)逐原子卷積,回傳各同位素峰相對最高峰的高度與質量差;`isotopeSpecies(ion, z)` 把一種離子拆成每個同位素峰一種「離子」,位置是 m/z + 質量差 / z。蘆丁 [M+H]⁺ 的 M+1 約 0.30、M+2 約 0.08;緩激肽 [M+2H]²⁺ 的 M+1 約 0.61、M+2 約 0.21。

### 離子阱的運動(`TrapSim`)

畫面時間比實機慢太多,直接積分 760 kHz 的運動在動畫裡看不出東西,所以用「包絡模型」:每顆離子記軸向振幅 `A` 與相位 `th`,相位以 β(q) × `OMEGA_V` / 2 前進(`OMEGA_V` 是畫面上的射頻頻率 `TRAP.fV` = 7 Hz),徑向兩個分量用 β(q/2)。微運動用 cos Φ 調變位置:軸向乘上 (1 − 0.5 q cos Φ),徑向乘上 (1 + 0.25 q cos Φ)。

- 氦氣冷卻:`A` 以每秒 `TRAP.gammaHe` = 0.9 的速率回到熱運動振幅 `Ath`(1.2 到 1.9 mm,畫面放大過)。
- 共振射出:`trap.ac` > 0 時,`A` 每秒增加 `TRAP.gain` × ac / (1 + (d / `trap.wRes`)²),d = (β − β(0.83)) / β(0.83)。一般 `wRes` = `TRAP.wRes` = 0.035;放大掃描改成 0.004,相差 1 或 0.5 的同位素才會一根一根輪流出去。|z| 超過 `TRAP.zEject` = 7.6 mm 就從端帽小孔出去。
- q ≥ 0.908:振幅一直變大,很快從端帽出去(邊界射出)。
- 從哪一側出去:每顆離子建立時就決定 `side`(取 `Ath` 這個已經抽過的亂數的末位,各半,亂數序列不變)。|z| 超過 7.6 mm 而且在自己那一側才出去;在另一側時位置停在端帽內緣,半個振盪週期後從自己那側出去。**不要改回看 z 的正負號**:同一種 m/z 的離子相位會和射頻的節拍同步,以前同一種離子常常全部往同一側出去(2026-10-20 實測 [2M+Na]⁺ 9 顆全部往入口),那一根峰就整個不見。例外是被隔離波形推出去的離子(`o.kick`):從先碰到的那一側出去,不等自己那側。重的離子振盪很慢(500 V 時 m/z 1221 一個來回約 5 秒),只准從自己那側出去的話,2.4 秒的隔離結束時還有一部分留在阱裡,碎片質譜就多出團簇的峰(2026-10-20 在操作台用蘆丁標準品做 MS² 時發現)。
- 往出口端帽(+x)出去的離子沿二次貝茲曲線飛 0.3 秒到轉換電極,產生二次粒子(負離子模式時用 `secCol` 畫成橙色的正離子)與倍增器裡的發光(`pulses`),並記一個事件 `{ mz, V, sp, col, label, key }`;往入口端帽出去的往回飛、淡出,不計數,所以大約一半被偵測到。
- 事件的 m/z:平常是離子本身的 m/z 加上 `trap.res` 的常態雜訊。操作台關掉端帽交流電壓時(`trap.labMap` 為 true 且射出時 q > 0.89),改用儀器的換算 V / (kV × 0.83),離子實際在 0.908 才出去,所以算出來偏大約 9%(0.908 / 0.83),雜訊也加寬到 0.4%。
- 空間電荷:`trap.sc` 是裝填超過目標值的倍數減 1(操作台關掉自動增益控制、濃度提高時才大於 0)。事件的 m/z 多加 0.0004 × m/z × sc(往大的 m/z 偏),雜訊乘上 (1 + 0.5 sc),離子雲也放大 (1 + 0.15 sc) 倍。只畫方向,數值是示意;8 倍裝填時 611 約偏 +1.7、半高寬約 2。
- CID:`trap.excite = { mz, q: 0.25, amp }` 以寬 0.05 的共振推指定 m/z 的離子,同時累加 `heat`;超過各自的門檻就換成 `o.cid.products` 裡的碎片(`pickProduct()` 依比例先抽好,一顆前驅離子一個碎片)。MS/MS 一章的門檻是 1.6 到 5.0、611 以外的離子在 2.4 到 6.6 秒之間各自被推出去;操作台的門檻是 1.0 到 3.0。
- `tracer` 為每種樣品記最近 4.2 秒的軸向位置,給示波器面板 `drawScope()` 畫線。

### 其他模擬

- `EsiSim`:液滴每秒 24 顆從噴針尖端出來,邊飛邊縮;電荷密度 q / r² 超過 17 就分裂(最多 3 次),每次噴出 3 到 5 顆子液滴,子液滴 0.35 到 0.75 秒後有一半機率放出一個離子,交給 `TransportSim.addFree()`。另有鞘氣的流線。液滴最多 300 顆,`InstancedMesh` 畫 320 個。
- `TransportSim`:放出的離子被拉向毛細管入口(`IP.coneTip`),到了就排上路徑(x = −5);路徑上每段的速度在 `TRANSPORT_SPEED(x)`(毫米 / 秒),在桿子裡加上射頻造成的晃動。`ctl.feed` 可以不經電灑直接在某個 x 放入離子(離子阱章節從 x = 222 放)。閘門關閉(`gateOpen` 為 false)時,到 x = 189.5 的離子被擋下、淡出;到 x = 252 的離子交給 `trap.addIon()`,只有 `F.trapAccept` 為 true 時才收。中性分子從毛細管出口直直往前,撞上錯開的截取錐就彈開。
- `GasSim`:各區的點數 330、46、7、2 只表示「越往裡越空」,不是實際比例(實際差了將近一億倍);離子阱裡另有 26 個氦原子。
- `SaddleSim`:放在離子阱上方 150 mm 處的 72 × 72 mm 曲面。高度 h = k · S · (w² − 2u²),S = cos(相位) 讓馬鞍翻轉;`uMix` 從馬鞍漸變成碗 h = kₑ(4u² + w²) − 9,軸向比徑向陡 4 倍,對應 β_z ≈ 2β_r。球的受力是同一個位能的梯度加輕微阻尼,每格分 8 步積分;跑出邊界 0.7 秒後重放。章節裡先不轉(6.4 秒前)、再轉太慢(每秒 0.42 圈)、最後每秒 1.6 圈。
- `Spectrum.add(mz, w, col, label, key)`:同一種離子(`key` 是它真正的 m/z)的事件一定算在同一根峰;沒有 `key` 時,相差小於 max(0.6, 0.008 × m/z) 的事件併成一根。以 Welford 法累計平均 m/z 與變異數,畫在平均位置、峰寬用標準差,所以相距 0.5、半高寬 0.3 的同位素峰會部分重疊(和實機一樣)。以前只用距離合併,放大掃描時相鄰同位素會互搶事件、拆成好幾根小峰。

### 掃描怎麼放慢

實機每秒掃 5500 個 m/z 單位,照這個速度畫面上一閃就過。`scanKeys(t0, 清單, m0, mEnd, tail, fast, slow)` 為每一種離子排兩段:先用 `fast` 秒快轉到 0.93 m(緩動),再用 `slow` 秒等速走過 0.93 m 到 1.025 m,最後用 `tail` 秒走到 `mEnd`。種類彼此相近時(611、633、649,或同位素)改用 `windowKeys(t0, m0, [[lo, hi, 秒], …])`:快轉到每個範圍的起點,再等速走過整個範圍。`warpScan(t, keys)` 算出當下的射出點 m*,電壓 V = m* × kV × 0.83;`M_START` 是 500 V 時的射出點(約 117.7)。面板標著「動畫在兩種離子之間快轉」;排出順序與每種離子對應的電壓仍然正確。

## 章節時間軸

| 章 | `key` | 標題 | 長度 | 開始 | 畫面在做什麼 |
|---|---|---|---|---|---|
| 0 | `intro` | 開場 | 7 s | 0:00 | 片頭字卡(`OVS.title`),整台儀器 |
| 1 | `outside` | 質譜儀在做什麼 | 11 s | 0:07 | 靠近離子源 |
| 2 | `open` | 拆開來看 | 16 s | 0:18 | 上蓋、左門打開,組件從機殼移到放大模型,四段氣壓標籤 |
| 3 | `esi` | 電灑游離 | 30 s | 0:34 | 泰勒錐、液滴分裂、離子被吸進毛細管 |
| 4 | `vacuum` | 進入真空 | 18 s | 1:04 | 毛細管與加熱塊,管狀透鏡與截取錐分開離子與中性分子 |
| 5 | `guides` | 離子導引 | 17 s | 1:22 | 四極桿與八極桿,閘門在 11 到 15.8 秒關閉 |
| 6 | `trap` | 離子阱 | 25 s | 1:39 | 離子阱拆開、氦氣、離子進阱冷卻,10 mm 比例尺 |
| 7 | `saddle` | 為什麼困得住 | 32 s | 2:04 | 翻轉的馬鞍,最後變成碗與「碗深」面板 |
| 8 | `rhythm` | 每種質荷比都有自己的節奏 | 24 s | 2:36 | 電壓、q 值與示波器面板 |
| 9 | `scan` | 掃描排出 | 42 s | 3:00 | 端帽交流電壓、升電壓、依序排出,質譜長出來 |
| 10 | `detect` | 偵測與質譜 | 26 s | 3:42 | 轉換電極與倍增器,「實際速度」橫幅 |
| 11 | `adducts` | 加成離子與團簇離子 | 34 s | 4:08 | 蘆丁標準品:611、633、649 與團簇 1221、1243,峰上標離子 |
| 12 | `isotopes` | 同位素峰與電荷數 | 31 s | 4:42 | 放大掃描:前半蘆丁 611 的同位素(間距 1),15 秒起緩激肽 2+(間距 0.5) |
| 13 | `negative` | 負離子模式 | 30 s | 5:13 | 蘆丁 [M−H]⁻ 609、甲酸根加成 655、團簇 1219;轉換電極 +15 kV |
| 14 | `msms` | 串聯質譜 MS/MS | 34 s | 5:43 | 蘆丁 611:隔離、活化碎裂、掃出碎片,四步驟面板,碎片峰標掉了多少 |
| 15 | `recap` | 重點整理 | 17 s | 6:17 | 四點整理,13.4 秒起片尾字卡 |

總長 `TOTAL` = 394 秒,由各章 `dur` 加總,播放列的分段寬度也照 `dur` 分配。新的三章(11 到 13)共用 `readSpecUpdate(ST, t, 開始掃描的秒數, specView)`:端帽交流電壓在 1 到 2.5 秒間打開,依 `ST.scan` 升電壓,右側只放電壓與質譜兩個面板。加成離子與負離子兩章的亂數種子都是 46,是比較幾個種子後,每根峰都出現、峰高比例最接近設定豐度的一個;改了裝填數、豐度或掃描時間,要重跑一次確認每根峰仍然看得到。同位素一章前後半用 39 與 40。MS/MS 一章用 60(2026-10-20 從 36 改過來:隔離改成兩側都能出去之後亂數序列變了,36 只剩 1 顆 465 被偵測到;60 在跳轉進來、從前一章連續播進來兩種情況都是 303 四顆、465 五顆)。

每一章是一個物件:

- `cam`:鏡頭關鍵格。`K(t, 看的點, 位移, { fov, sx, sy })` 由看的點加位移得到相機位置,`KP(t, 相機位置, 看的點, …)` 直接給位置。`t` 是章內時間。`sx`、`sy` 是畫面偏移(`camera.setViewOffset`),右側有面板的章節用 `HUDX` = 0.17 把主角往左推。第一章另有 `start`。
- `storyCamera(i, t)` 以上一章最後一格當這一章 t = 0 的起點,依序用 `ease` 內插,所以章節之間的鏡頭是連續的。
- `cues`:`[章內秒數, 字幕]`。字幕可用 `**詞**`(強調色)與 `{524|文字}`(m/z 524 的顏色)。`caption()` 淡入 0.45 秒、淡出 0.35 秒,上方小字是「章號 標題」。沒有字幕的章節(開場、重點整理)用 `transcript` 提供文字稿的內容。
- `update(ST, t, dt)`:每格先 `resetF()` 把 `F` 與 `OVS` 清成預設,再由章節寫入這一格要的狀態(粒子開關、電壓、面板、標籤)。標籤用 `labels(ST, t, [[錨點, 標題, 小字, 出現, 消失, dx, dy], …])`,錨點以 `cab:` 或 `asm:` 開頭,對應 `buildCabinet()` 與 `buildAssembly()` 回傳的 `anchors`。
- `enter(ST, cont)`(選用):進入這一章時重設模擬。連續播放進來時 `cont` 為 true,`saddle` 與 `scan` 會沿用上一章阱裡的離子;拖時間軸跳進來時為 false,一律重新裝填。`isotopes` 在章內 15 秒換樣品(`ST._zoomB` 旗標在 `enter` 歸零),跳轉時一樣會從章節開頭重算到那裡。
- `prewarm`(選用):拖時間軸跳進這一章時,先空跑幾秒讓粒子流已經在跑(`esi` 0、`vacuum` 4、`guides` 7 秒)。

右側面板由 `OVS.hud` 的開關組合:`rf`(電壓)、`q`(q 值軸)、`well`(碗深)、`steps`(MS/MS 步驟)、`scope`(示波器)、`spec`(質譜,`specView` 設範圍 `lo`、`hi`、刻度 `step`、小數位數 `dp`、上方的電壓軸 `vAxis`、峰上標離子的 `ionLabels` 與游標 `cursor`);`hide(s)` 讓已經排出的離子不再出現在面板上(看 `ST.counts`)。峰的標示會自動往上錯開,避免相近的峰互相蓋住。橫式畫面面板寬 470 × `OV.U`,直式畫面改成滿寬並縮小到 0.8 倍;面板那一欄會碰到 `#topnav` 時(直式,或較窄的橫式視窗),從 `OV.navBottom` 開始畫,不再壓在分頁列與畫質選單底下。

## 播放、暫停與手動操作

- `APP`:`mode`(`story` 或 `lab`)、`playing`、`t`(故事時間)、`chapter`、`userCam`(使用者動過鏡頭)、`blend` 與 `blendFrom`(從使用者的鏡頭接回動畫鏡頭)、`simT`(模擬時鐘,也用在鏡頭微晃與顆粒)、`rec`(錄影中)。
- 主迴圈 `loop(now)`:錄影中或分頁在背景時不做事;`quality.shouldRender(now)` 把即時播放限制在 60 FPS;dt 最多 0.05 秒。操作台模式跑 `labStep(dt)`,播放中跑 `storyStep(dt)`,接著 `applyFrame(APP.simT)`、`updateCamera(dt)`、`renderFrame()`、`updateBar()`、`updateLiveCaption()`。
- `storyStep(dt)` 推進時間,跨章時呼叫 `enter(ST, true)`,再 `storyUpdate()`(`resetF()`、`ch.update()`、字幕)與 `simStep(dt)`。`simStep()` 讓所有模擬前進一步,`F.acquire` 為 true 時才把阱的事件加進質譜,最後重算 `ST.counts`(每種 m/z 還剩幾顆)。播到結尾自動暫停。
- `seek(t)`:各模擬用固定種子重設(章號加 11、12、13、14),呼叫 `enter(ST, false)` 與 `prewarm`,再從章節開頭以 1/30 秒一步重算到 t。同一個時間點拖過去的畫面一定相同;連續播放到同一點可能略有不同(見上面 `enter` 的 `cont`)。章節越長、跳得越後面重算越久,最長的 `scan` 一章約 1260 步。
- 播放列:拖曳或點擊時間軸跳到該點(操作台會先關掉),滑過顯示章名與時間;時間軸取得焦點時 ← → 切換章節。`jumpChapter(-1)` 在章節開頭 2 秒內回上一章,否則回到本章開頭。
- 鍵盤(焦點在輸入元件或說明視窗時不處理):空白鍵播放或暫停(操作台中按會先離開操作台),播放中 ← → 切換章節,F 全螢幕。暫停時 `showHint()` 顯示提示「暫停中:拖曳或用方向鍵改變視角,按空白鍵繼續」3.2 秒。提示 `#hint` 在畫質選單下方(桌機 top 112 px、680 px 以下 102 px);它的 z-index 是 9,比 `#topnav` 的 11 低,放在 16 px 時會被分頁列整個蓋住(2026-10-13 以前就是這樣)。
- 暫停後拖曳鏡頭會把 `APP.userCam` 設為 true,`updateCamera()` 改走使用者鏡頭分支;再播放時 `setPlaying(true)` 記下目前鏡頭,1.2 秒內接回動畫鏡頭。
- 窄螢幕:`adjFov()` 在寬高比小於 1.6 時加大視角(上限 78°),保留 16:9 畫面的左右範圍;寬高比小於 1.15 時(`mobile()`)不做左右偏移,改成上下偏移,面板也改成滿寬。
- 開頁:`boot()` 套主題、`resize()`,把程式裡所有非拉丁字元(中文、上下標的 ⁺⁻²、減號 −)收集起來預載 Noto Sans TC(400、500、700)與 IBM Plex Mono(400、500、600),最多等 7 秒;接著 `buildTranscript()`,讀網址決定起點(見下一節),再開始播放。網址有 `?paused` 或系統設定減少動態效果(`prefers-reduced-motion: reduce`)時停住不自動播放。畫布上畫的上下標字元若不在預載範圍內,畫布不會自己去下載那個字型子集,會一直用備用字型。

### 章節連結、文字稿與讀屏字幕

- `linkTarget()`:網址的 `#key`(章節的 `key`,例如 `#scan`)優先,其次 `?t=秒` 或 `?t=分:秒`,`#lab` 開操作台。`boot()` 在第一次 `seek` 之前就讀,才不會被改寫。
- `syncHash()`:在 `updateBar()` 裡呼叫,網址的 hash 跟著目前章節(開場不帶 hash,操作台是 `#lab`),用 `history.replaceState`,不新增瀏覽紀錄;錄影時不動。使用者手動改 hash 時 `hashchange` 會跳到那一章並播放。
- **章節的 `key` 已經是對外的網址**,改名會讓別人分享出去的連結失效;要改名時保留舊的 key 對應,或至少在交接紀錄寫明。
- `buildTranscript()`:從 `CHAPTERS` 的字幕(或 `transcript`)產生說明視窗裡「字幕文字稿」的清單,去掉 `**` 與 `{m/z|…}` 標記;點章名由 `goChapter()` 關掉視窗、跳到那一章並播放。字幕改了文字稿自動跟著變。
- `updateLiveCaption()`:故事模式下把目前字幕寫進看不見的 `#capLive`(`aria-live="polite"`),螢幕閱讀器才讀得到畫在畫布上的字幕;只有字幕換了才寫。

### 視角操作

共用的 `../assets/camera-nav.js`(2026-10-07),由 `createCameraNav()` 建立的 `nav` 在 `updateCamera()` 的使用者鏡頭分支、`controls.update()` 之前呼叫 `nav.step(dt)`。只在 `camFree()`(暫停或「自己操作」)且不在錄影時作用:滑鼠拖曳旋轉,右鍵或 Shift 拖曳平移,滾輪縮放;觸控板雙指滑動平移、捏合縮放;方向鍵或 WASD 移動、Q/E 轉向、+/− 縮放,Shift 加快;一操作就把 `APP.userCam` 設為 true。R 在故事模式設好 `APP.blendFrom`、把 `APP.userCam` 設回 false,鏡頭平滑回到動畫的鏡頭;在操作台飛回 `enterLab()` 的預設視角。播放中方向鍵仍是切換章節;時間軸自己處理過的方向鍵(`e.defaultPrevented`)不再由全域的鍵盤處理重複切換。縮放範圍 0.03 到 6,觀察點限制在 (0, 0.32, 0) 半徑 2 的球內。

## 自己操作(離子阱操作台)

`LAB`:`auto`(自動掃描中)、`m`(射出點)、`pol`(`'+'`、`'-'`)、`mode`(`full` 一般、`msms` 串聯質譜、`zoom` 放大掃描)、`level`(2 或 3)、`seq`(串聯質譜的進度)、`zoom`(放大掃描的範圍)、`fill`(裝填量是目標值的幾倍)、`zoomList`。

- `enterLab()`:`APP.mode = 'lab'`、暫停,顯示 `#lab`,重設電灑、傳輸與馬鞍,呼叫 `labFill()`,鏡頭移到 `D(272, −2, 0)` 加 (0.04, 0.035, 0.2)。
- `labFill()`:依樣品與正負離子換清單(校正液只有正離子),電壓回到 500 V;自動增益控制開著時裝填 = 目標值,關掉時 = 目標值 × 濃度(0.25 到 8 倍),超過的部分寫進 `trap.sc`;依豐度裝入離子(豐度 1、目標值時 22 顆),清掉質譜,`trap.labMap = true`,最後 `labControls()` 更新選單。「重新裝填」、換樣品、切正負離子、改濃度或自動增益控制都會呼叫它。
- `labControls()`:正負離子按鈕的狀態;「挑一種離子撞碎」只列 `PRODUCTS` 裡有資料的前驅離子;MS³ 只在碎片還有下一層資料時可選(目前只有 611 → 465 → 303);放大掃描列出這個樣品有化學式的離子,正離子模式另加緩激肽 2+。
- 串聯質譜 `labStartMsms()` 與 `labSeqStep()`:重新裝填後依序「隔離」(2.4 秒,其他離子被寬頻電壓推出去)、「活化」(4.4 秒,1 秒內把前驅離子移到 q = 0.25,再照它的頻率推,撞成 `pickProduct()` 抽到的碎片),MS³ 再對 465 做一次隔離與活化,最後開自動掃描排出碎片。隔離與活化期間不記入質譜(`F.acquire` false)、端帽交流電壓關掉、滑桿跟著顯示電壓;動滑桿會中止流程。碎片峰標示掉了多少(−146、−308、−162…),面板換成步驟面板。
- 放大掃描 `labStartZoom()`:用 `isotopeSpecies()` 裝入那一種離子的各同位素,`trap.res` 0.13、`trap.wRes` 0.004,先快速掃到範圍起點(快轉每格最多停在起點,不會一步跨過整個範圍;以前在 m/z 600 附近一格跨約 12,蘆丁 611 的範圍只有 5.8 寬,掃描直接結束),再用 9 秒走過 m/z − 1.2/z 到 m/z + 4.6/z;掃完 `labZoomResult()` 用前兩根峰的間距算電荷數寫進讀值。
- `labStep(dt)`:先跑 `labSeqStep()`,再處理自動掃描。一般的自動掃描讓射出點每秒增加 20%,阱裡還有離子的 m/z 在射出點的 0.91 到 1.03 倍之間(關掉交流電壓時到 1.12 倍,因為邊界射出晚約 9%)時放慢到每秒 2.2%,到 8500 V 停止;判斷看阱裡實際的離子(含碎片),不只看樣品清單。按「自動掃描」會先把端帽交流電壓重新打勾,要看關掉的效果得在掃描開始後再取消勾選,或關掉後用滑桿手動掃。讀值列出每種離子(串聯質譜時是阱裡實際有的離子)的 q、「留不住」或「已排出」、步驟或電荷數、留得住的最小 m/z,以及裝填的說明。質譜的範圍依模式改變。
- `exitLab()`:回到故事模式,清掉 `seq`、`zoom`,`seek(APP.t, false)` 停在原本的時間點。

## 錄影

說明視窗的「錄成影片」呼叫 `record()`:

- 從 jsDelivr 動態載入 mp4-muxer 5.2.1(`+esm`,`firstTimestampBehavior: 'offset'`),用 WebCodecs 的 `VideoEncoder`(`REC_CODEC` = `avc1.42E028`,H.264 Constrained Baseline、level 4.0;7 Mbps、1920×1080、30 fps,每 2 秒一個關鍵格)。**不要改回 High profile(`avc1.640028`):** Firefox 的編碼器用 High 時會產生 B 畫格,畫格不照順序送出(1 3 2 5 4…),mp4-muxer 收到第一格就丟出錯誤,Firefox 錄影整個失敗;Baseline 依規格沒有 B 畫格(2026-10-22 用 Firefox 157 與 Chrome 156 實測)。
- `body.rec` 藏起介面;`quality.configure(…, { recording: true })` 強制完整畫質,AO 開啟,顆粒關掉(結束後還原)。沿用目前的深淺色模式。
- `seek(from)` 後以固定的 1/fps 一步一步 `storyStep()`,每格把 3D 畫面和疊圖畫布畫到同一張畫布再編碼。編碼佇列超過 8 格就等 `dequeue` 事件;每 30 格用 `MessageChannel` 讓出一次執行緒(背景分頁的計時器會被節流,這樣切到別的分頁也會繼續錄)。
- 完成後下載 `ion-trap-ms.mp4`;`finally` 還原顆粒、`resize()` 恢復使用者畫質,回到原本的時間點並暫停,結果留在 `window.__lastRec`。
- 從主控台可以指定範圍與規格:`lcq.record({ from, to, fps, width, height, bitrate, upload })`;`upload` 是作者本機伺服器接收影片的網址,正式網站用不到。
- 按鈕預設隱藏。開頁時 `canRecord()` 先確認有 `VideoEncoder` 與 `VideoFrame`,再用 `VideoEncoder.isConfigSupported()` 問 `REC_CODEC`、1920×1080、7 Mbps、30 fps 能不能編碼;可以才顯示「錄成影片」,不行就顯示說明視窗裡的 `#recNo`(「這個瀏覽器不能錄影,請改用電腦版的 Chrome 或 Edge」)。改 `record()` 的預設編碼設定時,`canRecord()` 要一起改。2026-10-22 實測:Chrome 156 與 Firefox 157 顯示按鈕、錄得出完整的檔案;Playwright 的 WebKit 27.2(Windows)不支援,顯示 `#recNo`。
- 錄影時 `ovResize()` 不帶 `#topnav` 的範圍,面板照原本的位置畫。全長 394 秒的錄影在作者電腦上約需幾分鐘。

## 到站人數

`loadVisits()` 用 Abacus 的 `tung-beauregard-github-io/instrument-principles` 計數,和入口(`../assets/app.js`)用同一套規則(2026-10-13 對齊):

- 只有網址是 `tung-beauregard.github.io` 而且路徑在 `/instrument-principles/` 底下、這個瀏覽器可以寫入 `localStorage`、又沒有 `lcq-visited` 記錄時才用 `hit`(加一,成功後記下 `lcq-visited`);本機預覽、別的網域、儲存空間不能用時都只 `get`。
- 回應不是 200、數值不是非負整數、連不上或 6 秒逾時,都顯示「—」,`title` 改成「到站人數暫時無法載入」。不論成功或失敗,結束時才把 `#visits` 顯示出來,載入中不會先閃一個 0。
- 改這段時,入口的 `loadVisits()` 要一起看,兩邊共用同一個計數與瀏覽器記錄。

## 網址參數與除錯

- `#key`(章節)、`?t=分:秒`、`#lab`:見上面「章節連結」。
- `?paused`:停住不自動播放(可以和 `#key`、`?t=` 一起用)。
- `?perf=1`:共用畫質模組的效能顯示(FPS、繪圖比例、繪圖裝置),只顯示在本頁。
- `window.lcq`:`record`、`seek`、`setPlaying`、`shot`、`run`、`APP`、`TOTAL`、`CHAPTERS`、`trap`、`spectrum`、`view`、`ST`、`isotopePattern`、`lab`(`enterLab`、`exitLab`、`labStep`、`labFill`、`labStartMsms`、`labStartZoom`、`LAB`)。
- `shot(t, name, w, h)`:跳到 t、用指定尺寸畫一格,存成 JPEG,在 HTTP 預覽時 POST 到同一伺服器的 `/save?name=`。這是作者本機預覽伺服器專用的接收端,一般靜態伺服器與正式網站沒有這個端點,請求會失敗但不影響頁面。
- `run(t1, fps)`:從目前時間以固定步長連續播到 t1(不經過 `seek`),用來比對連續播放與跳轉的差別,也方便在主控台快速跑完一章看結果。

## 修改的切入點

- **字幕、標籤、面板文字:** 字幕在各章的 `cues`;標籤在各章 `labels()` 的清單;面板標題在 `drawRF()` 這類函式與各章的 `specView.title`;片頭片尾在 `drawOverlay()` 與 `drawEndCard()`;重點整理的四句在 `RECAP_LINES`;說明視窗與操作台是 HTML。畫在畫布上的字要寫在 module 程式裡,`boot()` 才會預載到它的字型。用語以白話為準(AGENTS.md 第 5 節)。
- **章節長度與時間:** 改 `dur` 時一併檢查 `cues`、`cam`、`labels()` 的時間與 `update()` 裡的 `sstep`、`win` 時間點;`TOTAL` 與播放列自動跟著變。總長改了要同步 `INSTRUMENTS.md`(「共 16 章,約 6.5 分鐘」)、本文件的時間軸表與 `docs/VALIDATION.md` 的時間點。
- **新增章節:** 在 `CHAPTERS` 裡加物件(`key`、`title`、`dur`、`cam`、`cues`、`update`),需要乾淨的阱內狀態就寫 `enter`,需要粒子流已經在跑就設 `prewarm`;沒有字幕的章節給 `transcript`。新章節的 `key` 會變成網址,取名要穩定。
- **樣品、加成離子、碎片:** `SAMPLES`、`SAMPLES_NEG`、`PRODUCTS`。新增離子時填化學式 `f`(放大掃描與同位素才會出現),用化學式重算 m/z 核對;碎片的鍵是前驅 m/z 的 `toFixed(2)`。操作台的選單會自動跟著清單變。
- **模型:** 尺寸與位置在 `IP` 和 `buildAssembly()`。改了零件的 x 位置,要一起改 `TRANSPORT_SPEED()` 的分段、`TransportSim` 的 `centerY()` 與 `pos()`(136、187、196、247)、閘門的 x = 189.5、進阱的 x = 252、`GasSim` 的區塊、`anchors`、各章用 `D(x, …)` 定位的鏡頭,以及 `applyFrame()` 裡拆開離子阱的位移。
- **公式與數值:** `PHYS` 與 `TRAP`。改 r₀、z₀ 或射頻頻率要重算 `kV`(見上面),再核對字幕裡的 830、2230、5190 V、每 m/z 4.25 V、280 kHz、0.908、1830 與 2000,以及說明視窗與 `INSTRUMENTS.md` 的數值。改 `qEject` 時 `BETA_EJECT`、端帽發光頻率與示波器的交流波形會自動跟著變。
- **鏡頭:** 各章的 `cam`;`HUDX`;操作台的預設視角在 `enterLab()` 與 `nav` 的 `reset`;自由視角的範圍在 `createCameraNav()` 的參數。
- **顏色與主題:** 場景的在 `PALETTE`,疊圖的在 `OV_COL`,網頁元件的在 CSS 變數;依 m/z 上色的在 `MZ_STOPS`(對數刻度 100 到 2000)。
- **分享預覽圖:** 片頭畫面改了就用 `node scripts/make-og-images.mjs <預覽網址> lcq` 重產 `assets/og/lcq.jpg`(見 README)。

## 設計取捨

以下是從程式與註解看得出的理由:

- 包絡模型而不直接積分 Mathieu 方程:畫面放慢太多,照實積分看不到東西;包絡模型保留由 β(q) 決定的振盪頻率比、共振條件與射出順序,微運動只做示意。
- 掃描在兩種離子之間快轉(`warpScan()`):照實際速率掃,每種離子通過射出點只有幾毫秒;快轉讓每種離子都有幾秒可以看,面板也註明了。
- 阱內的離子點與軌跡不用相加混合(`PointCloud(…, false)`、`LineCloud(…, false)`):離子密集時相加混合會整團變成白色,看不出顏色;電灑、傳輸與氣體在深色模式仍用相加混合發光。
- 3D 標籤只存物件與局部座標(`obj`、`local`),畫的時候才換成螢幕位置,所以模型移動、鏡頭轉動時標籤會跟著走。
- 加熱匣的材質設了 `polygonOffset`,避免和加熱塊的切面重疊閃爍。
- 錄影等 `dequeue` 事件、用 `MessageChannel` 讓出執行緒,不用 `setTimeout`,因為背景分頁的計時器會被節流。
- 質譜的峰用「同一種離子」分組,而不是只看距離:放大掃描的峰寬要照規格表約 0.3,相距 0.5 的同位素峰才會像實機那樣部分重疊、但仍分得出來。
- 離子從哪一側出去事先抽好:見上面「離子阱的運動」。

## 2026-10-20:加入的內容

- 三個新章節(加成離子與團簇離子、同位素峰與電荷數、負離子模式),MS/MS 一章的碎片峰標示掉了多少。
- 操作台:正負離子、蘆丁標準品、串聯質譜 MS² 與 MS³、放大掃描、裝填量與自動增益控制(空間電荷)。
- 章節連結(`#key`、`?t=`、`#lab`)、字幕文字稿、讀屏用的字幕。
- 面板會避開分頁列;預載字型範圍包含上下標與減號;分享預覽的 og 標籤。
- 修正:同一種離子全部往同一側出去、放大掃描的峰被拆成好幾根、隔離時重的離子留在阱裡、操作台的放大掃描一步跨過範圍(見上面);MRFA 的 m/z 由 524.27 改成 524.26(化學式算出 524.265)。

## 2026-10-13:修正的問題

- 畫質選單看不到:選單原本掛在 `#sitenav` 裡,靠 `../assets/render-quality.css` 的 `#sitenav > .quality-control` 絕對定位到分頁列下方;2026-10-07 分頁列加了 `overflow-x:auto`(手機上要能橫向捲動)之後,選單落在捲動範圍外被裁掉(880 px 寬實測 `scrollHeight` 86、`clientHeight` 36)。改成上面說的 `#topnav` 與 `#qhost`,選單不在分頁列裡面,不會再被裁掉;共用的 `render-quality.css` 沒有改。
- 「暫停中」提示被分頁列蓋住:分頁列變寬之後,置中、top 16 px 的提示落在分頁列底下(1280 px 寬實測完全重疊)。移到畫質選單下方。
- 到站人數:服務失敗時改成顯示「—」,加一的條件改成和入口相同(見上面「到站人數」)。
- 錄影按鈕:先確認瀏覽器能編碼才顯示(見上面「錄影」)。
- 離子阱尺寸的出處:說明視窗、片尾字卡與程式註解原本寫 March (1997),改成讀得到原文的 March (1999)。數值 r₀ 7.07 mm、z₀ 7.85 mm 沒有變。

## 修改後要檢查

- 共用命令:`node scripts/check-site.mjs`(含分享預覽的 og 標籤與圖檔)、`node scripts/check-render-quality.mjs`(含這一頁 module 的語法)、`node scripts/check-camera-nav.mjs`。
- HTTP 預覽打開 `lcq/`:自動播放、console 沒有錯誤;拖時間軸跳到每一章,畫面與字幕對得上;暫停後拖曳、方向鍵、R 都正常,再播放鏡頭會接回去。
- 新章節:用 `lcq.seek(章節開始, false); lcq.run(章節結束)` 跑完一章,看 `lcq.spectrum.peaks` 是否每根峰都出現(見 VALIDATION.md 的數字)。
- 連結:開 `#adducts`、`?t=3:05`、`#lab`,以及從文字稿點章名。
- 「自己操作」:三種樣品、正負離子、自動掃描、MS² 與 MS³、放大掃描(蘆丁 z = 1、緩激肽 z = 2)、關掉自動增益控制並把濃度拉到 8 倍(峰偏移、變寬),開始掃描後取消勾選端帽交流電壓(峰偏大約 9%、變寬),離開後回到原本的時間點。
- 深淺色切換、390 px 寬的播放列與分頁列(可以橫向捲動);直式畫面的面板從分頁列下方開始;畫質選單在分頁列右端下方看得到、切換有效;暫停時提示出現在選單下方,沒有被擋住。
- 到站人數:正常時是數字;在主控台把 `fetch` 換成會失敗的函式再呼叫一次 `loadVisits` 的同一段程式,應顯示「—」。錄影按鈕在支援的瀏覽器出現,沒有 `VideoEncoder` 時不出現、改顯示說明。
- 動到錄影或時間軸時,用主控台 `lcq.record({ from: 0, to: 10 })` 錄一小段確認檔案能播放。
- 詳細步驟與預期結果見 `../docs/VALIDATION.md` 的「lcq:離子阱質譜(動畫講解)」。

## 2026-10-05:即時繪圖效能

- `loop()` 只在前景且非錄影時執行,先通過共用 `quality.shouldRender()` 的 60 FPS 上限,再用實際時間差推進原本動畫。
- `resize()` 套用 `../assets/render-quality.js` 的畫質、解析度預算(每格最多約 340 萬像素)與 AO。`renderFrame()` 保留相機、粒子尺寸、composer 與文字疊圖;畫質控制在分頁列下方,不擠壓手機播放列(2026-10-13 起掛在 `#qhost`,見上方「修正的問題」)。
- 自動模式取代舊的 90 格單向降畫質邏輯,避免視窗 resize 把已降低的畫質重設。
- `record()` 強制完整後製,使用原有固定時間步與尺寸;`finally` 的 `resize()` 恢復使用者畫質。錄影不經即時節流器。
