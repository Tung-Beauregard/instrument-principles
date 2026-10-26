# 族群遺傳與產地鑑定:維護說明

`population-genetics/` 是「生化進階」分區的動畫教材(2026-10-27 建立):從一棵棵樹的 SSR 基因型算出等位基因頻率,接著是哈溫平衡與近親係數 F、Ho 比 He 少的三種原因、Fst 與基因流、STRUCTURE 分群與 ΔK,最後用指派檢定與排除檢定推回查獲木材的產區,並以紅檜與桃花心木的研究說明產地鑑定的實務限制。基礎教材是 `dna-markers/`(DNA 鑑定:SSR、基因型、DNA 指紋)。播放器、畫圖工具與版面是共用檔,這一頁只提供章節、控制項、示意資料的產生與計算。純 HTML、CSS 與 ES module,不需要建置,不連外部服務,不使用到站人數計數。

## 檔案與分工

| 檔案 | 內容 | 常改的地方 |
|---|---|---|
| `population-genetics/index.html` | head 的 meta 與 og 標籤、分頁列(暫時只有「← 儀器入口」與本頁,統整時換成整區的分頁列)、標題與導言、播放器的 DOM(`.player`、`.screen`、`#stage`、`.cap`、`.bar`、`#btnFs`)、右欄(`#ops`、`#chapters`)、重點整理(最前面一行「先看:」連到 `../dna-markers/`)與資料來源;頁面程式全部在最後的 `<script type="module">` | 文字、章節、示意資料的種子與參數 |
| `../assets/bio-lesson.js`、`../assets/bio-draw.js`、`../assets/bio-lesson.css`、`../assets/mobile-panels.*` | 共用播放器、畫圖工具、版面、全螢幕與轉向提示。**不要在這裡改**,需要時寫在回報給統整的人 | 不改 |
| `../assets/population-genetics.svg` | 入口卡片的概念圖(440 × 260):三群針葉樹各圍一圈、木材以虛線箭頭指回其中一群、底下是依三群比例上色的長條 | 改圖 |
| `../assets/og/population-genetics.jpg` | 分享預覽圖,由 `scripts/make-og-images.mjs` 產生(統整時處理) | 重產,不手動改 |

## 程式結構(`index.html` 的 module)

畫布一律用邏輯座標 960 × 540(`createLesson` 等比例縮放;手機上 `g.boost` 會把字放大到最多 1.3 倍,版面要留空間)。每一章是 `{ key, name, dur, cues, draw(g, t, S) }`,第 2 章與第 7 章另有 `enter()`。所有畫面都由這一章的秒數 `t` 與控制項 `S` 推出來,拖進度列、跳章都會畫出正確的畫面。

由上到下:

1. **共用小工具**:`sup`、`fx`(固定位數、負號換成 −)、`fade`、`POPCOL`(A 到 E 區的顏色)、`ALC`(等位基因的顏色)、`conifer`、`timber`(照 `dna-markers/` 的畫法)、`chip`(產區的小標籤,色塊上一定寫「A 區」這類字)、`pie`。
2. **亂數與分布**:`srng(seed)`(bio-draw 的 `rng` 是 xorshift,相鄰種子前幾個數很像,所以先乘 2654435761 打散、丟掉前 24 個)、`normal`、`gamma`(Marsaglia 與 Tsang)、`dirichlet`、`beta`、`binom`(逐個抽)、`driftFrom`(Balding–Nichols 模型)、`pick`、`het`(He = 1 − Σp²)。
3. **示意資料**:`NL = 12` 個位點、`KA` 每個位點的等位基因數、`bpOf` 長度;`POP`(五個產區的「真正」頻率,種子 `POP_SEED = 213`);`REF`(A 到 D 各 25 棵的參考樣本,種子 `REF_SEED = 1213`;D 區最後兩棵是從 A 移入的一棵與 A × D 混血一棵);`COUNTS`(參考樣本的等位基因計數)、`SEEN`(參考樣本出現過的等位基因)、`hsht`(一組族群的 Hs 與 Ht)。
4. **各章的資料與計算**:第 1 章 `TL`、`TREES`;第 3 章 `F_SELF`、`wahlundF`、`nullF`、`NULL_R`、`DEFICIT`;第 4 章 `PBAR`、`DELTA`、`twoPops`、`HUANG_AREAS`、`HUANG_FST`;第 5 章 `ISL`、`NMS`、`islandOf`;第 6 章 `ALL`、`GI`、`admix`、`runAdmix`、`structureOf`、`LNPD`、`DELTAK`;第 7 章 `kOf`、`locusLog`、`logL`、`scores`、`simOf`、`pOf`、`WOODS`;第 8 章 `HUANG_ASSIGN`。
5. **`chapters`**:8 章。`touchedF`、`touchedLoci`:這一章動過 F 或位點數之後,改用控制項的值,不再跑開場的漸變(`enter()` 進章時歸零)。
6. **`createLesson(...)`**,最後是閒置時的預先計算:`jobs` 依序做 K = 3、2、4、5 各 3 次 EM(`runAdmix`)、四區的排除檢定模擬(`simOf`)、四種 Nm 的島嶼模擬(`islandOf`),每 30 毫秒做一件。還沒做完就進到該章時,`structureOf`、`simOf`、`islandOf` 會當場算(桌機約 0.1 秒),結果都有快取。

