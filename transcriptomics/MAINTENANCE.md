# 轉錄體分析:維護說明

`transcriptomics/` 是生化進階分區的一份 2D 動畫教材(2026-10-27 建立):RNA-seq 資料從 FASTQ 與 Phred 品質分數、修剪接頭,到有參考基因體時的跨內含子比對、沒有參考基因體時的從頭組裝(k-mer 與 de Bruijn 圖),再到 RPKM、TPM、DESeq2 的 size factor、生物重複與負二項變異、Benjamini–Hochberg 校正與火山圖,最後用 BLAST、Pfam 結構域、讀框與萜類含量挑出萜類合成酶候選。共 8 章,138 秒,每章有字幕,每一章都有可以自己調的控制項。讀者設定為做過 GC-MS、LC-MS 的大學部高年級與研究生,假設看過 `../sequencing/`(DNA 定序)與 `../terpene-synthase/`(萜類合成酶)。

純 HTML 與 ES module,沒有外部依賴、不需要建置。播放器、畫圖小工具與版面是生化原理分區共用的檔案,這份教材只提供章節與控制項。所有數字都在瀏覽器裡用固定亂數種子產生、照公式算出來(載入時約 40 毫秒),不是寫死的結果。

## 檔案與分工

| 檔案 | 內容 | 常改的地方 |
|---|---|---|
| `transcriptomics/index.html` | head 的 meta 與 og 標籤、分頁列、標題、播放器的元素、重點整理(最前面一行「先看」)與資料來源;教材程式都在最後的 `<script type="module">` | 字幕(各章的 `cues`)、章名、示意資料的常數、重點整理、資料來源 |
| `assets/transcriptomics.svg` | 入口卡片的概念圖(440 × 260;點與 read 的位置是用固定種子的小腳本算出後寫死在檔案裡):左框是疊在三個外顯子上的短 read(淺綠),其中三條琥珀色的 read 拆成兩段、用弧線跨過內含子;中間一個薄荷綠箭頭;右框是火山圖,右上薄荷綠點(上調)、左上藍點(下調)、底部灰點,琥珀色虛線是顯著門檻;左上角 `READS TO GENES` 小字 | 入口改版時 |
| `assets/bio-lesson.js`、`assets/bio-draw.js`、`assets/bio-lesson.css`、`assets/mobile-panels.*` | 共用的播放器、畫圖小工具、版面、全螢幕與轉向提示 | 不在這份教材裡改;需要新畫法就在本頁寫小函式 |

頁面結尾呼叫 `createLesson({ chapters, state, controls })`,回傳值存在 `L`。`globalThis.__lesson` 是除錯與測試用的介面(`go`、`pause`、`time`、`state`、`redraw`、`set`、`chapter`、`duration`)。分頁列目前只有「← 儀器入口」與本頁(`aria-label="生化進階"`),統整時換成整區的分頁列;`og:image`(`assets/og/transcriptomics.jpg`)由統整的人用 `scripts/make-og-images.mjs` 產生。

## 章節代號(對外網址)

`#fastq`、`#align`、`#assemble`、`#tpm`、`#size-factor`、`#replicates`、`#de-test`、`#candidates`。網址會跟著章節改變,比照 AGENTS.md 第 1 節不可隨意更名;必須改時讓舊的代號仍然對到同一章。

## 座標與單位

畫布邏輯座標 960 × 540(左上角是原點,y 往下)。手機上播放器把字放大最多 1.3 倍(`g.boost`),所以標籤之間都留了空間;鹼基方塊(本頁的 `box`)裡的字母不跟著放大。各章的座標函式:

- 第 1 章:第 i 個鹼基(0 起算)的 x 是 `fcx(i) = 150 + (i + 0.5) × 12.5`;品質長條圖 `qy(q) = 490 − 3.9q`。四行 FASTQ 在 y = 56、90、124、158。
- 第 2 章:mRNA 上第 p 個鹼基在 `MX(p) = 160 + 0.74p`(y = `MY` 150);基因體上在 `GX(p)`,三個外顯子是 `EXGX`(90–312、382–530、600–896),兩個內含子 `INTRON` 各畫成 70 px(真的內含子長很多,畫面上有斷開記號);基因體在 y = `GY` 318。read 用 `packRows` 排成不重疊的列,mRNA 上用 `ROWM`、基因體上用 `ROWG`,每列 9 px。
- 第 3 章:基因上第 c 個字(外顯子 1 是 0–11、外顯子 2 是 12–19、外顯子 3 是 20–31)在 `XC(c) = 132 + 24c`;兩條異構體的字母列在 `R1Y` 170、`R2Y` 216;de Bruijn 圖的上路在 `PY1` 296、下路在 `PY2` 344。
- 第 4 到 8 章的圖都在各自的 `draw` 裡用區域變數換算(例如第 7 章火山圖 `VX`、`VY`,第 8 章蛋白質地圖 `AX(aa) = 400 + aa / 650 × 520`)。

## 計算區段(`// ===== 計算開始` 到 `// ===== 計算結束`)

這一段只用 `bio-draw.js` 的 `rng`,不碰畫面,可以整段抽出來用 node 驗算(見最後一節)。

