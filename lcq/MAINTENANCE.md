# 離子阱質譜原理(動畫講解):維護說明

`lcq/index.html` 是單一 HTML 檔,用 three.js 0.183.2(jsDelivr ES module,經 importmap 載入)繪圖,不需要建置。內容是一段 13 章、299 秒的自動播放解說(附字幕,可拖時間軸、暫停後自己轉視角),另有「自己操作」的離子阱操作台與頁內錄影。

「離子阱質譜」這份教材有兩個畫面(2026-10-13 合併):本目錄是「動畫講解」,`../lcq-3d/` 是「拆開探索」(維護說明見 `../lcq-3d/MAINTENANCE.md`)。兩頁的程式各自獨立,不共用模型或模擬。入口只有一張卡片(`content/instruments.json` 的 `lcq`);拆開探索不在清單裡,由兩頁分頁列的「離子阱質譜」一組互相連結,`scripts/check-site.mjs` 的 `extraPages` 一樣檢查它的連結。

**正本:** 儲存庫裡的 `lcq/index.html` 是正本,直接修改這個檔。它最初由六個原始碼片段(core、models、sim、overlay、story、app)和頁面外殼串接而成,片段只在作者電腦的暫存資料夾裡,沒有進儲存庫;之後的修改(畫質、視角操作、白話用詞、分頁列)都直接改在 `index.html`,片段已經過時,不要再用它重新產生。串接時留下的分區標記還在,在檔案裡搜尋 `// ---- ` 可以跳到各區。

## 分區與主要名稱

`<head>` 最前面有一小段 script 先讀 `localStorage` 的 `lcq-theme`,設定 `<html data-theme>`,避免淺色模式先閃深色。CSS 的顏色都是 `:root` 的變數,深淺兩組;分頁列是 `#sitenav`(其他教材是 `.sitenav`),「離子阱質譜」一組的樣式是 `.sn-lesson` 與 `.sn-name`。module 開頭先載入共用的 `../assets/render-quality.js` 與 `../assets/camera-nav.js`,`quality` 的選單掛在 `#sitenav` 底下。

