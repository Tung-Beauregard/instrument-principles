# GC-MS 拆開來看：維護說明

`gc-ms/index.html` 是單一 HTML 檔（約 3,600 行、250 KB）：CSS 在 `<style>`，程式是一段 `<script type="module">`，3D 用 three.js 0.183.2（jsDelivr，經 importmap 載入），不需要建置。頁面把 ALS 自動進樣器、氣相層析儀與四極桿質譜儀放在實驗桌上，跟著一針精油樣品看成分怎麼在管柱裡分開、在質譜裡怎麼帶電碎裂；下方主控台的層析圖、質譜、升溫曲線和 3D 管柱裡的色帶都由同一個滯留模型即時算出。另有 8 站的導覽、可開關的放大鏡（管柱內部與離子源）、四段動畫說明與牆上的四張說明圖。頁面沒有錄影、沒有到站人數、只有深色主題。

科學數值與來源見 `../INSTRUMENTS.md`，操作步驟與數值案例見 `../docs/VALIDATION.md` 的 gc-ms 一節。本文件 2026-10-22 依目前程式（基準提交 `473027f`）重寫，保留 2026-10-05 與 2026-10-07 兩次修改的內容（放在最後的分日期小節，仍有效的部分也寫進各節）。文中的數值都是用 Node 從這個檔抽出模型的純函式算出來的。

**正本：** 儲存庫裡的 `gc-ms/index.html` 是正本，直接修改這個檔。module 開頭的註解寫「3D 場景在 scene.js（動態載入 three.js）」，但儲存庫裡沒有 `scene.js`，3D 程式就在同一段 module 的後半（推測是早期分檔時留下的註解，待確認）；「動態載入」仍成立，`init3D()` 用 `import('three')` 載入。各區開頭有 `/* ---------- 名稱 ---------- */` 註解（動畫說明的四段是 `// ---------- 名稱`），搜尋 `---------- ` 可以跳到各區。

## 分區與主要名稱

`<head>`：meta description 與分享預覽的 og 標籤（圖在 `../assets/og/gc-ms.jpg`，見 README「分享預覽圖」）、Google Fonts（IBM Plex Mono、Noto Sans TC、Outfit）、`<style>`、importmap，最後是共用的 `../assets/render-quality.css`。CSS 的顏色都是 `:root` 的變數（`--bg`、`--glass`、`--ink`、`--accent`、`--warn` 等），成分類別色是 `--c-mh`、`--c-om`、`--c-sh`、`--c-os`、`--c-solv`（註解寫「已驗證色盲可分」，驗證方法待確認）。注意 `.seg` 在本頁是成組的切換按鈕，和 `lcq/` 的 `.seg`（播放列）不同。

HTML：`#gl`（3D 畫布）、`#tags`（3D 標籤層）、`#lensBtn`（放大鏡開關）、`#load`（載入中）、`.hud`（介面格線，五區：`brief` 左上的標題、小卡與說明框，`ctl` 控制面板，`hole` 中間的空白可視區，`con` 主控台，`foot` 頁尾小字）、`#tip`（滑鼠提示框）、`#help`（說明視窗）、`#xp`（動畫說明視窗）。`#hole` 本身不畫東西，它的位置決定 3D 的觀察點投影到哪裡、放大鏡放在哪裡、預設視角多遠。

| 分區 | 內容 | 常改的地方 |
| --- | --- | --- |
| 開頭 | 匯入 `createQualityControls`、`createCameraNav`、`createFieldDemo`；`quality`（畫質選單掛在 `.ctl`）；小工具 `$`、`$$`、`clamp`、`lerp`、`smooth01`、`easeIO`、`REDUCED`（系統的減少動態效果）、`cssv`、`f1`、`f2` | 很少改 |
| 成分類別與示範樣品 | `CLS`（單萜烯、含氧單萜、倍半萜烯、含氧倍半萜、溶劑；`v` 是圖表用的 CSS 變數，`glow` 是 3D 發光色）、`CPDS`（15 個成分）、`SOLV`、`BYID`；m/z 範圍 `MZ0` = 40、`MZ1` = 230、`MZN` = 191；載入時替每個成分算 `frac`（佔總離子流的比例）、`lib`（比對用的向量）、`baseMz`（基峰）、`label`；`unitVec()` | 成分、KI、組成、質譜 |
| 質譜碎片 | `FRAG`（每個成分三種斷法）、`SUBS`、`fmtF()`（化學式轉下標）、`nominal()`（整數質量，只認 C、H、O）、`atomsOf()`、`ionTxt()`、`lossTxt()` | 斷法與說明 |
| 管柱與升溫程式 | `COL`、`PROG`、`RATES`、`DT`、`SCAN`、`KABUND`、`R_GAS`；`lnk()`、`kOf()`、`ovenT()`、`runEnd()`、`simulate()`；峰形 `shape()` 與 `erfcxPos()`；`hash()`、`baseAt()`、`noiseAt()`、`ticClean()`；`zAt()`、`timeForZ()`、`bandSig()` | 滯留模型、升溫條件、峰寬、基線 |
| 狀態 | `S`、`RUNS`、`getRun()`；進樣 `INJ_STEPS`、`INJ_TOTAL`、`injStepAt()`、`startInjection()`、`finishInjection()` | 進樣的步驟與文字 |
| 追蹤與敘述 | `currentTrack()`、`dot()`、`partner()`、`selectiveIon()`、`elutingWin()`、`columnText()`、`coeluteText()`、`msStory()`、`storyHTML()`、`msFocusNow()` | 說明框的文字 |
| 導覽 | `TOUR`、`tourOn()`、`setTour()`、`tourEnter()`、`tourNext()`、`updateTourBar()`、`tourTick()`、`tourStory()` | 導覽的站、時間與文字 |
| 圖表 | 共用：`E`（所有元素）、`COLORS`、`SIZES` 與 `ro`（ResizeObserver）、`fitCanvas()`、`niceStep()`、`rrect()`、`hatchPattern()`、`FONT_SM`、`FONT_LB`。層析圖：`CH`、`winSpan()`、`chromWindow()`、`chromSeries()`、`drawChrom()`、`chromTimeAtX()`、`chromTip()`、`peakNearX()`。總覽：`drawOver()`、`overTimeAtX()`。質譜：`BG`、`spectrumAt()`、`MS`、`msFocusCpd()`、`drawMS()`、`msAtX()`、`msTip()`。四極桿：`aP()`、`b1q()`、`QZ`、`QP`、`quadIons()`、`quadState()`、`drawQuad()`、`quadTip()`。`drawOven()`；成分表 `buildTable()`、`syncTable()` | 圖表版面、標示、提示框 |
| 介面 | `markDirty()`、`setPressed()`、`userTakesOver()`、`setTime()`、`setRate()`、`setTrack()`、`setExplode()`、`togglePlay()`、`syncMsView()`、`SPEEDS`、`setSpeed()`、`syncPlayBtn()`、`showTip()`、`openHelp()`；`initUI()`（抓元素、讀 CSS 顏色、接所有事件與鍵盤）；`jumpToPeak()`、`animateTime()`（`tAnim`）；每一格的 `tick()` | 互動流程、快捷鍵 |
| 3D 場景 | `THREE`、`PolyCurve`（依弧長取點的折線曲線）、`G`、版面 `L`、`NB`、`BAND_SP`、`DEF_VIEW`、`rand()`；`init3D()` | 相機、燈光、後製 |
| 模型 | 材質 `M` 與 `buildMaterials()`、`glassMat()`、`spriteMat()`；`shadows()`、`box()`、`boxAt()`、`cyl()`、`washer()`、`cutCyl()`、`tubeAlong()`、`canvasTex()`；`POSTER_X`、`POSTER_Y`、`buildRoom()`、`drawPosters()`；`buildBench()`、`buildGC()`、`buildInlet()`、`buildALS()`、`buildTransfer()`、`buildMSD()`；管柱 `bez()`、`columnPoints()`、`rebuildColumn()`；`buildHelium()`；粒子 `ION_N`、`FX_N`、`makePoints()`、`buildFx()` | 零件尺寸與位置、材質 |
| 放大鏡 | `MOL_N`、`GAS_N`、`ATOM_N`、`lensTop()`、`buildMagnifier()`、`buildLensMS()`、`blobPts()`、`layoutChannel()`、`LENS_T`、`updateLensMS()`；擺放 `lensDodge()`、`placeLens()`、`placeLensBtn()`；管柱內部的模擬 `updateMagnifier()` | 放大鏡內容與位置規則 |
| 標籤與點選 | `TAGS`、`tag()`、`buildTags()`（含點部件的取景表 `ZOOM`）、`panelRects`、`refreshPanelRects()`、`updateTags()`；`lensHit()`、`initPointerTools()`、`aimRay()`、`posterAt()`、`zoomAt()`、`zoomTo()` | 標籤文字與出現條件、點部件的取景 |
| 鏡頭 | `tourCamera()`、`onTourChange()`；`updateViewOffset()`、`fitDistance()`、`viewFor()`、`flyTo()`、`resetView()`、`SHOTS` | 預設視角、導覽取景 |
| 每一格（3D） | `update3D()`、`drawDisplays()`、`spawnFx()`、`updateIons()`、`updateVapor()`、`updateALS()`、`resize3D()` | 動畫的速度與外觀 |
| 動畫說明 | `XF`、`XM`、`XC`、`xText()`、`xArrow()`、`xDot()`、`xRng()`；`XP.part`、`XP.ki`、`XP.ei`、`XP.quad`；`xp`、`xpCueIndex()`、`openXP()`、`closeXP()`、`setXPTopic()`、`xpSeek()`、`xpJump()`、`xpToggle()`、`xpFrame()`、`xpDraw()`（`XP_KEYS` 有定義但沒有用到） | 四段動畫的腳本與文字 |
| 啟動 | `initUI()`、`S.run = getRun(S.rate)`、`buildTable()`、`kickoff()`、`show3DError()`、`init3D()` 的 then／catch、`step()`、`frame()` | 開頁行為 |

