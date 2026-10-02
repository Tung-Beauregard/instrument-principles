# LCQ 離子之旅:維護說明

`lcq-3d/index.html` 是單一 HTML 檔,用 three.js 0.183.2(jsDelivr ES module,經 importmap 載入)繪圖,不需要建置。檔案由作者電腦上的原始碼片段串接而成,串接時保留了分區標記,在檔案裡搜尋 `// ==== ` 就能跳到各區。直接修改這個檔即可;若之後改用原始碼重新產生,記得先把這裡的修改併回原始碼,避免被覆蓋。

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
| `70_overlay.js` | 零件標籤 `addLabel()`、`drawLabels()`、字幕 `drawCaption()`、導覽用的示波窗 `drawScopes()` | 標籤文字與位置 |
| `80_tour.js` | 鏡頭關鍵格 `SHOTS`([時間, 相機位置, 看向哪裡, 視角, 是否停住])、分段字幕 `SCENES`、各段幫浦與玻璃濃淡 `SCENE_FX`、儀器指令 `TOUR_ACTIONS`、總長 `TOUR_DUR`、`resetForTour()` | 字幕、運鏡、導覽長度 |
| `85_help.js` | 「原理」視窗內容 `HELP_HTML` | 原理說明與數值表 |
| `90_main.js` | 視圖狀態 `VS`、`applyLayout()`、左側說明文字 `PHASE_WHY` 與 `COMP_WHY`、介面綁定 `bindUI()`、點零件飛鏡頭 `focusOn()`、主迴圈 `tick()`、`renderScene()`、`frame()`、`boot()` | 說明卡文字、互動行為 |
| `95_export.js`、`96_recui.js` | 錄影 `exportVideo()` 與錄影視窗 | 錄影解析度、位元率 |

網站版專用的分頁列樣式在 `<style>` 最後一段,`#sitenav` 開頭。

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