- 亂數:`rngw(seed)` 是 `rng(seed)` 先丟掉 20 個(小種子的 xorshift 前幾個數偏小)。`normal`(Box–Muller)、`gammaRand`(Marsaglia 與 Tsang)、`poisson`(λ < 30 用乘法,λ ≥ 30 用常態近似)、`nbinom(R, μ, α)` = 以 Gamma(形狀 1/α、尺度 μα)為平均的卜瓦松,平均 μ、變異數 μ + αμ²。
- `erfc`:Numerical Recipes 的 erfcc(相對誤差小於 1.2 × 10⁻⁷);`pTwo(z) = erfc(|z| / √2)` 是標準常態的雙尾 p 值。
- `bhAdjust(p)`:Benjamini–Hochberg 校正後的 p,由大往小累積取 min(m·p₍ᵣ₎ / r),和 R 的 `p.adjust(p, 'BH')` 相同;`bhK(sortedP, q)`:最後一個 p₍ᵢ₎ ≤ (i/m)·q 的名次 i(BH 1995 第 3.1 節)。
- `sizeFactors(cols)`:DESeq2 的 median of ratios。每個基因取各樣品計數的幾何平均(取對數平均),有 0 的基因不用;樣品 j 的 size factor = exp(中位數(log k_ij − 幾何平均的對數)),和 DESeq2 `estimateSizeFactorsForMatrix` 的寫法相同。
- `pearson(x, y)`:皮爾森相關係數。
- 第 1 章:`trimRead(seq, qs, thr, w = 4)` 先找接頭(`ADAPTER` 前 8 個字完全相同的位置),再照 Trimmomatic `SlidingWindowTrimmer.java` 的寫法:第一個窗格平均就低於門檻時整條丟掉;往後滑,窗格平均低於門檻時保留到「這個窗格的倒數第二個鹼基」(`keep = i + w`),再把尾巴低於門檻的鹼基一個個去掉。回傳 `adapterAt`(接頭從第幾個開始)、`win`(第一個不合格的窗格從第幾個開始)、`keep`(保留幾個)。`expErr(qs)` = Σ 10^(−Q/10),是一條 read 預期錯幾個鹼基。
- 第 3 章:`deBruijn(k)` 把兩條異構體的每個 k-mer 記下它在基因上的位置(`gpos1`、`gpos2`,異構體 2 跳過外顯子 2);節點是 k-mer 字串,重疊 k − 1 個就連一條邊(Grabherr 2011 的定義)。同一個字串出現在基因上不同的位置就是「被黏在一起」(`collapsed`);`branchK` 是出邊兩條以上的節點、`mergeK` 是入邊兩條以上的節點,`cycle` 用 DFS 找有沒有環。
- 第 4 章:`toyTable(tpsUp)`:假設整個轉錄體只有 `TOY` 的 5 個基因。讀數和「分子數 × 長度」成正比:count_i = 總讀數 × m_i·L_i ÷ Σ m·L;RPKM_i = count_i ÷ (L_i〔kb〕× 總讀數〔百萬〕);RPK_i = count_i ÷ L_i;TPM_i = RPK_i ÷ ΣRPK × 10⁶(等於 m_i ÷ Σm × 10⁶)。
- 第 5 章:`SF.at(f)`:2,000 個基因(對數常態,σ = 1.4),其中 80 個在處理組乘上 c 倍,讓它們占處理組讀數的比例變成 f(c = f(1 − s₀) ÷ (s₀(1 − f)),s₀ 是它們原本的占比);兩個樣品各加 σ = 0.18 的對數常態個體差異,總讀數 1,000 萬與 1,500 萬。回傳總讀數比 `totRatio`、size factor 比 `sfRatio`、沒變的基因用兩種方法校正後的中位倍數 `unchangedTot`、`unchangedSf`。
- 第 6 到 8 章:`DE`(見下一節);`DE.at(n)` 只用每組前 n 個樣品(重複越多是「再加幾棵樹」),先算 size factor,再對每個基因做簡化的 Wald 檢定:兩組校正後計數的平均 q̂_A、q̂_B(各加 0.5),log₂FC = log₂(q̂_B ÷ q̂_A),標準誤 SE = √((1/q̂_A + α)/n + (1/q̂_B + α)/n) ÷ ln 2,α 用趨勢值 α(μ) = 0.06 + 1/μ(μ 取兩組平均),z = log₂FC ÷ SE,p = `pTwo(z)`,再做 BH。結果依 n 快取。

DESeq2 實際上是用廣義線性模型擬合、每個基因的離散度從資料估計後往趨勢收縮、log₂FC 也會收縮;這裡省略這些步驟,所以是「示意的 Wald 檢定」,頁面「資料來源」最後一條有寫。因為模擬時每個基因的離散度就是趨勢值,這個檢定是校準的:換 30 個種子平均,FDR 0.05 時實際的偽發現比例約 4% 到 5%。

## 示意資料(全部是示意,頁面「資料來源」最後一條也有寫)

