# LCQ 離子之旅:維護說明

## 2026-10-05：即時繪圖效能

- 共用 `../assets/render-quality.js` 加入自動/流暢/完整畫質；`fitToWindow()` 同步後製與解析度，`frame()` 上限 60 FPS 並略過背景分頁。`tick()` 的科學計算、固定子步、粒子數與導覽時間軸不改。
- `drawStab()` 把固定穩定區、格線與座標快取到 `stabBackground`，只在畫布尺寸或字型就緒時重畫。離子點、MS/MS 活化標記仍畫在即時圖層，不快取動態資料。
- `updatePanels()` 的圖表與對應 3D 螢幕貼圖最高每秒更新 30 次；模式變更、時間重設與匯出不受此限制。
- `exportVideo()` 明確啟用完整後製，維持原匯出尺寸、fps 與固定時間步；完成或失敗後由 `onResize()` 恢復畫質。浮動資訊框和錄影流程保留。
- 排錯可加 `?perf=1`，顯示實際繪圖裝置、FPS 與繪圖比例；無遙測上傳。不要把軟體繪圖環境的數字視為一般 GPU 的效能。

`lcq-3d/index.html` 是單一 HTML 檔,用 three.js 0.183.2(jsDelivr ES module,經 importmap 載入)繪圖,不需要建置。檔案由作者電腦上的原始碼片段串接而成,串接時保留了分區標記,在檔案裡搜尋 `// ==== ` 就能跳到各區。

**正本:** 儲存庫裡的 `lcq-3d/index.html` 是正本,其他電腦或 AI 直接修改這個檔即可。作者電腦上的原始碼片段專案不在儲存庫中;作者若改用原始碼重新產生,必須先把儲存庫裡的修改併回原始碼,避免覆蓋別人的變更。

## 分區與主要名稱

| 分區 | 內容 | 常改的地方 |
|---|---|---|
| `00_core.js` | 共用工具、可重現亂數 `RNG`、示範樣品 `SPECIES`、`PRODUCT`、離子阱參數 `TRAP`、軸線高度 `AX`、`mzColor()` | 離子阱數值、示範樣品與峰高 |
| `10_scene.js` | 算圖器、相機、`OrbitControls`、bloom 後製、燈光、房間與實驗桌、`consoleScreen()`、直式螢幕的 `fitFov()` | 燈光亮度、bloom 門檻、預設鏡頭 |
| `20_materials.js` | 材質 `MAT`、剖面用的 `CUTMAT`(黃銅色切面)、玻璃 `glassMaterial()`、旋轉體剖面 `solidOfRevolution()`、`ringSolid()`、`postTo()` | 金屬顏色、剖面樣式 |
| `30_instrument.js` | 零件登記 `comp(id, xA, xE)`(組裝與展開的 x 位置)、組裝位置 `LAY`、離子源、毛細管、管透鏡、截取錐、`multipole()`、`plateLens()`、離子阱雙曲面電極 `TRAPPARTS`、偵測器 `DET` | 零件尺寸、位置、展開距離 |
| `32_facility.js` | 三個真空區的玻璃 `MANI`、幫浦群組 `PUMPS`、注射幫浦與 PEEK 管 `updatePeek()`、機殼 `CAB` 與 `setCabinetOpen()` | 壓力分區、機殼外觀 |
| `40_particles.js` | 點粒子(`PN` 覆蓋混合給離子、`PA` 相加混合給電子與氣體)、液滴、`SIM` 狀態、`stepSpray()`、`stepTransit()`(`SEG_SPEED` 各段速度)、`stepTrap()`(長期振盪、氦氣冷卻、射出、CID)、`stepFly()`(打拿極與電子雪崩)、`drawParticles()` | 粒子數量、速度、亮度 |
| `50_cycle.js` | 掃描循環 `CY`、各階段 `SEQ`(Full MS 與 MS/MS)、`M` = 位於射出點的 m/z(與 RF 振幅成正比)、質譜峰 `SPEC`、滑桿手動掃描 `manualStep()` | 各階段時間、MS/MS 前驅與碎片 |
| `60_panels.js` | Mathieu 穩定圖 `STAB`(數值積分網格與 β 表)、`drawStab()`、`drawSpec()`、主控台調諧參數 `TUNE_ROWS` | 圖表樣式、調諧參數示例值 |
| `70_overlay.js` | 零件標籤 `addLabel()`、`drawLabels()`;錄影用的字幕 `drawCaption()`、示波窗 `drawScopes()`、標題 `drawBug()` 與註記 `drawNote()`(網頁上播放導覽時,字幕與示波窗改由 `91_float.js` 的 DOM 資訊框顯示) | 標籤文字與位置、影片版面 |
| `80_tour.js` | 鏡頭關鍵格 `SHOTS`([時間, 相機位置, 看向哪裡, 視角, 是否停住])、分段字幕 `SCENES`、各段幫浦與玻璃濃淡 `SCENE_FX`、儀器指令 `TOUR_ACTIONS`、總長 `TOUR_DUR`、`resetForTour()` | 字幕、運鏡、導覽長度 |
| `85_help.js` | 「原理」視窗內容 `HELP_HTML` | 原理說明與數值表 |
| `90_main.js` | 視圖狀態 `VS`、`applyLayout()`、左側說明文字 `PHASE_WHY` 與 `COMP_WHY`、介面綁定 `bindUI()`、點零件飛鏡頭 `focusOn()`、主迴圈 `tick()`、`renderScene()`、`frame()`、導覽中的畫面疊加 `drawUIOverlay()`、預跑 `prewarm()`、`boot()` | 說明卡文字、互動行為 |
| `91_float.js` | 可拖動、可縮放的資訊框:`makeFloating()`、`initFloating()`、`pinFloat()`、`clampFloat()`、`resetAllFloats()`;導覽字幕與示波窗的 DOM 更新 `updateTourDom()`、`clearTourDom()` | 資訊框預設位置、縮放範圍 |
| `95_export.js`、`96_recui.js` | 錄影 `exportVideo()` 與錄影視窗 | 錄影解析度、位元率 |