顏色慣例:產區 A 薄荷綠、B 琥珀、C 藍、D 淡紫、E(沒取樣)紅;排除或不符用紅、通過用薄荷綠;重要的數字一律另外寫字。第 6 章長條的顏色是推出來的「群」,不是取樣地點:每一群配上它平均比例最高的那一區的顏色(一區只用一次),多出來的群用紅與橘;取樣地點在長條下面只寫字。

## 章節(`key` 也是網址 `#key`,改名會讓分享的連結失效)

| # | key | 秒數 | 字幕時間 | 畫面 |
|---|---|---|---|---|
| 1 | `frequency` | 15 | 0、4.5、9.5 | 左:A 區的 N 棵樹(`S.n`),每棵兩個等位基因的色點(10 棵以下另寫長度,100 棵時改成小方塊)。4.5 到 8.5 秒逐棵數過去(圈出目前那一棵,沒數到的變暗),右上的頻率長條跟著長高;9.6 秒起加上 95% 誤差棒(±1.96 × √(p(1 − p)/2N))與紅虛線的族群真值。右下:2N、He = 1 − Σp²、乘 2N/(2N − 1) 的修正與族群真值 |
| 2 | `hardy-weinberg` | 16 | 0、4.5、9、13 | 左上:邊長 p 與 q 的配子組合方塊(AA、Aa、aA、aa 的面積);左下:三種基因型的比例,虛線框是哈溫平衡、實心是有 F 時;右上:p²、2pq、q² 對 p 的曲線(4.5 到 7.5 秒畫出),F > 0 時加虛線的 p² + Fpq、2pq(1 − F)、q² + Fpq,並在目前的 p 畫點;右下:He、Ho、F = 1 − Ho/He。F 在 9 到 11 秒由 0 漸變到 `S.f`(動過 F 之後直接用 `S.f`) |
| 3 | `deficit` | 16 | 0、4、8、12 | 上:紅檜的實例(F 0.13 到 0.24、36 個位點 23 個偏離哈溫平衡)。三個面板依字幕時間亮起:近親交配(自交比例 1/3,8 個位點 F 都是 0.2)、兩群混在一起算(A 與 D 各半,F 依位點不同)、無效等位基因(位點 3 與 6 的 r = 0.15、0.25,只有這兩個位點高);各面板下方一句判讀,13.5 秒起最下面一行總結 |
| 4 | `fst` | 16 | 0、4.5、9、12.5 | 左上:兩個族群在一個位點的頻率長條(`twoPops(S.d)`),4.5 秒起畫出平均頻率的虛線;右上:Hs、Ht、Fst 的算式與「Ht 拆成族群之內與族群之間」的長條;左下(9 秒起):紅檜 4 區兩兩的 Fst(下三角);右下(12.6 秒起):Weir 與 Cockerham 的 θ |
| 5 | `gene-flow` | 17 | 0、4.5、9.5、13.5 | 左:8 個族群圍著移入池,圓餅是追蹤的那一個位點的頻率,琥珀色小點示意移入(數量隨 Nm);世代 1.2 到 12.5 秒從 0 走到 150。右上:Fst 對世代(其他 Nm 是灰線),4.6 秒起畫 1/(4Nm + 1) 的虛線;右下(9.6 秒起):由 Fst 反推 Nm 與紅檜的兩個例子,13.6 秒起寫「假設很少成立」 |
| 6 | `structure` | 18 | 0、4.5、9.5、14 | 上:100 棵樹的長條圖(0.4 到 4 秒由左往右出現),依 A、B、C、D 分區,D 區最後兩棵標「從 A 移入」與「混血」(5.5 秒起);左下(9.4 秒起):每個 K 跑 10 次的 ln P(D) 與平均線;右下(11 秒起):ΔK,標出最大的 K;14.2 秒起右上寫紅檜的結果 |
| 7 | `assignment` | 18 | 0、4.5、9.5、13.5 | 左:選的木材與 12 個位點的基因型,沒用到的位點變暗;位點數在 3.5 到 8.5 秒由 1 長到 `S.loci`(動過位點數之後直接用)。右上:四區的 log₁₀ 概似值,9.5 秒起加上相對分數長條;下(13.6 秒起):四區各自 1,000 個模擬個體的 log₁₀ 概似值直方圖、木材的位置(紅線是排除)、p 值與「排除 / 不能排除」,最下面一句結論 |
| 8 | `forensics` | 16 | 0、4、8.5、12.5 | 左上(3.8 秒起):紅檜 4 區的自我指派長條(GW 用琥珀色)與全部 81/92;左下(12.6 秒起):桃花心木的研究;右:四張檢查清單卡片依字幕時間出現(參考族群、位點數、木材 DNA、結論的寫法) |