- 第 1 章:`INSERT`(48 個)接 `ADAPTER`(Illumina TruSeq 第一讀接頭的前 12 個 `AGATCGGAAGAG`)成為讀長 60 的 `READ`;`QUAL` 是 60 個 Q 值,越往 3′ 端越低。名稱行用 Illumina 說明文件的範例 `@SIM:1:FCX:1:15:6329:1045 1:N:0:2`。解碼的三個例子是 `QUAL` 裡第一個 Q40、Q30、Q10(第 9、36、51 個鹼基,字元 I、?、+)。
- 第 2 章:mRNA 900 個鹼基,三個外顯子 `EX`(0–300、300–500、500–900);40 條讀長 100 的 read(`READS2`,`rngw(323)`),10 條跨接點(第一個接點 6 條、第二個 4 條),6 條完全落在和另一個基因相同的那段 `SHARED`(610–860)。
- 第 3 章:`E1` = ATGGCGGGTTCG、`E2` = AGCCATGT、`E3` = TCGGATAACCAC。這三段是搜尋出來的:k = 7 沒有重複的小段、k = 5 剛好一個(GTTCG,在外顯子 1 尾端與外顯子 2 接 3 的地方各出現一次)、k = 3 有 6 個;外顯子 1 與 2 的最後一個字不同,k ≥ 6 時兩條異構體只在真正的接點分岔。
- 第 4 章:`TOY` 的長度(0.5、5.0、1.5、2.0、1.6 kb)與分子數(對照 200、200、300、50、100;處理組萜類合成酶 50 或 400),總讀數 `DEPTH` 1,000 萬與 2,000 萬。
- 第 5 章:`SF`(`rngw(515)`)。
- 第 6 到 8 章:`DE`(`rngw(SEED_DE)`,`SEED_DE` = 22):4,000 個基因、每組 5 個樣品;樣品的 size factor exp(0.22z);表現量 q = max(8, exp(ln 180 + 1.5z));10% 的基因有差異,log₂FC = ±(0.35 + 平均 0.9 的指數分布),60% 是上升;離散度 α = 0.06 + 1/q。種子 22 是在 30 個種子裡挑的,實際的偽發現比例接近期望值(FDR 0.05 時 3.2% 到 4.9%),免得示範時剛好碰到偏高的一次。
  - 第 6 章的例子基因 `EXG`(第 11 個):對照 260、處理後 2 倍(log₂FC = 1),計數另外用 `rngw(SEED_EX)`(103)抽;種子是挑過的,讓 2、3、5 重複時 p 值分別是 0.105、0.0084、3.5 × 10⁻⁵。
  - 第 8 章:用 `rngw(4646)` 洗牌,取 46 個基因當「BLAST 像萜類合成酶」(`DE.tps`),第 k 個(0 起算)的屬性:k < 31 兩個結構域都有(31 到 36 只有 N 端、37 以後只有 C 端);k < 19 讀框完整、19 到 26 缺 5′ 端、27 到 30 缺 3′ 端;k < 8 處理後上升(log₂FC 3.0、2.4、1.3、1.15、2.1、2.8、0.9、1.5)、8 與 9 下降、19 到 22 上升、其餘大多沒變。候選 A 是 k = 0(表現量 240),候選 B 是 k = 19(缺 5′ 端),候選 C 是 `DE.P450`(洗牌後第 47 個,P450,上升 4 倍)。
  - 12 棵樹(`rngw(1212)`):每棵樹一個潛在的「途徑活性」u,單萜含量 = 3 × 2^(0.7u + 0.12ε) mg/g,基因表現量 = q × 2^(β·0.9u + 0.35ε);β:A 1、B 0.9、C 0.9、k = 3 為 0.85、k = 5 為 0.5、k = 1 為 0.25,其他 0 到 0.1。`DE.rOf(gi)` 是 log₂ 表現量與 log₂ 含量的皮爾森 r。
  - 蛋白質地圖:參考是 UniProt O24475(大冷杉 pinene 合成酶,628 個胺基酸,轉運胜肽 1–36,DDXXD 379–383)與 InterPro 的 Pfam 位置(PF01397 74–265、PF03936 332–566),這幾個是真的;候選 A(612 個)、B(從第 230 個開始,398 個)、C(512 個,PF00067)的長度與結構域位置、BLAST 最佳結果與 E 值都是示意。

## 狀態與控制項

`state: { qcut: 20, splice: true, k: 5, tpsUp: false, boom: 0.4, rep: 3, fdr: 0.05, fc: 1, cand: 'A' }`

| 控制項 | 種類 | 出現在 | 改了之後 |
|---|---|---|---|
| `qcut`「修剪門檻」Q15、Q20、Q30 | seg | `fastq` | `onChange` 設 `S.qTouched`,這一章直接畫成結尾的樣子(門檻線、窗格停在不合格的位置、切點、保留幾個與預期錯誤數) |
| `splice`「比對方式」會跨、不會跨內含子 | seg | `align` | 設 `S.spTouched`;跨接點的 read 改成紅框加 ×,左下的計數框反白目前的方式 |
| `k`「k-mer 的長度」3、5、7 | seg | `assemble` | 設 `S.kTouched`;換成 `DBG.get(k)`,節點、被黏在一起的虛線弧、分岔與會合、結論文字一起變 |
| `tpsUp`「處理組的萜類合成酶增加 8 倍」 | toggle | `tpm` | 設 `S.tpTouched`;三欄都重算,下方改寫肌動蛋白 TPM 的變化與 RPKM 加總 |
| `boom`「處理組裡大量上升的基因占掉的讀數」不變、約 20%、約 40% | seg | `size-factor` | 設 `S.bTouched`;左邊的占比、直方圖、兩條線與兩行結果一起變 |
| `rep`「每組幾個生物重複」2、3、5 | seg | `replicates`、`de-test`、`candidates` | 換 `DE.at(n)`:例子基因的點、範圍與 p 值,平均與變異數的散布,火山圖、BH 圖與計數,第 8 章的篩選與候選的檢定結果 |
| `fdr`「FDR 門檻」0.01、0.05、0.1 | seg | `de-test`、`candidates` | BH 的線與 k、火山圖的水平線與分類、篩選的「處理後上升」 |
| `fc`「倍數門檻」1.5、2、4 倍 | seg | `de-test`、`candidates` | 火山圖的兩條直線與分類、篩選的「處理後上升」;值是 log₂ 倍數(`LOG2_15`、1、2) |
| `cand`「看哪一個候選」A、B、C | seg | `candidates` | 換候選的 BLAST 行、蛋白質地圖、檢定結果、12 棵樹的散布圖與檢查表、結論 |