網站版專用的分頁列樣式在 `<style>` 最後一段,`#sitenav` 開頭。

## 座標、尺度與模型階層

- 場景單位約為 1 cm。x 軸是離子行進方向(離子源在 −x,偵測器在 +x),y 軸朝上,離子軸線在 `y = AX = 5`,z 軸朝向預設相機。
- 每個零件是 `comp(id, xA, xE)` 建立的 `THREE.Group`,原點在導軌中心線上;組裝時 x = `xA`(取自 `LAY`),展開時移到 `xE`。`applyLayout()` 依 `VS.explode` 在兩者之間內插,離子阱的端蓋與間隔環另外向兩側分開 1.0 與 0.5。
- 粒子路徑由 `updateKeys()` 每格從零件目前位置算出(`K.nodes`),所以展開時離子仍沿著零件走。
- 離子阱電極用實際尺寸(r₀ = 0.707、z₀ = 0.785)。毛細管長度、多極柱與偵測器的尺寸是示意;液滴大小、離子點大小、阱內振盪振幅與頻率都經過放大,時間也放慢(自動循環中 m/z 150 至 2000 的掃描約 6.5 秒,實機約 0.34 秒)。
- 剖面零件用 `solidOfRevolution()` 建立,切口固定朝向相機上方(`CUT_CENTER`),切面一律用黃銅色材質 `MAT.steelCut`。

## 資訊框:拖動與縮放

- 五個資訊框:標題與說明(`.side`)、控制面板(`.ctl`)、穩定圖(`#pStab`)、質譜(`#pSpec`)、導覽字幕(`#pCap`),由 `initFloating()` 註冊。
- 預設位置完全由 CSS 決定。使用者第一次拖動或縮放時,`pinFloat()` 把目前畫面上的位置寫成左上角座標 `{x, y, s, w}`,之後用行內樣式定位;縮放用 CSS 變數 `--fs`(0.5 至 2.2),原點用 `--to`,字幕置中用 `--tx`。
- 狀態存在這台瀏覽器的 `localStorage`(鍵名 `lcq3d-panels-v1`);無法使用儲存空間時只在這次瀏覽有效。工具列的「重設版面」(`#layoutBtn`)呼叫 `resetAllFloats()` 全部還原;雙擊某個資訊框上緣的把手只還原那一個。
- 拖動:框面或上緣把手(`.fp-grip`);按鈕、滑桿與輸入框不會觸發拖動。縮放:右下角(`.fp-size`)。鍵盤:把手獲得焦點時用方向鍵移動(Shift 一次 40 px),縮放鈕用 + 和 − 鍵。
- 視窗大小改變時,`clampFloat()` 把資訊框拉回畫面內,至少保留一角與上緣把手。