全部 132 秒。播完最後一章會停住;在某一章動過控制項,那一章播完也會停住(播放器的行為)。

## 控制項

全部 `restart: false`:改了值畫面立刻更新。

| id | 標籤 | 種類 | 章 | 預設 | 效果 |
|---|---|---|---|---|---|
| `n` | 取樣棵數 N | seg 5/10/30/100 | `frequency` | 30 | 用 `TREES` 的前 N 棵:樹的排列、頻率長條、誤差棒寬度、He 與修正值 |
| `p` | 等位基因 A 的頻率 p | range 0.05 到 0.95 | `hardy-weinberg` | 0.6 | 方塊的邊長、曲線上的點、三種基因型的比例、He、Ho |
| `f` | 近親係數 F | range 0 到 1 | `hardy-weinberg` | 0.2 | 虛線曲線、實心長條、Ho 與 F;動過以後不再跑 9 到 11 秒的漸變(`touchedF`) |
| `d` | 兩群的差異 | range 0 到 1 | `fst` | 0.6 | `twoPops(d)` 的兩群頻率、He₁、He₂、Hs、Fst 與拆開的長條(Ht 不變) |
| `nm` | 每代移入數 Nm | seg 0.1/1/4/10 | `gene-flow` | 1 | 選哪一組島嶼模擬(`islandOf`)、平衡線 1/(4Nm + 1)、移入小點的數量 |
| `k` | 群數 K | seg 2/3/4/5 | `structure` | 3 | 長條圖用哪一個 K 的 EM 結果(`structureOf`);ln P(D) 與 ΔK 的圖不變 |
| `wood` | 查獲的木材 | seg 木材 1/2/3 | `assignment` | 木材 1 | 換基因型(`WOODS`),全部數字、直方圖位置與結論跟著變 |
| `loci` | 使用的位點數 | range 1 到 12 | `assignment` | 12 | 只用前 n 個位點算概似值與排除檢定;動過以後不再跑 3.5 到 8.5 秒的漸增(`touchedLoci`) |

`deficit` 與 `forensics` 兩章沒有控制項,右欄的「自己調整」會整個藏起來。測試或除錯可以用 `__lesson.go('assignment')`、`__lesson.set('wood', 2)`、`__lesson.time = 17.9`、`__lesson.redraw()`(`set` 會觸發 `onChange`,等同動過控制項)。

## 計算模型與公式