| 分區 | 內容 | 常改的地方 |
|---|---|---|
| `core.js` | 小工具(`clamp`、`lerp`、`smooth`、`ease`、`sstep`、時間窗 `win`、可重現亂數 `makeRng`、`gauss`、`V3`);物理常數 `PHYS`、`qOf()`、`vEjectOf()`、`betaExact()`、查表 `BETA_LUT` 與 `betaOf()`、`BETA_EJECT`;樣品 `SAMPLES`(`cal` 校正液、`np` 天然物);依 m/z 上色的 `MZ_STOPS`、`colorForMz()`、`cssForMz()`;主題 `PALETTE`、`computeDark()`;算圖器、相機、環境光、天空與地板、四盞燈;後製 `composer`(RenderPass、GTAOPass、UnrealBloomPass、OutputPass、`finish` 暗角與顆粒);`view`、`setRenderSize()`、`applyViewOffset()`、`applyTheme()`;粒子 `PointCloud`、`LineCloud` | 物理數值、樣品、顏色、燈光與 bloom |
| `models.js` | 材質 `MAT` 與 `initMaterials()`(`rodA`、`rodB`、`ring`、`capIn`、`capOut` 用自發光表示電壓;`ghostA`、`ghostB` 是半透明的前排桿子);剖半旋轉體 `latheSolid()` 與 `ring2`、`cyl2`、`axisX`、`mesh`、`tube`、`canvasTex`、`plateX`;機殼 `CAB` 與 `buildCabinet()`、`setCabinetFade()`;離子路徑組件 `IP` 與 `buildAssembly()` | 零件尺寸與位置、材質、標籤錨點 |
| `sim.js` | 顏色 `COL`;目前的樣品 `sampleState`、`setSample()`、`pickSpecies()`;電灑 `EsiSim`;傳輸 `TRANSPORT_SPEED` 與 `TransportSim`;背景氣體 `GasSim`;離子阱 `TRAP`、`OMEGA_V`、`TrapSim`;馬鞍面 `SaddleSim`;質譜累加 `Spectrum` | 粒子數量、速度、阱內運動參數 |
| `overlay.js` | 疊圖畫布 `OV`、`OV_COL`、`ovResize()`、`ovTheme()`;字型 `FONT_SANS`、`FONT_MONO`;字幕標記 `parseRich()`、斷行 `layoutRich()`(`NO_START` 避頭字元)、`drawRichLines()`;3D 標籤 `projectPx()`、`drawLabel()`;儀表面板 `panelBox()`、`drawRF()`、`drawQ()`、`drawScope()`、`drawSpectrum()`、`drawWell()`、`drawSteps()`;整格疊圖 `OVS`、`drawOverlay()`、片頭片尾 `drawEndCard()`、重點整理 `drawRecap()`、`fitText()`、`drawWrapped()` | 面板文字與版面、片頭片尾 |
| `story.js` | 放大模型的擺放 `DIO`、機殼內的擺放 `CABPOSE`、座標換算 `D()`;鏡頭關鍵格 `K()`、`KP()`、`HUDX`;每格狀態 `F` 與 `resetF()`;`labels()`、`caption()`;掃描游標 `warpScan()`、`scanKeys()`;章節 `CHAPTERS`、`TOTAL`、`chapterAt()`、`storyCamera()` | 字幕、標籤、運鏡、章節長度 |
| `app.js` | 建立場景物件與 `ST`;`OrbitControls`;播放狀態 `APP`;`simStep()`、`storyUpdate()`、`storyStep()`、`seek()`;把狀態套到場景的 `applyFrame()`;`adjFov()`、`updateCamera()`、`renderFrame()`、主迴圈 `loop()`;播放列(`updateBar()`、`railTime()`、`jumpChapter()`、`setPlaying()`、`showHint()`);視角操作 `camFree()`、`nav`;鍵盤、主題、說明視窗;操作台 `LAB`、`labFill()`、`enterLab()`、`exitLab()`、`labStep()`;`resize()`;錄影 `record()`;到站人數 `loadVisits()`;`boot()`;除錯用的 `shot()`、`run()`、`window.lcq` | 互動流程、錄影、計數 |

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

- `PHYS`:r₀ 7.07 mm、z₀ 7.85 mm(March 1997),射頻 760 kHz、振幅 0 到 8500 V 零到峰值(LCQ Series Hardware Manual),共振射出點 q = 0.83(Wong & Cooks 1997),a = 0 的穩定邊界 q = 0.908,掃描速率每秒 5500 m/z 單位。
- q_z = 8eV / (m (r₀² + 2z₀²) Ω²),整理成 `qOf(V, mz) = V / (kV · mz)`,`kV` = 5.1175 V。**`kV` 是寫死的常數**,不會隨 r₀、z₀、射頻頻率自動重算;改這三個值時要自己重算 kV(用上面的數值與 1 Th = 1.66054×10⁻²⁷ kg / e,得 q = 0.19541 × V / (m/z))。
- `vEjectOf(mz) = 0.83 × kV × mz`,每 m/z 約 4.2475 V:m/z 195.09 約 829 V、524.27 約 2227 V、1222 約 5190 V(字幕寫 830、2230、5190);8500 V 能射出的最大 m/z 約 2001,若等到 0.908 才排出只到約 1829。
- β:`betaExact(q)` 以 a = 0 的連分數迭代(展開到 k = 10),`betaOf()` 用 0 到 0.908 之間 2048 格的查表內插,q ≥ 0.908 回傳 1。β(0.83) ≈ 0.736,對應的軸向振盪頻率 β × 760 / 2 ≈ 280 kHz,也就是端帽交流電壓的頻率(計算值,手冊沒有直接寫,字幕與標籤都註明)。MS/MS 活化時 β(0.25) ≈ 0.179,約 68 kHz。
- 低質量截止:留得住的最小 m/z = V / (kV × 0.908)。操作台讀值直接顯示這個值;500 V 時約 108,MS/MS 把 611 放到 q = 0.25 的 782 V 時約 168。
- 「平均下來的碗」`drawWell()`:深度 D = q × V / 8(a = 0 的擬位能近似),在「為什麼困得住」一章固定用 V = 400 V,三種離子約 20、7.5、3.2 V。
- 偵測與掃描的字幕數字:轉換二次發射電極 −15 kV、倍增器增益約 3×10⁵、m/z 150 掃到 2000 約 0.34 秒(1850 / 5500)。
- 樣品(皆為 [M+H]⁺):校正液咖啡因 195.09、MRFA 524.27、Ultramark 取 1222.0 一根;天然物檜木醇 165.09、兒茶素 291.09、槲皮素 303.05、扁柏脂素 355.12、蘆丁 611.16。豐度 `ab` 是示意。蘆丁的碎片 465.10(少鼠李糖 146)與 303.05(少芸香糖 308)是黃酮苷常見的裂解方式,不是這台儀器的實測。