## 導覽流程

- 「播放導覽」或按 C:`startTour()` 先呼叫 `resetForTour()`(亂數種子 20261001,預跑 9 秒讓離子流穩定),之後每格 `tourStep()` 依時間執行 `TOUR_ACTIONS` 的儀器指令、依 `SHOTS` 內插相機(三次 Hermite,第 5 欄為 1 的關鍵格速度歸零)、依 `SCENES` 切換標籤、機身狀態與示波窗。
- 導覽時 `#app` 加上 `cine`:標題與說明隱藏,控制面板只留一列按鈕,穩定圖與質譜預設排在右側、字幕在下方中央;這些都還能拖動與縮放。窄螢幕(860 px 以下)示波窗預設縮成 0.62 倍,矮視窗(760 px 以下)縮成 0.8 倍。
- 網頁上的字幕與示波窗由 `updateTourDom()` 更新;錄影時不用 DOM,改由 `exportVideo()` 以固定版面把 `drawCaption()`、`drawScopes()` 畫進每一格,所以使用者調整的資訊框位置不影響影片。
- 再按一次、按 Esc 或播完:`stopTour()` 還原原本的掃描模式與機身狀態,`clearTourDom()` 收起字幕。

## 網址參數

- `?view=ext`、`?view=asm`、`?view=exp`:開啟時的機身狀態(外觀、組裝、展開)。
- `?tour`:開啟後直接播放導覽。
- 作者本機版另有自動錄影上傳參數,網站版不含。

## 連動關係

- 每格 `tick()` 依序更新導覽或視圖狀態、`applyLayout()` 移動零件、`cycleStep()` 決定閘門與 RF、`simStep()` 推進粒子,接著 `renderScene()` 畫出粒子與兩張示波圖。
- 離子的 q 值由 `qOf(mz) = TRAP.qEject × CY.M / mz` 算出;`CY.M` 一變,穩定圖上的點、阱內振盪頻率與射出時機一起變。
- 偵測器收到離子時呼叫 `SIM.detectHook()`,在質譜上閃一下;峰高本身來自 `SPEC` 的理想值,不是粒子計數。
- 導覽開始時 `resetForTour()` 固定亂數種子並預跑 9 秒,所以每次導覽與錄影的畫面都相同。

## 錄影

「錄成影片」逐格算圖,用 WebCodecs 的 H.264 編碼,再用 jsDelivr 上的 mp4-muxer 5.2.2 封裝成 MP4。只有支援 `VideoEncoder` 的瀏覽器會顯示這個按鈕(Chrome、Edge)。1080p、30 fps 全長 141 秒,一般筆電約 2 到 5 分鐘算完,檔案約 110 MB。錄好的影片不要提交進網站。

## 修改後的檢查

- 在網站根目錄執行 `node scripts/check-site.mjs`。
- 用 HTTP 預覽打開 `lcq-3d/`,確認畫面有動、console 沒有錯誤、分頁列能回到入口與其他教材,並在 390px、768px 與桌面寬度各看一次。
- 改了導覽時,按「播放導覽」從頭看到尾,確認字幕與鏡頭對得上。
- 改了資訊框時,在一般模式與導覽中各拖動、縮放一次,按「重設版面」確認回到預設位置;導覽中控制面板、示波窗與字幕不應重疊。
- 詳細步驟與預期結果見 [docs/VALIDATION.md](../docs/VALIDATION.md)。

## 設計取捨(可確認的部分)

- 離子用「覆蓋」混合而不是相加混合,避免上百顆離子疊在阱中心變成一團白光。
- bloom 門檻設在 1.45,金屬反光不會發光,只有離子、電子與指示燈會。
- 錄影逐格固定步長計算,電腦慢也不會掉格;導覽與錄影共用 `resetForTour()`,畫面可重現。
- 離子源畫成正交噴灑,依據是 LCQ Deca XP Plus 規格表;原始 Deca XP 與 XP MAX 的噴灑角度不同,未區分機型(見 INSTRUMENTS.md)。