- **頻率與異質度(第 1 章)**:p = 次數 ÷ 2N;He = 1 − Σp²;樣本的 He 期望值偏低 (2N − 1)/2N 倍,所以乘 2N/(2N − 1);誤差棒是二項分布的常態近似 ±1.96 × √(p(1 − p)/2N)(只為了顯示,頂端超過 0.8 時截在圖框)。
- **哈溫平衡與近親(第 2 章)**:AA = p² + Fpq、Aa = 2pq(1 − F)、aa = q² + Fpq;F = 1 − Ho/He。
- **三種原因(第 3 章,期望值、沒有取樣誤差)**:部分自交平衡時 F = s/(2 − s),s = 1/3 得 0.2;兩群各半混在一起時,各自符合哈溫平衡,所以 Ho = Hs,而期望值用合併頻率,F = (Ht − Hs)/Ht(等於這兩群之間的 Fst);無效等位基因 r:真正的頻率是看得到的等位基因各乘 (1 − r),null/null 沒有訊號當成缺值、a/null 看起來像 a/a,由基因型列舉算出表面上的 Ho 與 He(結果剛好等於 2r/(1 + r))。
- **Fst(第 4 章)**:Hs = 各族群 He 的平均,Ht = 平均頻率的 He,Fst = (Ht − Hs)/Ht。`twoPops(d)` 是 p̄ ± d × Δ,所以 Ht 固定為 0.775、Fst = 0.1536 d² ÷ 0.775 ≈ 0.198 d²。
- **島嶼模型(第 5 章)**:8 個族群、每個 N = 25 棵(2N = 50 個基因)、40 個兩對偶的位點;起點每個位點祖先頻率 0.2 到 0.8、各族群以 Beta(p₀(1 − F₀)/F₀, (1 − p₀)(1 − F₀)/F₀) 抽(F₀ = 0.3);每代先移入 p ← (1 − m)p + m × p̄(m = Nm/N,移入池是全部族群的平均,包含自己),再二項抽樣漂變。Fst = Σ 族群間變方 ÷ Σ p̄(1 − p̄)(兩對偶時就是 (Ht − Hs)/Ht)。島上畫的是 Σ p̄(1 − p̄) 最大(整段時間最有變化)的那一個位點。反推 Nm = (1/Fst − 1) ÷ 4。
- **分群(第 6 章)**:STRUCTURE 的混合模型(每棵樹 K 個比例 q,每群在每個位點一套頻率,每個等位基因先依 q 選群、再依該群頻率抽出),這裡用 EM 求最大概似:E 步算每個等位基因來自各群的機率,M 步更新 q(除以 2 × 位點數)與各群頻率(加 0.01 的偽計數);最多 800 次、對數概似進步小於 10⁻⁵ 就停;每個 K 從 3 個亂數起點各跑一次,取概似最高的。這不是 STRUCTURE 的 MCMC,沒有先驗、沒有相關頻率模型,只用來畫示意資料的長條。
- **ΔK(第 6 章)**:`LNPD` 是每個 K 10 次的示意值;ΔK = |L(K+1) − 2L(K) + L(K−1)| ÷ sd(L(K)),L 是各次平均、sd 是樣本標準差(除以 n − 1),照 Structure Harvester 的程式;K = 1 與最大的 K 算不出來。
- **指派(第 7 章)**:Rannala 與 Mountain(1997)式 9,先驗 Dirichlet(1/k)(k 是參考樣本加上這件木材出現過的等位基因種類):同型 hh 是 (n_h + 1/k)(n_h + 1 + 1/k) ÷ ((n + 2)(n + 1)),異型 hg 是 2(n_h + 1/k)(n_g + 1/k) ÷ ((n + 2)(n + 1));位點相乘(log₁₀ 相加)。相對分數 = 各區概似值 ÷ 四區總和。
- **排除(第 7 章)**:每區用 (n_h + 1/k)/(n + 1) 的頻率模擬 1,000 個個體(種子 9000 起),算它們在同一區的 log₁₀ 概似值;p = 模擬值 ≤ 木材值的比例,p < 0.01 排除。這是 Cornuet 等(1999)排除檢定的簡化版,GeneClass2 的預設也是 1,000 個個體、α = 0.01,但它的重抽方法(例如 Paetkau 等 2004)和這裡不完全一樣。