### 離子阱的運動(`TrapSim`)

畫面時間比實機慢太多,直接積分 760 kHz 的運動在動畫裡看不出東西,所以用「包絡模型」:每顆離子記軸向振幅 `A` 與相位 `th`,相位以 β(q) × `OMEGA_V` / 2 前進(`OMEGA_V` 是畫面上的射頻頻率 `TRAP.fV` = 7 Hz),徑向兩個分量用 β(q/2)。微運動用 cos Φ 調變位置:軸向乘上 (1 − 0.5 q cos Φ),徑向乘上 (1 + 0.25 q cos Φ)。

- 氦氣冷卻:`A` 以每秒 `TRAP.gammaHe` = 0.9 的速率回到熱運動振幅 `Ath`(1.2 到 1.9 mm,畫面放大過)。
- 共振射出:`trap.ac` > 0 時,`A` 每秒增加 `TRAP.gain` × ac / (1 + (d / `TRAP.wRes`)²),d = (β − β(0.83)) / β(0.83),寬度 `wRes` = 0.035。|z| 超過 `TRAP.zEject` = 7.6 mm 就從端帽小孔出去。
- q ≥ 0.908:振幅一直變大,很快從端帽出去(邊界射出)。
- 往出口端帽(+x)出去的離子沿二次貝茲曲線飛 0.3 秒到轉換電極,產生二次粒子與倍增器裡的發光(`pulses`),並記一個事件 `{ mz, V, sp, col }`;往入口端帽出去的往回飛、淡出,不計數,所以大約只有一半被偵測到。
- 事件的 m/z:平常是離子本身的 m/z 加 0.16 的常態雜訊。操作台關掉端帽交流電壓時(`trap.labMap` 為 true 且射出時 q > 0.89),改用儀器的換算 V / (kV × 0.83),離子實際在 0.908 才出去,所以算出來偏大約 9%(0.908 / 0.83),雜訊也加寬到 0.4%。
- CID(MS/MS 一章):`trap.excite = { mz, q: 0.25, amp }` 以寬 0.05 的共振推 m/z 611 的離子,同時累加 `heat`;超過各自的門檻(1.6 到 5.0)就換成碎片離子(55% 是 465.10,其餘 303.05)。隔離時 611 以外的離子在 2.4 到 6.6 秒之間各自被推出去。
- `tracer` 為每種樣品記最近 4.2 秒的軸向位置,給示波器面板 `drawScope()` 畫線。

### 其他模擬

