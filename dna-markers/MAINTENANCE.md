# DNA 鑑定(分子標記):維護說明

`dna-markers/` 是「生化原理」分區的動畫教材(2026-10-26 建立):細胞核的 SSR(微衛星)怎麼分辨每一棵樹、電泳怎麼讀出基因型、多個位點的機率怎麼相乘、親子與雜交怎麼判斷,以及用葉綠體 DNA 檢查加工樣品與苦茶油的原料。播放器、畫圖工具與版面是整區共用的檔案,這一頁只提供章節、控制項與自己的小畫圖函式。純 HTML、CSS 與 ES module,不需要建置,不連外部服務,不使用到站人數計數。

## 檔案與分工

| 檔案 | 內容 | 常改的地方 |
|---|---|---|
| `dna-markers/index.html` | head 的 meta 與 og 標籤、分頁列、標題與導言、播放器的 DOM(`.player`、`.screen`、`#stage`、`.cap`、`.bar`、`#btnFs`)、右欄(`#ops`、`#chapters`)、重點整理與資料來源;頁面程式全部在最後的 `<script type="module">` | 文字、章節、數值常數 |
| `../assets/bio-lesson.js` | 共用播放器 `createLesson`(畫布縮放、播放、字幕、章節清單、控制項、網址 `#章節`、鍵盤)。**不要在這裡改**,有需要寫在回報給統整的人 | 不改 |
| `../assets/bio-draw.js` | 共用畫圖工具 `g.text / g.tag / g.rrect / g.circle / g.line / g.arrow / g.base / g.strand / g.blob / g.tube / g.axes / g.curve / g.panel`、顏色 `C`、`seg / ease / clamp / lerp / complement / rng` | 不改 |
| `../assets/bio-lesson.css`、`../assets/mobile-panels.*` | 共用版面、手機面板與全螢幕判斷、`createRotateHint` | 不改 |
| `../assets/dna-markers.svg` | 入口卡片的概念圖(440 × 260):木頭切面、葉片、CA 重複序列與電泳圖的兩個峰 | 改圖 |
| `../assets/og/dna-markers.jpg` | 分享預覽圖,由 `scripts/make-og-images.mjs` 產生(統整時處理,這個目錄不手動放圖) | 重產,不手動改 |

## 程式結構(`index.html` 的 module)

畫布一律用邏輯座標 960 × 540 畫(`createLesson` 依實際大小等比例縮放;手機上字會被放大到最多 1.3 倍,`g.boost`,版面要留空間)。每一章是 `{ key, name, dur, cues, draw(g, t, S) }`:`t` 是這一章播到第幾秒,`S` 是控制項的值。所有動畫都由 `t` 推出來(`seg(t, a, b)` 取 0 到 1 的進度,`ease` 讓它平順),沒有另外的計時器,所以拖進度列、跳章都會畫出正確的畫面。

由上到下:

1. **共用小工具**:`sup`(上標數字)、`sci`(寫成 1.7 × 10⁻¹²)、`trees`(可分辨的棵數,往下取兩位有效數字)、`fade(g, a, fn)`(一段畫面整體淡入)、`stamp` 與 `fresh(k)`(控制項改過之後 0.65 秒的短轉場:`onChange` 記下時間,`draw` 裡用 `fresh('tree')` 這類值讓新的峰、帶、結論淡入;沒動過控制項時是 1)。
2. **小圖示**:`conifer`、`broadleaf`(針葉樹、闊葉樹,y 是樹冠中間)、`stump`(樹頭,y 是地面)、`timber`(橫躺的木材)、`bottle`(油瓶,y 是瓶底)、`mark`(畫出來的勾與叉,不靠字型)、`chip`(等位基因長度的小方塊)、`trace`(電泳圖:高斯峰加總,只畫到 `x1`,用來做「掃描到哪裡、峰長到哪裡」)、`band`(膠上的發光帶)、`alignRow`(第 1 章含缺口 `-` 的比對列)、`intactSet`(第 7 章用固定種子的亂數決定哪幾份片段還完整)。
3. **各章的資料常數**(都是示意值,見下方「數值」):`ALN`、`FL / FR / FLANK / bpOf`、`TPL / NEW`、`TREES`、`PI / CPI / NEED / canTell / FP / FP2 / SAME`、`MOTHER / CHILD / FROM_MOM / NEED_DAD / FATHERS`、`SP_A / SP_B / F1`、`SAMPLES`、`CP1 / CP2 / OILS`。
4. **`chapters`**:8 章。
5. **`createLesson({ chapters, state, controls })`** 與 `createRotateHint({ top: '.cap', suspended: () => false, text: '建議轉成橫式觀看,動畫比較大' })`。