## 啟動與每一格的流程

- module 由上往下執行：先建立 `quality`（畫質選單附加到 `.ctl`，要等 `quality.configure()` 第一次執行才啟用，3D 沒載入時一直停用）；最後 `initUI()`，`S.run = getRun(3)`，時間滑桿的上限，`buildTable()`，接著呼叫 `init3D()`。
- `init3D()`：先用一個暫時的畫布確認拿得到 `webgl2` 或 `webgl`，否則丟出錯誤；動態載入 three.js 與七個 addon（OrbitControls、RoomEnvironment、RoundedBoxGeometry、EffectComposer、RenderPass、UnrealBloomPass、OutputPass）；建 renderer、scene、camera、controls、composer、`G.nav`、`G.world`，`initPointerTools()`，設定 `window.GCMS`，加燈；依序 `buildMaterials()`、`buildRoom()`、`buildBench()`、`buildGC()`、`buildInlet()`、`buildALS()`、`buildTransfer()`、`buildMSD()`、`buildMagnifier()`、`buildHelium()`、`buildFx()`、`rebuildColumn(0)`、`buildTags()`、`drawPosters()`（非同步，先等字型最多 2.5 秒）；最後接 resize 與 `#hole` 的 ResizeObserver，`resize3D()`、`resetView(true)`，`G.ready = true`。
- 成功後隱藏 `#load`，0.5 秒後 `kickoff()`；失敗時 `show3DError()` 在 `.hud` 加一則 `.note3d`（「3D 模型沒有載入…底下的層析圖、質譜和所有控制仍然可以操作」），並立刻 `kickoff()`；另有保險的 `setTimeout(kickoff, 7000)`。`kickoff()` 只執行一次：一般是 `startInjection()`（自動進樣）；`REDUCED` 時直接 `finishInjection()`，停在 11.3 分、不播放（3 °C/min 時剛過 Linalool 的峰，自動追蹤落在 Camphor；為什麼選這個時間點，程式沒有寫，待確認）。
- 3D 沒載入時圖表與控制照常：`tick()` 每格都跑，只有 `update3D()` 與 `G.composer.render()` 要等 `G.ready`。
- `frame(now)`：分頁在背景或動畫說明開著時直接返回（`lastFrame` 照樣更新，回來時不會跳一大段）；`quality.shouldRender(now)` 把更新限制在 60 FPS；dt 最多 0.05 秒；`G.ready` 時 `quality.observe(now)`；`step(dt, now)` 依序 `tick()`、`update3D()`、`G.composer.render()`，出錯只在主控台印第一次。
- `tick(dt, now)` 的順序：進樣動畫（`S.inj.el` 以秒累加；推活塞過六成時 `S.injected = true`、`S.t = 0`，沒有導覽且不是 `REDUCED` 時自動播放）→ `tourTick()` → `tAnim`（點峰時 650 ms 的時間動畫）→ 播放時推進 `S.t`（見「播放速度」）→ `S.msOn`（進樣後、溶劑延遲 3 分之後、分析結束之前）→ 四極桿掃描值 `S.sweep` → `S.trackId = currentTrack()` → `S.spec = spectrumAt(S.t)` → `S.msFocus = msFocusNow()` → 拆開程度 `S.explode`（每秒變化 1/1.3）→ 圖表（`chartClock`，最多每秒 30 次：`drawChrom()`、`drawOver()`、`drawMS()`、`drawOven()`）→ `syncPlayBtn()` → 每 0.1 秒或 `dirty` 時更新文字（時間、柱溫與 k 的小卡、時間滑桿、說明框 `storyHTML()`、質譜上方的 `#msHit`、EIC 按鈕）。
- `update3D(dt, now)` 的順序：鏡頭（導覽中 `tourCamera()`；否則進樣鏡頭、`G.fly`、`G.nav.step(dt)`）→ `controls.update()` → 放大鏡（`placeLens()`、`placeLensBtn()`、離子源模式的 `updateLensMS()`）→ 拆開的位移 → 質譜正面淡出 → 柱溫箱發光、風扇、渦輪、指示燈、氦氣管的流動、兩個小螢幕（`drawDisplays()`，每 0.2 秒）→ 管柱色帶的 uniform → 追蹤色帶的圈、連線與標籤 → `updateMagnifier()`、`updateIons()`、`updateVapor()`、`updateALS()` → 偵測器與燈絲發光 → `updateTags()`。

## 狀態

`S`（介面與模擬）：

- 分析：`rate`（3、5、10）、`run`（目前速率的 `simulate()` 結果，`getRun()` 依速率快取在 `RUNS`）、`t`（分析時間，分鐘）、`playing`、`speed`（0.1、0.5、1、3）、`slow`（min(1, speed)）。
- 進樣：`inj`（`{ el, pushed }`，`el` 是秒，進樣結束後是 null）、`injected`、`vaporAt`。
- 追蹤：`track`（`auto` 或成分 id）、`trackId`（這一刻實際追蹤的成分）、`msFocus`（放大鏡與質譜正在解說的成分）、`lensCh`（放大鏡正在示範的斷法）、`lensOpen`（使用者打開放大鏡；不在初始物件裡，只在這次開頁有效）。
- 外觀與介面：`explode`、`explodeTarget`（0 組裝、1 拆開）、`eic`（抽出的 m/z 或 null）、`chromY`、`eicY`（縱軸的平滑值）、`table`、`tab`（手機版的 `chrom` 或 `ms`）、`bare`（隱藏介面）、`sheet`（窄版的設定面板）、`hoverChrom`、`hoverMS`、`dragChrom`。
- 質譜：`sweep`（四極桿此刻放行的 m/z）、`msOn`、`msView`（`spec` 譜圖或 `quad` 穩定圖）、`simMz`（固定的 m/z，null 是自動掃描）、`spec`（`spectrumAt()` 的結果）。
- 導覽與視窗：`tour`（`{ on, i, t, cid, paused, wasPaused }`）、`wasPlaying`（開說明視窗前在不在播放）。

`G`（3D）：`ready`；`renderer`、`scene`、`camera`、`controls`、`composer`、`bloom`、`nav`；`world`；零件 `gc`、`inlet`、`liner`、`septum`、`septumNut`、`als`、`turret`、`syringe`、`plunger`、`syLiq`、`door`、`coilGrp`、`fan`、`msd`、`msTop`、`msFront`、`msWin`、`msScr`、`src`、`lens`、`quad`、`det`、`turbo`；管柱 `colMesh`、`colMat`、`colCurve`、`colK`；放大鏡 `mag`、`lensGC`、`lensMS`、`lensMode`、`lensC`（目前的螢幕位置、寬度與深度）、`lensRect`、`lensUser`、`lensDrag`、`lensTourOff`、`lensAnim`、`lensLab`、`viewShift`、`holeRect`；鏡頭 `fly`、`userMoved`、`injCam`、`lastInj`；標籤 `magTag`、`bandTag`、`bandPos`、`bandSub`、`magSub`、`ZOOM`；說明圖 `posters`、`posterMeshes`；其他 `simSec`（放慢後的累計秒數）、`frontFade`、`hornGlow`、`spawnAcc`。

`xp`（動畫說明）：`k`、`t`、`playing`、`raf`、`opener`（關閉後把焦點還給它）、`cue`、`cues`、`was`、`tourWas`。

## 座標、尺度與模型