- `EsiSim`:液滴每秒 24 顆從噴針尖端出來,邊飛邊縮;電荷密度 q / r² 超過 17 就分裂(最多 3 次),每次噴出 3 到 5 顆子液滴,子液滴 0.35 到 0.75 秒後有一半機率放出一個離子,交給 `TransportSim.addFree()`。另有鞘氣的流線。液滴最多 300 顆,`InstancedMesh` 畫 320 個。
- `TransportSim`:放出的離子被拉向毛細管入口(`IP.coneTip`),到了就排上路徑(x = −5);路徑上每段的速度在 `TRANSPORT_SPEED(x)`(毫米 / 秒),在桿子裡加上射頻造成的晃動。`ctl.feed` 可以不經電灑直接在某個 x 放入離子(離子阱章節從 x = 222 放)。閘門關閉(`gateOpen` 為 false)時,到 x = 189.5 的離子被擋下、淡出;到 x = 252 的離子交給 `trap.addIon()`,只有 `F.trapAccept` 為 true 時才收。中性分子從毛細管出口直直往前,撞上錯開的截取錐就彈開。
- `GasSim`:各區的點數 330、46、7、2 只表示「越往裡越空」,不是實際比例(實際差了將近一億倍);離子阱裡另有 26 個氦原子。
- `SaddleSim`:放在離子阱上方 150 mm 處的 72 × 72 mm 曲面。高度 h = k · S · (w² − 2u²),S = cos(相位) 讓馬鞍翻轉;`uMix` 從馬鞍漸變成碗 h = kₑ(4u² + w²) − 9,軸向比徑向陡 4 倍,對應 β_z ≈ 2β_r。球的受力是同一個位能的梯度加輕微阻尼,每格分 8 步積分;跑出邊界 0.7 秒後重放。章節裡先不轉(6.4 秒前)、再轉太慢(每秒 0.42 圈)、最後每秒 1.6 圈。
- `Spectrum.add(mz, w, col)`:相差小於 max(0.6, 0.008 × m/z) 的事件併成同一根峰,以 Welford 法累計平均 m/z 與變異數,畫峰寬時用標準差;峰高超過最高峰 8% 才標數字。

### 掃描怎麼放慢

實機每秒掃 5500 個 m/z 單位,照這個速度畫面上一閃就過。`scanKeys(t0, 清單, m0, mEnd, tail, fast, slow)` 為每一種離子排兩段:先用 `fast` 秒快轉到 0.93 m(緩動),再用 `slow` 秒等速走過 0.93 m 到 1.025 m,最後用 `tail` 秒走到 `mEnd`。`warpScan(t, keys)` 算出當下的射出點 m*,電壓 V = m* × kV × 0.83。面板標著「動畫在兩種離子之間快轉」;排出順序與每種離子對應的電壓仍然正確。

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
| 11 | `msms` | 串聯質譜 MS/MS | 34 s | 4:08 | 蘆丁 611:隔離、活化碎裂、掃出碎片,四步驟面板 |
| 12 | `recap` | 重點整理 | 17 s | 4:42 | 四點整理,13.4 秒起片尾字卡 |

總長 `TOTAL` = 299 秒,由各章 `dur` 加總,播放列的分段寬度也照 `dur` 分配。

每一章是一個物件:

- `cam`:鏡頭關鍵格。`K(t, 看的點, 位移, { fov, sx, sy })` 由看的點加位移得到相機位置,`KP(t, 相機位置, 看的點, …)` 直接給位置。`t` 是章內時間。`sx`、`sy` 是畫面偏移(`camera.setViewOffset`),右側有面板的章節用 `HUDX` = 0.17 把主角往左推。第一章另有 `start`。
- `storyCamera(i, t)` 以上一章最後一格當這一章 t = 0 的起點,依序用 `ease` 內插,所以章節之間的鏡頭是連續的。
- `cues`:`[章內秒數, 字幕]`。字幕可用 `**詞**`(強調色)與 `{524|文字}`(m/z 524 的顏色)。`caption()` 淡入 0.45 秒、淡出 0.35 秒,上方小字是「章號 標題」。
- `update(ST, t, dt)`:每格先 `resetF()` 把 `F` 與 `OVS` 清成預設,再由章節寫入這一格要的狀態(粒子開關、電壓、面板、標籤)。標籤用 `labels(ST, t, [[錨點, 標題, 小字, 出現, 消失, dx, dy], …])`,錨點以 `cab:` 或 `asm:` 開頭,對應 `buildCabinet()` 與 `buildAssembly()` 回傳的 `anchors`。
- `enter(ST, cont)`(選用):進入這一章時重設模擬。連續播放進來時 `cont` 為 true,`saddle` 與 `scan` 會沿用上一章阱裡的離子;拖時間軸跳進來時為 false,一律重新裝填。
- `prewarm`(選用):拖時間軸跳進這一章時,先空跑幾秒讓粒子流已經在跑(`esi` 0、`vacuum` 4、`guides` 7 秒)。