第 6 到 8 章沒有「動過就跳到結尾」的旗標:這幾章的圖在前幾秒就都出現了,換值立刻反映。各章的 `enter(S)` 只把自己的旗標設回 false。

## 本頁的小畫法

- `box(g, x, y, b)`:置中的鹼基方塊(字母不放大)。`textW` 量字寬,`fade(t, a)` 是 a 到 a + 0.6 秒的淡入,`alphaDo(g, a, fn)` 在透明度 a 下畫 `fn`。
- `tree(g, x, y, s, col)`:小小的針葉樹(第 6 章的生物重複)。
- `axisX`、`axisY`、`yTitle`:只畫軸線、刻度與字(刻度字自己給,13 px)。
- `packRows`、`gPieces`(第 2 章把跨接點的 read 拆成兩段)。
- 上下標:等寬字型的 Unicode 上下標在畫布上太小,公式一律用一般字型(例如第 1 章的 Q = −10·log₁₀(p)、第 6 章的 p 值)。

## 每一章畫什麼

時間是這一章的秒數。

1. `fastq`「原始資料:FASTQ 與品質分數」(18 秒,`qcut`)
   - 0.3、1.2、2.1、3.0 秒四行依序淡入:名稱、序列(鹼基四色)、+、品質字元(Q < 20 的字元琥珀色)。
   - 4.5 到 13.2:公式 Q = −10·log₁₀(p) 與三個解碼框(字元 → ASCII − 33 = Q → p),虛線連到第四行的字元;13.2 到 13.8 淡出。
   - 8.2 起品質長條圖(8.4 到 9.6 長出來),Q ≥ 30 薄荷綠、20 到 29 淡綠、Q < 20 琥珀;9.3 起標出讀進接頭的 12 個。
   - 13.5 起紅色虛線門檻;13.6 到 14.3 接頭那段變暗(①);14.4 到 16.2 四格的窗格由左往右走,標出四格平均,到第一個不合格的窗格變紅;16.2 到 16.8 切點與「從這裡切掉」;15.2 起上方寫保留幾個與 Σp。
2. `align`「有參考基因體:跨過內含子比對」(16 秒,`splice`)
   - 基因體一直在(外顯子、內含子的斷開記號);1 到 3 秒外顯子往上接成 mRNA;3 到 4.2 秒 read 落在 mRNA 上(跨接點的琥珀色)。
   - 4.6 秒起每 0.07 秒一條 read 移到基因體,跨接點的拆成兩段、上方一條琥珀色弧線跨過內含子;不會跨時改成紅框加 ×。
   - 9 秒起左下計數框:40 條裡 10 條跨接點,兩種方式各對上幾條、少算幾 %;12.8 秒起完全落在 `SHARED` 的 6 條變藍,右下出現很像的另一個基因,虛線連到框的上緣。
3. `assemble`「沒有參考基因體:從頭組裝」(18 秒,`k`)
   - 0.2 到 4.7 秒:挪威雲杉與阿拉伯芥基因體大小的長條(1 比約 1/100)。0.6 秒起三個外顯子的色條與兩條異構體的字母列(異構體 2 中間虛線「跳過外顯子 2」)。
   - 4.6 到 9.7 秒:上方一條跨接點的 read,琥珀框依 k 滑動,下面列出前三個 k-mer;5.4 到 9.2 秒圖的節點由左到右出現(上路是異構體 1,異構體 2 跨接點的 k-mer 走下面的藍色路)。
   - 9.4 秒起標「分岔」「會合」;9.6 到 13.4 秒一顆薄荷綠的點先走異構體 1、再走異構體 2;9.6 秒起下方輸出框(TRINITY_DN1_c0_g1_i1、i2)。
   - 13.4 秒起被黏在一起的小段用琥珀色虛線弧連起它的兩個位置,右下寫節點數、幾個小段被黏在一起、分岔與會合共幾處、有沒有環。
4. `tpm`「長度與定序深度:RPKM 與 TPM」(17 秒,`tpsUp`)
   - 三欄(原始計數、RPKM、TPM),每個基因上面一條 A(對照)、下面一條 B(處理),數字寫在長條旁,底下是兩個樣品的加總。字幕講到哪一欄就框起那一欄、其他欄變淡(0 到 4.5、4.5 到 9、9 到 13 秒),13 秒起三欄都亮。
   - 下方兩行依目前的欄寫例子:原始計數講長度與定序量的偏差;RPKM 與 TPM 用萜類合成酶在 B 的數字代入公式;13 秒起講組成改變(打開開關時寫肌動蛋白的 TPM 少了幾 %、RPKM 加總不同)。