顏色慣例:母本那一邊 `MOM = C.lav`(淡紫)、父本那一邊 `DAD = C.blue`(淺藍)、樣品與「完整、對得上」用 `C.mint`、引子與注意用 `C.amber`、排除與不符用 `C.red`、電泳的標準片段用 `C.hot`(橘)。木頭的棕色(`WOOD`、`WOOD_FACE`)與油的黃色(`OIL`)是這一頁自己的常數。重要資訊都另外寫字(長度數字、「來自母本」、「沒有 100」、「甲型」等),不只靠顏色。

## 章節(`key` 也是網址 `#key`,改名會讓分享的連結失效)

| # | key | 秒數 | 字幕時間 | 畫面 |
|---|---|---|---|---|
| 1 | `markers` | 15 | 0、5、10 | 甲樹、乙樹(同一種)與別種的樹同一段 DNA 的比對(`ALN`,0.3 到 3.5 秒逐列出現);5.2、6.6、8.0 秒框出三種差異:一個鹼基不同、重複次數不同(SSR)、多或少一小段(InDel);10.6 秒起三張用途卡片(分辨每一棵樹、親子與雜交、檢查油品原料) |
| 2 | `ssr` | 15 | 0、5、10 | 上方 0 到 5 秒是 `(CA) × 6` 的例子;4.8 秒起換成「複製時聚合酶滑動」:新股沿模板長(5.3 到 7 秒)、在重複區鼓出一個含 GT 的小環(7 到 7.8 秒)、再長完(7.8 到 9.4 秒),寫出 CA × 4 → × 5。下方三棵樹同一個位點(甲 `S.rep`、乙 10、丙 5),10.2 秒起兩側出現引子箭頭,11.4 秒起框出 PCR 產物並寫長度 `bpOf(n)` |
| 3 | `genotype` | 16 | 0、5.5、11 | 左:樹 `S.tree` 的一對染色體(來自母本、來自父本),各標重複次數與產物長度。右上:毛細管電泳,5.6 秒後片段(綠是樣品、橘是 90/100/110 bp 的標準片段)依長度在不同時間到達偵測窗(`arrive(s)`,6 到 10.5 秒);右下的電泳圖用 `trace` 跟著掃描線長出來,10.6 秒後標峰的長度與「一個峰:同型合子 / 兩個峰:異型合子」 |
| 4 | `fingerprint` | 17 | 0、4.5、9、13 | 左上樹頭(被害木)與查獲的木材;左下 DNA 指紋:樹頭、木材、別棵樹各一列,每一直條是一個位點、裡面兩條短線是兩個等位基因(`FP`、`FP2`),別棵樹不同的位點畫紅色;9 到 13 秒位點數從 1 長到 `S.loci`。右上寫累積機率 `CPI[n-1]` 與 99.99% 信心下可分辨的棵數(`canTell`);右邊是累積機率對位點數的對數圖,琥珀虛線是分辨全臺紅檜所需的 `NEED`;下方寫出相乘的前幾項 |
| 5 | `parentage` | 16 | 0、4、8.5、12.5 | 左:母本、候選父本 `S.father` 與子代的小樹。右:5 個位點的表(母本、子代、候選父本);1.6 秒起逐位點畫出子代從母本拿到的那一個(淡紫線),5.2 秒起逐位點檢查父本有沒有 `NEED_DAD[i]`(有就畫藍線與勾,沒有就寫「沒有 100」);8.5 秒寫結論(0 個不符:不能排除;1 個不符:先不排除、再多驗;2 個以上:排除) |
| 6 | `hybrid` | 16 | 0、5.5、10.5 | 上:物種甲(母本,結種子的一方)、F1、物種乙(父本,給花粉的一方),圖示依 `S.group` 換成闊葉樹或針葉樹。中:三個位點的細胞核 SSR,親本各兩個方塊(淡紫是甲特有、淺藍是乙特有),2.6 秒起 F1 的兩個方塊分別從甲、乙飛過來。下:葉綠體只有一個峰,6 秒起親本各一個峰,8 秒起 F1 的峰(被子植物同甲型、針葉樹同乙型)與虛線箭頭,10.5 秒寫結論 |
| 7 | `copies` | 15 | 0、5、10 | 左:一個葉片細胞(細胞核裡兩份目標位點、10 顆葉綠體裡的小圈代表葉綠體 DNA)與「核 2 份 / 葉綠體可超過 10,000 份」。右:選的樣品(`S.sample`)裡「要 PCR 的那一段」:核 SSR 一排、葉綠體 SSR 一格格(份數縮小很多);5.6 到 9.4 秒依 `keep` 比例斷開,完整的發亮;9.6 秒寫兩種標記各剩幾份完整、驗不驗得到 |
| 8 | `oil` | 17 | 0、4.5、9.5、13.5 | 上:油瓶 → 抽出微量 DNA → 葉綠體 SSR 的 PCR → 電泳(4.5 秒起依序亮起),右上寫這瓶油與標示。中:兩個標記各一片膠,2 到 3.4 秒先跑出小果油茶與大果油茶的對照帶並標長度,9.6 到 11.4 秒跑出這瓶油的帶(`OILS[S.oil].bands`),11.4 秒寫結論。13.5 秒起下方的製油流程(種子、壓榨、粗油、過濾或精製,DNA 量是示意的長條)與「建議的檢查點:粗油之前」 |