右側面板由 `OVS.hud` 的開關組合:`rf`(電壓)、`q`(q 值軸)、`well`(碗深)、`steps`(MS/MS 四步驟)、`scope`(示波器)、`spec`(質譜,`specView` 設範圍、刻度、上方的電壓軸 `vAxis` 與游標 `cursor`);`hide(s)` 讓已經排出的離子不再出現在面板上(看 `ST.counts`)。橫式畫面面板寬 470 × `OV.U`,直式畫面改成滿寬並縮小到 0.8 倍。

## 播放、暫停與手動操作

- `APP`:`mode`(`story` 或 `lab`)、`playing`、`t`(故事時間)、`chapter`、`userCam`(使用者動過鏡頭)、`blend` 與 `blendFrom`(從使用者的鏡頭接回動畫鏡頭)、`simT`(模擬時鐘,也用在鏡頭微晃與顆粒)、`rec`(錄影中)。
- 主迴圈 `loop(now)`:錄影中或分頁在背景時不做事;`quality.shouldRender(now)` 把即時播放限制在 60 FPS;dt 最多 0.05 秒。操作台模式跑 `labStep(dt)`,播放中跑 `storyStep(dt)`,接著 `applyFrame(APP.simT)`、`updateCamera(dt)`、`renderFrame()`、`updateBar()`。
- `storyStep(dt)` 推進時間,跨章時呼叫 `enter(ST, true)`,再 `storyUpdate()`(`resetF()`、`ch.update()`、字幕)與 `simStep(dt)`。`simStep()` 讓所有模擬前進一步,`F.acquire` 為 true 時才把阱的事件加進質譜,最後重算 `ST.counts`(每種 m/z 還剩幾顆)。播到結尾自動暫停。
- `seek(t)`:各模擬用固定種子重設(章號加 11、12、13、14),呼叫 `enter(ST, false)` 與 `prewarm`,再從章節開頭以 1/30 秒一步重算到 t。同一個時間點拖過去的畫面一定相同;連續播放到同一點可能略有不同(見上面 `enter` 的 `cont`)。章節越長、跳得越後面重算越久,最長的 `scan` 一章約 1260 步。
- 播放列:拖曳或點擊時間軸跳到該點(操作台會先關掉),滑過顯示章名與時間;時間軸取得焦點時 ← → 切換章節。`jumpChapter(-1)` 在章節開頭 2 秒內回上一章,否則回到本章開頭。
- 鍵盤(焦點在輸入元件或說明視窗時不處理):空白鍵播放或暫停(操作台中按會先離開操作台),播放中 ← → 切換章節,F 全螢幕。暫停時顯示提示「暫停中:拖曳或用方向鍵改變視角,按空白鍵繼續」。
- 暫停後拖曳鏡頭會把 `APP.userCam` 設為 true,`updateCamera()` 改走使用者鏡頭分支;再播放時 `setPlaying(true)` 記下目前鏡頭,1.2 秒內接回動畫鏡頭。
- 窄螢幕:`adjFov()` 在寬高比小於 1.6 時加大視角(上限 78°),保留 16:9 畫面的左右範圍;寬高比小於 1.15 時(`mobile()`)不做左右偏移,改成上下偏移,面板也改成滿寬。
- 開頁:`boot()` 套主題、`resize()`,把程式裡所有中文字元收集起來預載 Noto Sans TC(400、500、700)與 IBM Plex Mono(400、500、600),最多等 7 秒,再 `seek(0)` 開始播放。網址有 `?paused` 或系統設定減少動態效果(`prefers-reduced-motion: reduce`)時停在第一格不自動播放。

### 視角操作