5. `size-factor`「樣品之間:size factor」(17 秒,`boom`)
   - 左邊兩根百分比長條:大量上升的基因(琥珀)與其他基因占的讀數比例,1.2 到 3.6 秒處理組的占比長上去。
   - 4.5 秒起右邊是 2,000 個基因 B ÷ A 的直方圖(對數刻度,琥珀是那 80 個);5.4 秒起琥珀虛線是總讀數比、下面寫只用總讀數校正時沒變的基因變成幾倍。
   - 9 秒起公式;10.2 到 12 秒薄荷綠的 size factor 線從總讀數比滑到中位數;13 秒起寫 size factor 校正後沒變的基因是幾倍與前提。
6. `replicates`「生物重複與計數的變異」(16 秒,`rep`)
   - 左邊例子基因:兩組各 n 棵小樹、n 個點(校正後計數),白線是平均、豎線是 95% 範圍(對數尺度上 ±1.96 SE);下面寫 log₂FC、標準誤、p 值(小於 0.05 薄荷綠,否則琥珀)。
   - 4.5 秒起右邊是 4,000 個基因在對照組的平均與變異數(對數),藍色虛線是卜瓦松(變異數 = 平均)、薄荷綠曲線是 μ + α(μ)μ²。
   - 9.5 秒起右下 CV² = 1/μ + α 的拆解(α = 0.1,μ = 10、100、1,000;藍是定序、綠是個體)。
7. `de-test`「差異表現:多重檢定與火山圖」(18 秒,`rep`、`fdr`、`fc`)
   - 左邊 0 到 9 秒是 p 值直方圖(灰是沒有差異的基因、薄荷綠是有差異的,模擬時知道答案),4 秒起 p = 0.05 的虛線;9.2 秒起換成 p 值由小排到大的前 XN 名(XN 約是 k 的 1.8 倍),琥珀線 (i/m)·q 在 9.6 到 11 秒畫出來,點在 9.8 到 12 秒出現(名次 ≤ k 的薄荷綠),12 秒起標出 k。
   - 右邊火山圖:先用未校正的 p(4 到 9.4 秒 p < 0.05 的點琥珀色),9.4 到 11 秒點往下移到校正後的 p;13.5 秒起依門檻分成上調(薄荷綠)、下調(藍)與其他(灰),畫出兩條倍數門檻線與上下調的個數。縱軸超過 16 的點畫成頂端的小三角形。
   - 下方三行:只看 p < 0.05 選出幾個、其中幾個其實沒有差異;BH 校正後選出幾個、其中幾個沒有差異;加上倍數門檻後的上下調個數。
8. `candidates`「從候選名單到萜類合成酶」(18 秒,`cand`、`rep`、`fdr`、`fc`)
   - 左邊六層篩選(長條長度是對數比例):4,000 → 46(BLAST)→ 31(兩個結構域)→ 19(讀框完整)→ 處理後上升(依門檻)→ 和單萜含量相關(r ≥ 0.8),分別在 0.2、1.4、5、7.5、10、11.5 秒出現。
   - 0.6 秒起右上寫候選與 BLAST 最佳結果;4.6 秒起蛋白質地圖(參考 O24475 與候選,轉運胜肽、PF01397、PF03936、DDxxD);候選 B 的前段用虛線框標「沒拼出來」。
   - 9.5 秒起右下框:處理 ÷ 對照的 log₂FC 與校正後 p、12 棵樹的散布圖(對數座標,迴歸線)與 r、五項檢查表(✓ 或 ✗);13.5 秒起結論。

## 示意的數值與簡化

- 上一節的所有序列、品質、計數、表現量、含量、候選的長度與 BLAST 結果都是示意。
- 第 1 章的接頭以「前 8 個字完全相同」判斷;實際的軟體容許錯配與部分接頭。
- 第 2 章的內含子畫成固定寬度;read 數、讀長 100 與「6 條落在相同那段」是示意。
- 第 3 章的 k 用 3、5、7(Trinity 預設 25),read 與外顯子都很短,方便看;節點依它在基因上的位置排,真實的圖沒有座標。
- 第 4 章假設整個轉錄體只有 5 個基因,所以 RPKM 與 TPM 的數值比實際大很多;公式與加總的性質不受影響。
- 第 6、7 章的檢定是簡化的 Wald 檢定(見計算區段),不是完整的 DESeq2;差異基因的比例、倍數分布與離散度趨勢是示意。
- 第 8 章的 46、31、19 是模擬時指定的個數,「處理後上升」與「相關」兩層才是從模擬資料算出來的;r ≥ 0.8 是示意的門檻。不能拿來實際判斷候選。

## 科學內容的來源