播完最後一章會停住(播放器的行為)。使用者在某一章動過控制項,那一章播完也會停住。

## 控制項

全部 `restart: false`:改了值畫面立刻更新,不從頭播;要看過程可以點進度列重播那一章。

| id | 標籤 | 種類 | 章 | 預設 | 效果 |
|---|---|---|---|---|---|
| `rep` | 甲樹的重複次數 | range 4 到 11 | `ssr` | 7 | 甲樹那一列的 CA 個數與產物長度(84 + 2n bp) |
| `tree` | 樣品樹 | seg A/B/C/D | `genotype` | A | 換一棵樹的兩個等位基因(`TREES`):A 98/104、B 102/102(同型合子)、C 94/106、D 96/102 |
| `loci` | 比對的位點數 | range 1 到 28 | `fingerprint` | 28 | 指紋的直條數、累積機率、可分辨棵數、圖上的點 |
| `father` | 候選父本 | seg 甲/乙/丙 | `parentage` | 甲 | 甲 2 個位點不符(排除)、乙全部對得上、丙 1 個不符(先不排除) |
| `group` | 植物類群 | seg 被子植物/針葉樹 | `hybrid` | 被子植物 | 圖示換闊葉或針葉;F1 的葉綠體峰跟母本(甲型)或父本(乙型) |
| `sample` | 樣品 | seg 新鮮葉片/乾燥木材/油 | `copies` | 乾燥木材 | 份數與完整比例(`SAMPLES`),以及兩種標記的結論 |
| `oil` | 油品 | seg 小果油茶油/大果油茶油/兩種種子混榨/市售:標示小果 | `oil` | 小果油茶油 | 這瓶油的帶(`OILS`)與結論 |

測試或除錯可以用 `__lesson.go('oil')`、`__lesson.state.oil = 'mix'`、`__lesson.time = 16`、`__lesson.redraw()`。

## 數值:有出處的與示意的

有出處(來源見下一節):