## 數值:有出處的與示意的

有出處(來源見下一節):

- 紅檜(Huang 2022):4 區 92 棵(MM 西南 20、HV 西北 25、GW 西北 23、SY 東部 24)、36 個 SSR;各區 Fis 0.132 到 0.242(平均 0.200),Fis = 1 − Ho/He;36 個位點有 23 個偏離哈溫平衡(P < 0.001),作者的解釋是人為選擇、非隨機交配或遺傳漂變;兩兩 Fst 0.035(HV–GW)到 0.074(MM–HV),Nm 3.141 到 6.832;STRUCTURE K = 1 到 5、每個 K 20 次,用 Structure Harvester 的 ΔK 選 K = 3(SY、MM、HV 與 GW 同一群);GeneClass 2.0 自我指派 MM 19/20、HV 22/25、GW 16/23、SY 24/24,全部 81/92 = 88.0%;GW 有 4 棵被判到 HV、3 棵被判到 MM,作者說 GW 位在 HV 與 MM 之間。
- 頁面驗算:紅檜的 Nm 和 (1/Fst − 1) ÷ 4 一致(0.074 → 3.128,論文 3.141;0.059 → 3.987,論文 4.022;0.062 → 3.782,論文 3.798;0.035 → 6.893,論文 6.832;0.065 → 3.596,論文 3.603;0.056 → 4.214,論文 4.199),差別來自 Fst 只印到小數 3 位。這是計算推估,論文沒有寫出換算式。
- 臺灣扁柏(Huang 2020):乾燥木材 22 件 7 件驗出(31.81%),每件要抽兩次以上。
- 桃花心木(Degen 2013):31 個林分、1,971 棵、6 個核 SSR、145 個等位基因,遺傳距離與地理距離 r = 0.82,兩批木材以貝氏指派檢定都指派回正確國家。
- 每族群 25 到 30 個(Hale 2012,兩種鳥、一種哺乳類、一種昆蟲的資料);約 10 個位點、每區 30 到 50 個、Fst 約 0.1 時貝氏法可接近全對(Cornuet 1999 的摘要);GeneClass2 預設 1,000 個模擬個體、α = 0.01(說明文件);用 ΔK 的研究 54%(443/822)選出 K = 2,沒用的 21%(82/386)(Janes 2017 的摘要)。

示意(畫面與「資料來源」最後一條都有標):

- 五個產區的頻率(`POP`)、參考樣本(`REF`)、移入與混血的兩棵、三件木材(`WOODS`,種子 31、34、638)、第 1 章的 100 棵樹(種子 77)。樣本算出的兩兩 Fst:A–B 0.084、A–C 0.126、A–D 0.082、B–C 0.035、B–D 0.060、C–D 0.083(族群真值 0.077、0.103、0.081、0.030、0.067、0.081),刻意讓 B、C 最像,範圍接近紅檜的 0.035 到 0.074。種子是在幾百組裡挑的:要 B–C 最小而且其他兩兩落在 0.055 到 0.105、木材 1 在 12 個位點清楚指向 A、木材 2 在 B 與 C 之間搖擺、木材 3 分數高卻被排除;計算本身沒有調整。
- 第 3 章:自交比例 1/3、A 與 D 各半混合、位點 3 與 6 的無效等位基因頻率 0.15 與 0.25。
- 第 4 章兩群的頻率(`PBAR`、`DELTA`)與長度 152 到 168 bp。
- 第 5 章島嶼模擬的族群數、大小、位點數、起始 Fst 0.3 與種子。
- 第 6 章每個 K 的 ln P(D)(`LNPD`,平均 −2940、−2700、−2520、−2508、−2503、−2501,標準差 0.4、1.5、2.2、8、14、21,再加亂數),形狀照 STRUCTURE 常見的輸出;長條是 EM 對示意資料算的。
- 等位基因長度(`BP0`、`BPS`)。

用 node 驗算過的值(把 module 的模型部分抽出來跑,和寫頁面前的原型一致):