- Conesa A, et al. A survey of best practices for RNA-seq data analysis. Genome Biol. 2016;17:13. https://pmc.ncbi.nlm.nih.gov/articles/PMC4728800/ (品質越往 3′ 端越差,太低就要修掉;FASTX-Toolkit、Trimmomatic 修剪;要用能跨接點的比對軟體;人類 70% 到 90% 的 read 對得上,多處比對主要來自重複序列與旁系同源基因的共同結構域;HTSeq-count、featureCounts 常丟掉多處比對的 read,RSEM、eXpress、Sailfish、kallisto 會依機率分配;沒有基因體時從頭組裝,建議把所有樣品合在一起組裝再把 read 對回去;組裝常碎成好幾段;RPKM 是樣品內的量,RPKM、FPKM、TPM 在少數高表現且有差異的基因扭曲分布時表現不好;TMM、DESeq 的校正;負二項分布是卜瓦松加上額外變異;至少三個生物重複;表 1 的檢出力(倍數 2 時 3、5、10 重複為 87%、98%、100%);用 SwissProt、Pfam、InterPro、Blast2GO 註解)
- Cock PJ, et al. Nucleic Acids Res. 2010;38(6):1767–1771. https://pmc.ncbi.nlm.nih.gov/articles/PMC2847217/ (FASTQ 四種行;Sanger FASTQ 用 ASCII 33 到 126 表示 PHRED 0 到 93;舊的 Illumina 1.3+ 用 64)
- Ewing B, Green P. Genome Res. 1998;8(3):186–194. doi:10.1101/gr.8.3.186(phred 為每個鹼基估計錯誤機率;依摘要)
- Illumina, Quality Scores for Next-Generation Sequencing:https://www.illumina.com/science/technology/next-generation-sequencing/plan-experiments/quality-scores.html (Q = −10 log₁₀ e;Q10、Q20、Q30 為 1/10、1/100、1/1,000);BaseSpace 的 FASTQ 說明:https://help.basespace.illumina.com/files-used-by-basespace/fastq-files (四行與名稱行範例 `@SIM:1:FCX:1:15:6329:1045 1:N:0:2`)
- Bolger AM, et al. Trimmomatic. Bioinformatics. 2014;30(15):2114–2120. https://pmc.ncbi.nlm.nih.gov/articles/PMC4103590/ (片段比讀長短時讀進接頭;滑動窗格);Trimmomatic README(`SLIDINGWINDOW:4:15` 的說明)與 `SlidingWindowTrimmer.java`:https://github.com/usadellab/Trimmomatic ;cutadapt 文件的 TruSeq 接頭 `AGATCGGAAGAGCACACGTCTGAACTCCAGTCA`:https://cutadapt.readthedocs.io/en/stable/guide.html
- Dobin A, et al. STAR. Bioinformatics. 2013;29(1):15–21. https://pmc.ncbi.nlm.nih.gov/articles/PMC3530905/ ;Kim D, et al. HISAT2. Nat Biotechnol. 2019;37:907–915. https://pmc.ncbi.nlm.nih.gov/articles/PMC7605509/
- Nystedt B, et al. Nature. 2013;497:579–584. doi:10.1038/nature12211(挪威雲杉基因體 20 Gb,第一個裸子植物基因體,阿拉伯芥小 100 倍以上,很多超過 10,000 bp 的內含子;依摘要);Neale DB, et al. Genome Biol. 2014;15:R59. https://pmc.ncbi.nlm.nih.gov/articles/PMC4053751/ (火炬松內含子平均超過 2.7 kbp,有的超過 100 kbp;重複序列約占 82%;針葉樹基因體的大小與複雜度讓定序組裝很難)
- Grabherr MG, et al. Trinity. Nat Biotechnol. 2011;29(7):644–652. https://pmc.ncbi.nlm.nih.gov/articles/PMC3571712/ (節點是 k 個鹼基、重疊 k − 1 個就連邊;預設 k = 25;Inchworm、Chrysalis、Butterfly;報出異構體與旁系同源基因;在不同基因裡重複的序列造成模糊,長於 k 的共同序列要靠 read 與成對 read 解開);Trinity 輸出的命名:https://github.com/trinityrnaseq/trinityrnaseq/wiki/Output-of-Trinity-Assembly
- Hall DE, et al. BMC Plant Biol. 2013;13:80. https://pmc.ncbi.nlm.nih.gov/articles/PMC3668260/ (扭葉松與北美短葉松:受傷加茉莉酸甲酯處理的莖做 454 與 Illumina 定序,Trinity 組裝;BLAST e 值小於 10⁻⁵ 挑候選;沒有基因體時,組裝的轉錄體對找防禦基因很重要)
- Keeling CI, et al. BMC Plant Biol. 2011;11:43. https://pmc.ncbi.nlm.nih.gov/articles/PMC3058080/ (雲杉至少 69 個有轉錄的萜類合成酶,屬裸子植物特有的 TPS-d 亞家族;只看胺基酸序列的相似度無法準確預測功能)
- Mortazavi A, et al. Nat Methods. 2008;5:621–628. doi:10.1038/nmeth.1226(RPKM);Wagner GP, et al. Theory Biosci. 2012;131(4):281–285. doi:10.1007/s12064-012-0162-3(RPKM 的平均依樣品而變,提出 TPM;依摘要);Zhao S, et al. RNA. 2020;26(8):903–909. doi:10.1261/rna.074922.120(RPKM、TPM 公式;平均 RPKM 依樣品而變;TPM 是相對比例,依樣品的 RNA 組成而變)
- Love MI, et al. DESeq2. Genome Biol. 2014;15:550. https://pmc.ncbi.nlm.nih.gov/articles/PMC4302049/ (負二項、平均 = size factor × q、變異 μ + αμ²;median of ratios;Wald 檢定、BH 校正;兩三個重複常見,離散度與倍數的收縮);Anders S, Huber W. Genome Biol. 2010;11:R106. https://pmc.ncbi.nlm.nih.gov/articles/PMC3218662/ (size factor 用各樣品對幾何平均的比值取中位數;卜瓦松的變異數等於平均數,負二項允許更大;讀數高時要靠更多生物重複)
- Robinson MD, Oshlack A. Genome Biol. 2010;11:R25. https://pmc.ncbi.nlm.nih.gov/articles/PMC2864565/ (一個條件裡有大量獨有或高表現的基因時,其他基因可分到的讀數變少,只用總讀數校正會讓差異分析偏向一邊)
- Schurch NJ, et al. RNA. 2016;22(6):839–851. https://pmc.ncbi.nlm.nih.gov/articles/PMC4878611/ (每組 48 個重複的實驗;3 個重複時 11 個工具裡 9 個只找到 20% 到 40% 的顯著差異基因;建議至少 6 個,要找全部倍數的差異基因至少 12 個;重複少時 edgeR 與 DESeq2 較好)
- edgeR User's Guide(Last revised 2026-04-25)2.9.2 節:https://bioconductor.org/packages/release/bioc/html/edgeR.html (同一管 RNA 重測的計數照卜瓦松變;CV² = 1/μ + φ,技術的 CV 隨計數變大而變小,BCV 不會;沒有重複時的典型 BCV:人 0.4、基因相同的模式生物 0.1、技術重複 0.01)
- Benjamini Y, Hochberg Y. J R Stat Soc B. 1995;57(1):289–300. doi:10.1111/j.2517-6161.1995.tb02031.x(FDR 是被拒絕的假設中錯誤的期望比例;第 3.1 節:k 為最後一個 P₍ᵢ₎ ≤ (i/m)q* 的 i,拒絕 H₍₁₎ 到 H₍ₖ₎,獨立時控制 FDR 於 q*;第 3.2 節 15 個 p 值的例子,Bonferroni 拒絕 3 個、本法拒絕 4 個);Penn State STAT 555 第 4.3 節(BH 校正後的 p = min(m·p₍ᵢ₎/i, 1)):https://online.stat.psu.edu/stat555/node/59/
- Cui X, Churchill GA. Genome Biol. 2003;4:210. https://pmc.ncbi.nlm.nih.gov/articles/PMC154570/ (火山圖:−log₁₀ p 對 log₂ 倍數)
- NCBI, The Statistics of Sequence Similarity Scores:https://www.ncbi.nlm.nih.gov/BLAST/tutorial/Altschul-1.html (E 值是分數至少 S 的比對碰巧出現的預期個數,搜尋空間加倍 E 也加倍;E < 0.01 時 P 與 E 幾乎相同);Karlin S, Altschul SF. PNAS. 1990;87:2264–2268. https://pmc.ncbi.nlm.nih.gov/articles/PMC53667/
- InterPro:PF01397(Terpene synthase, N-terminal domain,IPR001906)https://www.ebi.ac.uk/interpro/entry/pfam/PF01397/ ;PF03936(Terpene synthase family, metal binding domain,IPR005630)https://www.ebi.ac.uk/interpro/entry/pfam/PF03936/ ;PF00067(Cytochrome P450);兩個萜類合成酶條目都寫 Tpsd 包括 pinene、myrcene、taxadiene 合成酶。O24475 的 Pfam 位置取自 InterPro API(2026-10-27 查)。
- UniProt O24475(Pinene synthase, chloroplastic,*Abies grandis*,628 個胺基酸;轉運胜肽 1–36;DDXXD motif 379–383;Mg²⁺ 結合位 379、383、531):https://www.uniprot.org/uniprotkb/O24475/entry
- Bohlmann J, et al. PNAS. 1998;95(8):4126–4133. https://pmc.ncbi.nlm.nih.gov/articles/PMC22453/ (單萜合成酶 600 到 650 個胺基酸,N 端有送進質體的轉運胜肽,RR 之後才是成熟蛋白;DDxxD 固定二價金屬離子;序列比對可以分到亞家族,但不能判定新酵素的功能,要表現出來鑑定產物)
- Ma LT, et al. Plants. 2021;10(11):2404. https://pmc.ncbi.nlm.nih.gov/articles/PMC8625326/ (臺灣杉針葉、毬果、木材的轉錄體 BLASTx 搜尋,5 個候選 593 到 628 個胺基酸,BLAST 的 E 值都是 0.0;木材庫裡的片段短於 500 bp;用 RACE 取得全長)
- Foster AJ, et al. Plant Physiol. 2013;161(4):1993–2004. doi:10.1104/pp.112.206383(西部紅側柏有腺體與沒有腺體的葉子比較,600 多個基因在有腺體時高;一個單萜合成酶表現在腺體表皮,做出檜烯;另找了把檜烯轉成側柏酮的候選;依摘要)
- Martin D, et al. Plant Physiol. 2002;129(3):1003–1018. doi:10.1104/pp.011001(茉莉酸甲酯讓挪威雲杉木質部長出創傷樹脂道,萜類合成酶活性上升;依摘要)
- Chen C, et al. BMC Genomics. 2018;19:550. https://pmc.ncbi.nlm.nih.gov/articles/PMC6057064/ (樟樹沉香醇型與龍腦型葉子 RNA-seq,Trinity 組裝 156,184 個 unigene,作者提醒沒有參考基因體時這個數目有高估的疑慮;三個 TPS14-like 在龍腦型較高,qRT-PCR 與 RNA-seq 的 R² 為 0.9231;頁面沒有列)
- Everaert C, et al. Sci Rep. 2017;7:1559. https://pmc.ncbi.nlm.nih.gov/articles/PMC5431503/ (RNA-seq 與 qPCR 的倍數變化約 85% 的基因一致;不一致的多半較短、外顯子較少、表現量較低;頁面沒有列)
- TransDecoder:https://github.com/TransDecoder/TransDecoder/wiki (預設找 100 個胺基酸以上的讀框;有不完整的讀框;頁面沒有列)