- 紅檜:36 個 SSR 位點,單一位點 PI 0.114 到 0.897、平均 0.431;28 個不連鎖位點 CPI 1.652 × 10⁻¹²,99.99% 信心下可分辨 6,000 萬棵;全臺族群 3,206 ± 320 萬棵;6 個位點 CPI 1.728 × 10⁻⁵(Huang 2022)。
- 可分辨棵數的算法:論文寫 CL = (1 − CPI)^N,頁面解出 N = ln(CL) ÷ ln(1 − CPI)(`canTell`,CL = 0.9999);`NEED` = −ln(0.9999) ÷ 3,206 萬 ≈ 3.1 × 10⁻¹²,是「分辨全臺紅檜」所需的累積機率。這條虛線是由論文的公式與族群數換算的,不是論文畫的線。
- 臺灣扁柏的盜伐案:以 19 個不連鎖位點把 3 件查獲木材比對回 3 棵被害木;乾燥木材 22 個樣品 7 個成功(Huang 2020)。
- 一個葉片細胞的葉綠體 DNA 可超過 10,000 份(Morley & Nielsen 2016 的摘要)。
- 親子排除:親子每個位點至少共有一個等位基因,實務上常要兩個位點不符才排除(Jones 2010)。
- 扁柏屬種間雜交的葉綠體 DNA 和父本相同(Kondo 1998);針葉樹的葉綠體 DNA 由父本遺傳(Neale 1989);胞器 DNA 大多由母本遺傳(Greiner 2015)。
- 苦茶油:兩個葉綠體 SSR 分辨大果油茶與小果油茶;小果油茶的後代與母樹基因型相同(母系遺傳);製油各步驟都能判讀、最好的檢查點在粗油之前;驗出兩款臺灣在地苦茶油用的是進口種子(Food Anal Methods 2023 的摘要)。大果油茶(油茶 *C. oleifera*)與小果油茶(短柱山茶 *C. brevistyla*)的名稱依農業部的資料。

示意(畫面上與「資料來源」最後一條都有標):

- 所有序列(`ALN`、`FL`、`FR`、`TPL`)、重複次數、兩側固定序列 84 bp、等位基因長度(`TREES`、`MOTHER`、`CHILD`、`FATHERS`、`SP_A`、`SP_B`、`F1`)。
- 每個位點的 PI(`PI`):論文每個位點的值在表 2 的圖片裡讀不到,所以用示意值。選法:落在論文的 0.114 到 0.897、平均 0.435(論文 0.431)、由小到大排,前 6 個相乘 1.72 × 10⁻⁵、28 個相乘 1.65 × 10⁻¹²,接近論文的兩個累積值。指紋直條裡短線的位置(`FP`、`FP2`)與別棵樹剛好相同的位點(`SAME`)也是示意。
- 毛細管電泳的到達時間、峰寬與峰高;標準片段只畫 90、100、110 bp 三支(實際的標準品片段更多)。
- 第 7 章的份數、完整比例與斷裂方式(`SAMPLES`);畫面寫明「份數縮小很多」。
- 兩個葉綠體 SSR 在兩種油茶的長度(`CP1`、`CP2`:152/146、203/211 bp)、混榨時帶的強弱、製油流程各步驟的 DNA 量長條。論文全文沒有讀到,實際的標記名稱與長度未確認。

## 科學內容的來源