- 自我指派(留一法、12 個位點):A 25/25、B 20/25、C 21/25、D 22/25。
- 木材 1:1 個位點 D 56.4%、A 42.1%;12 個位點 A 100.0%(log₁₀ −8.98,p = 0.434),B、C、D p < 0.001。木材 2:3 個與 6 個位點 B 與 C 約各半;12 個位點 C 85.2%、B 14.8%(p 0.137 與 0.156,都不能排除),A、D p < 0.001。木材 3:8 個位點 A 100%、p = 0.128(不能排除);12 個位點 A 100%、p = 0.003,四區都排除。
- 手算一個位點:木材 1 位點 1,A 區計數 10、4、13、0、1、22(n = 50、k = 5),異型 2 × 13.2 × 22.2 ÷ (52 × 51) = 0.220995,和頁面一致(只用 2pq 是 0.2288)。
- 第 3 章:Wahlund 各位點 F 0.028、0.045、0.242、0.029、0.175、0.010、0.070、0.097;無效等位基因 0.261、0.400(= 2r/(1 + r))。
- 第 6 章:ln P(D) 平均 −2940.1、−2701.0、−2520.1、−2508.4、−2500.8、−2488.3,ΔK(2) 52.4、ΔK(3) 95.8、ΔK(4) 0.6、ΔK(5) 0.3。K = 3 時 A 區平均 0.88、B 與 C 同一群(0.72、0.88)、D 0.89;移入的那棵 0.88 屬 A 群,混血 0.58 / 0.42。
- 第 5 章:第 100 到 150 代的平均 Fst,Nm 0.1、1、4、10 分別是 0.707、0.183、0.060、0.027,對照 1/(4Nm + 1) 的 0.714、0.200、0.059、0.024。
- 第 1 章:N = 5、10、30、100 的 He 0.460、0.625、0.731、0.720,修正後 0.511、0.658、0.743、0.724;族群真值 0.714。
- 第 4 章:d = 0、0.3、0.6、1 的 Fst 0、0.018、0.071、0.198。

## 科學內容的來源