共用的 `../assets/camera-nav.js`(2026-10-07),由 `createCameraNav()` 建立的 `nav` 在 `updateCamera()` 的使用者鏡頭分支、`controls.update()` 之前呼叫 `nav.step(dt)`。只在 `camFree()`(暫停或「自己操作」)且不在錄影時作用:滑鼠拖曳旋轉,右鍵或 Shift 拖曳平移,滾輪縮放;觸控板雙指滑動平移、捏合縮放;方向鍵或 WASD 移動、Q/E 轉向、+/− 縮放,Shift 加快;一操作就把 `APP.userCam` 設為 true。R 在故事模式設好 `APP.blendFrom`、把 `APP.userCam` 設回 false,鏡頭平滑回到動畫的鏡頭;在操作台飛回 `enterLab()` 的預設視角。播放中方向鍵仍是切換章節;時間軸自己處理過的方向鍵(`e.defaultPrevented`)不再由全域的鍵盤處理重複切換。縮放範圍 0.03 到 6,觀察點限制在 (0, 0.32, 0) 半徑 2 的球內。

## 自己操作(離子阱操作台)

- `enterLab()`:`APP.mode = 'lab'`、暫停,顯示 `#lab`,重設電灑、傳輸與馬鞍,呼叫 `labFill()`,鏡頭移到 `D(272, −2, 0)` 加 (0.04, 0.035, 0.2)。
- `labFill()`:依選單換樣品(`cal` 三種、`np` 五種),電壓回到 500 V,依豐度裝入離子(豐度 1 的裝 22 顆),清掉質譜,`trap.labMap = true`。「重新裝填」與換樣品都呼叫它。
- `labStep(dt)`:滑桿是目標電壓,實際電壓以每秒 6 倍的速率趨近;核取方塊控制端帽交流電壓。按「自動掃描」時 `#labScan` 的處理會先把端帽交流電壓重新打勾,要看關掉的效果得在掃描開始後再取消勾選,或關掉後用滑桿手動掃。「自動掃描」讓射出點 `LAB.m` 每秒增加 20%,射出點落在還沒排出的某種離子 m/z 的 0.91 到 1.03 倍之間(關掉交流電壓時是 0.91 到 1.12 倍,因為邊界射出晚約 9%)時放慢到每秒 2.2%,到 8500 V 停止;動滑桿就停止自動掃描。讀值列出每種離子的 q、「留不住」(q ≥ 0.908)或「已排出」,以及留得住的最小 m/z。面板顯示電壓、q 值、示波器與質譜。
- `exitLab()`:回到故事模式,`seek(APP.t, false)` 停在原本的時間點。

## 錄影

說明視窗的「錄成影片」呼叫 `record()`:

- 從 jsDelivr 動態載入 mp4-muxer 5.2.1(`+esm`),用 WebCodecs 的 `VideoEncoder`(`avc1.640028`、7 Mbps、1920×1080、30 fps,每 2 秒一個關鍵格)。
- `body.rec` 藏起介面;`quality.configure(…, { recording: true })` 強制完整畫質,AO 開啟,顆粒關掉(結束後還原)。沿用目前的深淺色模式。
- `seek(from)` 後以固定的 1/fps 一步一步 `storyStep()`,每格把 3D 畫面和疊圖畫布畫到同一張畫布再編碼。編碼佇列超過 8 格就等 `dequeue` 事件;每 30 格用 `MessageChannel` 讓出一次執行緒(背景分頁的計時器會被節流,這樣切到別的分頁也會繼續錄)。
- 完成後下載 `ion-trap-ms.mp4`;`finally` 還原顆粒、`resize()` 恢復使用者畫質,回到原本的時間點並暫停,結果留在 `window.__lastRec`。
- 從主控台可以指定範圍與規格:`lcq.record({ from, to, fps, width, height, bitrate, upload })`;`upload` 是作者本機伺服器接收影片的網址,正式網站用不到。
- 限制:按鈕沒有先檢查瀏覽器有沒有 `VideoEncoder`,在不支援 WebCodecs 的瀏覽器按下去會顯示「錄製失敗」。全長 299 秒的錄影在作者電腦上約需一到幾分鐘。