頁面的「資料來源」只列其中最主要的幾條。

## 修改後要檢查什麼

1. 語法:把 module script 抽出來跑 `node --check`;頁面不能有破折號(U+2014)與不該出現的姓名,文案不用空泛、猜測的詞(`scripts/check-bio.mjs` 會檢查姓名與破折號;這份教材併進清單之後才會被它檢查到)。
2. 計算:把 `// ===== 計算開始` 到 `// ===== 計算結束` 抽出來,和 `assets/bio-draw.js` 的 `rng` 一起用 node 執行(例如 `new Function('rng', 程式碼 + 'return { trimRead, toyTable, SF, DE, ... }')(rng)`),核對下面這些值;改了種子或參數之後要重新看一次畫面上的字:
   - `trimRead`:Q15 保留 47、Q20 保留 43、Q30 保留 38(第一個不合格的窗格分別從第 44、41、35 個開始,0 起算);整條的 Σp = 2.246,修剪後 0.153、0.035、0.011。
   - `sizeFactors([[10,20,30],[20,40,60]])` = 0.7071、1.4142;`bhK` 對 BH 1995 第 3.2 節的 15 個 p 值、q* = 0.05 是 4;`pTwo(1.96)` = 0.0500、`pTwo(3)` = 2.700 × 10⁻³。
   - `toyTable(false)`:兩個樣品的 TPM 加總都是 1,000,000、RPKM 加總都是 469,613;`toyTable(true)`:B 的 RPKM 加總 478,088、肌動蛋白 TPM 250,000(原本 352,941)。
   - `SF.at(0.4)`:處理組上升基因占 38.4%,總讀數比 1.463、size factor 比 0.981,沒變的基因用總讀數校正是 0.663 倍、用 size factor 是 0.988 倍;`SF.at(0.2)`:0.872 與 0.988;`SF.at(0)`:1.006 與 1.001。
   - `deBruijn`:k = 3 有 26 個節點、6 個小段被黏在一起、分岔 4 會合 4、有環;k = 5 是 31、1(GTTCG)、1 與 2、有環;k = 7 是 32、0、1 與 1、沒有環。`READS2` 有 10 條跨接點、6 條落在 `SHARED`。
   - `DE`:402 個基因真的有差異。每組 3 重複時 p < 0.05 有 455 個(164 個其實沒差異),FDR 0.05 時 227 個(10 個沒差異,4.4%),其中 2 倍以上上調 135、下調 70;2 重複時 188 個(3.2%);5 重複時 288 個(4.9%)。例子基因 2、3、5 重複時 p = 0.105、0.00837、3.55 × 10⁻⁵(3 重複手算:q̂_A 251.95、q̂_B 438.10、α 0.0629、log₂FC 0.798、SE 0.303、z 2.637)。篩選在 3 重複、FDR 0.05、2 倍時是 46 → 31 → 19 → 7 → 2,候選 A、B、C 的 r 是 0.948、0.981、0.919。