- Huang CJ, et al. 2022. SSR individual identification system construction and population genetics analysis for *Chamaecyparis formosensis*. Sci Rep 12:4126. https://pmc.ncbi.nlm.nih.gov/articles/PMC8904461/ (Results 的 Developing *C. formosensis* individual identification system 一節;Materials and methods 同名一節有 PI、PD 的定義)
- Huang CJ, et al. 2020. Development and technical application of SSR-based individual identification system for *Chamaecyparis taiwanensis* against illegal logging convictions. Sci Rep 10:22095. https://pmc.ncbi.nlm.nih.gov/articles/PMC7744516/ (摘要與 Results;注意:這篇是臺灣扁柏,不是紅檜)
- Vieira MLC, et al. 2016. Microsatellite markers: what they mean and why they are so useful. Genet Mol Biol 39(3):312–328. https://pmc.ncbi.nlm.nih.gov/articles/PMC5004837/ (Definition and genome occurrence…:聚合酶滑動、共顯性、多等位;Genotyping:18 到 25 個鹼基的引子在兩側、膠或毛細管電泳;In-silico prospecting…:葉綠體 SSR 多是 A/T 單鹼基重複)
- Thermo Fisher, How to Conduct Fragment Analysis. https://www.thermofisher.com/us/en/home/life-science/sequencing/sequencing-learning-center/capillary-electrophoresis-information/how-conduct-fragment-analysis.html (一條引子帶螢光、已知長度的標準片段、雷射激發、單一鹼基的解析度)
- Jones AG, et al. 2010. A practical guide to methods of parentage analysis. Mol Ecol Resour 10:6–30. https://doi.org/10.1111/j.1755-0998.2009.02778.x (Box 1 與 Exclusion 一節)
- Waits LP, et al. 2001. Estimating the probability of identity among genotypes in natural populations: cautions and guidelines. Mol Ecol 10:249–256. https://doi.org/10.1046/j.1365-294x.2001.01185.x (理論的 PI 比實際偏低;近親的 PI 當作保守的上限;頁面「兩棵樹不是近親時才能相乘」的依據)
- Anderson EC, Thompson EA. 2002. A model-based method for identifying species hybrids using multilocus genetic data. Genetics 160:1217–1229. https://pmc.ncbi.nlm.nih.gov/articles/PMC1462008/ (物種間固定差異的等位基因、F1 與回交的分類)
- Wheeler GL, et al. 2014. A review of the prevalence, utility, and caveats of using chloroplast simple sequence repeats for studies of plant biology. Appl Plant Sci 2(12):1400059. https://pmc.ncbi.nlm.nih.gov/articles/PMC4259455/ (葉綠體 SSR 多為 A/T 單鹼基重複、通常單親遺傳、用來判斷雜交的方向)
- Kondo T, et al. 1998. Paternal inheritance of chloroplast and mitochondrial DNA in interspecific hybrids of *Chamaecyparis* spp. Breed Sci 48:177–179. https://doi.org/10.1270/jsbbs1951.48.177 (*C. obtusa* × *C. pisifera* 的 4 個雜交後代,葉綠體與粒線體 DNA 都和父本相同)
- Neale DB, et al. 1989. Chloroplast and mitochondrial DNA are paternally inherited in *Sequoia sempervirens*. PNAS 86:9347–9349. https://pmc.ncbi.nlm.nih.gov/articles/PMC298492/ (摘要:至今研究過的針葉樹,葉綠體 DNA 都是父系遺傳)
- Greiner S, et al. 2015. Why are most organelle genomes transmitted maternally? BioEssays 37:80–94. https://pmc.ncbi.nlm.nih.gov/articles/PMC4305268/ (胞器 DNA 大多母系遺傳;Box 3:約三分之一研究過的物種有雙親傳遞的跡象)
- Morley SA, Nielsen BL. 2016. Chloroplast DNA copy number changes during plant development in organelle DNA polymerase mutants. Front Plant Sci 7:57. https://pmc.ncbi.nlm.nih.gov/articles/PMC4740508/ (摘要:葉片細胞可超過 10,000 份)
- Deguilloux MF, et al. 2002. Novel perspectives in wood certification and forensics: dry wood as a source of DNA. Proc R Soc B 269:1039–1046. https://pmc.ncbi.nlm.nih.gov/articles/PMC1690996/ (摘要:乾燥木材的 DNA 多半已降解,短而份數多的序列(葉綠體、粒線體、重複的核序列)最容易驗到)
- Xia Y, et al. 2025. Magnetic nanoparticle-based DNA isolation from refined soybean oil: a cost-effective approach for GM testing. Foods 14(18):3186. https://pmc.ncbi.nlm.nih.gov/articles/PMC12469460/ (精製油的 DNA 極少又嚴重斷裂;粗油與冷壓油比較多;PCR 產物設計在 200 bp 以下)
- Food Anal Methods. 2023;16(11–12):1635–1645. https://doi.org/10.1007/s12161-023-02532-2 (苦茶油的葉綠體 SSR;只讀到摘要)
- 農業部特用作物資料(大果油茶 *C. oleifera* 與小果油茶又稱短柱山茶 *C. brevistyla*):https://kmweb.moa.gov.tw/subject/subject.php?id=35465 (PDF;另一份林業研究專訊把小果種寫成細葉油茶 *C. tenuifolia*,分類上有分歧,頁面依農業部與上面那篇論文用 *C. brevistyla*)