## 到站人數

`loadVisits()` 用 Abacus 的 `tung-beauregard-github-io/instrument-principles` 計數,和入口共用 `lcq-visited` 這個瀏覽器記錄:網域是 `*.github.io` 而且這個瀏覽器沒記過時用 `hit`(加一並記下),其他情況只 `get`;6 秒逾時。成功才顯示 `#visits`。**和入口不同:** 服務失敗時這一頁把計數藏起來,入口(`assets/app.js`)與 `AGENTS.md` 第 6 節的規定是顯示「—」。這個差異尚未修改,記在 `docs/HANDOFF.md` 的缺口裡。

## 網址參數與除錯

- `?paused`:停在第一格,不自動播放。
- `?perf=1`:共用畫質模組的效能顯示(FPS、繪圖比例、繪圖裝置),只顯示在本頁。
- `window.lcq`:`record`、`seek`、`setPlaying`、`shot`、`run`、`APP`、`TOTAL`、`CHAPTERS`、`trap`、`spectrum`、`view`、`ST`、`lab`(`enterLab`、`exitLab`、`labStep`)。
- `shot(t, name, w, h)`:跳到 t、用指定尺寸畫一格,存成 JPEG,在 HTTP 預覽時 POST 到同一伺服器的 `/save?name=`。這是作者本機預覽伺服器專用的接收端,一般靜態伺服器與正式網站沒有這個端點,請求會失敗但不影響頁面。
- `run(t1, fps)`:從目前時間以固定步長連續播到 t1(不經過 `seek`),用來比對連續播放與跳轉的差別。

## 修改的切入點

- **字幕、標籤、面板文字:** 字幕在各章的 `cues`;標籤在各章 `labels()` 的清單;面板標題在 `drawRF()` 這類函式裡;片頭片尾在 `drawOverlay()` 與 `drawEndCard()`;重點整理的四句在 `recap` 一章的 `OVS.recapLines`;說明視窗與操作台是 HTML。畫在畫布上的中文要寫在 module 程式裡,`boot()` 才會預載到它的字型。用語以白話為準(AGENTS.md 第 5 節)。
- **章節長度與時間:** 改 `dur` 時一併檢查 `cues`、`cam`、`labels()` 的時間與 `update()` 裡的 `sstep`、`win` 時間點;`TOTAL` 與播放列自動跟著變。總長改了要同步 `INSTRUMENTS.md`(「共 13 章,約 5 分鐘」)與本文件的時間軸表。
- **新增章節:** 在 `CHAPTERS` 裡加物件(`key`、`title`、`dur`、`cam`、`cues`、`update`),需要乾淨的阱內狀態就寫 `enter`,需要粒子流已經在跑就設 `prewarm`。
- **模型:** 尺寸與位置在 `IP` 和 `buildAssembly()`。改了零件的 x 位置,要一起改 `TRANSPORT_SPEED()` 的分段、`TransportSim` 的 `centerY()` 與 `pos()`(136、187、196、247)、閘門的 x = 189.5、進阱的 x = 252、`GasSim` 的區塊、`anchors`、各章用 `D(x, …)` 定位的鏡頭,以及 `applyFrame()` 裡拆開離子阱的位移。
- **公式與數值:** `PHYS` 與 `TRAP`。改 r₀、z₀ 或射頻頻率要重算 `kV`(見上面),再核對字幕裡的 830、2230、5190 V、每 m/z 4.25 V、280 kHz、0.908、1830 與 2000,以及說明視窗與 `INSTRUMENTS.md` 的數值。改 `qEject` 時 `BETA_EJECT`、端帽發光頻率與示波器的交流波形會自動跟著變。
- **鏡頭:** 各章的 `cam`;`HUDX`;操作台的預設視角在 `enterLab()` 與 `nav` 的 `reset`;自由視角的範圍在 `createCameraNav()` 的參數。
- **顏色與主題:** 場景的在 `PALETTE`,疊圖的在 `OV_COL`,網頁元件的在 CSS 變數;依 m/z 上色的在 `MZ_STOPS`(對數刻度 100 到 2000)。