- 單位是公分（3D 區開頭的註解：「單位:公分;x 向右、y 向上、z 朝向觀眾」）。實驗桌桌面在 y = 0（`buildBench()`：x −128 到 128、z −46 到 46，下面是到 y = −90 的櫃子），地板 y = −92，後牆在 z = −175。
- **世界左右鏡像：** 儀器都在 `G.world` 裡，`G.world.scale.x = -1`。群組內沿用原本的座標（GC 在 x < 0、質譜在 x > 0），畫出來時質譜在左、GC 在右、氦氣鋼瓶在最右邊。群組座標換成世界座標一律經過 `G.world.localToWorld()` 或零件自己的 `localToWorld()`；`DEF_VIEW`、`SHOTS`、`ZOOM`、`tourCamera()` 的位移、房間、說明圖、燈與相機都是世界座標，所以世界座標的 +x 是遠離質譜顯示幕的方向（2026-10-07 偵測器一站的取景就是在這裡弄反）。為什麼整組要鏡像，註解只寫了結果（質譜在左、GC 在右），理由待確認。兩個小螢幕與氦氣瓶的字用 `scale.x = -1` 或 `repeat.x = -1` 翻回來。
- 版面常數 `L`（群組座標）：`gc`（GC 外殼 x −87 到 −37、高 54、z −28 到 28）、`oven`（爐腔 x −84 到 −47、y 5 到 45、z −22 到 27）、`inlet`（進樣口 x −74、y 54、z 6）、`coil`（管柱圈 x −80 到 −53、中心 y 25、z 4、半徑 9、10 圈）、`ms`（質譜外殼 x −10 到 48、高 44、z −28 到 28）、`ax`（離子軸 y 24、z 0）、`src` 0（離子源）、`q0` 6 到 `q1` 28（四極桿）、`det` 33（偵測器）、`mag`（放大鏡長 46、半徑 7.4；同一個物件裡的 `x`、`y`、`z` 沒有被讀取）。
- GC（`buildGC()`、`buildInlet()`、`buildALS()`）：外殼分成五塊包住爐腔；爐腔 `M.cavity` 只畫背面；後方風扇 `G.fan` 與加熱圈（`G.heaterMat`）；左鉸鏈的爐門 `G.door`（玻璃窗 `M.glassDoor`）；右側面板有顯示幕 `G.gcDisp`、兩顆燈 `G.ledReady`／`G.ledRun`、12 顆按鍵；管柱架 `G.coilGrp` 跟著管柱圈移動。進樣口有切開的加熱塊、玻璃襯管 `G.liner`（含玻璃棉）、隔墊螺帽 `G.septumNut`、隔墊 `G.septum`，分流出口管線 `G.splitPath`。ALS 在進樣口正上方：樣品盤 `G.turret` 10 格（第 3 格是樣品、另有清洗與廢液瓶），注射針 `G.syringe`（標籤「注射針 10 μL」）、針筒裡的液柱 `G.syLiq`、活塞 `G.plunger`。
- 傳輸線（`buildTransfer()`）：切開一角的套管，從 x −46 到 −9，長 37。
- 質譜（`buildMSD()`）：底板、左右與後側板、上蓋 `G.msTop`、正面群組 `G.msFront`（四塊 `M.shellFade` 圍出窗口、窗玻璃 `G.msWin`、小螢幕 `G.msScr`、一顆按鈕）；內腔 `M.cavityDark` 只畫背面；玻璃真空腔（半徑 8.5、長 46，x −6 到 40）；離子源 `G.src`（4 cm 見方的離子化室、推斥極、上下兩條燈絲 `G.filMat`、電子束 `G.beamMat`）；三片透鏡 `G.lens`；四極桿 `G.quad`（四根金色桿，半徑 0.95，中心在 (y, z) = (±1.34, ±1.34)，長 22，外面一層玻璃管）；偵測器 `G.det`（出口片、高能倍增極、號角形的電子倍增器 `G.hornMat`）；渦輪分子泵（轉子 `G.turbo`）。離子 `G.ionMesh` 掛在 `G.msd` 底下，用質譜的群組座標。
- 管柱（`columnPoints(k)`、`rebuildColumn(k)`）：路徑從進樣口往下、貝茲曲線接到管柱圈、10 圈螺旋、再一段貝茲曲線接到傳輸線、直線走到離子源前；k 是拆開程度（圈往前 30k、出口端往外 6k）。`rebuildColumn()` 用 `PolyCurve` 建 1700 段、半徑 0.44 的 TubeGeometry，每個頂點帶 `aS`（沿路徑 0 到 1），模型的位置 z（0 到 1）直接對到這條路徑。畫出來的螺旋部分約 5.7 m（每圈約 56.6），實際管柱是 30 m，管徑也放大很多倍：示意。
- 尺寸都是示意：Agilent 6850 Series II 的規格表寫它的寬度只有 6890N 的一半、柱溫箱 202 × 200 × 105 mm（高 × 寬 × 深）、管柱架直徑 130 mm（來源見 INSTRUMENTS.md）；模型的爐腔是寬 37、高 40、深 49，管柱圈直徑 18，都放大了。四極桿的桿半徑（0.95）和 r₀（約 0.945）幾乎相等，也是示意。
- 材質 `M`（`buildMaterials()`）：外殼 `shell`、`shell2`、`door`、`panel`、`dark`；空腔 `cavity`、`cavityDark`（只畫背面）；不鏽鋼 `steel`、`steel2`（雙面）、`steelDark`；四極桿 `gold`；實驗桌 `bench`（clearcoat）、`cabinet`、`wall`；`blue`、`red`、`cap`、`capRed`、`white`、氦氣瓶 `cyl`；離子化室 `srcVol`（半透明）。玻璃是自訂 shader `glassMat()`（邊緣較亮，`uFade` 控制淡出）：`glassClear`、`glassDark`、`glassDoor`、`glassVial`、液膜 `film`。`ledCyan` 的顏色乘 2.4，給 bloom 用。`M.shellFade` 在 `buildMSD()` 由 `shell` 複製出來，給可淡出的正面。點狀粒子都用 `spriteMat()`（相加混合，大小 `uScale` 在 `resize3D()` 依畫面高度更新）。
- 燈光（場景座標）：半球光 0.32；主光 `key`（暖白 1.55，位置 (150, 270, 200)，2048² 陰影）；背光 `rim`（青 0.9）；補光 `fill`（0.3）；柱溫箱裡的點光源 `G.ovenLight`（在 `G.world` 裡，強度隨溫度）。環境光是 RoomEnvironment（強度 0.32），色調映射 ACES、曝光 0.95，霧 520 到 1500。後製：RenderPass、UnrealBloomPass（強度 0.6、半徑 0.38、門檻 1.0，只有亮度超過 1 的顏色會發光）、OutputPass；render target 是 HalfFloat。`quality.configure()` 在「完整」才開陰影與 4 倍 MSAA，「流暢」關掉 bloom。
- 相機：PerspectiveCamera 視角 30°、near 2、far 3200。OrbitControls：阻尼 0.08、距離 25 到 950、`maxPolarAngle` 0.53π（相機最低只到比水平略低一點）、平移在螢幕平面上。預設視角 `DEF_VIEW` 的觀察點 (19, 47, 0)、方向 (−0.24, 0.3, 0.92)；距離由 `fitDistance()` 依 `#hole` 的大小算，讓寬 160、高 136 的範圍放得進可視區（限制在 150 到 900）。`SHOTS[1]` 是 ALS 的取景（相機 (36, 96, 66)、觀察點 (74, 72, 4)）。`updateViewOffset()` 用 `setViewOffset` 把觀察點投影到 `#hole` 正中央，再加上放大鏡避讓的 `G.viewShift`。
- 房間（`buildRoom()`）：磁磚地板、後牆、牆上一條青色燈條、四張說明圖（見「動畫說明」）。
- 標籤（`buildTags()`）：HTML 元素疊在畫布上。`tag(text, sub, pos, cls, show, near, far)` 的 `text`、`sub` 可以是每格重算的函式，`pos` 回傳世界座標；`obj(o, x, y, z)` 的偏移照原本未鏡像的寫法，x 取負號後經過鏡像，標籤仍落在物件右側。`near`、`far` 是相機距離的範圍：「質譜儀」在 150 以外才出現，「離子源」「四極桿」「偵測器」在 150 以內，拆開後質譜裡的四個零件標籤（推斥極、燈絲、離子透鏡、高能倍增極）在 170 以內，其他零件標籤不限距離。類別：`part` 是零件標籤（儀器上的在拆開後才出現）與放大鏡裡的小標，手機上一律不顯示；`band` 是色帶與放大鏡裡的離子、`neutral` 是中性碎片、`keep` 讓手機上也留小字。標籤的小字多數是即時的（柱溫、進樣狀態、四極桿的 m/z）。`updateTags()` 每 30 格重量一次 `.brief`、`#ctl`、`#console`、`.note3d` 的位置，標籤框碰到這些面板或放大鏡就不畫。

## 滯留模型與數值

都在「管柱與升溫程式」一區，可以用主控台的 `GCMS.S.run` 核對。下面的數字是 Node 跑同一份程式的結果。