頁面「資料來源」只列最主要的 5 條加 1 條示意說明;完整清單在 `INSTRUMENTS.md` 的這一節。

## 修改時要注意

- **改 `PI`**:保持在 0.114 到 0.897 之間、由小到大排,並讓 `CPI[5]` ≈ 1.728 × 10⁻⁵、`CPI[27]` ≈ 1.652 × 10⁻¹²;字幕第 4 句、重點整理與「資料來源」裡的數字要一起對。
- **改 `TREES`**:長度要避開標準片段 90、100、110 bp(不然綠色的峰會疊在橘色的峰上),也要在電泳圖的 88 到 112 bp 範圍裡;`rep` 的最大值 11 對應 106 bp。
- **改第 5 章的基因型**:子代每個位點都要剛好有一個等位基因只在母本身上(`FROM_MOM`),避免子代兩個都和母本相同造成不能判斷哪一個來自父本;`FATHERS` 的不符個數決定三種結論。
- **改 `OILS` 或 `CP1 / CP2`**:膠的範圍寫在 `gels` 陣列(標記 1 是 140 到 160 bp、標記 2 是 195 到 220 bp)。
- 加字時注意手機的 1.3 倍放大:字至少 13 px,同一高度的兩段字之間留三成以上的空間;畫面左上、右上不要塞太多字。
- 文字用半形 `,` `:` `;` `()`、全形「。」「、」「」;不要用破折號,不寫「可能」「探索」這類空泛詞。
- 文獻依整區的引用規則:一般寫第一作者加 et al.;苦茶油那篇只寫期刊、卷頁與 DOI,不寫作者。不要加上研究室或老師的名字。

## 修改後要檢查

1. 語法:把 `<script type="module">` 的內容抽成 .mjs,跑 `node --check`。
2. 截圖:用 Playwright 對每一章的 0.35、0.75、1 倍時間點截圖(742 × 298),再截 1280 × 800、384 × 686 的整頁;手機尺寸(字放大 1.3 倍)也要逐章看一次。看:主控台沒有錯誤、字沒有疊在一起、沒有東西超出畫面、每章的重點看得出來。
3. 控制項:每個控制項用介面點過(或改 `__lesson.state` 後 `__lesson.redraw()`),畫面要立刻改變,而且只在對應的章節出現。
4. 鍵盤左右鍵換章、網址 `#oil` 這類可以直接打開那一章。
5. `node scripts/check-site.mjs`(統整進入口與清單之後)。

## 已知限制與待確認

- 苦茶油那篇只讀到摘要:兩個葉綠體 SSR 的名稱、重複單位與實際長度、製油流程的步驟細節、混合比例的偵測下限都未確認,畫面上的長度與流程是示意。
- 紅檜論文每個位點的 PI 在表格圖片裡,沒有逐一抄錄;頁面用示意值,只對上論文的範圍、平均與兩個累積值。
- 臺灣扁柏那篇的結論段寫「五件查獲木材比對回三棵被害木」,摘要與結果寫三件;頁面依摘要與結果寫 3 件。
- 這份教材的規劃說明把 2020 年那篇寫成紅檜;查證後是臺灣扁柏(*C. taiwanensis*),2022 年那篇才是紅檜(*C. formosensis*)。頁面已依論文改正。
- 大果油茶 *C. oleifera*、小果油茶(短柱山茶)*C. brevistyla* 的對應,是從搜尋引擎對農業部那份 PDF 的摘錄確認的;PDF 本身的中文字抽不出來,沒有逐字核對。苦茶油那篇論文的摘要也用 *C. brevistyla*,兩者一致。
- 第 7 章「油裡的核 SSR 幾乎驗不到」是示意的極端情況;實際上冷壓或粗製的油有時也能驗核 DNA,所以字幕只說葉綠體標記「比較容易」。