3. 截圖:用生化原理分區的截圖腳本(每章三個時間點,加上 742×298、1280×800、384×686 的整頁),逐張看:沒有主控台錯誤、字不疊字、沒有東西超出畫面、手機尺寸(字放大 1.3 倍)也放得下。
4. 控制項:每一章點右邊的每個按鈕,狀態與 `aria-pressed` 要變、畫面要立刻變(例如第 1 章 Q30 時保留 38 個,第 3 章 k = 7 時沒有虛線弧,第 7 章火山圖的上下調個數跟著門檻變,第 8 章換候選時檢查表跟著變);控制項只出現在表格列的章節。
5. 字幕:每章 4 句、中文約 60 個字以內,時間點和畫面對得上。

## 已知限制與待統整

- 分頁列只有本頁,統整時要換成生化進階整區的分頁列,並把本頁加進 `content/instruments.json`(分類 `bio-adv`)、入口的靜態備援卡片、README 與 INSTRUMENTS.md;`check-bio.mjs` 目前只認 `aria-label="生化原理"` 的分頁列,生化進階要另外處理。
- `og:image`(`assets/og/transcriptomics.jpg`)還沒有產生。
- 第 7 章的火山圖每一格畫 4,000 個點(桌機一格不到 2 毫秒);手機上如果覺得卡,可以改成換值時才畫到離屏畫布。
- 手機直拿時畫布只有約 360 px 寬,第 2、7 章的小字很小,靠播放器的轉向提示與全螢幕補救。