- 條件：`COL` = { `tM` 1.37（死時間，分）、`N` 70000（理論板數）、`sig0` 0.0006（進樣帶寬，以管長的比例表示）}；`PROG` = { `T0` 60、`Tf` 220（°C）、`hold` 3、`delay` 3.0（溶劑延遲，分）}；`RATES` = [3, 5, 10] °C/min。HP-5MS 30 m × 0.25 mm × 0.25 μm 與 He 1.0 mL/min 只出現在說明文字與標籤裡，模型只用 `tM`、`N` 與 `lnk()` 的係數。
- 柱溫：`ovenT(t, rate)` = min(60 + rate × t, 220)；分析長度 `runEnd(rate)` = (220 − 60) ÷ rate + 3，3、5、10 °C/min 為 56.33、35.00、19.00 分（按鈕寫「共 56、35、19 min」，`#tSlider` 的上限跟著換）。
- 停留倍數 k：`lnk(x, T)` = (45000 + 4600 (x − 10)) ÷ (R × (T + 273.15)) − (14.2 + 0.8 (x − 10))，x = KI ÷ 100（等效碳數），R = 8.314 J/(mol·K)。也就是把吸附焓（45 + 4.6 (x − 10) kJ/mol）與熵項（14.2 + 0.8 (x − 10)）依碳數線性內插。註解寫「HP-5MS、相比 250 校正過」：相比 β = 內半徑 ÷ (2 × 膜厚) = 125 μm ÷ 0.5 μm = 250；四個係數怎麼校正、用了哪些數據，程式與文件都沒有寫（待確認）。例：60 °C 時 α-Pinene 4.58、Limonene 9.94、(E)-Caryophyllene 280（說明視窗寫「將近 300」）；Caryophyllene 130 °C 時 5.02、135 °C 時 3.97（說明視窗寫「130 °C 左右 k 降到 4 上下」）；溶劑（KI 600）60 °C 時 0.25。
- 移動：位置 z（0 是進樣口、1 是管柱出口）照 dz/dt = 1 ÷ (tM × (1 + k(T(t)))) 積分（`simulate()`，Euler 步長 `DT` = 0.005 分，跨過 z = 1 的那一步線性內插求 tR）。每一步的 z 存在 `sp.z`，`zAt()` 內插、`timeForZ()` 反查。到分析結束還沒出來的給 tR = tEnd + 60（目前 15 個成分在三種速率下都出得來）。
- 峰寬：σ（分）= √(1/N + σ0²) × tM × (1 + kₑ)，kₑ 是流出那一刻溫度下的 k。√(1/N + σ0²) = 0.003827，相當於約 68,000 板。溶劑乘 1.8；`tail: true` 的三個醇類（Linalool、Borneol、α-Terpineol）加指數拖尾 τ = 0.7σ，峰形是指數修正高斯（`shape()`，面積都是 1，`erfcxPos()` 用 Abramowitz 與 Stegun 7.1.26 的近似避免溢位）。半高寬（2.3548σ）在 3 °C/min 時約 2.4 秒（α-Pinene）到 3.8 秒（倍半萜），10 °C/min 時都約 1.4 到 1.6 秒。管柱裡色帶的寬度另用 `bandSig(z)` = √(σ0² + z/N)（管長的比例）。
- 保留指數：`simulate()` 用同一個模型跑 C7 到 C18 的直鏈烷類（`run.alk`；x 就是碳數，所以烷類本身的 KI 正好是 100n），再用 van den Dool 與 Kratz 的升溫公式 KI = 100n + 100 × (tR − tₙ) ÷ (tₙ₊₁ − tₙ) 算 `kiCalc`。成分表的「KI（本次）」就是它，「KI（資料庫）」是 `CPDS` 的 `ki`。3 °C/min 時 α-Pinene 934（資料庫 939）、Camphene 949（954），其他差 0 到 3。換速率時 α-Pinene 934、935、937，Camphene 949、950、952，其他最多差 2。烷類時間：3 °C/min 時 C8 2.97、C9 4.68、C10 7.48、C11 11.24 分；10 °C/min 時 2.56、3.52、4.78、6.18 分。
- 離子總數（層析圖）：每個掃描點 t = j × `SCAN` 的值是 Σ A × shape(t) + 基線 + 雜訊。A = `amt` × `KABUND`（7800），沒有分成分的感度差，所以峰面積的比例就是 `amt` 的比例（15 個 `amt` 加起來正好 100）。基線 `baseAt(T)` = 2.2×10⁴ + 5.5×10⁴ × e^((T − 220)/40)（註解：溫度越高管柱流失越多；60 °C 約 2.30×10⁴、220 °C 7.7×10⁴）。雜訊 `noiseAt(j)` = (hash(j) − 0.5) × 1.2×10⁴，由掃描序號決定，同一個時間點永遠相同。總覽 `run.ov` 把整次分析分成 900 格、每格取最大值，`run.ticMax` 是其中最大的（3 °C/min 約 3.34×10⁶，就是 α-Pinene 的峰頂）。溶劑延遲（3 分前）沒有訊號。
- 掃描間隔 `SCAN` = 0.0048 分 = 0.288 秒，每秒約 3.47 張質譜（動畫說明寫「三、四次」）。
- 質譜 `spectrumAt(t)`：每個成分的貢獻 v = A × shape(t)，乘它的 `frac`，每根線再乘 0.92 到 1.08 的掃描起伏（hash；註解：「所以比對相似度不會剛好 100」）；背景 `BG`（m/z 40、41、43、44、55、57、69、73、147、207、208、209，強度乘 0.35 + e^((T − 220)/40)；提示框說是「空氣、液膜受熱分解」）加上偶爾出現的雜訊。每根線記住貢獻最多的成分 `who`，畫成那一類的顏色。比對：強度開根號後的單位向量和每個成分的 `lib` 做內積（餘弦相似度），顯示 floor(100 × s)、最多 99。各成分峰頂的比對是 97 到 99；Limonene 與 1,8-Cineole 兩峰中間（3 °C/min 的 8.53 分）兩者約各佔四成與六成，最佳比對 1,8-Cineole、只剩約 80。
- 抽出離子（EIC）：`chromSeries()` 另外累加 v × `frac[m]`，再加 300 到 1200 的小雜訊。有 EIC 時層析圖切成上下兩格，各用自己的縱軸。
- 共流出：`partner(c)` 找 tR 相差小於 3 (σ₁ + σ₂) 的最近成分，分離度 Rs = ΔtR ÷ (2 (σ₁ + σ₂))（底寬當 4σ）；`selectiveIon(c, o)` 找 (frac_c − 1.5 × frac_o) × √m 最大的 m/z。15 個成分裡只有 Limonene 與 1,8-Cineole 互為鄰居：3、5、10 °C/min 時相差 4.3、3.0、1.7 秒，Rs 0.86、0.78、0.65；兩峰之間的谷底（不含基線）是較矮峰頂的 0.53（3 °C/min）與 0.94（10 °C/min）。Limonene 的選擇性離子是 68、1,8-Cineole 是 43。
- 自動追蹤 `currentTrack()`：`track` 是 `auto` 時，溶劑還沒過完（tR + 2.5σ）就追溶劑，之後是第一個還沒過完（tR + 2.5σ + 2τ）的成分，全部流出後是 null。
- 播放速度：播放時 `S.t` 每秒增加 `speed` ÷ (1 + 11 × near)，near 是附近峰的 exp(−u²)、u = (t − tR) ÷ (2.6σ + τ)：1× 平常是每秒 1 分鐘分析時間，峰頂放慢到 1/12（註解：「出峰時自動放慢」）。1× 播完整次分析約 74 秒（3 °C/min）、48 秒（5）、27 秒（10），另加 6.45 秒的進樣動畫。
- 四極桿掃描（畫面上）：`S.sweep` 每秒前進 (230 − 40) ÷ 3 × `slow`，約 3 秒從 40 掃到 230 再回到 40；`simMz` 不是 null 時停在那裡。只在質譜收訊號或面板切到四極桿時掃。

### 成分、質譜與碎片

- `CPDS`（依 KI 排序）：α-Pinene 939、Camphene 954、β-Pinene 979、β-Myrcene 990、p-Cymene 1024、Limonene 1029、1,8-Cineole 1031、Linalool 1096、Camphor 1146、Borneol 1169、α-Terpineol 1188、Bornyl acetate 1285、(E)-Caryophyllene 1417、α-Humulene 1452、Caryophyllene oxide 1582。欄位：`id`、`name`、`short`（圖上用的短名）、`ki`、`amt`（虛構的面積 %）、`cls`、`mw`（整數分子量）、`tail`、`ms`（70 eV 的主要離子 `{ m/z: 相對強度 }`，只取 m/z 40 以上）。
- KI 的出處：程式註解寫「取自實驗室 GC 工具內建的萜類 KI 表（非極性管柱）」。這次對照 Babushok 等 2011 的表 4（二甲基矽氧烷加 5% 苯基，HP-5 屬於這類）：15 個值和表中平均值相差 −3.1 到 +3.7，除了 Linalool（1096，表中 50% 範圍 1097 到 1102）都落在 50% 範圍內（數字與來源見 INSTRUMENTS.md）。那篇把 5% 苯基相歸為「slightly polar」，和註解的「非極性」用詞不同。
- `ms` 的強度是概略值，程式沒有寫出處（待確認）；說明視窗與 INSTRUMENTS.md 寫明只取主要離子、不可拿來鑑定。
- `FRAG`：每個成分三種斷法 `ch`。第一種是沒斷的 M⁺•（只有 `mz` 與 `note`），另兩種有 `ion`（帶電碎片的化學式）、`loss`（中性碎片）、`note`；`ionRad` 表示奇電子離子（⁺•），`lossMol` 表示失去的是中性分子（否則是自由基 •），`lossTxt` 可覆寫中性碎片的寫法（p-Cymene 的 91 寫「CH₃• + C₂H₄」、Borneol 的 95 寫「H₂O + C₃H₅•」）。這次用 `nominal()` 核對過：每個化學式的整數質量等於 `mw`，每種斷法的 ion 等於 `mz`、ion + loss 等於分子量；`note` 裡說的基峰（例如 Limonene 的 68、Linalool 的 71）都和 `ms` 的最強線一致。唯一的缺口是 α-Terpineol 的 `ms` 沒有 m/z 154（見「已知的不一致」）。
- 溶劑 `SOLV`（KI 600，3 °C/min 時 1.69 分流出）只出現在管柱色帶、說明框與追蹤，在溶劑延遲之內，不進質譜。

### 四極桿穩定圖（`drawQuad()`）

- a ∝ U/(m/z)、q ∝ V/(m/z)。畫第一穩定區：q 0 到 0.706 的上界是 `aP(q)`（Mathieu 特徵值 a₀ 的級數取負號，y 方向），0.706 到 0.908 的上界是 `b1q(q)`（b₁ 的級數，x 方向）。用 Node 解：兩條交在 q = 0.7060、a = 0.2370，`b1q` 在 q = 0.908 降到 0，和註解寫的頂點 (0.706, 0.237) 一致。
- 掃描線 a = λq，λ = `QZ.lam` = 0.3306（U/V = λ/2 ≈ 0.165）。它和兩條邊界交在 q = 0.6943 與 0.7084，`QZ.q1`、`QZ.q2` 寫的是 0.6944 與 0.7084。`quadState(mz, set)`：q = `QZ.qc`（0.7014）× set ÷ mz，set 就是此刻放行的 m/z（`S.sweep` 或 `simMz`）；q 在 q1 到 q2 之間才通過，小於 q1 是太重、大於 q2 是太輕。set = 93 時通過的是 m/z 92.08 到 93.94。
- 畫哪些點由 `quadIons()` 決定：目前質譜裡最強的 8 根（相對強度 5% 以上），加上解說中成分的 M⁺•；還沒有訊號時用 α-Pinene 最強的 7 根（93、91、92、77、79、41、121）當示範。q 超過 1.05 的不畫，右上角寫「還有 N 個更輕的」。點一個點把 `simMz` 設成它的 m/z。
- 3D 的離子穿不穿得過四極桿用另一個寬鬆的規則（`updateIons()`：和 `S.sweep` 相差 16 以內，含 230 回到 40 的接續），只是讓畫面上一直看得到離子穿過去，和穩定圖的窗口寬度無關（示意）。

## 粒子與 3D 動畫