- Huang CJ, et al. 2022. SSR individual identification system construction and population genetics analysis for *Chamaecyparis formosensis*. Sci Rep 12:4126. https://pmc.ncbi.nlm.nih.gov/articles/PMC8904461/ (Table 4 各區 Ho、He、Fis;Table 5 兩兩 Fst 與 Nm;Fig. 3 與 STRUCTURE 一段;Table 6 GeneClass 自我指派)
- Huang CJ, et al. 2020. Development and technical application of SSR-based individual identification system for *Chamaecyparis taiwanensis* against illegal logging convictions. Sci Rep 10:22095. https://pmc.ncbi.nlm.nih.gov/articles/PMC7744516/ (乾燥木材 7/22;這篇只做個體比對,沒有做產地推論)
- Holsinger KE, Weir BS. 2009. Genetics in geographically structured populations: defining, estimating and interpreting FST. Nat Rev Genet 10:639–650. https://pmc.ncbi.nlm.nih.gov/articles/PMC4687486/ ((1 − F) = (1 − f)(1 − θ);島嶼模型 Fst ≈ 1/(4Nₑm + 1) 與它的限制;距離隔離的迴歸;一般研究用 θ 比較合適)
- Holsinger KE. EEB 5348 Population Genetics 講義(CC BY 4.0):https://darwin.eeb.uconn.edu/eeb348-notes/inbreeding.pdf (p² + fpq、2pq(1 − f)、f = 1 − Ho/He、部分自交平衡值)、https://darwin.eeb.uconn.edu/eeb348-notes/genetic-structure.pdf (Wahlund 效應:異型合子少 2Var(p);Fst = Var(p)/p̄q̄ = (Ht − Hs)/Ht;1 − Fit = (1 − Fis)(1 − Fst);樣本 He 的期望值乘 (n − 1)/n;θ 納入 Gst 忽略的取樣誤差)
- Weir BS, Cockerham CC. 1984. Estimating F-statistics for the analysis of population structure. Evolution 38:1358–1370. https://doi.org/10.1111/j.1558-5646.1984.tb05657.x (只引用,沒有在頁面計算 θ)
- Whitlock MC, McCauley DE. 1999. Indirect measures of gene flow and migration: FST ≠ 1/(4Nm+1). Heredity 82:117–125(島嶼模型的假設、Fst 對 Nm 是非線性,誤差會放大;內容由課程摘要與他文引述確認)
- Pritchard JK, Stephens M, Donnelly P. 2000. Inference of population structure using multilocus genotype data. Genetics 155:945–959. https://pmc.ncbi.nlm.nih.gov/articles/PMC1461096/ (摘要)
- Pritchard JK, Wen X, Falush D. 2010. Documentation for structure software: Version 2.3. https://web.stanford.edu/group/pritchardlab/structure_software/release_versions/v2.3.4/structure_doc.pdf (第 1 節:K 群、群內哈溫平衡與連鎖平衡、可指派到兩群以上;3.1 節混合模型與 q;第 5 節:K 的估計只是近似、生物學解釋不一定直接、選能說明主要結構的最小 K;5.2 節近親與無效等位基因會讓 K 高估;5.4 節距離隔離)
- Evanno G, Regnaut S, Goudet J. 2005. Detecting the number of clusters of individuals using the software STRUCTURE: a simulation study. Mol Ecol 14:2611–2620. https://doi.org/10.1111/j.1365-294X.2005.02553.x (ΔK;全文沒有讀到,算法依 Structure Harvester)
- Earl DA, vonHoldt BM. 2012. STRUCTURE HARVESTER. Conserv Genet Resour 4:359–361;程式 https://github.com/dentearl/structureHarvester (`harvesterCore.py` 的 ΔK 算法)
- Janes JK, et al. 2017. The K = 2 conundrum. Mol Ecol 26:3594–3602. https://doi.org/10.1111/mec.14187 (摘要)
- Rannala B, Mountain JL. 1997. Detecting immigration by using multilocus genotypes. PNAS 94:9197–9201. https://pmc.ncbi.nlm.nih.gov/articles/PMC23111/ (式 1 先驗 Dirichlet(1/k)、式 6、式 9、式 10)
- Cornuet JM, et al. 1999. New methods employing multilocus genotypes to select or exclude populations as origins of individuals. Genetics 153:1989–2000(摘要)
- Piry S, et al. 2004. GeneClass2. J Hered 95:536–539;說明文件 https://www1.montpellier.inrae.fr/CBGP/software/GeneClass/GeneClass2/Help.pdf (準則、Monte Carlo 重抽、預設 1,000 個模擬個體與 α = 0.01、分數)
- Chapuis MP, Estoup A. 2007. Microsatellite null alleles and estimation of population differentiation. Mol Biol Evol 24:621–631. https://academic.oup.com/mbe/article/24/3/621/1246960 (無效等位基因來自引子黏合區的變異;要先排除 Wahlund 效應等其他原因;族群分化明顯時會高估 Fst)
- Van Oosterhout C, Weetman D, Hutchinson WF. 2006. Estimation and adjustment of microsatellite null alleles in nonequilibrium populations. Mol Ecol Notes 6:255–256. https://assets.uea.ac.uk/f/185167/x/3d0a8c7abd/van-oosterhout-et-al-2006-men.pdf (多個不連鎖位點的 Fis 可以分開無效等位基因與近親)
- Hale ML, Burg TM, Steeves TE. 2012. Sampling for microsatellite-based population genetic studies: 25 to 30 individuals per population is enough to accurately estimate allele frequencies. PLoS ONE 7:e45170. https://pmc.ncbi.nlm.nih.gov/articles/PMC3440332/
- Degen B, et al. 2013. Verifying the geographic origin of mahogany (*Swietenia macrophylla* King) with DNA-fingerprints. Forensic Sci Int Genet 7:55–62. https://doi.org/10.1016/j.fsigen.2012.06.003 (摘要)
- Dormontt EE, et al. 2015. Forensic timber identification: It's time to integrate disciplines to combat illegal logging. Biol Conserv 191:790–798. https://doi.org/10.1016/j.biocon.2015.06.038 (摘要)
- Rousset F. 1997. Genetic differentiation and estimation of gene flow from F-statistics under isolation by distance. Genetics 145:1219–1228. https://pmc.ncbi.nlm.nih.gov/articles/PMC1207888/ (字幕提到距離隔離時的依據;頁面沒有畫)