## 設計取捨

以下是從程式與註解看得出的理由:

- 包絡模型而不直接積分 Mathieu 方程:畫面放慢太多,照實積分看不到東西;包絡模型保留由 β(q) 決定的振盪頻率比、共振條件與射出順序,微運動只做示意。
- 掃描在兩種離子之間快轉(`warpScan()`):照實際速率掃,每種離子通過射出點只有幾毫秒;快轉讓每種離子都有幾秒可以看,面板也註明了。
- 阱內的離子點與軌跡不用相加混合(`PointCloud(…, false)`、`LineCloud(…, false)`):離子密集時相加混合會整團變成白色,看不出顏色;電灑、傳輸與氣體在深色模式仍用相加混合發光。
- 3D 標籤只存物件與局部座標(`obj`、`local`),畫的時候才換成螢幕位置,所以模型移動、鏡頭轉動時標籤會跟著走。
- 加熱匣的材質設了 `polygonOffset`,避免和加熱塊的切面重疊閃爍。
- 錄影等 `dequeue` 事件、用 `MessageChannel` 讓出執行緒,不用 `setTimeout`,因為背景分頁的計時器會被節流。

## 已知問題(尚未修改)

- 畫質選單看不到:`../assets/render-quality.css` 的 `#sitenav > .quality-control` 把選單絕對定位在分頁列下方,但 2026-10-07 起 `#sitenav` 設了 `overflow-x:auto`(手機上要能橫向捲動),選單落在分頁列的捲動範圍外被裁掉。2026-10-13 在 880 px 寬實測:分頁列高 37.5 px,選單在 top 60.5 px,`#sitenav` 的 `scrollHeight` 86 大於 `clientHeight` 36,畫面上看不到。修法要另外決定選單放哪裡(例如分頁列外另設一個固定位置的容器)。
- 到站人數在服務失敗時隱藏,不是顯示「—」(見上面「到站人數」)。
- 錄影按鈕沒有先檢查 WebCodecs(見上面「錄影」)。

## 修改後要檢查

- 共用命令:`node scripts/check-site.mjs`、`node scripts/check-render-quality.mjs`(含這一頁 module 的語法)、`node scripts/check-camera-nav.mjs`。
- HTTP 預覽打開 `lcq/`:自動播放、console 沒有錯誤;拖時間軸跳到每一章,畫面與字幕對得上;暫停後拖曳、方向鍵、R 都正常,再播放鏡頭會接回去。
- 「自己操作」:換樣品、重新裝填、自動掃描(質譜依序出峰)、開始掃描後取消勾選端帽交流電壓(峰偏大約 9%、變寬),離開後回到原本的時間點。
- 深淺色切換、390 px 寬的播放列與分頁列(可以橫向捲動)、畫質選單。
- 動到錄影或時間軸時,用主控台 `lcq.record({ from: 0, to: 10 })` 錄一小段確認檔案能播放。
- 詳細步驟與預期結果見 `../docs/VALIDATION.md` 的「lcq:離子阱質譜(動畫講解)」。

## 2026-10-05:即時繪圖效能

- `loop()` 只在前景且非錄影時執行,先通過共用 `quality.shouldRender()` 的 60 FPS 上限,再用實際時間差推進原本動畫。
- `resize()` 套用 `../assets/render-quality.js` 的畫質、解析度預算(每格最多約 340 萬像素)與 AO。`renderFrame()` 保留相機、粒子尺寸、composer 與文字疊圖;畫質控制在 `#sitenav` 下方,不擠壓手機播放列。
- 自動模式取代舊的 90 格單向降畫質邏輯,避免視窗 resize 把已降低的畫質重設。
- `record()` 強制完整後製,使用原有固定時間步與尺寸;`finally` 的 `resize()` 恢復使用者畫質。錄影不經即時節流器。