- 進樣（`INJ_STEPS`，共 6.45 秒）：轉盤 1.0、下針 0.7、抽樣 1.5、退針 0.6、轉開 0.8、刺進隔墊 0.7、推活塞 0.35、拔針 0.8 秒；推活塞過六成（5.51 秒）時開始計時。`updateALS()` 依步驟轉樣品盤、上下移動注射針（−3.8、−17.2）、活塞與液柱。沒有導覽、使用者沒動過鏡頭、不是 `REDUCED` 時，進樣一開始鏡頭飛到 ALS（`SHOTS[1]`，1.5 秒），分析時間過 0.45 分或進樣結束時飛回全景（2.4 秒）。
- 蒸氣（`updateVapor()`）：推活塞那一刻放出 140 顆點，七成沿分流出口管線 `G.splitCurve` 排出，三成往下進管柱。
- 管柱色帶：`G.colMat` 的 fragment shader 對 16 條色帶（15 個成分加溶劑，`NB`）各加一個高斯發光 exp(−0.5 ((s − c) ÷ w)²)；`update3D()` 每格寫入 `uC`（位置 z）、`uW`（寬度，至少 0.0011）、`uA`（亮度：依 `amt` 與寬度，溶劑當 30，進樣後 0.03 分內淡入）。追蹤的色帶套一個青色圈 `G.zoomRing`，標籤 `G.bandTag` 寫成分名與此刻的 k。
- 柱溫箱：加熱圈的自發光與 `G.ovenLight` 隨 (T − 45) ÷ 175 增加；風扇進樣後轉快；渦輪每秒 30 弧度；兩顆燈表示待命與執行中；`drawDisplays()` 在 GC 螢幕寫 RUN、POST 或 READY、時間、柱溫，在質譜螢幕寫 SCAN 或 EM OFF、「40-400 u」、「SRC 230°C」。
- 離子（`updateIons()`，520 顆 InstancedMesh）：質譜收訊號時每秒產生最多 150 顆（依 `spec.total` 相對 `ticMax` 調整），依貢獻抽成分、依 `frac` 抽 m/z。狀態 1 飄進離子化室；2 被推斥極加速並聚到軸上；3 在四極桿裡前進並橫向擺動（不穩定的振幅以 e^(0.3 s) 長大，超過 1.1 就撞桿、發橙色閃光）；4 轉彎打到高能倍增極；5 三顆電子往下落進倍增器（`G.hornGlow`）。閃光 `G.fx` 是 160 顆點。
- 燈絲在 `S.msOn` 時發亮，電子束閃爍。

### 放大鏡

- 放大鏡是掛在相機上的 3D 物件（`G.mag`；`buildMagnifier()` 把相機加進場景），兩種內容：管柱內部 `G.lensGC` 與離子源 `G.lensMS`，都左右鏡像（流向往左，和儀器一致）。材質關掉 `depthTest`、`renderOrder` 20 以上，所以永遠畫在最上層（註解：不會被介面面板或儀器擋住）。
- 管柱內部（`updateMagnifier()`）：每 0.4 秒依追蹤色帶的位置附近的組成（各成分以高斯權重）重新分配 48 顆分子（`MOL_N`）。每顆分子在液膜裡以每秒 1 ÷ (k × 0.32) 的機率回到載氣、在載氣裡以每秒 1 ÷ 0.32 的機率溶進液膜，所以停在液膜的比例是 k ÷ (1 + k)；載氣裡的分子依拋物線流速前進（中心快、管壁慢）。另有 170 顆灰點代表載氣。標籤小字寫「x% 處 · 液膜裡 y%」。
- 離子源（`updateLensMS()`）：示範 `S.msFocus` 那個成分的 `FRAG`，每種斷法 6.4 秒（`LENS_T`）後換下一種。每段 0 到 1.3 秒是中性分子（1.0 秒起電子從燈絲射下來），1.3 到 2.6 秒是抖動的 M⁺•，2.6 秒後斷開：帶電的那塊被加速往四極桿、中性的那塊往上飄、淡出（第一種斷法不斷）。原子只畫碳（類別色）與氧（紅），氫省略，依化學式的原子數用面心立方格點排成一團（`blobPts()`、`layoutChannel()`，最多 24 顆）。譜圖上圈出正在示範的那一根並標失去的中性碎片，`#msHit` 也換成這一根的說明。
- 何時派得上用場、何時顯示、按鈕、位置與拖曳：見「2026-10-07」一節，內容仍有效。補充 `placeLens()` 的大小：寬版（可視區寬高比大於 1.45）是可視區寬的 27%（管柱）或 46%（離子源），窄版 50% 或 86%，限制在 170 到 430 px（離子源 560 px）；四個角落都會蓋到觀察點時，導覽中先試 `lensDodge()` 平移畫面，空地不夠或不在導覽中才把放大鏡縮成 0.7 倍。

## 圖表與互動

- 層析圖 `drawChrom()`：視窗寬 `winSpan()` = max(2.4, tEnd ÷ 7) 分（3、5、10 °C/min 為 8.05、5.00、2.71 分），游標固定在 65% 處；縱軸平滑跟著視窗內的最大值；各成分的面積淡淡塗上類別色；溶劑延遲與分析結束畫斜線並標字；峰名依峰高排，撞到就往上一層，三層都撞到就不標；游標左邊是已經量到的（實線），右邊是還沒量到的預覽（淡）。
- 層析圖的操作：拖曳（超過 3 px）捲動時間；沒拖動的點擊在 10 px 內有峰就 `jumpToPeak()`（追蹤那個成分、時間動畫到峰頂），否則 `animateTime()` 到點的位置；進樣前按下會直接 `finishInjection()`。滑過顯示 `chromTip()`（時間、柱溫、離子總數、佔 4% 以上的前三個成分）。
- 總覽 `drawOver()`：整次分析（`run.ov` 的 0.75 次方，矮峰也看得到），亮框是層析圖目前的視窗；點或拖曳跳到那個時間。
- 質譜 `drawMS()`：m/z 40 到 230，每根線是貢獻最多那一類的顏色；標出最強的 7 根（間距 22 px 以上）；淡青色直條是四極桿此刻掃到的 m/z；有解說中的成分時標 M⁺•，放大鏡示範的那根加圈並標「−中性碎片」。滑過顯示 `msTip()`（相對強度、各成分佔多少、這根是怎麼來的）；點一根線（取 ±2 內最強的）打開或關掉 EIC。
- 四極桿檢視（按 Q 或「四極桿」）：見上方「四極桿穩定圖」；`#qctl` 的滑桿（m/z 40 到 230）固定 `simMz`，「自動掃描」恢復，「電場動畫」打開 `XP.quad`。
- `drawOven()`：40 到 240 °C 的升溫線，走過的部分是暖色。寬度 1180 px 以下不顯示這一格。
- 成分表 `buildTable()`：#、成分、流出時間、KI（本次）、KI（資料庫）、峰面積 %、類別；點一列 `jumpToPeak()`；換速率時重建。手機上沒有這顆按鈕。
- 升溫速率 `setRate(r)`：換成新的 run；有追蹤成分時，還在管柱裡就換成在新速率下走到同一個位置的時間，已經流出就對齊峰頂並依峰寬比例縮放；沒有時依分析長度等比例換算。
- 拆開 `setExplode()`：`update3D()` 依 `easeIO(S.explode)` 讓爐門轉開 1.75 弧度、管柱圈往前 30、ALS 抬高 12、隔墊螺帽、隔墊與襯管往上（15、9.5、4.5）、質譜上蓋抬高 18、正面往觀眾移 16、離子源與透鏡往傳輸線那一側移（6、2.5）、偵測器往另一側移 7，並 `rebuildColumn(k)`；質譜正面同時淡出（`G.frontFade`）。
- 慢動作 `setSpeed(v)`：`speed` 管時間軸，`slow` = min(1, v) 管進樣、分子、離子、放大鏡與導覽每站的時間（註解：鏡頭和介面反應維持正常速度）；3× 只加快時間軸。
- 窄螢幕：1180 px 以下控制面板收進「設定」（`.app.sheet`，× 或 Esc 關閉），升溫小圖不顯示；760 px 以下主控台用分頁切換層析圖與質譜（`S.tab`），零件標籤與成分表不顯示；高度不夠時不顯示導言（`.lede`）。手機尺寸另外把說明與主控台收成細條，見「手機版的面板收合」。
- 說明視窗 `openHelp()`：開著時暫停播放與導覽，關閉後恢復，焦點回到 ? 按鈕；Esc、× 或點背景關閉。
- 鍵盤（`initUI()` 的 keydown，帶 Ctrl、Cmd、Alt 的不處理）：動畫說明開著時只處理 Esc、空白鍵、← →；說明視窗開著時只處理 Esc；Esc 先關設定面板，再結束導覽；焦點在 input 或 textarea 時只處理 / 與 H、?。其餘：空白鍵播放或暫停（導覽中是暫停導覽；焦點在按鈕上時交給按鈕）、[ ] 時間 ±0.1 分（Shift 或 { } 為 ±1 分）、0 1 2 3 追蹤自動、α-Pinene、Limonene、Caryophyllene、F 換升溫速率、, . 播放速度、X 拆開或組裝、C 導覽、N 下一站（只在導覽中）、Q 質譜面板、I 重新進樣、R `resetView(false)`、H 或 ? 說明、/ 隱藏介面。方向鍵、WASD、+ − 由 `camera-nav.js` 處理（見「2026-10-07」）。

## 導覽

`setTour(true)`：「追蹤成分」選的是某個成分（不是自動、不是溶劑）就跟它，否則跟 α-Pinene，同時把「追蹤成分」設成它（導覽結束後保留）、清掉 EIC、關設定面板，`tourEnter(0)`。`tourEnter(i)` 設定這一站的時間與面板並停止播放，`tourTick(dt × slow)` 推進與換站，`tourCamera(dt)` 取景（每格以 1 − e^(−2dt) 的比例靠近目標，`REDUCED` 時直接到位），說明框由 `tourStory()` 產生，`#tourbar` 顯示「導覽 i/8 · 站名」與進度點。