頁面「資料來源」列 7 條加 1 條示意說明;完整清單在 `INSTRUMENTS.md` 的這一節。

## 修改時要注意

- **改 `POP_SEED`、`REF_SEED` 或任何產生示意資料的參數**:所有數字都會變。改完要重跑上面的驗算,確認 B、C 仍然最像、紅檜範圍附近的 Fst、三件木材仍然呈現「清楚指派」「相鄰兩區分不開」「分數高卻被排除」三種情況,並更新本檔與 `INSTRUMENTS.md` 的數字。
- **改 `admix`**:K = 2 到 5 的長條都要重看;K 大於真正群數時的分法本來就不穩定,畫面只呈現「多出來的群沒有清楚對應」。
- **改 `LNPD`**:ΔK 的峰值要留在 K = 3,字幕與右上的「紅檜 4 區:ΔK 選 K = 3」才對得上。
- **改第 7 章的公式**:`locusLog` 與 `simOf` 要用同一套頻率與先驗,排除檢定才有意義;`kOf` 要把木材自己的等位基因算進種類數。
- 加字時注意手機的 1.3 倍放大:重要的字 15 到 20 px、次要至少 13 px;同一列的兩段字之間留三成以上的空間。
- 文字用半形 `,` `:` `;` `()`、全形「。」「、」「」;不要用破折號;不寫空泛的「可能」「探索」(指派結果寫「機率最高」)。文獻依整區的規則寫第一作者加 et al.,不寫研究室或老師的名字。

## 修改後要檢查

1. 語法:把 `<script type="module">` 抽成 .mjs,跑 `node --check`。
2. 驗算:把 module 的「共用小工具」到 `const chapters` 之前這一段抽出來,在 node 裡匯入 bio-draw 的 `rng` 後執行,對照上面的數字(自我指派、三件木材、ΔK、島嶼模擬、第 1、3、4 章)。
3. 截圖:每一章 0.35、0.75、1 倍時間點(742 × 298)與 1280 × 800、384 × 686 的整頁;另外對每個控制項的幾個值截圖(N = 5、100;p = 0.1、F = 1;d = 0、1;Nm = 0.1、10;K = 2、4、5;三件木材配 1、6、8、12 個位點)。看:主控台沒有錯誤、字沒有疊在一起、沒有東西超出畫面。
4. 控制項只在對應的章出現(`deficit` 與 `forensics` 沒有控制項);鍵盤左右鍵換章、網址 `#structure` 這類可以直接打開那一章。
5. 統整進入口與清單後:`node scripts/check-bio.mjs`、`node scripts/check-site.mjs`。

## 已知限制與待確認

- 第 6 章用 EM 求混合模型的最大概似,不是 STRUCTURE 的 MCMC;ln P(D) 是示意值,沒有由資料算出,ΔK 只有公式是真的。
- 排除檢定的模擬是簡化版(從加了先驗的頻率抽個體),和 GeneClass2 的重抽演算法不完全相同;Weir 與 Cockerham 的 θ 只在字幕與畫面提到,頁面算的是 (Ht − Hs)/Ht。
- 島嶼模擬只有 8 個族群、移入池包含自己,所以平衡值和無限多島嶼的 1/(4Nm + 1) 略有差距(Nm = 1 時 0.183 對 0.200)。
- 距離隔離只在字幕提到,沒有模擬;桃花心木的 r = 0.82 是遺傳距離與地理距離的相關。
- Huang 2022 的摘要寫自我指派 88.44%,Table 6 與內文是 88.04%(81/92),頁面用 81/92;內文寫 GW 與 HV 的 Nm 是 6.382,Table 5 是 6.832,頁面用表格的值。
- Evanno 2005、Paetkau 1995、Manel 2005 的全文沒有讀到;ΔK 的算法依 Structure Harvester 的程式與 STRUCTURE 說明文件。Cornuet 1999、Janes 2017、Degen 2013、Dormontt 2015 只讀到摘要。Whitlock 與 McCauley 1999 的內容由課程摘要與他文引述確認。
- Hale 2012 的資料是兩種鳥、一種哺乳類與一種昆蟲,不是樹;頁面只引用「每族群 25 到 30 個」的結論。