| 站 | `k` | 名稱 | 時間怎麼走、何時換站 | 鏡頭（世界座標） | 放大鏡與面板 | 說明框 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `als` | 進樣 | `startInjection()` 重新進樣；推完活塞、進樣動畫過 5.85 秒換站 | `SHOTS[1]`：相機 (36, 96, 66)、看 (74, 72, 4) | 不開 | 「跟著 … 的分子走一趟。」加進樣步驟 |
| 2 | `inlet` | 進樣口 | 分析時間每秒前進 0.05 分（最多到 0.2 分），4.5 秒後換站 | 相機 (50, 77, 52)、看 (74, 58, 6) | 不開 | 氣化與分流 |
| 3 | `column` | 管柱 | 分析時間每秒前進 0.06 ÷ v 分（v 是此刻每分鐘走過的管長比例），限制在 0.5 到 4 分；走到管長 93% 換站（註解：至少每秒前進管長的 6%） | 跟著色帶（平滑跟上），位移 (−20, 26, 88) | 管柱內部，自動打開 | `columnText()` 加放大鏡的說明 |
| 4 | `xfer` | 傳輸線 | 先跳到走到 93% 的時間，再每秒前進 0.1 分，到峰頂（醇類加 0.5τ）換站 | 跟著色帶，位移 (−8, 18, 62) | 管柱內部 | 傳輸線 |
| 5 | `source` | 離子源 | 時間停在峰頂，16 秒 | 離子源，位移 (4, 12, 46) | 離子源，自動打開 | `msStory()` |
| 6 | `quad` | 四極桿 | 停在峰頂，12 秒 | 觀察點 10 秒內沿四極桿從 x 4 走到 30（群組座標），位移 (−6, 14, 50) | 收起；質譜面板換成穩定圖 | 四極桿怎麼篩 |
| 7 | `det` | 偵測器 | 停在峰頂，9 秒 | 偵測器下方 2，位移 (10, 14, 52)（從正面窗口斜看） | 收起；面板回到譜圖 | 偵測器、分子離子與基峰 |
| 8 | `done` | 完成 | 停在峰頂，10 秒後結束 | 預設視角 `viewFor(null)` | 收起 | 流出時間與 KI |

依程式模擬（每格 1/60 秒）各站的長度：α-Pinene 在 3 °C/min 時約 5.9、4.5、10.3、3.1、16、12、9、10 秒，全程約 71 秒（5 °C/min 約 69 秒、10 °C/min 約 66 秒）；Limonene 的管柱一站約 13.8 秒、Caryophyllene 約 16.6 秒。慢動作時每站跟著放慢。

- 「下一步」或 N：`tourEnter(i + 1)`（在第 1 站按會跳過進樣動畫）；最後一站不顯示「下一步」，在那裡按 N 會結束導覽。
- 暫停：播放鈕或空白鍵切換 `S.tour.paused`，每站的計時與時間軸都停；打開說明視窗或動畫說明也會暫停，關閉後回到原本的狀態。第 1 站暫停時進樣動畫本身仍會走完（它在 `tick()` 裡，不看導覽暫停），恢復後直接換到第 2 站。
- 結束：最後一站跑完、按「結束導覽」、Esc 或再按 C 時 `setTour(false)`，`onTourChange(false, false)` 讓鏡頭飛回全景，質譜面板回到譜圖。
- 使用者接手 `userTakesOver()`：自己動時間（滑桿、拖層析圖、點峰、[ ]）、升溫速率、追蹤成分、重新進樣、點部件放大、用滾輪或鍵盤移動視角，以及拖曳轉動（OrbitControls 的 `start`），都以 `setTour(false, true)` 結束導覽，鏡頭留在原處，不飛回全景。沒有「從剛才那站繼續」的功能，要再按一次導覽從第 1 站開始。

## 動畫說明（`XP`）

- 四段：`part` 走走停停（32 秒）、`ki` 保留指數 KI（30 秒）、`ei` 電子撞擊游離（32 秒）、`quad` 四極桿（36 秒，長度取自共用模組）。每段有 `title`、`dur`、`cues`（[開始秒數, 說明]）與 `draw(c, t)`，畫在 600 × 340 的虛擬座標（`xpDraw()` 依畫布寬度縮放）。每段都是時間的函式，所以能暫停、跳段、重播。
- `part`：k = 1（藍）與 k = 3（橙）各 120 顆分子（`NH`），畫面各畫前 16 顆（`NV`）。每顆分子交替待在載氣（平均 0.36 秒，`TG`）與液膜（平均 k × 0.36 秒），每次停留取平均值上下 30%（`xRng(11)` 固定種子；註解：真的分子每秒進出液膜非常多次，放慢後若用完全隨機的停留時間，一團分子會散得太開）；在載氣裡以 84 px/s 前進，要走 468 px（5.57 秒的載氣時間）。3 秒起放進管柱，平均抵達時間藍 14.1 秒、橙 25.4 秒（理論值 3 + 5.57 × (1 + k) 是 14.1 與 25.3）。層析圖的兩條曲線各用該種 120 顆的抵達時間，每顆放一個 σ 0.35 秒的高斯疊成，每 0.1 秒預先算好，兩條用同一個最大值正規化。
- `ki`：每次畫都從 `getRun(3)`、`getRun(10)` 拿 C8 到 C11 與 α-Pinene 的時間，21.6 秒起 2.6 秒內從 3 °C/min 內插到 10 °C/min；字幕也是現算的（`cues` 是 getter）。目前的值：3 °C/min 時 C9 4.68、C10 7.48、α-Pinene 5.64 分，走了這一格的 34%，KI 934；10 °C/min 時 3.52、4.78、3.98 分，KI 937。改了滯留模型，這段會自動跟著變，INSTRUMENTS.md 與 VALIDATION 的數字要一起改。
- `ei`：α-Pinene 的碳骨架是寫死的 10 個點與 11 根鍵（`AT`、`BONDS`），斷開時帶走的原子在 `PIECE_B`（93 帶走 3 個碳、121 帶走 1 個、136 不斷）。主角分子 7.4 秒被撞、13 秒起振動、15.6 秒斷成 93；21 秒起每 1.3 秒再來一顆，共 8 顆（`SEQ`：93、136、93、121、93、93、121、93）。右下角的質譜取 `CPDS` 裡 α-Pinene 相對強度 6% 以上的 12 根，跟著離子數長出來。**這段沒有讀 `FRAG.apin`**：斷法與標籤文字（C₇H₉⁺ m/z 93、C₃H₇•（43））都寫在 `XP.ei` 裡，改 `FRAG.apin` 不會跟著變。
- `quad`：`createFieldDemo('quad', { font, cues })`（共用的 `../assets/analyzer-fields.js`，物理見 `../mass-analyzers/MAINTENANCE.md` 與 INSTRUMENTS.md），本頁只換了字幕；三顆球用模組預設的 77、93、136（α-Pinene 的碎片），q 為 0.815、0.675、0.462，直流與交流的比例 a = 0.3q，穩定窗口 q 0.625 到 0.725。22 秒起兩種電壓一起從 0.74 倍調到 1.62 倍，77、93、136 分別約在 23.4、26.1、33.5 秒落在窗口正中間。`draw()` 每格 `seek(t)`，往回跳時模組從頭重算。字幕「每秒從 m/z 40 掃到 400 三、四次」的次數取本頁的 `SCAN`。
- 控制：`openXP(k, opener)`、`closeXP()`、`setXPTopic()`、`xpSeek()`、`xpJump()`（往前時離本段開頭超過 1.5 秒先回到開頭）、`xpToggle()`（播完再按從頭播）；`xpFrame()` 有自己的 requestAnimationFrame。開著時 `frame()` 直接返回（3D 不畫、時間軸不走），播放與導覽暫停，關閉後恢復並把焦點還給打開它的元素；`REDUCED` 時不自動播放。鍵盤 Esc、空白鍵、← → 在 keydown 最前面處理；從說明視窗打開時，Esc 先關動畫、再按一次才關說明。
- 入口：控制列的「動畫」（`btnXp`，開上次看的那段，第一次是走走停停）、說明視窗各段的「▶ 看動畫」（`.xp-open`，`data-xp` 指定哪一段）、四極桿面板的「電場動畫」（`btnQuadXp`）、牆上的四張說明圖。
- 牆上的說明圖：`POSTER_X` = [[−205, part], [−45, ki], [115, ei], [275, quad]]（世界座標 x），中心高 `POSTER_Y` = 80，貼在後牆前（z 約 −171）。`drawPosters()` 先等字型（最多 2.5 秒）再畫 1024 × 680 的貼圖與右上角「點一下看動畫」；第四張用 `createFieldDemo('quad').seek(13.3)` 再 `draw(g, { bare: true })`。放低到中心高 80 是為了預設視角比較不會被上方面板切掉，仍有幾張在面板後面，所以另外有「動畫」按鈕（2026-10-07 交接紀錄）。點擊在 `zoomAt()`：射線先打說明圖（`G.posterMeshes`），比儀器近才打開動畫；滑過時 `posterAt()` 把游標換成手指。

## 網址參數與除錯

- 本頁沒有自己的網址參數，也沒有錄影或匯出。共用畫質模組的 `?perf=1` 可用（FPS、繪圖比例、繪圖裝置，只顯示在本頁）。
- 畫質選擇存在 `localStorage` 的 `instrument-render-quality`（共用模組，所有教材同一個值）；本頁自己不存東西，放大鏡開關、追蹤成分、升溫速率重新整理後都回到預設。
- `window.GCMS = { G, S, TAGS, xp: { open, seek } }`：在 `init3D()` 裡設定，3D 沒載入時不存在。給自動測試讀鏡頭、放大鏡、標籤與狀態，或跳到動畫的某一秒，不要拿來寫功能。主控台可以核對數值，例如 `GCMS.S.run.sp.get('apin').tR`（3 °C/min 時 5.6376）、`GCMS.S.run.alk`、`Math.round(GCMS.S.run.sp.get('apin').kiCalc)`；`getRun` 沒有公開，要看別的速率就按 F 或速率按鈕，再讀 `GCMS.S.run`。
- 共用的 `camera-nav.js` 另外設定 `globalThis.__cameraNav`（相機與觀察點）。

## 修改的切入點

- **文字：** 說明框在 `storyHTML()`、`columnText()`、`coeluteText()`、`msStory()`、`tourStory()` 與 `INJ_STEPS`；標籤在 `buildTags()`；提示框在 `chromTip()`、`msTip()`、`quadTip()`；放大鏡的小字在 `updateLensMS()`（`G.lensLab`）與 `updateMagnifier()`（`G.magSub`）；質譜上方的一行在 `tick()`；說明視窗、控制列與按鈕是 HTML；說明圖在 `drawPosters()`；動畫說明在各 `XP` 的 `cues` 與 `draw()`。用語以白話為準（AGENTS.md 第 5 節）。說明視窗裡的數字（k 將近 300、Rs、KI 差幾個單位、死時間約 1.4 min）是手寫的，改模型後要重算再改。
- **成分與質譜：** `CPDS`（`ki`、`amt`、`ms`、`tail`）與 `FRAG`。新增成分時：`ms` 的 m/z 要在 40 到 230 之間；`FRAG` 要有三種斷法，每個 `mz` 在 `ms` 裡要有值（否則譜圖上圈的是空位）；用 `nominal()` 核對 ion + loss 等於 `mw`（化學式只支援 C、H、O）。`amt` 加總不必是 100（成分表會換算），但色帶亮度以 18 為基準。新增成分會多一條色帶（`NB` 自動加一，shader 的陣列長度跟著變）。「追蹤成分」的按鈕與 0 到 3 鍵只對應 HTML 的 `data-track` 與 keydown 裡寫死的三個 id。
- **滯留模型與條件：** `COL`、`PROG`、`RATES`、`lnk()`、`SCAN`、`KABUND`、`baseAt()`。一起受影響的：說明視窗的數字、速率按鈕的「共 56、35、19 min」、`#ovenP` 的初始文字與 `#tSlider` 的初始上限 56.33、`XP.ki` 的數字（自動）、INSTRUMENTS.md 與 VALIDATION 的數值。**`chromatography/index.html` 有自己的一份 `lnkGC()` 與 `GC_COL`（積分步長 0.004 分），不會跟著改**，兩份教材的數字要一起核對。`RATES` 改了要同步 HTML 的 `#segRate`。
- **模型：** `L` 與各 `build*()`。改了 `L.ax`、`L.src`、`L.q0`、`L.q1`、`L.det`，要一起看 `columnPoints()` 的終點、`updateIons()` 的路徑、`buildTags()` 的錨點與 `ZOOM`、`tourCamera()` 的取景、`update3D()` 裡拆開的位移；改外殼時保留空腔內縮 0.15（見「2026-10-07」）。世界座標鏡像，改取景前先確認方向。
- **鏡頭：** 預設 `DEF_VIEW` 與 `fitDistance()`；進樣的 `SHOTS`；導覽 `tourCamera()`；點部件 `ZOOM`；自由視角的範圍在 `createCameraNav()` 的參數（radius 380）與 OrbitControls 的 `minDistance`、`maxDistance`、`maxPolarAngle`。
- **導覽：** `TOUR`（站名與順序）、`tourEnter()`（每站的時間點與面板）、`tourTick()`（換站條件與 `dur`）、`tourCamera()`、`tourStory()`；放大鏡在哪幾站自動打開寫在 `update3D()` 的 `lensWant`。`msFocusNow()` 與 `update3D()` 用站的 `k` 判斷，不用序號；進度點跟著 `TOUR` 的長度。
- **動畫說明：** 新增一段時在 `XP` 加物件（`title`、`dur`、`cues`、`draw`），在 `#xpTabs` 加一顆按鈕（`data-k`），需要時在說明視窗加 `.xp-open`；要加說明圖就改 `POSTER_X` 與 `drawPosters()`。
- **顏色：** CSS 變數；`CLS` 的 `v`（CSS 變數名）與 `glow`（3D 發光色）；圖表的格線與座標軸色在 `initUI()`；動畫說明的顏色在 `XC`。
- **分享預覽圖：** 開頁畫面改了就用 `node scripts/make-og-images.mjs <預覽網址> gc-ms` 重產 `assets/og/gc-ms.jpg`（見 README）。

## 設計取捨

以下是從程式與註解看得出的理由：

- 3D 載入失敗時圖表與控制照常：模型、圖表與說明都不依賴 three.js，three.js 在 `init3D()` 裡才動態載入（module 開頭的註解與 `show3DError()` 的說明）。
- 總覽圖每格取最大值，窄峰才不會被平均掉；質譜每次掃描加 ±8% 起伏，比對分數才不會剛好 100（註解）。
- 慢動作只放慢「過程」的動畫，鏡頭和介面反應維持正常速度；3× 只加快時間軸（註解）。
- 放大鏡掛在相機上、畫在最上層，不被面板或儀器擋住；深度依鏡頭距離調整，靠近儀器時不會插進儀器裡造成破圖（註解）。
- 導覽的管柱一站快轉，分子幾乎不動（k 很大）時也至少每秒前進管長的 6%（註解）。
- 空腔與外殼內側留 0.15 的間隙，避免兩個面搶著顯示（註解與 2026-10-07 的修正）。
- Q 與 R 維持本頁原有的功能，所以共用視角操作不開 Q/E 轉向、不接管 R（註解）。
- 世界左右鏡像、離子源示範省略氫原子：註解只寫了做法，理由待確認。走走停停的停留時間限制在上下 30% 的理由見「動畫說明」。

## 已知的不一致（程式未修改）

2026-10-22 重寫文件時核對程式發現，都還沒有改：

- 說明視窗寫 Limonene 與 1,8-Cineole「10 °C/min 時只剩 0.7」：模型算出 0.65（3 °C/min 的 0.86 和「約 0.9」相符）。層析教材用同一個模型，寫的是 0.65。
- 說明視窗寫「這樣算出的 KI 換了升溫速率也只差一兩個單位」：成分表裡 α-Pinene（934、935、937）與 Camphene（949、950、952）差 3。
- α-Terpineol 的 `ms` 沒有 m/z 154，但 `FRAG.terp` 的第一種斷法是 M⁺• 154：放大鏡示範這一段時，譜圖上的圈與「M⁺•」標示落在沒有訊號的位置，四極桿面板也會多一個 154 的點（`quadIons()` 會補上分子離子）。
- 導覽第 5 站（離子源）只有 16 秒，三種斷法要 3 × 6.4 = 19.2 秒：第三種（α-Pinene 是基峰 93）剛斷開約 0.6 秒就換站。
- 掃描範圍：質譜螢幕寫「40-400 u」、質譜關著時四極桿標籤寫「m/z 40–400」、說明視窗與動畫字幕寫掃到 400，但模擬的質譜與掃描只到 230（`MZ1`）。
- `kickoff()` 只檢查自己有沒有執行過：3D 載入較慢（最多等 7 秒）或載入後的 0.5 秒內，使用者如果已經開了導覽、拖了時間或按了播放，`kickoff()` 仍會重新進樣（`S.t` 回到 0、EIC 清掉）；`REDUCED` 時則把時間改成 11.3 分。由程式推斷，沒有在瀏覽器重現。
- 焦點在 `<select>`（播放速度、畫質）時按空白鍵也會播放或暫停並 `preventDefault()`（`inField` 只排除 INPUT 與 TEXTAREA），鍵盤使用者不能用空白鍵打開這兩個選單（方向鍵仍可改值）。由程式推斷，沒有在瀏覽器確認。
- 沒用到的程式：`L.mag` 的 `x`、`y`、`z`，`XP_KEYS`；module 開頭的註解提到不存在的 `scene.js`；`G.nav` 的 `home.p` 是建立當時還在原點的相機位置，因為 `reset: false` 所以沒有用到（`home.t` 仍是限制觀察點的球心）。

## 2026-10-07：鏡頭、放大鏡、點選放大與動畫說明

- 視角操作：`init3D()` 建立 `G.nav`（共用的 `../assets/camera-nav.js`），`update3D()` 在非導覽分支、`G.fly` 之後呼叫 `G.nav.step(dt)`。滑鼠滾輪縮放，觸控板雙指平移、捏合縮放，方向鍵或 WASD 移動、+/− 縮放。Q（質譜面板）與 R（`resetView()`）維持本頁原有功能，所以不開 Q/E 轉向、不接管 R。使用者一操作就和拖曳一樣接手鏡頭：清掉 `G.fly`、`G.injCam`，設 `G.userMoved`，導覽中則經 `userTakesOver()` 結束導覽。說明視窗或動畫說明開著時不作用。觀察點限制在 `DEF_VIEW.tgt` 半徑 380 的球內。
- 世界左右鏡像（見「座標、尺度與模型」）：`tourCamera()` 偵測器一站的鏡頭偏移是 `V3(10, 14, 52)`，從正面窗口斜看進去；以前是 `V3(-12, 12, 34)`，鏡頭落在顯示幕那一側又貼得太近，畫面被外殼擋住。改任何取景前先確認鏡像方向。
- 正面外殼自動淡出：`update3D()` 把鏡頭位置換到 `G.msd` 的本地座標，鏡頭在質譜正前方、離正面 18 單位內時，正面外殼（`M.shellFade`）、窗玻璃（`G.msWin` 的 `uFade`）和小螢幕（`G.msScr`）一起淡出，貼近正面 4 單位內完全透明。和拆開共用同一個淡出值 `G.frontFade`（取兩者較大的），淡出過半就不寫深度，幾乎全透明時（0.98 以上）整組隱藏。
- 空腔不可以和外殼共面：柱溫箱的 `M.cavity` 與質譜內腔的 `M.cavityDark` 都是只畫背面的盒子，四壁比外殼內側內縮 0.15。以前完全貼齊，兩個面搶著顯示，從窗口斜看會出現閃爍的條紋（導覽第 5 到 8 站最明顯）。之後加任何貼著外殼的內襯或面板，也要留這個間隙。
- 放大鏡預設收起：`update3D()` 先算 `lensWant`（這時放大鏡派得上用場：沒有導覽時是鏡頭離觀察點夠遠，管柱模式 105、離子源模式 70 以上，而且介面沒有隱藏；導覽時是第 3、4、5 站），真正顯示要再看 `S.lensOpen`（使用者按角落的按鈕打開，只在這次開頁有效）或導覽中的 `G.lensTourOff`（按 × 只收起這一站，`onTourChange()` 時清掉）。不在導覽時，`S.msFocus` 有值就是離子源模式，否則是管柱模式。`placeLensBtn()` 管那顆按鈕：收起時放在放大鏡會出現的角落（寬版管柱模式右下、離子源模式左下，窄版左上）並寫「放大鏡:管柱內部」或「放大鏡:離子源」，打開時變成放大鏡右上角的 ×。按鈕寬高只在文字換掉時量一次（`b._w`、`b._h`），不要每格量。說明框裡「暫停在這支峰上」那句依 `S.lensOpen` 換說法。
- 放大鏡位置（`placeLens()`）：自動模式依版面列出角落，蓋到觀察點（`controls.target` 的投影，周圍留 70 px）就換下一個角落。導覽中四個角落都會蓋到時（手機的可視區只有約 360×180），放大鏡留在第一個角落，由 `lensDodge()` 算出觀察點往左右或上下哪一邊移最少，`G.viewShift` 慢慢跟上，`updateViewOffset()` 把這段平移加進投影中心；鏡頭和觀察點本身不動。判斷是否蓋到時要先扣掉目前的平移，不然平移完又判定沒蓋到，會來回跳。找不到角落、又沒有可以平移的空地（或不在導覽中）時，把放大鏡縮成 0.7 倍。放大鏡是跟著鏡頭的 3D 物件，深度 `G.lensC.D` 取鏡頭到觀察點距離的 0.35 倍（6 到 90），鏡頭靠近儀器時放大鏡也跟著靠近，不會插進儀器裡。
- 拖放大鏡、點部件放大（`initPointerTools()`）：畫布上的捕獲階段 `pointerdown` 若落在 `G.lensRect` 裡就改成拖放大鏡，用 `stopImmediatePropagation()` 擋掉 OrbitControls，視角不會跟著轉；拖到的位置記成可視區裡的比例 `G.lensUser`，雙擊放大鏡清掉、回到自動位置。沒拖動的單擊（450 ms、6 px 內）交給 `zoomAt()`：射線只打 `G.world`，略過隱藏的物件、玻璃和淡出的外殼；落點 28 單位內有部件標籤就用那個標籤的取景（`buildTags()` 裡的 `ZOOM`，存成 `G.ZOOM`；沒有寫在 `ZOOM` 的零件標籤用 (−6, 12, 40) 的位移），打到外殼或從窗口打到內牆就放大整台（質譜儀、管柱烘箱、ALS 自動進樣器），其餘沿目前的方向拉近。有取景的標籤加 `.zoomable`，本身也能點。`zoomTo()` 和使用者自己操作一樣接手鏡頭（`userTakesOver()`、清掉 `G.injCam`、設 `G.userMoved`），1.2 秒飛過去。
- 畫面文字：說明、標籤、讀值改成高中畢業看得懂的白話，原則見 `../AGENTS.md` 第 5 節；型號只留在頁尾小字與說明。
- 新增動畫說明（四段）與牆上的說明圖（第四張「四極桿」）：內容見「動畫說明」一節。這次重寫時更正兩處舊說法：走走停停是「每種 120 顆」（共 240 顆，每種畫前 16 顆）；電子撞擊游離的斷法寫在 `XP.ei` 裡，沒有讀 `FRAG.apin`。
- 除錯用的 `window.GCMS`（見「網址參數與除錯」）。

## 2026-10-05：即時繪圖效能

- `frame()` → `step()` → `tick()`／`update3D()`／`G.composer.render()`；背景分頁略過，前景最高 60 FPS。
- `tick()` 中圖表由 `chartClock` 限制最高每秒 30 次；時間、成分、質譜、粒子和鏡頭的原本計算不改。`drawChrom()`、`drawOver()`、`drawMS()`、`drawOven()` 保留原資料與公式。
- `resize3D()` 同步 renderer 與 composer 的繪圖比例（`quality.pixelRatio(w, h, 1.75)`），再更新粒子尺寸；使用者沒動過鏡頭、不在飛行或導覽中時，順便把鏡頭放回預設視角。`quality.configure()` 設定陰影、MSAA 與 bloom，完整模式保留原後製。
- 畫質選單在 `.ctl`；手機和平板用原有的「設定」開啟控制面板。選單等 renderer 初始化後才啟用。
- 拆解由 `S.explode`、`S.explodeTarget` 與 `update3D()` 管理；不要因效能調整改寫 `rebuildColumn()` 的管柱位置。導覽由 `tourTick()`、`tourCamera()` 管理。

## 手機版的面板收合（2026-10-22）

- 共用的 `../assets/mobile-panels.js` 與 `../assets/mobile-panels.css`（用法寫在 js 檔開頭的註解）；在啟動段的 `buildTable()` 之後建立。本頁的面板排在 `.hud` 的格線裡，所以不用底部停靠區，細條直接插在面板裡。
- 判斷用 `(max-width: 760px), (max-height: 500px) and (max-width: 1180px)`：比其他教材多一個 1180 px 的上限，因為 1180 px 以上的控制面板不是「設定」那種彈出面板，「調整」細條打不開它。符合時 `<html>` 加上 `mp`，預設收起：
  - 說明 `#story`：細條「說明 · ＜說明的前兩行＞」插在說明框前面（`place: 'before'`，因為 `#story` 的內容整個會被換掉），往下展開；展開時細條不再重複那段字。
  - 主控台 `#console`：最上面兩條細條，「調整 · 追蹤成分、時間、升溫速率、組裝或拆開、重新進樣、導覽、動畫、原理說明、畫質」按了是打開原本的設定面板（`action`，等於按「設定」），「層析圖・質譜 · 示範精油 · HP-5MS · 升溫 ＜S.rate＞ °C/min」按了展開或收起圖；收起時「播放」鈕暫時搬到這條細條右邊（`keep`），不用展開也能播放或暫停。
- 格線：直拿（760 px 以下）時主控台的高度改成 `auto`，列是「細條、細條、252 px 的圖」，圖固定在第三列（`grid-row: 3`），導覽中細條藏起來時主控台才會和原本一樣高。收起時 3D 的區域（`#hole`）在 375×812 從約 300 px（說明較長時更少）長到約 450 px。
- 橫拿（761 到 1180 px；手機橫拿時網址列占掉一段，高度常常只剩 280 到 300 px）：`.brief` 變成最上面的一條，分頁列、讀值卡（每張 86 px 寬）與說明細條排成一列，標題省掉（分頁列上已經標出 GC-MS），說明展開時從這一條往下蓋在 3D 的左上角；主控台的兩條細條並排在最下面；中間整片是 3D（780×300 時 756×174）。頁尾的出處省掉。打開圖時（`html.mp:not(.mp-suspended) .hud:has(> .console.mp-open)`）主控台改放右半邊，層析圖與質譜用分頁切換（和直拿一樣），左半邊是 3D；高度 420 px 以下時打開的圖省掉圖例與總覽條（總覽條的跳時間可以改用拖曳層析圖），層析圖在 780×300 才有約 116 px 高；不支援 `:has()` 的瀏覽器維持上下排（圖會蓋住大半畫面，收起就好）。導覽中分頁列藏起來，上面一條是讀值與導覽列，講稿排在它下面一整行，3D 在左半邊、主控台在右半邊（圖例與總覽條省掉）。
- 直拿時標題改成一列（27/23 px）、讀值卡排成一列、導言不顯示。
- 導覽中（`suspended: () => tourOn()`）細條藏起來、說明與主控台照原本的方式出現，結束後回到原本的收合狀態。
- 直拿的觸控手機開頁 1.5 秒後提示一次「建議轉成橫式觀看」，位置在說明細條下方（`top: '.brief'`）。
- 3D 的取景本來就跟著 `#hole` 的大小（`updateViewOffset()` 的 ResizeObserver），收合不用另外處理。
- 桌機與平板不符合上面的判斷，不加任何 class，版面和以前相同；`scripts/check-mobile-panels.mjs` 檢查接線。

## 修改後要檢查

- 手機尺寸（390×844 與 844×390，觸控）：三條細條有名稱與內容說明、預設收起；「說明」展開說明框、「層析圖・質譜」展開圖、「調整」打開設定面板；收起時播放鈕在細條上；導覽中細條藏起來、主控台和原本一樣高，結束後回到原本的狀態；詳見 `docs/VALIDATION.md` 的「手機版面板收合」。
- 共用命令：`node scripts/check-site.mjs`（含分享預覽的 og 標籤）、`node scripts/check-render-quality.mjs`（含本頁 module 的語法）、`node scripts/check-camera-nav.mjs`、`node scripts/check-fields.mjs`（本頁載入 `analyzer-fields.js`）。
- 改了模型或條件：在主控台用 `GCMS.S.run` 核對 VALIDATION 的數值（流出時間、烷類、KI、Rs 的說明句），也核對 `chromatography/` 的 GC 數字；說明視窗與 INSTRUMENTS.md 的手寫數字一起改。
- HTTP 預覽打開 `gc-ms/`：自動進樣、播放與暫停、拆開與組裝、設定與鍵盤、各畫質、層析圖與質譜、390、768 px 與桌面寬度；console 沒有錯誤。
- 視角操作與 Q、R 等原有快捷鍵；點部件與標籤放大、放大鏡的開關、拖放大鏡與雙擊歸位。
- 導覽 8 站都走過；第 5、7、8 站沒有條紋，手機寬度第 5 站的離子源露在放大鏡旁邊。
- 四段動畫與各個入口、Esc 的順序。
- 詳細步驟與預期結果見 `../docs/VALIDATION.md` 的 gc-ms 一節。
