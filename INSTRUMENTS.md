# 儀器原理

用互動 3D 動畫說明實驗室儀器的原理;「生化原理」一區用 2D 動畫講分子生物學與生物化學的實驗原理。

## 離子阱質譜原理(以 LCQ Deca XP 為例)

一份教材兩個畫面,從分頁列的「離子阱質譜」一組切換(2026-10-13 起;拆開探索原本是另一份教材「LCQ 離子之旅」,網址沒有變):

- 動畫講解:https://tung-beauregard.github.io/instrument-principles/lcq/
- 拆開探索:https://tung-beauregard.github.io/instrument-principles/lcq-3d/

### 動畫講解(lcq/)

沿著離子走的路徑看一遍離子阱質譜儀的硬體:電灑游離、加熱毛細管、截取錐、四極桿與八極桿、離子阱、偵測器。後半段說明離子阱怎麼依質荷比把離子分開,接著看真實質譜上常見的加成離子、團簇離子、同位素峰與負離子模式,最後示範 MS/MS。範例儀器是 Thermo Finnigan LCQ Deca XP。

- 打開就自動播放,附中文字幕,共 16 章,約 6.5 分鐘
- 暫停後可以拖曳旋轉視角;空白鍵播放或暫停,左右方向鍵切換章節
- 網址跟著章節改變(例如 `#scan`),複製網址就能分享那一章;`?t=3:00` 從指定時間開始,`#lab` 直接開操作台
- 說明視窗裡有每一章的字幕文字稿,點章名就從那一章開始播放;螢幕閱讀器也讀得到字幕
- 「自己操作」可以調射頻振幅、做掃描,切換正負離子,做 MS² 與 MS³,用放大掃描看同位素峰與電荷數,關掉自動增益控制看離子太擠時峰怎麼偏移
- 說明視窗裡可以把整段動畫錄成 1080p 的 MP4

#### 數值與示意

主要數值取自 Finnigan LCQ Series Hardware Manual、LCQ Deca Hardware Manual、LCQ Deca XP Plus 規格表、March (1999) 與 Wong & Cooks (1997)。約 280 kHz 的端帽交流頻率與每 m/z 約 4.25 V 是依這些數值計算的,手冊沒有直接寫。

離子阱尺寸的出處:R. E. March,〈Ion Trap Mass Spectrometers〉,Encyclopedia of Spectroscopy and Spectrometry(Academic Press,1999),原文是「For the ion trap in the LCQ and GCQ instruments, r0 = 0.707 cm and z0 = 0.785 cm」,同一段也列出上面 q_z 的公式。2026-10-13 以前這裡與說明視窗把尺寸標成 March (1997);那篇是同一作者的入門文章,全文需要登入,這次沒有讀到,所以改標讀得到原文的 1999 年這一篇。

毛細管長度、桿子尺寸與偵測器幾何是示意;液滴、離子雲與振盪幅度已放大,時間也放慢了很多倍。

公式與推算(程式裡的位置見 lcq/MAINTENANCE.md「物理與數值」):

- q_z = 8eV / (m (r₀² + 2z₀²) Ω²)。用 r₀ = 7.07 mm、z₀ = 7.85 mm、Ω = 2π × 760 kHz 得 q = 0.1954 × V / (m/z),V 是環形電極電壓的零到峰值。
- 共振射出時的電壓 V = 0.83 / 0.1954 × m/z ≈ 4.25 V × m/z:m/z 195、524、1222 分別約 830、2230、5190 V;8500 V 對應 m/z 約 2000,若等到 q = 0.908 才排出只到約 1830。
- 端帽交流頻率:a = 0 時 β(0.83) ≈ 0.736,軸向振盪頻率 β × 760 kHz / 2 ≈ 280 kHz。MS/MS 活化的 q = 0.25 對應 β ≈ 0.179,約 68 kHz。
- 低質量截止:留得住的最小 m/z = 0.1954 × V / 0.908;MS/MS 把 m/z 611 放到 q = 0.25(約 782 V)時約 168。
- 平均下來的位能井深度 D ≈ q × V / 8(擬位能近似)。
- m/z 150 掃到 2000:1850 ÷ 5500 ≈ 0.34 秒。

示範樣品:LCQ 正離子校正液的咖啡因 195、MRFA 524 與 Ultramark 的一根 1222;天然物檜木醇 165、兒茶素 291、槲皮素 303、扁柏脂素 355、蘆丁 611,都是 [M+H]⁺。蘆丁標準品另有加成離子 [M+Na]⁺ 633、[M+K]⁺ 649 與團簇離子 [2M+H]⁺ 1221、[2M+Na]⁺ 1243;負離子模式是 [M−H]⁻(蘆丁 609)、甲酸根加成 [M+HCOO]⁻ 655 與團簇 [2M−H]⁻ 1219;二價的例子是緩激肽 [M+2H]²⁺ 530.79。峰高都是示意。

- m/z 都是單一同位素值,用離子的化學式重算過(2026-10-20)。加成離子的質量依 Fiehn 實驗室的 ESI 加成離子表(根據 Huang 等,J Am Soc Mass Spectrom 1999;H⁺ 1.007276、Na⁺ 22.989218、K⁺ 38.963158、HCOO⁻ 44.998201),分子量取自 ChEBI:蘆丁 610.15338、緩激肽 1059.56140。
- 同位素峰的高度依 IUPAC 的代表性同位素豐度(¹³C 1.07%、¹⁵N 0.364%、¹⁸O 0.205% 等)逐原子計算:蘆丁 [M+H]⁺ 的 612 約是 611 的 0.30 倍,緩激肽二價離子的同位素峰間距 0.5。
- 蘆丁 MS/MS 的碎片 465(少鼠李糖)、303(少芸香糖)與 MS³ 的 465 → 303(少葡萄糖)是黃酮苷常見的裂解方式,不是這台儀器的實測。負離子 609 的碎片 300 與 301:PLOS ONE 2018 的圖 4 列「m/z = 609.2 [M-H]-; m/z = 301.0」;He 等(J Pharm Biomed Anal 2013)以負離子 MRM 定量蘆丁,搜尋摘要寫它用 609 → 300(只讀到摘要,沒有讀到這個轉換的原文),搜尋摘要也說多篇資料以 300 較高。哪一個高要看儀器與碰撞能量,動畫各畫一半。扁柏脂素沒有酸性的 OH,負離子模式畫得很弱。
- 峰寬取自同系列較新機型 LCQ Fleet 的規格表(PS63262-EN)的 Table 1:每秒 5,000 的 Enhanced 半高寬 0.45、Zoom 0.3(Normal 是 0.7、每秒 12,500);Deca XP 的一般掃描是每秒 5,500,所以一般掃描用 0.45。同一份規格表寫 ZoomScan 是「a high-resolution, full-range scan to resolve isotopic envelopes」,常用來判斷胜肽的電荷數;自動增益控制讓離子阱「always filled with the optimum number of ions」(Deca XP Plus 規格表也有同樣的句子)。
- 空間電荷只畫出方向(離子太擠時峰往大的 m/z 偏、變寬),數值是示意。
- 負離子模式的轉換電極改加 +15 kV:±15 kV 出自 LCQ 手冊(見下方拆開探索一節)。負離子撞上轉換電極放出正離子、正離子再撞倍增器第一級放出電子,出自 Hamamatsu R6985-80 規格書第 2 頁(那是四極柱用的偵測器,圖上是 ±10 kV)。
- 團簇離子在毛細管溫度較高時常會解離,依搜尋摘要裡的一篇 ESI 研究(丙酮、乙醇的非共價團簇在高溫下變少),沒有讀到原文,也不是蘆丁本身的資料。

各項數值的來源頁碼尚未逐項記錄。

#### 來源連結(2026-10-20 新增的部分)

- Fiehn 實驗室 ESI 加成離子表:https://fiehnlab.ucdavis.edu/staff/kind/metabolomics/ms-adduct-calculator
- ChEBI 蘆丁:https://www.ebi.ac.uk/chebi/CHEBI:28527 ;緩激肽:https://www.ebi.ac.uk/chebi/CHEBI:3165
- NIST 的同位素組成表(列出 IUPAC 的代表性豐度):https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl
- PLOS ONE 2018,蘆丁衍生物的質譜(圖 4):https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0203159
- He 等,J Pharm Biomed Anal 84:189–195(2013):https://doi.org/10.1016/j.jpba.2013.06.019
- LCQ Fleet 規格表 PS63262-EN:https://assets.thermofisher.cn/TFS-Assets/CMD/Specification-Sheets/PS-63262-LCQ-Fleet-Ion-Trap-LC-MSn-PS63262-EN.pdf
- Hamamatsu R6985-80 規格書:https://www.hamamatsu.com/content/dam/hamamatsu-photonics/sites/documents/99_SALES_LIBRARY/etd/R6985-80_TPMH1339E.pdf

#### 技術

單一 HTML 檔(lcq/index.html),用 three.js 0.183.2 繪圖,不需要建置。底部的到站人數由免費的 Abacus 計數服務記錄,同一台裝置只算一次。程式分區、物理數值與章節時間軸見 lcq/MAINTENANCE.md。

### 拆開探索(lcq-3d/)

仿照 [The Plane of Focus](https://sael.net/plane-of-focus/) 的拆解式 3D 呈現,把 LCQ Deca XP 的離子路徑排在一條導軌上,可以在外觀、組裝、展開之間切換,跟著離子從電灑噴針走到偵測器。和「動畫講解」是同一台儀器的另一種呈現,著重零件剖面、壓力分區與穩定圖。

- 「播放導覽」(或按 C)自動運鏡,附中文字幕,共 12 段,約 2 分 21 秒
- 機身切換外觀、組裝、展開;點零件會在左側顯示說明,鏡頭也會靠過去
- 掃描模式切換 Full MS 與 MS/MS;下方兩個示波窗即時顯示 Mathieu 穩定圖與質譜
- 拖曳「RF 振幅」滑桿手動掃描,拉回最左邊會重新注入離子
- 標題說明、控制面板、穩定圖、質譜與導覽字幕都可以拖動、從右下角縮放,位置記在瀏覽器裡;「重設版面」還原
- 「錄成影片」把整段導覽逐格算圖存成 1080p MP4(需要支援 WebCodecs 的 Chrome 或 Edge)

#### 數值與示意

規格取自 LCQ Deca Hardware Manual (1999)、LCQ Series Hardware Manual、LCQ Deca XP Plus 規格表與 Wong & Cooks, Current Separations 16:3:

- 離子光學順序:加熱毛細管、管透鏡、截取錐、方柱四極柱、多極柱間透鏡、八極柱、入口透鏡、離子阱;多極柱 RF 2.45 MHz、400 Vp-p
- 壓力:毛細管到截取錐約 1 Torr,四極柱區約 10⁻³ Torr,分析區約 2×10⁻⁵ Torr;阱內氦氣約 1 mL/min,約 1 mTorr
- 離子阱:r₀ = 0.707 cm、z₀ = 0.785 cm(March 1999,出處見上方動畫講解一節;文獻裡另一個常見的 0.783 cm 是 1995 年以前 r₀ = 1.00 cm 的商用離子阱把 z₀ 拉長約 10.6% 的值,不是 LCQ),RF 0.76 MHz、最高約 8500 V (0-p),共振射出點 q_z = 0.83,掃描約每秒 5500 u
- MS/MS:隔離用 5 至 380 kHz 的寬頻波形;Activation Q 0.25、30 ms(預設值出自 LCQ Fleet 手冊,XP Plus 文獻採用相同設定)
- 偵測:轉換打拿極 ±15 kV,連續式電子倍增管 −0.8 至 −2.5 kV、增益約 3×10⁵

計算推估:穩定圖由 Mathieu 方程數值積分(RK4,以單值矩陣的跡 |tr| < 2 判斷穩定)畫出;MS/MS 活化時的低質量截止是 0.25 / 0.908 ≈ 前驅離子 m/z 的 27%。

教學示意:離子源畫成正交噴灑(XP Plus 的設計;原始 Deca XP 與 XP MAX 的噴灑角度不同,這裡未區分機型);示範樣品是 LCQ 正離子校正液(咖啡因 m/z 195、MRFA m/z 524、Ultramark 1621),質譜峰高為示意;零件尺寸、離子振盪頻率與時間尺度都經過調整;主控台上的調諧參數是文獻中的正離子示例值;阱內 8 字形軌跡用低 q 近似 ω_z = 2ω_r 繪製。模擬結果不可用於實樣鑑定。

#### 技術

單一 HTML 檔(lcq-3d/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區與修改方式見 lcq-3d/MAINTENANCE.md。

## GC-MS 氣相層析質譜

網頁:https://tung-beauregard.github.io/instrument-principles/gc-ms/

把 ALS 自動進樣器、氣相層析儀與四極桿質譜儀拆開來看,跟著一針精油樣品走一趟:進樣、在 30 m 管柱裡依滯留因子 k 分開,再進質譜帶電、碎裂、按質荷比篩選。頁尾小字寫「以 Agilent 6850 GC(含 ALS 自動進樣器)與 5973N MSD 為例」。

- 「導覽」讓鏡頭跟著一個成分的分子走完 8 站:進樣、進樣口、管柱、傳輸線、離子源、四極桿、偵測器、完成(跟 α-Pinene、3 °C/min 時約 71 秒)
- 放大鏡:在管柱內部看分子在液膜與載氣之間進出;暫停在峰上會切到離子源,示範 M⁺• 怎麼形成、怎麼斷成碎片
- 質譜面板的「四極桿」檢視畫出 Mathieu 穩定圖,可以把四極桿固定在某個 m/z
- 動畫說明(控制列的「動畫」、說明視窗、牆上的四張說明圖):走走停停、保留指數 KI、電子撞擊游離、四極桿(翻轉的馬鞍)
- 可切換升溫速率(3、5、10 °C/min)、拆開儀器,播放速度有 0.1× 與 0.5× 慢動作
- 層析圖可拖曳捲動、點峰追蹤、點質譜線抽出 EIC;峰表附用正烷烴換算的 KI

### 數值與示意

動畫說明的數字:走走停停的 k = 1 與 3 是為了說明挑的整數,每次停留取平均值上下 30%(真的分子每秒進出液膜非常多次,峰才窄;畫面放慢後若照完全隨機的停留時間,一團分子會散得太開);保留指數的時間與 KI 直接取本頁的滯留模型(每分鐘 3 °C:C9 4.68、C10 7.48、α-Pinene 5.64 分,KI 934;每分鐘 10 °C:C9 3.52、C10 4.78、α-Pinene 3.98 分,KI 937;2026-10-22 重算相符);電子撞擊游離的斷法與質譜取本頁 α-Pinene 的資料(136、121、93,主要離子相對強度 6% 以上;斷法寫在動畫自己的程式裡,沒有讀成分表的碎片資料);四極桿那段的物理見下方「質譜儀-不同分析器比較」的電場形狀,三顆球用 α-Pinene 的碎片 77、93、136,「每秒掃 3、4 次」取本頁的掃描間隔 0.0048 分。

管柱 HP-5MS 30 m × 0.25 mm × 0.25 μm、He 1.0 mL/min、柱溫 60 °C 起以 3、5 或 10 °C/min 升到 220 °C 後保持 3 min。各成分的滯留由 5% 苯基管柱(HP-5 類)的 KI 值換算(簡化的熱力學模型;15 個 KI 和 Babushok 等 2011 的 5% 苯基統計值相差 −3 到 +4,見下表),峰寬以約 7 萬理論板數估算。樣品是虛構的示範組成;質譜只取主要離子,強度為概略值,只供說明,不可拿來鑑定。質譜螢幕與說明寫掃描 m/z 40 到 400,模擬的質譜只算到 230(示意)。儀器外觀與尺寸是示意。

公式與推算(程式裡的位置見 gc-ms/MAINTENANCE.md「滯留模型與數值」;數字 2026-10-22 用 Node 跑本頁程式算出,並在 Chrome 156、Firefox 157、WebKit 27.2 以主控台的 `window.GCMS` 核對流出時間、烷類與 KI,三者相同):

- 升溫程式:T(t) = min(60 + r·t, 220) °C,r = 3、5、10 °C/min;全長 (220 − 60) ÷ r + 3 = 56.33、35.00、19.00 min(按鈕寫「共 56、35、19 min」)。
- 停留倍數:ln k = (45000 + 4600(x − 10)) ÷ (R·T) − (14.2 + 0.8(x − 10)),x = KI ÷ 100(等效碳數),T 以 K 計,R = 8.314 J/(mol·K);也就是依碳數線性內插的吸附焓(45 + 4.6(x − 10) kJ/mol)與熵項。程式註解寫「HP-5MS、相比 250 校正過」:相比 β = 管內半徑 ÷ (2 × 膜厚) = 125 μm ÷ 0.5 μm = 250;四個係數的校正依據沒有記錄(待確認)。60 °C 時 α-Pinene 的 k = 4.58、(E)-Caryophyllene 280(說明視窗「將近 300」);Caryophyllene 130 °C 時 5.02、135 °C 時 3.97(說明視窗「130 °C 左右 k 降到 4 上下」)。
- 在管柱裡移動:dz/dt = 1 ÷ (t_M(1 + k)),z 是走過的管長比例,t_M = 1.37 min;z 到 1 的時間就是流出時間。α-Pinene 在 3、5、10 °C/min 為 5.64、4.95、3.98 min,(E)-Caryophyllene 24.62、17.07、10.37 min。
- 峰寬:σ = √(1/N + σ₀²) × t_M × (1 + kₑ),N = 70,000、σ₀ = 0.0006(進樣帶寬,以管長的比例計),合起來相當於約 68,000 板;kₑ 是流出那一刻的 k。α-Pinene 3 °C/min 時 σ 1.00 s(半高寬 2.37 s)、10 °C/min 0.60 s。三個醇類加指數拖尾 τ = 0.7σ。
- 保留指數:同一個模型跑 C7 到 C18 正烷烴,KI = 100n + 100(tR − tₙ) ÷ (tₙ₊₁ − tₙ)(van den Dool 與 Kratz 的升溫式)。α-Pinene:3 °C/min 為 900 + 100 × (5.638 − 4.677) ÷ (7.482 − 4.677) = 934;10 °C/min 為 937。成分表「KI(本次)」換速率時最多變 3(α-Pinene、Camphene),其他不超過 2(說明視窗寫「只差一兩個單位」,略少)。
- 分離度:Rs = ΔtR ÷ (2(σ₁ + σ₂))(底寬 4σ)。Limonene 與 1,8-Cineole:3、5、10 °C/min 相差 4.3、3.0、1.7 秒,Rs 0.86、0.78、0.65。說明視窗的「3 °C/min 約 0.9」相符,「10 °C/min 只剩 0.7」比模型高(程式未修改,見 gc-ms/MAINTENANCE.md「已知的不一致」)。
- 層析圖(離子總數):Σ amt × 7800 × 峰形 + 基線 2.2×10⁴ + 5.5×10⁴ × e^((T − 220)/40) + 雜訊;每個成分的感度相同,所以峰面積比就是組成比。
- 質譜:各成分的主要離子依當下的量相加,每根 ±8% 起伏;背景離子(m/z 40、41、43、44、55、57、69、73、147、207、208、209)隨柱溫變強。比對用強度開根號後的餘弦相似度:峰頂 97 到 99,Limonene 與 1,8-Cineole 正中間約 80。
- 掃描間隔 0.0048 min = 0.288 s,每秒約 3.5 張質譜(動畫說明「每秒掃三、四次」)。
- 四極桿穩定圖:a ∝ U/(m/z)、q ∝ V/(m/z);第一穩定區的邊界用 Mathieu 特徵值 a₀ 與 b₁ 的級數,頂點 (0.706, 0.237);掃描線 a = 0.3306q(U/V ≈ 0.165)和邊界交在 q 0.694 與 0.708,放行 m/z 93 時能通過的是 92.1 到 93.9。
- 碎片的質量差用整數質量(C 12、H 1、O 16);每種斷法的帶電碎片加中性碎片都等於分子量(2026-10-22 逐一核對)。α-Terpineol 的質譜少了 m/z 154,但碎片示範有 M⁺• 154(程式未修改)。

規格與數值的狀態:

| 項目 | 頁面上的值 | 狀態 | 來源或依據 |
| --- | --- | --- | --- |
| 代表機型 | Agilent 6850 GC(含 ALS)與 5973N MSD,只在頁尾小字與說明 | 示意的代表機型 | 頁面文字。6850 Series II 規格表:寬度只有 6890N 的一半、柱溫箱 202 × 200 × 105 mm(高 × 寬 × 深)、管柱架直徑 130 mm |
| 儀器外觀與尺寸 | 模型的 GC 寬 50、高 54、深 56 cm,爐腔寬 37、高 40、深 49,管柱圈直徑 18 | 示意(GC 比實機寬,柱溫箱大很多) | 程式 `L`;Series II 規格表的整機寬 283 mm、高 490 mm(到 FID 蓋頂)、深 568 mm,柱溫箱與管柱架見上一列 |
| 管柱 | HP-5MS 30 m × 0.25 mm × 0.25 μm | 原廠規格(型號) | 19091S-433 的經銷商頁面列 30 m、0.25 mm、0.25 µm、−60 到 325/350 °C、Low Polarity(原廠頁面擋自動讀取,沒有讀到) |
| 固定相 | 「5% 苯基聚矽氧烷」(說明視窗) | 文獻(原廠寫法待確認) | Babushok 等 2011 把 HP-5 列在 5% 苯基的二甲基矽氧烷相;經銷商頁面只寫 Low Polarity |
| 相比 | 250 | 計算 | 125 μm ÷ (2 × 0.25 μm) |
| 載氣、柱溫程式、溶劑延遲、進樣 | He 1.0 mL/min;60 °C 起 3、5、10 °C/min 到 220 °C 保持 3 min;3 min;1 μL、分流、進樣口 250 °C | 方法設定(示意) | 頁面;升溫在 6850 規格表的範圍內(標準爐比室溫高 5 °C 到 350 °C,六段升溫) |
| 死時間 | 1.37 min(說明視窗「約 1.4 min」) | 推估(待確認) | 程式 `COL.tM`;沒有找到原廠的計算或量測值 |
| 理論板數 | 約 7 萬 | 推估(待確認) | 程式 `COL.N`;Restek 的技術文件寫這種管柱約 12 萬板,頁面的值偏低,依據沒有記錄 |
| 離子源溫度 | 230 °C | 常用設定(只見搜尋摘要) | 搜尋摘要寫 5973 的 EI 離子源預設 230 °C、四極桿 150 °C;Agilent 的原文讀不到 |
| 電子能量 | 70 eV | 通用慣例 | Shimadzu 說明頁:多數質譜庫以 70 eV 量測、訊號在 70 eV 附近最強 |
| 游離所需能量、電子倍增器增益 | 約 8 到 10 eV;放大十萬倍以上 | 待確認 | 頁面文字;Shimadzu 頁只寫約 10 eV 以下產生不了離子;倍增器的值沒有找到 5973N 的出處 |
| 掃描 | 螢幕與文字寫 40 到 400 u、每 0.288 s 一張;模擬只到 230 | 示意 | 程式 `MZ1`、`SCAN` |
| 成分的 KI | 見下表 | 文獻值(相符) | 程式註解:實驗室 GC 工具內建的萜類 KI 表 |
| 組成、質譜強度、碎片 | 面積 % 合計 100;每個成分 10 到 15 根主要離子;每個成分三種斷法 | 虛構、概略值、常見裂解方式的示意 | 程式註解;化學式與整數質量互相核對過,沒有逐條對文獻 |
| 四極桿穩定圖 | 頂點 (0.706, 0.237) | 理論計算 | Mathieu 級數,和「質譜儀-不同分析器比較」一節引用 Paul 1989 的頂點一致;窗口寬度是示意 |

KI 對照(Babushok 等 2011 的 5% 苯基二甲基矽氧烷相統計;平均 / 中位數 / 50% 範圍;2026-10-22 從 NIST 保存的 PDF 讀出):

| 成分 | 頁面 | 平均 | 中位數 | 50% 範圍 |
| --- | --- | --- | --- | --- |
| α-Pinene | 939 | 936.1 | 937 | 933 到 939 |
| Camphene | 954 | 950.3 | 952 | 948 到 954 |
| β-Pinene | 979 | 977.7 | 979 | 975 到 980 |
| Myrcene | 990 | 989.2 | 991 | 988 到 992 |
| p-Cymene | 1024 | 1024.3 | 1025 | 1022 到 1027 |
| Limonene | 1029 | 1029.5 | 1030 | 1027 到 1032 |
| 1,8-Cineole | 1031 | 1031.8 | 1032 | 1030 到 1034 |
| Linalool | 1096 | 1099.0 | 1099 | 1097 到 1102 |
| Camphor | 1146 | 1143.4 | 1144 | 1142 到 1146 |
| Borneol | 1169 | 1166.2 | 1166 | 1164 到 1169 |
| α-Terpineol | 1188 | 1189.7 | 1189 | 1188 到 1192 |
| Bornyl acetate | 1285 | 1283.5 | 1285 | 1282 到 1288 |
| (E)-Caryophyllene | 1417 | 1420.1 | 1419 | 1417 到 1422 |
| α-Humulene | 1452 | 1453.1 | 1454 | 1450 到 1456 |
| Caryophyllene oxide | 1582 | 1580.6 | 1581 | 1578 到 1583 |

同一篇的純二甲基矽氧烷(非極性)統計比較低(例如 Linalool 1086.3、1,8-Cineole 1022.4),頁面的值和 5% 苯基那一組一致;那篇把 5% 苯基相歸為「slightly polar」,程式註解寫的「非極性管柱」用詞不準(程式未修改)。PDF 抽出的文字沒有表格標題,這裡依固定相的名稱與數值判斷是哪一組。

### 技術

單一 HTML 檔(gc-ms/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區、滯留模型、導覽與動畫說明見 gc-ms/MAINTENANCE.md。

### 來源連結

讀到內容的(2026-10-22):

- Babushok, Linstrom & Zenkevich 2011, Retention Indices for Frequently Reported Compounds of Plant Essential Oils, J. Phys. Chem. Ref. Data 40:043101(doi:10.1063/1.3653552),NIST 保存的 PDF:https://www.nist.gov/document/jpcrd402011retpdf
- Agilent 6850 Series II Network GC System Specifications(5989-0958EN,2010-01-05;第三方網站保存的副本;頁面寫的是 6850,原始 6850 的規格沒有核對):https://cdn.labwrench.com/eMan/manualNo/1228/agilent_technologies_6850_series_ii_gc_system_datasheet.pdf
- HP-5ms 19091S-433 經銷商頁面:https://cz.eshop.altium.net/en/12468-hp-5ms-30m-0-25mm-0-25um
- Restek, Leverage Your MS Vacuum to Significantly Speed Up Analyses(GNAR3505C-UNV,2024;30 m × 0.25 mm 管柱約 12 萬板):https://discover.restek.com/wp-content/uploads/GNAR3505.pdf
- Shimadzu, Electron Energy and Mass Spectrum:https://www.shimadzu.com/an/service-support/technical-support/analysis-basics/gcms/fundamentals/ei/electron_energy_mass.html

只在搜尋摘要看到、沒有讀到原文的:Agilent 19091S-433 原廠頁面、OpenLab 說明「Analyzer Temperature Guidelines」、5973N 硬體手冊(都擋自動讀取,沒有繞過);應用文件 5989-0678EN 的第三方副本是加密的 PDF,沒有解開讀。死時間 1.37 min、`lnk()` 四個係數的校正數據、質譜強度、理論板數 7 萬的依據、電子倍增器「十萬倍以上」、游離能「8 到 10 eV」都沒有找到出處(待確認)。

## UV-Vis 分光光度計

網頁:https://tung-beauregard.github.io/instrument-principles/uv-vis/

把雙光束、雙單色器的紫外可見光分光光度計拆開來看,跟著光從燈走到偵測器:氘燈與鹵素燈、換燈鏡、前置光柵與中間狹縫、主光柵與出口狹縫、分光鏡、參考槽與樣品槽,最後是兩個 Peltier 致冷的光二極體。

- 「導覽」自動播一遍,附中文字幕,共 8 章,約 1 分半(92 秒)
- 拖曳光柵或波長滑桿改變波長(190 到 1100 nm),光路顏色、光柵角度與換燈鏡跟著變;畫面標示的是主光柵,前置光柵也拖得動
- 樣品可選 DPPH 甲醇溶液、福林酚呈色液、葉綠素 a 丙酮溶液與氧化鈥標準溶液;波長寬度(頻寬)可選 0.2、0.5、1、2、4 nm
- 「掃描」量出整條吸收光譜;換頻寬再掃一次,上一條會留著比較,頻寬越寬峰越矮也越寬
- 可切換組裝與展開兩種外觀

### 數值與示意

頁面刻意不顯示型號(2026-10-02 新增時的決定)。說明視窗寫規格取自「原廠技術資料(2020 年 4 月版)」,這一版沒有找到;頁面用到的每一項規格都和 Analytik Jena〈Technical Data SPECORD PLUS Series〉Version 1.2(06/2026)裡 SPECORD 250 PLUS 那一欄相同:雙光束、雙單色器、可變頻寬,190 到 1100 nm、頻寬 0.2、0.5、1、2、4 nm、220 nm 的雜散光 ≤0.005 %T(NaI)、換燈點可設在 300 到 450 nm(這裡用 320 nm)、兩個 Peltier 致冷的矽光二極體偵測器、500 nm 基線雜訊(RMS)≤0.0001 A。同一張表的 50 PLUS、200 PLUS(固定 1.4 nm、沒有致冷)與 210 PLUS(185 到 1200 nm、220 nm 雜散光 ≤0.03 %T)都至少有一項不符,所以推定是 SPECORD 250 PLUS(2026-10-22 讀原文核對)。機內元件的位置、角度與數量是示意;光柵轉角用每毫米 1200 條、夾角 20° 的光柵方程估算(這兩個值是示意,技術資料沒有列刻線密度)。光譜是依文獻吸收峰位置組合的模擬曲線,雜訊依通過的光量估算,不是實測數據。

公式與推算(程式裡的位置見 uv-vis/MAINTENANCE.md「光學與數值」;數字 2026-10-22 用 Node 跑本頁程式算出,讀值卡與影片畫格另在 Chrome 156、Firefox 157、WebKit 27.2 核對,三者相同):

- 光柵方程(定偏角單色器):mλ = 2d sinθ cos(φ/2)。用 m = 1、d = 1/1200 mm、夾角 φ = 20°(示意)得 sinθ = 1200 × λ(nm) × 10⁻⁶ ÷ (2 cos 10°):θ(190 nm) = 6.65°、θ(320 nm) = 11.24°、θ(550 nm) = 19.58°、θ(1100 nm) = 42.08°。畫面上兩片光柵以 550 nm 為基準轉 −12.9° 到 +22.5°。光柵方程只決定轉角,光線與散開的扇形是畫到固定位置的示意。
- 換燈:波長低於 320 nm 由氘燈供光(原廠可設在 300 到 450 nm);319 nm 時吸光度 0.624(氘燈),320 nm 時 0.632(鹵素燈)。
- 吸收帶與頻寬:每個吸收帶是高斯 a·exp(−(λ − c)² / 2σ²);儀器的頻寬(狹縫函數)近似成半高寬等於頻寬的高斯,σ_s = 頻寬 ÷ 2.355。兩個高斯捲積後寬度 σ' = √(σ² + σ_s²),峰高乘 σ / σ'(面積不變)。紫外端另加吸收邊 A_t·exp(−(λ − λ_t) / d_t)。吸光度夾在 −0.05 到 3.3。氧化鈥 451.3 nm:0.2 nm 時 0.860、1 nm 0.849、4 nm 0.720;DPPH 517 nm:0.920 與 0.919(寬的吸收帶幾乎不受頻寬影響)。
- 這個捲積是對吸光度做的;實際儀器平均的是狹縫範圍內的透射光。照實際的做法,氧化鈥 451.3 nm 在 4 nm 時是 0.686(程式 0.720),寬帶的 DPPH、福林酚、葉綠素差不到 0.002(簡化,程式未修改)。
- 透射率與吸光度:T = 10^(−A),A = log₁₀(參考光 ÷ 樣品光);0.920 對應 12%。兩路同時量,燈光變強變弱時相除後抵消(第 06 章示範,閃爍 ±20% 是示意)。
- 比爾定律:A 與濃度、光徑成正比(字幕與牆上說明,程式沒有用濃度計算)。
- 雜訊(推估):σ = 1.2 × 10⁻⁴ × (2 / 頻寬) ÷ √(L(λ) × D(λ) × 10^(−A)),依據是光量 ∝ 頻寬²、散粒雜訊 ∝ 1 / √光量;L、D 是燈與偵測器的相對強度(示意)。500 nm、A = 0 時 0.2、1、2、4 nm 分別是 0.0027、0.00054、0.00027、0.00014 A。程式註解寫「2 nm、500 nm 附近約 0.0001 A(原廠規格 ≤0.0001)」,實際算出 0.00027 A,兩者不一致(程式未修改)。
- 燈與偵測器的相對強度(示意):氘燈 0.3 + 0.7·exp(−((λ − 215) / 110)²);鹵素燈 0.18 + 0.82 × B(λ, 3000 K) ÷ B(966 nm, 3000 K),966 nm 是 3000 K 黑體的峰值(維恩定律 2.898 × 10⁻³ m·K ÷ 3000 K);偵測器 190 nm 0.2、900 nm 最高 1、1100 nm 0.3。
- 掃描:每個樣品都用約 6 秒掃完(範圍 ÷ 6 nm/s,DPPH 每秒 100 nm);原廠最快每分鐘 12000 nm(每秒 200 nm),動畫的速度是示意。

規格與數值的狀態(「技術資料」指上面那份 Version 1.2 的 SPECORD 250 PLUS 一欄):

| 畫面上的內容 | 出現的地方 | 狀態 | 依據 |
| --- | --- | --- | --- |
| 波長範圍 190 到 1100 nm、頻寬 0.2 到 4 nm 五段 | 滑桿、按鈕、字幕、片尾字卡 | 原廠規格 | 技術資料 |
| 雙光束、雙單色器(兩次選波長、光分兩路) | 介紹、第 01 章字幕、片尾字卡 | 原廠規格 | 技術資料;機內兩片光柵與中間狹縫的擺法是示意 |
| 220 nm 的雜散光「不到 0.005 %」 | 第 03 章字幕 | 原廠規格 | 技術資料寫 ≤0.005 %T(字幕的「不到」原文是 ≤) |
| 換燈點可設 300 到 450 nm,這裡用 320 nm | 說明視窗、第 02 章字幕、換燈鏡標籤 | 原廠規格(範圍)、示意(320) | 技術資料 Light source |
| 兩個用致冷晶片降溫的光二極體 | 第 06 章字幕、偵測器、片尾字卡 | 原廠規格 | 技術資料 Detector:兩個矽光二極體,210 與 250 PLUS 用 Peltier 致冷 |
| 濾光片輪「含檢查波長的濾片」 | 濾光片輪標籤 | 原廠規格(內建氧化鈥濾片)、示意(輪的形狀與 6 格) | 技術資料 Spectrometer type |
| 外形(寬 59、深 68.4、高 26 單位,推測 1 單位 = 1 cm) | 3D 模型 | 寬深和原廠相符、高度待確認 | 技術資料 590 × 690 × 290 mm(W × D × H);程式沒有註明外形依據 |
| 樣品室、機內元件的位置與數量 | 3D 模型 | 示意 | 說明視窗與頁尾寫明是示意;原廠樣品室 364 × 185 × 200 mm |
| 光柵每毫米 1200 條、夾角 20°;光柵轉角 | 3D 模型(只決定轉角) | 示意、推估 | 程式註解寫示意;轉角由光柵方程算 |
| DPPH 在 517 nm 吸收最強 | 第 07 章字幕、樣品的 `peak` | 文獻(部分) | Kuncoro & Rijai 2018 在甲醇中測得 515 nm;517 nm 只見於搜尋摘要;328、237 nm 兩帶沒有找到出處 |
| 福林酚呈色在 765 nm | 樣品的 `peak` | 文獻(部分) | OIV/OENO 382B/2010:藍色產物在約 750 到 760 nm 最強、在 760 nm 量;765 nm 只見於搜尋摘要;880 nm 那一帶沒有找到出處,和 765 nm 那帶相加後曲線最高點落在約 780 nm(程式未修改) |
| 葉綠素 663 nm 與 430 nm | 樣品的 `peak`、光譜曲線 | 文獻(部分) | PROMETHEUS 流程(引用 Lichtenthaler 1987)在 100% 丙酮量 662、645、470 nm;430 nm 只見於搜尋摘要;其他 6 帶沒有找到出處,而且沒有葉綠素 b 645 nm 附近那一帶 |
| 氧化鈥 14 個吸收帶(241.1 到 640.5 nm) | 光譜曲線、`peak` 451.3 | 文獻 | NIST SRM 2034 證書表 1 的 1 nm 一欄(第 10 帶對應 2 nm 一欄的 451.32);證書說第 10 帶在頻寬小於約 1 nm 時分成兩個最低點,程式畫成一個 |
| 各吸收帶的峰高與寬度、樣品濃度 | 光譜曲線 | 示意 | 說明視窗寫光譜是模擬的 |
| 雜訊大小 | 掃描曲線 | 推估 | 見上面「雜訊」;和程式註解引用的原廠 ≤0.0001 A 不一致 |
| 吸光度上限 3.3、掃描約 6 秒 | 光譜曲線、讀值、掃描 | 示意 | 技術資料的測量範圍是 −3 到 3 A、最快每分鐘 12000 nm |
| 燈的光譜、偵測器響應、波長的顏色、燈光閃爍 ±20% | 光線亮度、雜訊、第 06 章 | 示意 | 程式註解與影片腳本 |

### 技術

單一 HTML 檔(uv-vis/index.html),用 three.js 0.183.2 繪圖(零件標籤用 CSS2DRenderer),不需要建置,不使用到站人數計數。程式分區、光路、光譜模型與影片時間軸見 uv-vis/MAINTENANCE.md。

### 來源連結

讀到內容的(2026-10-22):

- Analytik Jena, Technical Data SPECORD PLUS Series, Version 1.2(06/2026),英文版:https://analytik-jena.com/import/assets/12561109_TechData_SPECORD_PLUS_Series_en.pdf
- NIST SRM 2034 證書(Holmium Oxide Solution Wavelength Standard,2016-08-29):https://tsapps.nist.gov/srmext/certificates/2034.pdf
- Kuncoro & Rijai, Antioxidant Activity from Lygodium microphyllum Aerial Parts(BROMO 2018,DPPH 在甲醇中 515 nm):https://www.scitepress.org/Papers/2018/83608/pdf/index.html
- OIV 決議 OIV/OENO 382B/2010(總酚,藍色產物約 750 到 760 nm 最強):https://www.oiv.int/node/3351/download/pdf
- PROMETHEUS, Leaf Chlorophyll and Carotenoid Determinations(100% 丙酮量 470、662、645 nm):https://prometheusprotocols.net/leaf-chlorophyll-and-carotenoid-determinations/

只在搜尋摘要看到、沒有讀到原文的:2020 年 4 月版的技術資料(沒有找到;labwrench 上有 2010 年的規格表,沒有讀);DPPH 517 nm、福林酚 765 nm(ISO 14502-1 的流程、AOAC 的驗證)、丙酮中葉綠素的 430 nm 峰;UC Davis 的福林酚流程頁擋自動讀取,沒有繞過。

## NMR 核磁共振(以 Bruker AVANCE III 500 為例)

網頁:https://tung-beauregard.github.io/instrument-principles/nmr/

不是依某一台實際儀器建模。示例配置訂為 AVANCE III 500 主控台、Ascend 500 磁鐵(室溫孔道 54 mm)、5 mm BBO 探頭(寬頻 X 線圈在內圈、¹H 線圈在外圈),都是這個世代常見、彼此相容的組合;頁面只在右下角小字與說明視窗寫出型號。

把 500 MHz 核磁共振儀剖開來看,跟著訊號走一圈:主控台產生 500.13 MHz 的射頻,經功率放大與前置放大器送進探頭的線圈,把樣品裡氫原子核的磁化向量翻倒;倒下的磁化向量在同一個線圈感應出 FID,經前置放大器送回主控台數位化,做傅立葉轉換得到氫譜。版型和 UV-Vis 頁相同。

- 樣品:香草醛(4-羥基-3-甲氧基苯甲醛)或乙酸乙酯,CDCl₃ 溶液
- 脈衝角 0° 到 360°:放大鏡(玻璃球)裡的磁化向量跟著倒下,讀值顯示縱向與橫向分量
- 勻場(線寬 0.6、1.5、4、10 Hz)與累加次數(1、4、16、64)
- 「收訊」依累加次數打脈衝、收 FID、做傅立葉轉換;發射與接收路徑分別以琥珀色與薄荷綠沿電纜發光;再收一次時上一張譜以虛線留著比較
- 點譜可放大兩段(香草醛:芳香區、H-2 與 H-6;乙酸乙酯:OCH₂ 四重峰、CH₃ 三重峰),第三下回到整張
- 外殼組裝與剖開;剖開時看得到由線圈電流算出的磁力線
- 「導覽」自動播放 100 秒,15 段字幕,內容與影片相同
- 視角操作參考 The Plane of Focus:拖曳旋轉、右鍵平移、滾輪縮放;觸控板雙指平移、捏合縮放;方向鍵或 WASD 移動、Q/E 轉向、+/− 縮放、R 回到預設視角

### 數值與示意

原廠資料(Bruker 手冊與站位規劃):

- 中心磁場 11.74 T,¹H 觀測頻率 500.13 MHz;²H 鎖場頻率 76.773 MHz(BSMS Service Manual Z31130 表 16.4);室溫孔道直徑 54 mm。
- 磁鐵外形依 500'54 Ascend 使用手冊(Z31953,附錄 A):室溫外殼直徑 745 mm、底板直徑 795 mm、底板到頂法蘭 1005 mm、腳架 720 mm、底板到頂端管路 1564 mm。液氦槽 82 L(每次補 56 L,約 180 天一次)、液氮槽 106 L(每次補 83 L,約 15 天一次);漂移不超過 0.01 ppm/h(5 Hz/h)。
- 5 高斯(0.5 mT)線:水平 0.60 m、上下 1.20 m(Ascend 500,以及站位規劃 Z31276 中的 UltraShield Plus 500)。磁場中心離地約 1.10 m 取自 UltraShield Plus 500 的站位規劃值,Ascend 500 的磁場中心高度手冊沒有填。
- 標準孔勻場管外徑 50 mm、內徑 40 mm,探頭從磁鐵底部插入(Probes User Manual Z31339)。標準孔的 AVANCE 500 常用 BOSS-II 34 組室溫勻場(Hull, Bruker SpinReport 152/153);BOSS-III 為 36 組(使用單位的設備頁)。
- 主控台:IPSO 時序解析度 12.5 ns、SGU/2 產生射頻、BLA 線性功率放大器、HPPR/2 前置放大器(放在磁鐵腳邊,增益約 30 dB)、RXAD 接收器與 DRU 數位接收單元、BSMS/2(鎖場、勻場、升降、旋轉)(AVANCE III NMR Hardware User Guide Z31839)。
- 例行氫譜流程指令:`lock`、`atma`、`topshim`、`rga`、`zg`、`efp`、`apk`、`abs`(TopSpin Guide Book: Basic NMR Experiments)。
- 5 mm 樣品管約 0.6 mL;用量規把樣品設在磁場中心下方 1.8 cm(舊探頭)或 2.0 cm(新探頭)(Avance Beginners Guide)。

實際資料集(非原廠參數檔):

- 氫譜參數取自一台 Bruker 500 MHz、5 mm PABBO 探頭的公開資料列印:zg30、TD 65536、NS 16、DS 2、D1 1 s、SWH 10330.578 Hz(20.66 ppm)、AQ 3.17 s、O1P 6.175 ppm;¹H 90° 脈衝 8.90 µs(26 W)。不同探頭的脈衝長度不同。

計算推估:

- B₀ = 500.13 MHz ÷ 42.577 MHz/T = 11.746 T(CODATA 2022 質子磁旋比)。
- ²H 與 ¹³C 頻率由 IUPAC 統一化學位移尺度的頻率比 Ξ(15.350609%、25.145020%)換算:76.77 MHz、125.76 MHz。
- 25 °C 兩能階的族群差 tanh(hν/2kT) ≈ 4.0×10⁻⁵,即每 10 萬個氫核約多 4 個順著磁場。
- 訊雜比照 √NS 增加。
- 香草醛芳香區 H-2、H-5、H-6 的譜線由三個自旋的哈密頓量(化學位移 + 純量偶合)精確對角化計算,含強偶合造成的強度偏差;其他氫是單峰。乙酸乙酯的乙基用兩個 CH₂ 氫加三個 CH₃ 氫共五個自旋計算,得到 1:3:3:1 的四重峰與 1:2:1 的三重峰。
- FID 由同一組譜線以真實取樣間隔(1/SWH)計算,譜線是 Lorentzian,兩者互為傅立葉轉換。
- 磁力線由主線圈與反向屏蔽線圈的圓環電流(完全橢圓積分)算出;屏蔽線圈的總磁矩設為與主線圈大小相等、方向相反。線圈幾何是示意,所以磁力線的形狀只供說明。

文獻值:

- 香草醛在 CDCl₃:醛基 9.83(s)、H-5 7.04(d, J ≈ 8.5 Hz)、酚羥基約 6.2(寬峰)、甲氧基約 3.96(s)(Mazzotta 等 2022, Food Chem X 13:100227;Ralph 等 2009, USDA 林產品實驗室木質素模型化合物 NMR 資料庫)。文獻中 H-2 與 H-6 在 CDCl₃ 是 7.36 至 7.49 的多重峰;這裡把 H-6 定在 7.43、H-2 定在 7.42 是依多重峰範圍的推估,間位偶合 J(H-2, H-6) ≈ 1.8 Hz 取自同一化合物在丙酮-d₆ 的數據。
- 乙酸乙酯在 CDCl₃:CH₃CO 2.05(s)、OCH₂ 4.12(q, J = 7.1 Hz)、CH₃ 1.26(t, J = 7.1 Hz);殘留 CHCl₃ 7.26、水 1.56(Fulmer 等 2010, Organometallics 29:2176)。
- 500 MHz(約 11.7 T)以上的超導磁鐵,線圈內段多用 Nb₃Sn、外段用 NbTi(Krauth, Vacuumschmelze 技術文件)。

教學示意:

- 杜瓦瓶內部各層的半徑與高度、線圈分段、頂上塔的數量與位置、探頭、主控台、前置放大器與連線的外形與擺放。探頭的兩組鞍形線圈依 BBO 的排法(¹H 在外圈),尺寸是示意。
- 放大鏡裡順著磁場的自旋畫成 40 比 32(實際只多十萬分之四);化學位移的轉速經過縮放;弛豫畫得比實際慢;進動、脈衝與 FID 的時間大幅放慢;訊號沿電纜走的速度也是放慢的。
- FID 與譜圖的雜訊經過誇大,為了看出累加的效果;勻場好壞對應的線寬(0.6 Hz 起)是示意。
- 譜圖是依文獻化學位移與偶合常數模擬的,不是實測數據,不可用於實樣鑑定。

### 技術

單一 HTML 檔(nmr/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區與修改方式見 nmr/MAINTENANCE.md。

### 來源連結

- AVANCE III NMR Hardware User Guide(Z31839, 2008):https://www.pascal-man.com/pulseprogram/avance3/topspin_2_1/AVANCE3_nmr_hardware.pdf
- Site Planning for AVANCE Systems 300 to 700 MHz(Z31276, 2008):https://2210pc.chem.uic.edu/nmr/downloads/BASHCD10/pdf/z31276.pdf
- 500'54 Ascend User Manual(Z31953, 2014):https://2210pc.chem.uic.edu/nmr/downloads/bruker/en-US/pdf/z31953.pdf
- Probes User Manual(Z31339, 2009):https://2210pc.chem.uic.edu/nmr/downloads/bruker/en-US/pdf/z31339.pdf
- BSMS Service Manual DAEDALUS-LOCK(Z31130):https://2210pc.chem.uic.edu/nmr/downloads/bruker/en-US/pdf/z31130.pdf
- Hull, NMR Tips for Shimming Part I(Bruker SpinReport 152/153):https://www.pascal-man.com/pdf/shimming1.pdf
- TopSpin Guide Book: Basic NMR Experiments(H147755, 2017):https://nmr.chem.ucsb.edu/docs/Bruker_NMR_Manuals/topspin_basic_nmr_experiments.pdf
- Avance Beginners Guide:https://2210pc.chem.uic.edu/nmr/downloads/bruker/en-US/html/Avance%20Beginners%20Guide/en-US/18014398879838475.html
- CODATA 2022 質子磁旋比:https://physics.nist.gov/cgi-bin/cuu/Value?gammapbar
- IUPAC Ξ 頻率比整理:https://www2.chem.wisc.edu/~cic/nmr/Guides/Other/Xi_chem_shift_scale.pdf
- Fulmer 等 2010:https://pubs.acs.org/doi/10.1021/om100106e
- Ralph 等 2009(NMR Database of Lignin and Cell Wall Model Compounds):https://www.glbrc.org/databases_and_software/nmrdatabase/NMR_DataBase_2009_Complete.pdf
- Mazzotta 等 2022:https://doi.org/10.1016/j.fochx.2022.100227
- Krauth, Fabrication and application of NbTi and Nb₃Sn superconductors:https://niobium.tech/-/media/niobiumtech/attachments-biblioteca-tecnica/nt_fabrication-and-application-of-nbti-and-nb3sn-superconductors.pdf
- 氫譜參數的實際資料列印(5 mm PABBO 探頭):https://isomerdesign.com/bitnest/www.policija.si/m/Isopropylphenidate-ID-1171-15-report_final.pdf

頁碼:Ascend 500 外觀尺寸與冷凍劑在附錄 A(手冊第 70 至 81 頁);5 高斯線在站位規劃第 36 至 37 頁;勻場管尺寸在 Probes 手冊第 15 頁;鎖場頻率在 BSMS 手冊表 16.4(第 117 頁);IPSO、SGU/2、BLA、HPPR/2、RXAD、DRU 在硬體手冊第 12 至 191 頁的各章。

## 質譜儀-不同分析器比較(四極柱、離子阱、飛行時間、Orbitrap)

網頁:https://tung-beauregard.github.io/instrument-principles/mass-analyzers/

不是依某一台實際儀器建模。中央的電灑游離源把同一組離子(咖啡因、阿魏酸與 MRFA 的 [M+H]⁺)分成四路,送進四種質量分析器,比較它們怎麼依 m/z 分開離子,以及解析度、質量誤差與收一張譜的時間。數值參考的代表機型只寫在右下角小字、說明視窗與片尾小字:四極柱 Agilent 5977 系列單四極、離子阱 Thermo LCQ Fleet(3D 離子阱)、飛行時間 Agilent 6546(正交加速加反射鏡)、Orbitrap Thermo Q Exactive。版型和 UV-Vis、NMR 頁相同。

- 選分析器,鏡頭移過去;「收譜」依各自的方式收一張譜:四極柱掃描電壓、離子阱關住再掃射頻、飛行時間推一次、Orbitrap 收集注入再收暫態並做傅立葉轉換
- 每種分析器一組設定:四極柱篩得多細(一般、更細)、離子阱的掃描速度(一般、慢一點更細)、飛行時間的反射鏡(開、關)、Orbitrap 記錄多久(64、128、256、512 ms)
- 左欄的簡圖用白話標出離子從哪裡進來、怎麼走、在哪裡被量到,和 3D 同方向、同步動(窄螢幕按「簡圖」打開);下方主控台是譜,換一種再收時上一張以虛線留著比較
- 點譜可放大兩段:m/z 195(咖啡因與阿魏酸只差 0.0225)、MRFA 的 M+2 精細結構;第三下回到整張
- 讀值:能分開的差距(m/z 195 能分開的最小 m/z 差,等於 195 ÷ 解析度)、量到的偏差、量一張譜要多久,以及咖啡因和阿魏酸分不分得開
- 「導覽」自動播放約 142 秒,15 段字幕,內容與影片相同
- 文字以台灣高中畢業看得懂為準:專有名詞換成白話或當場解釋,規格與型號留在說明視窗的小字
- 視角操作與其他 3D 教材相同(共用 assets/camera-nav.js)

### 數值與示意

離子(計算):

- [M+H]⁺ 的單一同位素 m/z = PubChem 的單一同位素質量 + 質子質量 1.00727647 u:咖啡因 C₈H₁₁N₄O₂⁺ 195.08765(CID 2519)、阿魏酸 C₁₀H₁₁O₄⁺ 195.06519(CID 445858)、MRFA C₂₃H₃₈N₇O₅S⁺ 524.26496(CID 9914740)。咖啡因與阿魏酸相差 0.02246,峰寬要小於這個值(m/z 195 的解析度高於約 8,700)才分得開。
- 同位素峰由元素的同位素組成計算(`isoPattern()`)。MRFA 的 M+2(相對單一同位素):³⁴S 526.26076(4.47%)、¹³C¹⁵N 526.26535(0.64%)、¹⁸O 526.26921(1.03%)、¹³C₂ 526.27167(2.96%)。
- 三種化合物的相對量(1.0、0.62、0.8)是示意。

四極柱:

- 原理:兩對桿子加 ±(U − V cos Ωt),a = 8zeU/(m r₀²Ω²)、q = 4zeV/(m r₀²Ω²)(Syed 等 2013,式 4、5;Paul 以兩對桿子之間的電壓定義,係數各差一半,a/q 相同)。第一穩定區頂點 (q, a) = (0.706, 0.237);掃描時 U/V 固定,a/q = 2U/V 與質量無關,掃描線越靠近頂點,能通過的 m/z 範圍越窄、離子也越少(Paul 1989)。
- 原廠資料(Agilent 5977 系列):單位解析;自動調諧的峰寬目標為半高寬 0.5 u(Concepts Guide 第 32 頁),化學游離自動調諧預設 0.6(Operating Manual 表 13);較早的 HP 5972A 是 0.55 u,0.45 到 0.65 可接受(第 77 至 78 頁)。最高掃描速度 12,500 u/s(不鏽鋼離子源)或 20,000 u/s(Inert Plus Extractor 或 HES),速度越快靈敏度越低、解析度可能變差(5977A、5977B 規格表)。質量軸穩定度優於 0.10 u / 48 小時;校正在 ±0.2 u 以內。
- 教材取值:峰寬 0.6 u(m/z 195 的解析度約 330);一張譜 = 500 u ÷ 12,500 u/s = 40 ms(推估,未計切換時間);質量誤差 +0.07 u(示意,在上面的穩定度之內)。
- 「更細」(峰寬 0.3 u、穿透率三成)是示意的對照設定,不是 5977 的規格。

離子阱(3D Paul 阱):

- 原理:q_z = 8zeV/(mΩ²(r₀² + 2z₀²)),和射頻振幅成正比、和 m/z 成反比;穩定邊界 q_z = 0.908(Schleicher 等 2022)。質量選擇不穩定掃描:把射頻振幅往上掃,m/z 小的先變得不穩定、依序射出(Stafford 等 1984);商用離子阱在邊界之前用共振激發把離子甩出。
- 原廠資料(Finnigan LCQ Series Hardware Manual):環電極射頻 0.76 MHz、振幅 0 到 8500 V(零到峰)(第 2-18 頁);掃描約 5,500 u/s;端蓋隔離波形 5 到 380 kHz(第 2-19 頁);氦氣約 0.1 Pa(第 2-20 頁);ZoomScan 是 10 u 寬的高解析掃描(第 1-9 頁)。
- 教材的峰寬、掃描速度與質量誤差取自 LCQ Fleet 規格表(表 1,m/z 50 到 2,000):一般掃描 12,500 Da/s、半高寬 0.7;加強掃描 5,000 Da/s、0.45;質量準確度 0.15 Da。實驗室的 LCQ Deca XP 是同系列較早的機型,手冊沒有對應的解析度表。
- 教材取值:m/z 195 能分開的差距約 0.7(一般)與 0.45(慢一點、更細),即解析度約 280 與 430;質量誤差 −0.09 與 −0.05 u(示意,在 0.15 Da 之內);一張譜 = 30 ms(離子累積與冷卻,示意)+ 500 u ÷ 掃描速度,即 70 與 130 ms。
- 示意:動畫的共振射出點畫在 q_z = 0.83,接近穩定邊界,是教學設定;環電極與端蓋的比例取文獻常引用的 LCQ 尺寸 r₀ 0.707 cm、z₀ 0.785 cm(出自 March 1999,見離子阱質譜一節;原廠文件未確認;以 0.76 MHz、8500 V 推算,q_z 0.83 對應 m/z 約 2,000,和 m/z 50 到 2,000 的範圍一致)。冷卻後的 8 字形刻意畫大。

飛行時間(正交加速、反射鏡):

- 原理:所有離子拿到相同動能 zeU = ½mv²,t = L·√(m/(2zeU)),t ∝ √(m/z);解析度 R = t/(2Δt)。反射鏡讓能量稍多的離子鑽得深、多走一段路,和能量少的一起抵達(Mamyrin 等 1973:當時一般飛行時間的解析度只有數百,反射式達 3,500)。正交加速:推出方向和離子束垂直,入射速度對飛行時間的影響降到最小(Dawson & Guilhaus 1989;Agilent Concepts Guide 第 27 頁)。
- 原廠資料(Agilent 技術文件):飛行管約 1 m,兩段式反射鏡讓路徑變成約 2 m;飛行管與偵測器前端約 −6,500 V;偵測器是微通道板、閃爍體與光電倍增管;每秒累加約 1 萬個暫態;m/z 200 的暫態約 25 µs、每秒 4 萬次(5990-9207EN 第 2 至 7 頁;5989-0373EN 第 4 至 7 頁)。
- 原廠資料(Agilent 6546 規格表):解析度 m/z 118 > 30,000、m/z 2,722 > 60,000(半高寬);以內標校正的質量誤差 < 0.8 ppm RMS;最高每秒 50 張譜(MS)。
- 教材取值:m/z 195 的解析度 30,000(能分開的差距約 0.0065)、質量誤差 +0.7 ppm(約 +0.0001)、一張譜 20 ms。
- 計算推估:L = 2 m、U = 6.5 kV 時,咖啡因 [M+H]⁺ 飛 24.94 µs、MRFA 40.89 µs;咖啡因與阿魏酸只差 1.44 ns。簡圖下方的抵達時間刻度用這組數值(`TOF_US195`)。動畫裡反射鏡的平均鑽入深度取漂移長度的四分之一(`FD.d0`),是單段均勻減速場一階能量聚焦的條件。
- 示意:反射鏡關掉的直線模式(解析度 3,000、誤差 8 ppm)是假設的對照,商用正交加速飛行時間都帶反射鏡;動畫的能量差(±6%)、飛行速度與推的間隔都經過調整。

Orbitrap:

- 原理(Makarov 2000):電位 U(r, z) = (k/2)(z² − r²/2) + (k/2)Rm²·ln(r/Rm) + C;軸向振盪 ω = √(k·ze/m),只和 m/z 有關,和離子的能量與位置無關;外電極分成兩半量感應電流,差動放大後做傅立葉轉換;M/ΔM = ½(ω/Δω)。
- 電極外形依等位面 z² = r²/2 − R²/2 + Rm²·ln(R/r) 繪製;R₁ = 6、R₂ = 15 取標準型 Orbitrap 的 6 mm、15 mm(Scheltema 等 2014),Rm = 22 是示意值。
- 原廠與文獻(Q Exactive):m/z 200 的解析度 17,500、35,000、70,000、140,000,對應暫態 64、128、256、512 ms;解析度和 √(m/z) 成反比;速度從 12 Hz(17,500)到 1.5 Hz(140,000)(Michalski 等 2011,表 I 與內文);內標 < 1 ppm RMS、外部校正 < 3 ppm RMS;中心電極 5 kV;C-trap 充氮(規格表)。MRFA 在 512 ms 暫態實測解析度 > 90,000(m/z 524,eFT)。
- 教材取值:質量誤差 −0.4 ppm(約 −0.0001);一張譜 83、167、333、667 ms(兩端取自上面的 12 Hz 與 1.5 Hz,中間兩檔依每檔減半推估)。
- 計算推估:Wörner 等 2022 對 Q Exactive UHMR(中心電極 5 kV、標準型電極)用 f ≈ 0.26055 × (m/z ÷ 1000)^−½ MHz。假設同樣適用於 Q Exactive:m/z 200 約 583 kHz、咖啡因 590 kHz、MRFA 360 kHz;咖啡因與阿魏酸相差約 34 Hz,拍頻週期約 29 ms。簡圖狀態列寫的「m/z 195 每秒來回約 59 萬次」用這組推估(`ORB_F200`)。m/z 526 在 512 ms 的解析度約 86,000(140,000 × √(200/526)),所以 MRFA 的 M+2 只有 ³⁴S 與 ¹³C₂ 勉強分開。
- 示意:動畫裡離子的轉速、振幅與注入過程大幅放慢;C-trap 與偏折透鏡的形狀是示意。

教學示意(四台共通):

- 四台的外形、尺寸、電壓、離子速度與時間尺度都經過調整;離子數量與軌跡大小放大。
- 譜由理論質量、同位素比例、高斯峰形與各分析器的峰寬算出,加上上述的系統誤差;雜訊經過放大;不是實測數據,不可用於實樣鑑定。

電場形狀(四台都有,互動模式在簡圖切換,影片與導覽講完每一台時停下來播;共用 `assets/analyzer-fields.js`,GC-MS 的四極桿動畫也用它):

- 小球照 Mathieu 方程式逐步積分(步長 1/600 秒),不是事先畫好的路徑;曲面是同一個電位的示意,高低經過縮放。翻轉放慢到每秒 1.6 次、太慢的一段每秒 0.42 次,和 lcq/ 第 07 段相同。電壓固定時翻得越慢 q 越大,所以「太慢」那段的 q 約 6.5,一定不穩定。
- 離子阱(環電極加交流、端蓋接地):a = 0;軸向 q_z、徑向 q_r = −q_z/2。主角 q_z 0.45(穩定),較重的約 0.25,太輕的 1.15(超過 0.908,留不住)。翻得夠快之後加一點阻尼代表氦氣冷卻(示意值 0.22 s⁻¹)。收譜那段把 q 每秒調高 14%,三顆球在 q_z 0.908 依序沿軸向射出;本頁 3D 的共振射出點畫在 0.83,這裡畫的是沒有共振射出時的穩定邊界,兩者都是示意。「每秒正負翻轉 76 萬次」取上方 Finnigan LCQ Series Hardware Manual 的 0.76 MHz。
- 四極柱:x 那一對桿子加 +(U − V cos Ωt)、y 那一對加相反的電壓;直流與交流的比例固定在 a = 0.3 q(U/V = 0.15)。用 Mathieu 特徵曲線 a₀(q) 與 b₁(q) 的級數算出這條線上的穩定範圍約 q 0.625 到 0.725,要的那種離子放在中間(0.675),較輕與較重的 m/z 比是 0.82 與 1.46:較輕的超過右邊界、沿 x(交流)方向越擺越大,較重的低於下邊界、沿 y(直流)方向慢慢被拉走。掃描時 U、V 一起從 0.74 倍調到 1.62 倍,三種依序落進窗口。「篩得更細」就是讓窗口更窄(提高 U/V,往穩定區頂點靠),這裡沒有另外畫。
- 飛行時間:電場畫成地形,推斥區是陡坡、飛行管是平地(沒有電場)、反射鏡是線性上坡;球照牛頓運動定律逐步積分(步長 1/600 秒)。三顆球:兩顆 m/z 195(其中一顆在推斥區起點遠一點,得到的能量少約兩成)、一顆 m/z 524。地形的長度(`TOF`:推斥區 0.1、反射鏡從 0.66 開始、坡度 1.3 倍)選成讓兩顆 m/z 195 經反射鏡後幾乎同時回到偵測器(差約 0.05 秒),關掉反射鏡直線飛時差約 0.3 秒;m/z 524 與 195 的飛行時間比接近 √(524/195) ≈ 1.64。這組數字是示意的比例,不是 6546 的尺寸;真實的時間見上面的計算推估。
- Orbitrap:中心電極畫成紡錘、外殼分成左右兩半;沿軸向的電位畫成一個碗。軸向擺盪用公式直接算,頻率 = 0.9 × √(195 ÷ m/z) 次/秒(畫面放慢);三顆球 m/z 195、300、524 的快慢比是 1 : 0.81 : 0.61,和擺幅、起點無關。下方畫外殼兩半的差動訊號與「拆成頻率」的長條。真實儀器 m/z 195 每秒來回約 59 萬次(見上面 `ORB_F200` 的推估)。
- 影片與導覽:講完每一台時停下來,把簡圖換成這一台的電場動畫(四極柱 14 秒、離子阱 16 秒、飛行時間 14 秒、Orbitrap 15 秒,只取動畫裡的關鍵段落),3D 調暗、說明文字放大,另有對應的字幕;所以影片總長從約 142 秒變成約 212 秒。

### 技術

單一 HTML 檔(mass-analyzers/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區與修改方式見 mass-analyzers/MAINTENANCE.md。

### 來源連結

- Syed 等 2013, Quadrupole Mass Filter: Design and Performance for Operation in Stability Zone 3, J. Am. Soc. Mass Spectrom. 24:1493(doi:10.1007/s13361-013-0704-z):https://www.liverpool.ac.uk/media/livacuk/massspectrometry/pdfs/Quadrupole,mass,filter,design,and,performance,for,operation,in,stability,zone,3.pdf
- Paul 1989 諾貝爾演講 Electromagnetic traps for charged and neutral particles(第 604 至 606 頁):https://www.nobelprize.org/uploads/2018/06/paul-lecture.pdf
- Agilent 5977B GC/MSD 規格表(5991-6352EN):https://research.njit.edu/york/sites/research.york/files/5977B_data_sheet1785.pdf
- Agilent 5977A GC/MSD 規格表(5991-1837EN):https://agilent.com/cs/library/technicaloverviews/public/Copy(1)%20of%20Agilent%205977A%20Series%20GCMSD%20System%20Data%20Sheet%205991-1837EN.pdf
- Agilent 5977 Series MSD System Concepts Guide(G7077-90036):https://www.agilent.com/cs/library/usermanuals/public/user-manual-msd-system-5977-concept-guide-G7077-90036-en-agilent.pdf
- Agilent 5977B Series MSD Operating Manual(G7077-90034):https://www.agilent.com/cs/library/usermanuals/public/user-manual-gc-msd-system-operating-5977B-series-G7077-90034-en-agilent.pdf
- HP 5972A MSD Hardware Manual(05972-90026):https://www.bodc.ac.uk/data/documents/nodb/pdf/agilent_5972A_msd_manual.pdf
- Finnigan LCQ Series Hardware Manual(97345-97003 Rev A):https://conquerscientific.com/wp-content/uploads/2022/10/thermo-finnigan-lcq-series_hardware-manual.pdf
- Thermo LCQ Fleet 規格表(PS63262-EN):https://assets.thermofisher.cn/TFS-Assets/CMD/Specification-Sheets/PS-63262-LCQ-Fleet-Ion-Trap-LC-MSn-PS63262-EN.pdf
- Schleicher 等 2022, Anal. Bioanal. Chem. 414:1279:https://pmc.ncbi.nlm.nih.gov/articles/PMC8724165/
- Stafford 等 1984, Int. J. Mass Spectrom. Ion Processes 60:85(doi:10.1016/0168-1176(84)80077-4)
- Mamyrin 等 1973, Sov. Phys. JETP 37:45:http://www.jetp.ras.ru/cgi-bin/dn/e_037_01_0045.pdf
- Dawson & Guilhaus 1989, Rapid Commun. Mass Spectrom. 3:155(doi:10.1002/rcm.1290030511)
- Agilent Time-of-Flight Mass Spectrometry 技術文件(5990-9207EN):https://www.agilent.com/cs/library/technicaloverviews/public/5990-9207EN.pdf
- Agilent Time-of-Flight Mass Spectrometry 技術文件(5989-0373EN):https://www.agilent.com/Library/technicaloverviews/Public/5989-0373EN%2011-Dec-2003.pdf
- Agilent 6200 Series TOF and 6500 Series Q-TOF Concepts Guide(G3335-90231):https://www.agilent.com/cs/library/usermanuals/public/G3335-90231_TOF_Q-TOF_Concepts.pdf
- Agilent 6546 LC/Q-TOF 規格表(5994-0609EN):http://www.dsp-c.co.rs/files/Agilent_6546_Product_Data_Sheet_5994-0609EN.pdf
- Makarov 2000, Electrostatic Axially Harmonic Orbital Trapping, Anal. Chem. 72:1156(doi:10.1021/ac991131p):https://masspec.scripps.edu/learn/ms/pdf/2000_Makarov.pdf
- Michalski 等 2011, Mol. Cell. Proteomics 10:M111.011015:https://pmc.ncbi.nlm.nih.gov/articles/PMC3284220/
- Thermo Q Exactive 規格表(PS30223_E):https://www.pragolab.cz/documents/QExactive_PS.pdf
- Scheltema 等 2014, Mol. Cell. Proteomics 13:3698:https://pmc.ncbi.nlm.nih.gov/articles/PMC4256516/
- Wörner 等 2022, Nat. Chem. 14:515:https://pmc.ncbi.nlm.nih.gov/articles/PMC9068510/
- PubChem:https://pubchem.ncbi.nlm.nih.gov/compound/2519、https://pubchem.ncbi.nlm.nih.gov/compound/445858、https://pubchem.ncbi.nlm.nih.gov/compound/9914740

部分規格表是第三方網站保存的副本(NJIT、dsp-c.co.rs、pragolab.cz、conquerscientific.com、assets.thermofisher.cn);Stafford 1984 與 Dawson & Guilhaus 1989 只核對了書目,沒有讀到全文。原廠沒有公開 5977 的射頻頻率與 r₀、6546 的推斥頻率與飛行長度,以及 Q Exactive 的軸向頻率;上面用到的這幾類數值都標為推估或示意。

## 光譜-光與分子(光與分子的交互作用)

網頁:https://tung-beauregard.github.io/instrument-principles/spectroscopy/

不是某一台儀器,而是把常見的光譜放在一起比:每一種光一份帶的能量不同,只有剛好對上分子某一種動作的「台階」才會被吸收。無線電波讓原子核翻面(放在強磁鐵裡,核磁共振 NMR)、微波讓整個分子轉動、紅外線讓化學鍵伸縮彎曲(紅外光譜 FTIR)、可見光與紫外光讓電子跳到高一層(UV-Vis)、X 光把最內層的電子打出去;另外兩種用法:螢光與拉曼(532 nm 雷射)。每一段都用同一個分子香草醛,每一種光看的地方在分子上發亮,最後一段「比一比」逐一比較每一種光看分子的哪裡、拿來做什麼;β-胡蘿蔔素只在紫外與可見光的螢幕上當有顏色的對照。版型和 UV-Vis、NMR 頁相同。

- 選一種光,鏡頭移過去;拖滑桿調頻率、波數、波長或能量,分子照能量對不對得上回應(自旋翻面、轉快一階、某一根鍵振動、電子雲變形、內層電子飛出)
- 「掃描」從一端掃到另一端,下方螢幕畫出那一種光譜;左欄的能量階梯畫出這一份光的能量和分子的台階
- 「光的其他用法」切換吸收、螢光、拉曼
- 這一種光看的地方(原子、鍵或電子雲)一直微微發亮;「比較表」打開每一種光看分子的哪裡、拿來做什麼的表
- 「導覽」自動播放約 221 秒,31 段字幕,內容與影片相同;導覽與影片會把分子移到面板之間空出來的地方,放不下就縮小,不會被字幕或螢幕擋住
- 文字以台灣高中畢業看得懂為準

### 數值與示意

能量換算(計算):E = hc/λ,hc = 1239.84198 eV·nm;1 cm⁻¹ = 1.2398×10⁻⁴ eV。500 MHz 的無線電波約 2.07×10⁻⁶ eV;香草醛的轉動譜線在 2 到 20 GHz,是 8.3×10⁻⁶ 到 8.3×10⁻⁵ eV(h = 4.1357×10⁻¹⁵ eV·s);中紅外 4000 到 400 cm⁻¹ 是 0.50 到 0.050 eV;可見光 400 到 700 nm 是 3.10 到 1.77 eV;紫外 200 到 400 nm 是 6.20 到 3.10 eV。片尾比較表的能量範圍取這幾個數量級。

- 各區與分子動作的對應:微波(約 10⁻⁵ 到 10⁻³ eV)對應分子轉動、紅外對應振動、可見光把電子提到高一層、X 光把電子打出去(HyperPhysics);無線電波讓原子核的自旋翻面(Reusch)。
- 核磁共振:香草醛在 CDCl₃ 的化學位移和 `nmr/` 相同(醛基 9.83、H-6 7.43、H-2 7.42、H-5 7.04、羥基約 6.2、甲氧基 3.96;來源見 NMR 一節)。BMRB bmse010006(250 MHz)為 9.81、7.44、7.41、7.04、3.92;羥基的位置和濃度有關,其他資料在 6.2 到 6.4 之間。磁場 11.74 T、500.13 MHz 同 NMR 一節。
- 微波:香草醛的轉動光譜有人在超音速噴流裡量過,看到醛基朝向不同的兩種構形,羥基都和甲氧基形成分子內氫鍵(Cocinero 等 2010)。那篇的轉動常數這次讀不到全文,頁面改用計算值:以 NIST WebBook 的香草醛 3D 結構(B3LYP/6-31G*)算慣性矩,得 A 2330.2、B 694.1、C 550.0 MHz;把羥基的氫轉向甲氧基(實驗看到的氫鍵構形)後為 A 2390.6、B 690.5、C 551.1 MHz,頁面用後者。譜線以剛體非對稱陀螺對角化算出(a 型、J+1 ← J),強度取 2 K 的分布、只留最強那條的 2% 以上,共 189 條在 2 到 20 GHz,大約每 B + C ≈ 1.24 GHz 一群。全部是計算推估,沒有考慮離心畸變與甲基的內轉動,也不知道實際的偶極矩分量(只畫 a 型)。微波爐的 2.45 GHz 加熱主要是介電加熱、不是共振吸收(HyperPhysics),所以頁面沒有拿微波爐當例子。
- 紅外:香草醛的吸收帶取自 NIST WebBook 的 Coblentz 光譜(礦物油糊 2529、KBr 錠 2530),由作者讀圖:O–H 寬帶,最深處 3140 到 3370;醛基 C–H 弱帶約 2814;C=O 1665 到 1671;苯環 1587 到 1592 與 1511 到 1515;C–O 1261 到 1266 與 1292 到 1296;1150 到 1164、1123、1029 到 1030。這是從紙本數位化的舊色散式光譜,約 ±5 cm⁻¹。頁面取 3180、2820、1666、1590、1510、1265、1155、1030;苯環 C–H 3020、甲基 C–H 2940 與 860 的彎曲依一般官能基範圍(Reusch、CU Boulder)。強度與寬度是示意。
- 紫外:香草醛 231、279、308 nm(Cayman Chemical,溶劑未註明;NIST WebBook 的 Robinson & Kiang 1955 為 230、281 與 312 到 315 nm 的寬峰)。β-胡蘿蔔素在己烷 425、450、478 nm(LipidBank)。
- 螢光:香草醛的水溶液(10⁻⁴ mol/L,加硫酸、鹽酸或氫氧化鈉調酸鹼),中性的香草醛放光在 330 nm,失去羥基上氫離子的陰離子放光在 405 nm 附近;基態 pKa 7.2,激發態約 −0.5,所以激發以後更容易失去氫離子(Vasilyeva 等 2002)。頁面的激發光譜用香草醛的吸收,放光畫 330 與 405 nm 兩個帶,兩者的相對強度是示意;文獻沒有給螢光量子產率,頁面不寫亮或暗。
- 拉曼:散射光中只有約一千萬分之一是拉曼散射(Renishaw;Bruker 與 HORIBA 寫的比例更小,所以頁面寫「大約一千萬份裡才有一份」);紅外看振動時偶極矩有沒有變、拉曼看極化率有沒有變(Reusch、Renishaw)。香草醛的拉曼位移依紅外的同一組振動放置,沒有找到可引用的實測拉曼譜,強度是示意,螢幕上只標苯環與 C=O 兩支。雷射 532 nm 是常見的選擇(Bruker)。
- X 光:碳 1s 284.2 eV(X-Ray Data Booklet 表 1-1);氧 1s 543.1 eV 是同一張表的通用值,這次沒能從 PDF 抽出那一列核對。吸收邊之後的下降用冪次示意。

比一比(每一種光看香草醛的哪裡):NMR 看每一個氫和它的鄰居;轉動光譜看整個分子的形狀;紅外最容易看到振動時偶極矩改變大的極性鍵(O–H、C=O、C–O);拉曼最容易看到極化率改變大的鍵(苯環骨架);紫外與可見光看苯環接醛基、連成一片的 π 電子;螢光看吸收以後會發光的部分;X 光看碳、氧最內層的電子(氫只有一個電子,沒有內層電子)。這是教學上的簡化:每一種光其實都會碰到整個分子,這裡畫的是那種光最容易看出來的部分;拉曼「水的干擾小」是因為水的拉曼散射很弱,紅外則會被水強烈吸收(Wenzel,LibreTexts)。

教學示意:分子、光波、能量階梯與時間尺度都經過縮放;能量階梯的尺每格差 100 倍,各種動作的區塊是大略範圍;各種譜的形狀是高斯或勞倫茲峰的組合,不是實測數據,不可用於實樣鑑定。

### 技術

單一 HTML 檔(spectroscopy/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區與修改方式見 spectroscopy/MAINTENANCE.md。

### 來源連結

- CODATA, hc in eV nm:https://physics.nist.gov/cgi-bin/cuu/Value?minvev
- NASA Imagine the Universe, The Electromagnetic Spectrum:https://imagine.gsfc.nasa.gov/science/toolbox/emspectrum1.html
- HyperPhysics, Molecular spectra:http://hyperphysics.gsu.edu/hbase/mod3.html ;Microwave oven:https://hyperphysics.gsu.edu/hbase/waves/mwoven.html
- Reusch, Virtual Textbook of Organic Chemistry:https://organicchemistrydata.org/reusch/virtualtext/spectroscopy/spectroscopy-intro/ 、https://organicchemistrydata.org/reusch/virtualtext/spectroscopy/infrared-spectroscopy/
- CU Boulder IR tutorial(醛):https://orgchemboulder.com/Spectroscopy/irtutor/aldehydesir.shtml
- BMRB bmse010006(香草醛):https://bmrb.io/metabolomics/mol_summary/show_data.php?id=bmse010006
- NIST WebBook 香草醛,紅外與紫外:https://webbook.nist.gov/cgi/cbook.cgi?ID=C121335&Type=IR-SPEC&Index=1 、https://webbook.nist.gov/cgi/cbook.cgi?ID=C121335&Mask=400
- Cayman Chemical, Vanillin:https://www.caymanchem.com/product/36422/vanillin
- NIST WebBook 香草醛的 3D 結構(B3LYP/6-31G*,算轉動常數用):https://webbook.nist.gov/cgi/cbook.cgi?Str3File=C121335
- Cocinero 等 2010, Conformational equilibria in vanillin and ethylvanillin, Phys. Chem. Chem. Phys. 12:12486(doi:10.1039/C0CP00585A):https://pubs.rsc.org/en/content/articlelanding/2010/cp/c0cp00585a
- Vasilyeva 等 2002, Experimental and quantum-chemical study of excited electronic states of vanillin protolytic species, Atmospheric and Oceanic Optics 15(3):239–241:https://ao.iao.ru/en/content/vol.15-2002/iss.03/10
- LipidBank, β-carotene:https://lipidbank.jp/VCA.html
- Renishaw, What Raman spectroscopy is:https://www.renishaw.com/en/what-raman-spectroscopy-is--25805
- Wenzel, Molecular and Atomic Spectroscopy, 5: Raman Spectroscopy(LibreTexts,水的拉曼散射很弱):https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Molecular_and_Atomic_Spectroscopy_(Wenzel)/5:_Raman_Spectroscopy
- Bruker, What is Raman spectroscopy:https://www.bruker.com/en/products-and-solutions/raman-spectroscopy/raman-basics/what-is-raman-spectroscopy.html
- X-Ray Data Booklet 表 1-1:https://xdb.lbl.gov/Section1/Table_1-1.pdf

## 層析-GC 與 HPLC

網頁:https://tung-beauregard.github.io/instrument-principles/chromatography/

從茨維特的色素管柱開始,講層析為什麼能把混在一起的成分分開:管子裡有會流動的東西(流動相,推著分子走)與不動的東西(固定相,把分子拉住一下),每種分子被拉住的時間不一樣,走得快慢就不一樣。接著是氣相層析 GC(氦氣推、烘箱升溫)與液相層析 HPLC(液體推、甲醇比例慢慢增加),峰為什麼會變寬、填充顆粒大小與壓力,以及分離度 Rs。版型和光譜-光與分子相同。

- 三台:茨維特的玻璃管柱、GC(氦氣鋼瓶、進樣口與針筒、烘箱裡盤起來的管柱、偵測器)、HPLC(溶劑瓶、幫浦、自動進樣器、放大剖開的管柱、偵測器)
- 「進樣」打一針,色帶在管柱裡分開,下方層析圖一支一支長出來;換條件會自動再打一針,上一次畫成灰色虛線對照
- GC 比較恆溫 100 °C、恆溫 140 °C 與升溫;HPLC 比較固定 50% 甲醇與甲醇慢慢增加,填充顆粒 5 µm 與 1.7 µm
- 左欄的簡圖三種:管子裡面(兩種分子在兩相之間進出,下方是走與被拉住的時間比例)、峰為什麼會變寬、分得開嗎(兩支峰的距離與寬度)
- 「導覽」自動播放約 202 秒,24 段字幕,內容與影片相同
- 文字以台灣高中畢業看得懂為準

### 數值與示意

茨維特(1906):

- 方法:把沉澱碳酸鈣裝進細玻璃管,色素溶在石油醚(加約一成酒精)裡倒進去,再用溶劑往下沖;用二硫化碳時色帶更清楚。CS₂ 的色帶由上到下:無色、黃色葉黃素 β、暗橄欖綠的葉綠素 b、暗藍綠的葉綠素 a、黃色葉黃素 α′ 與 α″、無色、橘黃色葉黃素 α;胡蘿蔔素不被拉住,最先流出。他把這樣的管子叫 chromatogram、方法叫 chromatographic method(Tswett 1906,Le Moyne College 的英譯節錄)。
- 頁面簡化成四條:胡蘿蔔素(最快)、葉黃素、葉綠素 a、葉綠素 b(最上面),k = 0.15、1.0、2.0、3.0 是示意值,先後依上面的順序;讀值卡寫「石油醚」。chroma(顏色)加 graphein(寫)的字源是一般說法,沒有找到茨維特本人的解釋。

GC:

- 和 `gc-ms/` 同一個滯留模型(HP-5MS 30 m × 0.25 mm × 0.25 µm、He 1.0 mL/min、死時間 1.37 分、約 7 萬理論板數;ln k 由 KI 與溫度算,見 GC-MS 一節)。成分取其中六種:α-蒎烯 939、檸檬烯 1029、1,8-桉葉油醇 1031、沉香醇 1096、樟腦 1146、石竹烯 1417(KI)。
- 三種條件的計算結果:恆溫 100 °C,α-蒎烯 2.60 分、樟腦 6.41 分、石竹烯 33.41 分(峰寬 σ 0.128 分,峰高只有 α-蒎烯的 4%);恆溫 140 °C,全部在 5.7 分內出完,前面幾支擠在死時間後面;升溫(60 °C 起每分鐘 10 °C,到 220 °C),3.98 到 10.37 分,峰寬都約 0.011 分。
- 檸檬烯與 1,8-桉葉油醇:在 5% 苯基管柱(DB-5MS、HP-5MS)上,同一篇研究量到的保留指數只差 0 到 3(Angioni 等 2006:1028 與 1031;Maia 等 2005:1032 與 1032;Jalali-Heravi 等 2006:1035 與 1038;Hazzit 等 2006:1044 與 1046,NIST WebBook),常常重疊。本頁的模型算出 Rs:恆溫 100 °C 0.56、恆溫 140 °C 0.20、升溫 0.65。

HPLC:

- 管柱 150 × 4.6 mm、C18、1 mL/min,死時間 1.5 分(推估:空隙約 1.6 mL)。滯留用反相層析常見的 log k = log kw − S × 甲醇比例;五個成分的 kw、S 是依它們在 C18 上常見的先後設定的示意值(沒食子酸 1.0、3.5;兒茶素 2.0、4.0;表兒茶素 2.3、4.1;阿魏酸 2.6、4.2;槲皮素 3.6、4.8),不是某一個實際方法的數據。梯度從入口往出口推進,位置 z 的分子碰到的是 z × 死時間 之前進入管柱的溶劑。
- 計算結果:固定 50% 甲醇,沒食子酸 1.77 分(幾乎沒被拉住)、槲皮素 25.27 分;甲醇 10% 起 15 分鐘加到 90%(0.8 分的延遲),5.24、9.22、10.41、11.55、14.28 分。
- 板數:常用的估法 N ≈ 300 × 管長(mm) ÷ 粒徑(µm),150 mm、5 µm 約 9,000,文獻常以約 10,000 為新管柱的參考(MicroSolv;LCGC);頁面取 5 µm 10,000、1.7 µm 29,000(同一估法的比例)。峰寬和 √N 成反比,所以 1.7 µm 的峰寬約為 5 µm 的 0.58 倍(頁面寫「大約六成」)。
- 壓力:同樣的管長與流速,壓力和粒徑平方成反比,(5 ÷ 1.7)² ≈ 8.7 倍。150 × 4.6 mm、5 µm、1 mL/min 用水約 60 bar(推估:常見的估算例子是 250 mm、5 µm、1 mL/min 用水約 100 bar,依管長換算);50% 甲醇的黏度約為水的 1.8 倍,頁面取約 100 bar,1.7 µm 約 900 bar(計算推估)。1.7 µm 的管柱通常做得短、細,UHPLC 管柱的耐壓約 1,000 到 1,240 bar(ACE、Waters 規格)。

分離度:Rs = 兩峰的滯留時間差 ÷ 兩峰底寬的平均(底寬 = 4σ),Rs 1.5 時兩支峰之間回到基線。

教學示意:三台的外觀、管柱長短與粗細、時間尺度都經過縮放;GC 與 HPLC 管柱裡的色帶放大 4 倍才看得見;層析圖的峰寬與高度照模型,不是實測數據,不可用於實樣鑑定。

### 技術

單一 HTML 檔(chromatography/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區與修改方式見 chromatography/MAINTENANCE.md。

### 來源連結

- Tswett 1906, Ber. Dtsch. Bot. Ges. 第 24 卷的兩篇論文(英譯節錄,Le Moyne College):https://web.lemoyne.edu/Giunta/tswett.html
- NIST WebBook 保留指數,檸檬烯:https://webbook.nist.gov/cgi/cbook.cgi?ID=C138863&Mask=2000&Type=KOVATS-RI-NON-POLAR-RAMP ;1,8-桉葉油醇:https://webbook.nist.gov/cgi/cbook.cgi?ID=C470826&Mask=2000&Type=KOVATS-RI-NON-POLAR-RAMP
- MicroSolv, Theoretical plate estimates(N ≈ 300 L/dp):https://www.mtc-usa.com/kb-article/aa-01449
- LCGC, Column plate number and system suitability:https://www.chromatographyonline.com/view/column-plate-number-and-system-suitability-1
- Waters ACQUITY BEH C18 1.7 µm 最高壓力:https://support.waters.com/KB_Chem/Columns/WKB198141_What_is_the_column_maximum_backpressure_for_the_ACQUITY_BEH_C18_21x100mm_part_186002352
- ACE 1.7 µm 管柱(耐壓 1,000 bar):https://www.hplc.eu/Downloads/ACE_1_7_Flyer.pdf

HPLC 成分的 kw 與 S、茨維特色帶的速度、GC 與 HPLC 的外觀都是示意;壓力的數字是由文獻的例子換算的推估,不是某一支管柱的實測。

## 生化原理

入口的「生化原理」一區(2026-10-26 起)用 2D 動畫講分子生物學與生物化學的實驗原理,共十份,共用 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖)與 `assets/bio-lesson.css`(版面),不需要 WebGL。每份分成幾章,有字幕與「自己調整」的選項;章節代號就是網址的 `#`。動畫裡的序列、濃度、峰的位置多半是示意,各節分別列出哪些數值有來源、哪些是示意。程式結構見各資料夾的 MAINTENANCE.md。2026-10-27 起,其中七份在最後加了「進階」章節(各節最後的「進階章節」)。

### 中心法則(`central-dogma/`)

網頁:https://tung-beauregard.github.io/instrument-principles/central-dogma/

生化原理分區的教材,版型同 `pcr/`:七章 2D 動畫加字幕,共 113 秒。從 DNA 的雙股結構講起,接著是複製叉上的分工、Meselson 與 Stahl 證明半保留複製的離心實驗、轉錄、真核生物的 RNA 加工、核糖體的轉譯,最後用人類 β 球蛋白基因(HBB)的開頭看改一個鹼基會造成哪一種點突變。

- 第 1 章 DNA 的結構:雙股螺旋攤平成梯子,看糖與磷酸的骨架、A 與 T 兩個氫鍵、G 與 C 三個氫鍵、兩股反向平行與 5′、3′ 端
- 第 2 章 DNA 複製:解旋酶、引子酶與 RNA 引子、前導股與延遲股(岡崎片段)、引子換成 DNA、接合酶
- 第 3 章 半保留複製:實驗步驟,上排是實際結果、下排是選的假說的預測;控制項「世代數」(0 到 4 代)與「對照的假說」(半保留、全保留、分散),每一代標示相符或不符
- 第 4 章 轉錄:啟動子、轉錄泡泡、只讀模板股、不需要引子、U 代替 T;做出的 mRNA 和編碼股上下對照
- 第 5 章 RNA 加工:5′ 帽、poly(A) 尾、剪接體剪掉內含子、成熟 mRNA 經核孔送出
- 第 6 章 轉譯:核糖體、tRNA 的反密碼子、肽鍵、移位、E/P/A 位、終止密碼子與釋放因子;左上的密碼表標出正在讀的密碼子
- 第 7 章 突變:控制項「要改的位置」(第 2 到第 9 個密碼子的每個鹼基)與「換成」(A、U、G、C),依標準遺傳密碼表算出新的胺基酸,分成同義、錯義、無義,第 20 個鹼基換成 U 時說明這是鐮刀型紅血球疾病的變異
- 文字以台灣高中畢業看得懂為準

#### 數值與示意

DNA 的結構(OpenStax Biology 2e 14.2):糖與磷酸構成骨架、鹼基在內側;兩股反向平行,一端有游離的 5′ 磷酸、另一端是 3′-OH,5′、3′ 是糖上碳的編號(磷酸接在 5′ 碳,3′ 碳接 OH);A 與 T 兩個氫鍵、G 與 C 三個;每對相距 0.34 nm、每圈 3.4 nm、10 個鹼基對、直徑 2 nm。

複製(OpenStax Biology 2e 14.4,大腸桿菌):解旋酶打斷鹼基對之間的氫鍵;引子酶做約 5 到 10 個核苷酸的 RNA 引子;DNA 聚合酶只能往 5′→3′ 方向接、需要游離的 3′-OH;連續合成的是前導股,做成岡崎片段的是延遲股,每段都要一個引子;DNA pol I 移除引子並補上 DNA,接合酶形成磷酸雙酯鍵把缺口接起來;每秒約 1000 個核苷酸。真核生物每秒 50 到 100 個,引子由 RNase H 移除(14.5,表 14.2;頁面沒有用到)。

Meselson 與 Stahl(1958,PNAS 44:671–682,依掃描全文):

- 大腸桿菌 B 株在 36 °C、以氯化銨為唯一氮源的葡萄糖培養基生長;在含 100 µg/mL、同位素純度 96.5% 的 ¹⁵NH₄Cl 培養基裡長 14 代,再加入十倍過量的 ¹⁴NH₄Cl 換成 ¹⁴N(第 673 至 674 頁);世代時間 0.81 與 0.85 小時(圖 3)。
- 離心:裂解液加進 pH 8.5 的 CsCl 溶液,密度 1.71 g/cm³,在 Spinco model E 超高速離心機以 140,000 × g(44,770 rpm)、25 °C 離心 20 小時;DNA 帶在密度 1.71 g/cm³ 附近,用紫外光吸收照片與微密度計記錄(第 676 頁)。¹⁴N 與 ¹⁵N DNA 兩帶的浮力密度差 0.014 g/cm³(圖 2,第 673 頁)。
- 結果:取樣點 0、0.3、0.7、1.0、1.1、1.5、1.9、2.5、3.0、4.1 代(圖 4,第 675 頁);滿一代時只有半標記的中間帶,之後只有半標記與未標記兩種,滿兩代時兩者各半(第 676 頁);中間帶位在兩帶之間 50 ± 2%(圖 4 說明)。
- 加熱(100 °C 30 分鐘)讓半標記 DNA 分成兩種密度相差 0.015 g/cm³ 的次單位,作者據此排除 Delbrück 的(分散式)複製方案(第 681 頁)。作者也寫明還沒證明這些次單位就是單股(第 678 頁);頁面只說「符合半保留複製」。
- 三種假說的定義見 OpenStax 14.3(第 1 代只有中間帶「表示半保留或分散」,第 2 代的兩條帶只有半保留解釋得了)。頁面的預測帶是依假說推算:第 n 代(n ≥ 1)全保留是重帶佔 1/2ⁿ、輕帶佔其餘;分散是一條帶,重的比例 1/2ⁿ;半保留是中間帶佔 2/2ⁿ、輕帶佔其餘。相符與否依此判定:全保留只有第 0 代相符,分散第 0、1 代相符。

轉錄與加工:模板股、與 mRNA 序列相同(T 換成 U)的編碼股、啟動子(OpenStax Biology 2e 15.2);RNA 聚合酶不需要引子、RNA 由 5′ 往 3′ 合成(OpenStax Microbiology 11.3);5′ 端加 7-甲基鳥苷的帽、3′ 端由 poly(A) 聚合酶加約 200 個 A,兩者都保護 mRNA,帽幫助轉譯開始,poly(A) 尾是運出細胞核所需蛋白質的結合處;內含子由剪接體在細胞核裡移除並分解(OpenStax Biology 2e 15.4)。

轉譯(OpenStax Biology 2e 15.1、15.5):64 個密碼子裡 61 個對應胺基酸、3 個終止,AUG 是甲硫胺酸也是起始密碼子;核糖體有 A、P、E 三個位置,反密碼子和密碼子配對,肽鍵形成後核糖體往 mRNA 的 3′ 端移一個密碼子,空的 tRNA 從 E 位離開;遇到 UAA、UAG、UGA 時由釋放因子讓多肽鏈脫離。細菌的起始 tRNA 帶甲醯甲硫胺酸,頁面簡化寫 Met。

遺傳密碼:頁面的 `CODE_AAS` 與 NCBI 第 1 號標準密碼表逐一比對 64 個密碼子,完全相同(2026-10-26)。胺基酸中文名用台灣常用名稱(丙胺酸、精胺酸、天門冬醯胺、天門冬胺酸、半胱胺酸、麩醯胺酸、麩胺酸、甘胺酸、組胺酸、異白胺酸、白胺酸、離胺酸、甲硫胺酸、苯丙胺酸、脯胺酸、絲胺酸、蘇胺酸、色胺酸、酪胺酸、纈胺酸)。

突變:點突變、同義(silent)、錯義、無義的定義依 OpenStax Microbiology 11.5。HBB 用 NM_000518.5 的編碼序列(CDS 51..494,444 nt,含終止密碼子,所以是 147 個胺基酸)前 27 個鹼基:AUG GUG CAU CUG ACU CCU GAG GAG AAG,翻成 Met Val His Leu Thr Pro Glu Glu Lys。鐮刀型紅血球的變異是 c.20A>T、p.Glu7Val,從成熟蛋白質算起稱為 Glu6Val(ClinVar VCV000015333、dbSNP rs334);MedlinePlus 寫成第 6 個位置的麩胺酸換成纈胺酸。頁面可選的 96 種改法(24 個位置 × 4 種鹼基)中,24 種沒變、17 種同義、52 種錯義、3 種無義(第 19、22 個鹼基 G→U 與第 25 個 A→U,都變成 UAG)。

教學示意:第 4、6 章的序列(啟動子 TAGCTA,mRNA 為 GCC AUG GCU UUC AAA GGC UGG UAA)與第 2 章模板的序列是自訂的;螺旋與梯子的比例、引子與岡崎片段的長度、複製叉與聚合酶的速度、轉錄泡泡的大小、酵素與核糖體的形狀大小、尾巴畫成 12 個 A、離心管裡帶的位置與粗細都是示意;「實際結果」那一排是依論文描述的結果畫成整數代的理想帶,不是論文照片的數位化。

#### 技術

單一 HTML 檔(central-dogma/index.html),共用 assets/bio-lesson.js、assets/bio-draw.js、assets/bio-lesson.css 與 assets/mobile-panels.*,2D canvas 繪圖,不需要建置,不使用到站人數計數;入口卡片圖是 assets/central-dogma.svg。程式分區與修改方式見 central-dogma/MAINTENANCE.md。

#### 來源連結

- OpenStax Biology 2e(Clark MA, et al., 2018)14.2 DNA Structure and Sequencing:https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing
- 14.3 Basics of DNA Replication(三種假說、Meselson 與 Stahl,圖 14.12、14.13):https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication
- 14.4 DNA Replication in Prokaryotes(表 14.1):https://openstax.org/books/biology-2e/pages/14-4-dna-replication-in-prokaryotes
- 14.5 DNA Replication in Eukaryotes(表 14.2):https://openstax.org/books/biology-2e/pages/14-5-dna-replication-in-eukaryotes
- 15.1 The Genetic Code:https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code
- 15.2 Prokaryotic Transcription:https://openstax.org/books/biology-2e/pages/15-2-prokaryotic-transcription
- 15.4 RNA Processing in Eukaryotes:https://openstax.org/books/biology-2e/pages/15-4-rna-processing-in-eukaryotes
- 15.5 Ribosomes and Protein Synthesis:https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis
- OpenStax Microbiology(Parker N, et al., 2016)11.3 RNA Transcription:https://openstax.org/books/microbiology/pages/11-3-rna-transcription ;11.5 Mutations:https://openstax.org/books/microbiology/pages/11-5-mutations
- Meselson M, Stahl FW. The replication of DNA in Escherichia coli. PNAS 1958;44(7):671–682. doi:10.1073/pnas.44.7.671:https://pmc.ncbi.nlm.nih.gov/articles/PMC528642/
- NCBI The Genetic Codes, table 1:https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi?chapter=tgencodes#SG1
- HBB mRNA NM_000518.5:https://www.ncbi.nlm.nih.gov/nuccore/NM_000518.5
- ClinVar VCV000015333(HBB c.20A>T,p.Glu7Val):https://www.ncbi.nlm.nih.gov/clinvar/variation/15333/
- MedlinePlus Genetics, HBB gene:https://medlineplus.gov/genetics/gene/hbb/

示意的序列、比例、速度與帶的形狀見上一段;頁面裡的數值以外的動畫細節都不是實測。

### PCR 與電泳(`pcr/`)

網頁:https://tung-beauregard.github.io/instrument-principles/pcr/

教學內容:PCR 的三個步驟與循環倍增、黏合溫度對專一性的影響、洋菜膠電泳判讀產物長度、qPCR 的 Ct 值與標準曲線。

| 項目 | 內容 | 狀態與來源 |
|---|---|---|
| 起始變性 | 94 到 98 °C;每個循環的變性 10 到 60 秒通常足夠 | Lorenz 2012,J Vis Exp (63):3998,第 6 節(PMC4846334) |
| 黏合溫度 | 約比引子的 Tm 低 5 °C;引子 Tm 最好 52 到 58 °C(可放寬到 45 到 65 °C) | Lorenz 2012,第 1、6 節 |
| 延伸 | Taq 聚合酶最適 70 到 80 °C,前 2 kb 約 1 分鐘、之後每多 1 kb 多 1 分鐘;頁面寫「72 °C 左右」是常用值 | Lorenz 2012,第 6 節 |
| 循環數 | 25 到 35 輪 | Lorenz 2012,第 6 節 |
| 引子長度 | 15 到 30 個鹼基(動畫畫成 6 個) | Lorenz 2012,第 1 節;畫法是示意 |
| 非專一產物 | 條件太寬鬆(例如黏合溫度太低)會出現梯子狀或抹開的條帶;太嚴格沒有產物 | Lorenz 2012,摘要與第 7 節 |
| Taq 的來源 | 耐熱細菌 *Thermus aquaticus* | Lorenz 2012,摘要 |
| 電泳 | DNA 骨架帶負電往正極移動;移動距離與片段大小的對數成反比 | Lee PY, et al. 2012,J Vis Exp (62):e3923 |
| SYBR Green I | 對雙股 DNA 有選擇性,結合後螢光大增 | Zipper H, et al. 2004,Nucleic Acids Res 32:e103(PMC484200,摘要) |
| qPCR 效率 | E = 10^(−1/斜率) − 1;斜率 −3.32 為 100%,起始量差 10 倍 Ct 差約 3.32 輪 | Agilent 斜率換算說明;MIQE(Bustin 2009,Clin Chem 55:611) |
| 示意值 | 序列、引子 Tm 58 °C、產物 450 bp、雜帶長度、平原期上限 1×10¹²、膠的跑速、qPCR 曲線形狀與門檻 | 示意,不是實驗結果 |

#### 進階章節(2026-10-27)

第 8 到 10 章(`primer` 引子設計與 Tm、`ddct` qPCR 相對定量、`melt` 熔解曲線),給做過 GC-MS、LC-MS 這類儀器分析的大學部高年級與研究生。三章共 52 秒,控制項:引子(四條示意引子)、鹽的條件、處理的效果、目標基因的效率、樣品、模板量。動畫裡的 Tm、ΔΔCt、Pfaffl 比值與熔解曲線的峰都在頁面上照公式算,不是寫死的數字。

| 項目 | 內容 | 狀態與來源 |
|---|---|---|
| 引子設計規則 | 長度 15 到 30 nt;GC 40% 到 60%;3′ 端要有 G 或 C;一對引子的 Tm 相差不超過 5 °C;兩條引子的 3′ 端不能互補,單一引子的 3′ 端也不能和自己其他部分互補(會形成引子二聚體或髮夾);避免 5 個以上相同鹼基與二核苷酸重複 | Lorenz 2012,J Vis Exp (63):3998,第 1 節(PMC4846334) |
| Wallace 規則 | Tm ≈ 2(A+T) + 4(G+C),只看組成;常用於 14 到 20 nt 的粗估;最近鄰法較好,各種計算器都只是估計 | Lorenz 2012 第 5 節;Biopython Bio.SeqUtils.MeltingTemp 文件(引 Thein 與 Wallace 1986) |
| 最近鄰參數 | 1 M NaCl 的統一參數(表 2 的 ΔH°、ΔS°,例如 CG/GC −10.6 kcal/mol、−27.2 cal/(K·mol);AA/TT −7.9、−22.2);起始項:末端 G·C 為 +0.1、−2.8,末端 A·T 為 +2.3、+4.1;自我互補的對稱校正 ΔS −1.4;表 1 的 ΔG°37(畫面上的長條) | SantaLucia J Jr. 1998,PNAS 95(4):1460–1465,表 1、表 2(PMC19045) |
| 鹽校正與 Tm 公式 | ΔS°[Na⁺] = ΔS°(1 M) + 0.368 × N × ln[Na⁺],N = 磷酸數 ÷ 2 = 長度 − 1;Tm = 1000 × ΔH° ÷ (ΔS° + R ln(C/4)) − 273.15(兩股不自我互補而且等量時用總濃度 ÷ 4),R = 1.987 cal/(K·mol) | SantaLucia 1998 內文(式子在原文是圖片,係數 0.368 與 N − 1 另外對照 Biopython 文件的 salt_correction 方法 5) |
| 計算條件 | 寡核苷酸 50 nM;鹽有三種:50 mM Na⁺、PCR 緩衝液(Primer3 的預設:一價 50 mM、Mg²⁺ 1.5 mM、dNTP 0.6 mM,依 von Ahsen 2001 換成 Na⁺ 等效 50 + 120 × √(1.5 − 0.6) ≈ 163.8 mM)、1 M Na⁺ | Primer3 說明文件(PRIMER_DNA_CONC、PRIMER_SALT_MONOVALENT、PRIMER_SALT_DIVALENT、PRIMER_DNTP_CONC 的預設與換算式);換算式也見 Biopython 文件 |
| 驗算 | 28 nt 的 CGTTCCAAAGATGTGGGCATGAGCTTAC:Na⁺ 50 mM、50 nM 時 60.32 °C,55 mM 時 60.79 °C,50 + 5 + 120 × √1.5 mM 時 67.39 °C,和 Biopython 文件的範例值相同;同一條的 ΔH −222.9 kcal/mol、ΔS(50 mM)−632.27 cal/(K·mol),和 BioPHP 的線上 Tm 計算器相同(它的 Tm 顯示 61 °C,濃度項的寫法不同) | node 驗算(2026-10-27) |
| 四條示意引子 | A CTGGATGACGAGATGGCTTG(GC 55%,Wallace 62 °C,最近鄰 52.7 / 58.4 / 67.5 °C,依序是 50 mM、PCR 緩衝液、1 M);B GGACCGCTCCTCCACAGCCG(GC 75%,70 °C;61.6 / 67.4 / 76.7 °C);C TTCACATAAAGTAAAGTTCG(GC 30%,52 °C;43.5 / 49.0 / 58.0 °C);D TCGGCAGGTCATTTGAATTC(GC 45%,58 °C;50.7 / 56.4 / 65.5 °C;3′ 端的 GAATTC 是回文,和自己 6 個鹼基互補) | 示意:隨機產生後依設計規則挑的,不對應真的基因;Tm 是照上面的公式算的 |
| 3′ 端自我互補的判斷 | 把引子和自己反向對齊,從 3′ 端往 5′ 數連續配得上的鹼基數;4 個以上標成問題,畫出兩條引子 3′ 端對在一起、被聚合酶各自延長 | 判斷門檻 4 是示意;二聚體被 Taq 延長、和不加模板的對照比對見 Thermo Fisher Real-time PCR handbook 的 Formation of primer-dimers 段 |
| Tm 預測的用法 | 演算法算出的 Tm 只供初步設計,實際的黏合溫度要用實驗(溫度梯度)決定;引子二聚體在 SYBR Green I 的測定裡可能造成偽陽性 | MIQE(Bustin 2009,Clin Chem 55:611)7.2 節 |
| ΔΔCt 法 | ΔCt = Ct(目標)− Ct(參考);ΔΔCt = ΔCt(處理)− ΔCt(對照);倍數 = 2^(−ΔΔCt);要求兩個基因的效率相同(相對效率圖斜率 < 0.1 可接受);效率不同時,目標與參考的 Cq 差會隨模板量改變 | Livak 與 Schmittgen 2001(Methods 25:402,只讀到摘要);Thermo Fisher Real-time PCR handbook 4.3 節;MIQE 7.4.1 節 |
| Pfaffl 法 | 比值 = E目標^ΔCP目標(對照 − 樣品) ÷ E參考^ΔCP參考(對照 − 樣品),E = 10^(−1/斜率)(E = 2 是每輪剛好加倍);兩個 E 都是 2 時化簡成 ΔΔ 法,ΔΔ 法只適合快速估計。頁面把 E 寫成 1 + E(E 是 MIQE 的效率,1.00 = 100%) | Pfaffl 2001,Nucleic Acids Res 29:e45(PMC55695) |
| 效率範圍 | 效率最好接近 100%,超出 90% 到 110% 可能讓結果偏掉;目標與參考基因的效率要相近 | Thermo Fisher Real-time PCR handbook(Troubleshooting 一節) |
| 相對定量的模型 | Ct = ln(門檻份數 ÷ 起始份數) ÷ ln(1 + E);效率 100% 時對照組目標 Ct 25、參考 Ct 18;處理組的上樣量 0.7 倍(兩個基因一起受影響,用來呈現參考基因的作用);參考基因效率固定 100%;Ct 取到小數第二位再算。2^(−ΔΔCt) ÷ 真值 = (真值 × 0.7)^(ln2 ÷ ln(1+E) − 1)。例:效率 90%、真值 8 倍時 2^(−ΔΔCt) 得 9.19(高估 15%),Pfaffl 得 8.01;效率 80%、16 倍時得 24.6(高估 54%) | 公式依 Livak、Pfaffl;Ct、上樣量與效率都是示意 |
| 熔解曲線 | qPCR 後慢慢升溫,SYBR Green I 的螢光在接近產物 Tm 時陡降;曲線的形狀與位置由 GC/AT 比、長度與序列決定,Tm 差不到 2 °C 也分得出;專一的擴增是一個窄峰;引子二聚體是螢光較低、較寬、在 70 多 °C 熔解的峰(長短不一),沒有模板時更常見,模板越少越多;出現多個峰表示有別的產物 | Ririe KM, et al. 1997,Anal Biochem 245:154–160(摘要);Thermo Fisher Real-time PCR handbook(Formation of primer-dimers、High resolution melting 一節) |
| 熔解曲線的模型 | 各產物還是雙股的比例 s = 1/(1 + e^((T − Tm)/w));F = 0.03 + (1 − 0.012(T − 60)) × Σ 量 × s;−dF/dT 用解析式;峰是局部最大值而且雙股分開的那一項大於 0.004。目標產物 84.5 °C(寬 0.55)、引子二聚體 76.5 °C(寬 1.6)、另一個產物 88 °C(寬 0.55);量依樣品與模板量(多、少、不加)而變 | 示意(Tm、寬度、量、染劑隨溫度變暗 1.2%/°C、背景 0.03、峰的門檻都不是實測) |

教學示意:四條引子序列、3′ 端互補的門檻、相對定量的 Ct 與上樣量、擴增與熔解曲線的形狀、三種產物的 Tm 與量,都是為了說明原理設定的,不可用於判讀實際的實驗。

來源連結:

- SantaLucia J Jr. A unified view of polymer, dumbbell, and oligonucleotide DNA nearest-neighbor thermodynamics. Proc Natl Acad Sci USA. 1998;95(4):1460–1465:https://pmc.ncbi.nlm.nih.gov/articles/PMC19045/
- Lorenz TC. Polymerase Chain Reaction: Basic Protocol Plus Troubleshooting and Optimization Strategies. J Vis Exp. 2012;(63):3998:https://pmc.ncbi.nlm.nih.gov/articles/PMC4846334/
- Primer3 manual(PRIMER_DNA_CONC、PRIMER_SALT_MONOVALENT、PRIMER_SALT_DIVALENT、PRIMER_DNTP_CONC、PRIMER_TM_FORMULA、PRIMER_SALT_CORRECTIONS):https://primer3.org/manual.html
- Biopython, Bio.SeqUtils.MeltingTemp(Tm_Wallace、Tm_NN 與 salt_correction 的說明與範例值):https://biopython.org/docs/latest/api/Bio.SeqUtils.MeltingTemp.html
- BioPHP minitools, Melting Temperature (Tm) Calculation(比對 ΔH、ΔS 用):http://www.biophp.org/minitools/melting_temperature/demo.php
- Livak KJ, Schmittgen TD. Analysis of relative gene expression data using real-time quantitative PCR and the 2^(−ΔΔCT) method. Methods. 2001;25(4):402–408:https://doi.org/10.1006/meth.2001.1262
- Pfaffl MW. A new mathematical model for relative quantification in real-time RT-PCR. Nucleic Acids Res. 2001;29(9):e45:https://pmc.ncbi.nlm.nih.gov/articles/PMC55695/
- Bustin SA, et al. The MIQE Guidelines. Clin Chem. 2009;55(4):611–622(7.2 節 Specificity、7.4.1 節 PCR efficiency):https://doi.org/10.1373/clinchem.2008.112797
- Thermo Fisher Scientific. Real-time PCR handbook(2016):https://www.thermofisher.com/content/dam/LifeTech/Documents/PDFs/PG1503-PJ9169-CO019861-Update-qPCR-Handbook-branding-Americas-FLR.pdf
- Ririe KM, et al. Product differentiation by analysis of DNA melting curves during the polymerase chain reaction. Anal Biochem. 1997;245(2):154–160:https://doi.org/10.1006/abio.1996.9916

未確認:Livak 與 Schmittgen 2001、Ririe 1997 只讀到摘要;von Ahsen 2001 的換算式是從 Primer3 與 Biopython 的說明文件讀到的,沒有讀原文;SantaLucia 1998 的式子在網頁版是圖片,係數另外對照 Biopython 文件。

### DNA 定序(`sequencing/`)

網頁:https://tung-beauregard.github.io/instrument-principles/sequencing/

教學內容:定序在做什麼(讀長與通量);Sanger 鏈終止法(ddNTP 讓新股隨機停下、毛細管電泳依長度排隊、雷射讀出末端顏色);Illumina 合成定序(打斷接上接頭、流動槽上橋式放大成叢、每輪接上一個帶螢光的可逆終止核苷酸、拍照、切掉);RNA-seq(mRNA 反轉錄成 cDNA 後定序、以讀到的次數比較基因表現);奈米孔定序(單股穿過蛋白質孔、離子電流隨孔裡的鹼基組合改變);三種方法的讀長、同時讀幾條、準確度與適合的用途。

| 項目 | 內容 | 狀態與來源 |
|---|---|---|
| 鏈終止 | ddNTP 的糖少了 3′-OH,接上後鏈不能再延長;終止物的比例要讓只有一部分鏈接上(1977 年 ddNTP 對 dNTP 約 100) | Sanger F, et al. PNAS 1977;74(12):5463–5467(PMC431765),第 5463 頁;方法見第 5464 頁 |
| 螢光與毛細管電泳 | 四種 ddNTP 各帶一種螢光;毛細管電泳依大小分開,差一個鹼基也分得出;雷射讀出末端顏色,依序就是序列;A 配 T、G 配 C | OpenStax Biology 2e,14.2 DNA Structure and Sequencing(Sanger Dideoxy Chain Termination Method 段落) |
| Sanger 讀長與準確度 | 讀長可到約 1,000 bp,單一鹼基準確度最高約 99.999%;一次 96 或 384 根毛細管;小規模的工作仍以 Sanger 為主 | Shendure J, et al. Nat Biotechnol 2008;26:1135–1145(doi:10.1038/nbt1486),第 1135、1141 頁 |
| 商用毛細管的讀長 | 一般 650 到 900 個鹼基;峰隨時間擴散變寬,長片段難和只短一個鹼基的分開 | Gamble R, et al. Electrophoresis 2026;47(1):5–12(PMC12827225),引言 |
| ddNTP 比例的效果 | 頁面把比例換成「每接一個鹼基被終止的機會 p」(0.02% 到 5% 八檔),長度 n 的片段量 = 5000 × p × (1 − p)ⁿ(以偵測下限為 1),可判讀需要 2 倍,毛細管上限取 900 個鹼基;結果 0.1% 到 0.2% 約讀到 800 到 900,太多或太少都讀得比較短 | 示意模型(幾何分布推算);只依據 Sanger 1977「只讓部分鏈接上」與 Gamble 2026 的讀長範圍,數字不是實驗值 |
| Illumina 的叢 | 片段兩端接上接頭(幾百 bp);表面的兩種引子讓複製品留在原地(橋式放大);每叢約 1,000 份;叢直徑約 1 微米 | Shendure 2008 第 1138 頁(Fig. 2b);Bentley DR, et al. Nature 2008;456:53–59(PMC2581791),Fig. 1 |
| 可逆終止合成定序 | 3′-O-疊氮甲基可逆終止核苷酸,四種各帶可切除的螢光;一起加入,每輪只接一個;雷射激發後照相;TCEP 切掉螢光並恢復 3′-OH | Bentley 2008,「DNA sequencing using reversible terminators and clonal single molecule arrays」一節;Shendure 2008 第 1139 頁(Fig. 3b) |
| Illumina 讀長的限制 | 訊號衰減與不同步(例如螢光或終止基沒切乾淨)限制讀長 | Shendure 2008 第 1139 頁 |
| Illumina 規格 | MiSeq(Reagent Kit v3)每片 2,200 萬到 2,500 萬條,最長 2 × 300;NovaSeq X Plus 25B 流動槽每片 260 億到 350 億條,2 × 50 到 2 × 150(1.5B 可做 2 × 300),2 × 150 時 85% 以上的鹼基高於 Q30 | Illumina 規格頁(2026-10-26 查):miseq/specifications、novaseq-x-plus/specifications |
| 兩種螢光 | 新機型用紅、綠兩種螢光與兩張照片分辨四種鹼基(兩種都亮 A、紅 C、綠 T、都不亮 G;各機型不一定相同);動畫畫成四種顏色 | Illumina「2-Channel SBS Technology」頁 |
| RNA-seq | RNA 轉成接上接頭的 cDNA 片段,定序得到 30 到 400 bp 的 read;對回參考基因體或轉錄本;以落在外顯子上的 read 數(依長度校正)估計表現量;可比較不同組織 | Wang Z, et al. Nat Rev Genet 2009;10:57–63(PMC2949280),「RNA-Seq technology and benefits」「Defining transcription level」 |
| 柏科樹葉的例子 | 比較有腺體與沒有腺體(天然變異株)的 *Thuja plicata* 葉子:600 多個基因在有腺體的葉子裡高(604 個 contig 差 10 倍以上);其中一個萜類合成酶做出 α-側柏酮的前身檜烯 | Foster AJ, et al. Plant Physiol 2013;161(4):1993–2004(doi:10.1104/pp.112.206383),摘要與結果;計數方法是 Illumina 的 3′ 端短片段定序(tag profiling) |
| 奈米孔原理 | 蛋白質孔嵌在不導電的高分子膜上;電壓讓離子電流通過孔;馬達蛋白把雙股拆開、把單股送進孔並控制速度;不同鹼基組合造成特定的電流變化;鹼基判讀演算法翻成序列 | Oxford Nanopore「Nanopore sequencing technology」與「Flow cells and nanopores」頁(2026-10-26 查) |
| 孔裡的鹼基數 | 電流由 3 到 6 個鹼基的組合決定(頁面畫成 5 個) | Jain M, et al. Genome Biol 2016;17:239(PMC5124260),「DNA strand sequencing using the Oxford Nanopore MinION」 |
| 奈米孔讀長 | 只受 DNA 本身長度限制,20 到 4,000,000 個鹼基;例行讀到 50 kb 以上 | Oxford Nanopore 技術頁;Jain 2016 Conclusions |
| 奈米孔準確度 | 2016 年單次約 92%;目前單次 99% 以上(最新模型 99.75%);多讀幾次的共識序列可以更準 | Jain 2016 Outlook;Oxford Nanopore「Accuracy」頁 |
| 奈米孔通量與機身 | MinION 一片 2,048 個孔、512 個一組控制,重 90 公克;MinION 流動槽 512 個通道、PromethION 流動槽 2,675 個通道 | Jain 2016;Oxford Nanopore 線上商店的流動槽頁 |
| 示意值 | 所有序列、反應管裡的材料畫法、八份新股停的位置、峰的形狀與雜訊、N 的判斷規則、毛細管跑速、叢的數目、橋的形狀、Illumina 的六叢序列、RNA-seq 的讀取次數、電流高低、單股前進速度、比較圖中奈米孔「常見幾萬」的範圍 | 示意,不是實驗結果 |

#### 進階章節(2026-10-27)

接在「三種方法比較」之後的三章,講 DNA 層次的分析(RNA-seq 的計數、標準化與差異表現在「轉錄體分析」`transcriptomics/`):

| 章節 | 重點與公式 | 數值的來源與狀態 |
|---|---|---|
| `align` 進階:比對與覆蓋度 | 先用一小段完全相同的種子查索引找出候選位置,再往兩邊延伸、逐個比較(seed-and-extend);重複序列裡的 read 放在哪一份都一樣好,MAPQ = −10 log₁₀ Pr{放錯位置} 給 0;覆蓋度 c = N × L ÷ G;每個鹼基被蓋到的次數接近 Poisson,P(k) = c^k e^(−c) ÷ k!;沒蓋到的比例約 e^(−c);空洞段數約 N·e^(−c) | 種子與延伸:Li 2013(BWA-MEM)第 2.1.1 節;MAPQ 的定義:SAM 規格 1.4 節、Li 與 Durbin 2009 第 2.7.4 節;一樣好的位置隨機挑一個並給 0:Li 2008(MAQ)Overview、Li 與 Durbin 2009 第 3.2 節;c 與島數 N·e^(−cσ):Lander 與 Waterman 1988 第 232 到 234 頁;C = LN / G 與 Poisson:Illumina 技術說明 770-2011-022。參考序列、兩條 read、種子長度 4、索引的畫法、「MAPQ 60」都是示意(60 是 Li 與 Durbin 2009 模擬裡用的高值)。覆蓋度是真的模擬:環狀 G = 1,000,000、L = 150、起點均勻隨機(固定種子);1× 沒蓋到 37.1%(e^(−1) 36.8%)、空洞 2,415 段(N·e^(−c) 2,452.5);5× 0.65%(0.67%)、220 段(224.6);30× 與 100× 沒有空洞 |
| `variant` 進階:變異判讀 | pileup;鹼基品質 Q = −10 log₁₀(錯誤率),Q20 = 1%、Q30 = 0.1%;二倍體三種基因型 0/0、0/1、1/1,讀到變異的比例約 0%、50%、100%;一條 read 讀到變異的機會 p = ε、0.5、1 − ε,看到 d 條裡 a 條變異的機率 ∝ p^a(1 − p)^(d − a)(Li 2011 式 2,m = 2);三種事先一樣時,機率最大的是判讀結果;真實基因型固定時 a 是二項分布,判對的機率是判成真實基因型的那些 a 的機率總和;低深度時異型合子可能只讀到一邊(深度 4 時 2 × 0.5⁴ = 12.5%) | Phred 20 = 1%、低於 5× 時常只讀到一條染色體、深度 > 20× 時 20% 到 80% 的規則才好用、事先機率偏向非異型合子以免把錯誤當變異:Nielsen 2011;式子:Li 2011 第 2.2 節式 (2)。ε = 1%(每個鹼基都當成 Q20)、只考慮兩種鹼基、三種基因型事先一樣、15 個鹼基的參考與抽出來的 read 都是示意。node 驗算:0/1 判對 87.5%(4 條)、97.85%(10 條)、99.994%(30 條);0/0 與 1/1 判對 96.06%、99.57%、99.9988%;讀到 1/10 條 T 時三種基因型的機率 90.3%、9.7%、0 |
| `assembly` 進階:基因體組裝與 N50 | 把 read 切成 k-mer,節點是 k − 1 個鹼基、邊是 k-mer(de Bruijn 圖),沿著邊走拼回序列;重複序列讓路徑匯合後分岔,沒有 read 從頭跨到尾就只能斷開;長讀長跨過長的重複;N50 = contig 由長到短加總,過總長一半的那一條的長度;N50 只看長度,不管接得對不對,丟掉短的 contig 會讓它變大,不同組裝要用同一個總長(例如基因體大小)才能比較 | de Bruijn 圖:Compeau 2011 Fig. 2、Box 1、Box 2;路徑匯合、spanner、N50 定義與比較的限制:Miller 2010 第 1.2、1.3、2 節。火炬松:約 22 Gb、單一大配子體、contig N50 8,206 bp(Zimin 2014),82% 是重複序列(Neale 2014),加入約 12× 的 PacBio 長讀長後 contig N50 25,361 bp(Zimin 2017)。兩段 de Bruijn 序列(k = 4)與 1 Mb 的基因體是示意:223 段重複序列(30 到 80 bp、0.3 到 6 kb、7 到 13 kb、38、46、72 kb,固定種子,約佔 52.9%),讀長 ≥ 重複長 + 40 bp 才跨得過,跨不過的重複不放進 contig。node 驗算:150 bp 104 條、N50 7,102 bp;10 kb 18 條、80,802 bp;50 kb 2 條、557,930 bp;150 bp 丟掉 5 kb 以下剩 30 條、N50 12,057 bp、總長少 170 kb |

控制項:平均定序深度 c(1×、5×、30×、100×);這個位置的 read 數(4、10、30)、真實基因型(0/0、0/1、1/1)、重新抽一組 read;讀長(150 bp、10 kb、50 kb)、丟掉 5 kb 以下的 contig。

來源連結:

- Lander ES, Waterman MS. Genomics 1988;2(3):231–239:https://doi.org/10.1016/0888-7543(88)90007-9
- Illumina, Estimating Sequencing Coverage(Pub. No. 770-2011-022):https://www.illumina.com/documents/products/technotes/technote_coverage_calculation.pdf
- Li H, Durbin R. Bioinformatics 2009;25(14):1754–1760:https://pmc.ncbi.nlm.nih.gov/articles/PMC2705234/
- Li H, Ruan J, Durbin R. Genome Res 2008;18(11):1851–1858:https://pmc.ncbi.nlm.nih.gov/articles/PMC2577856/
- Li H. Aligning sequence reads, clone sequences and assembly contigs with BWA-MEM. arXiv:1303.3997:https://arxiv.org/abs/1303.3997
- SAM 格式規格:https://samtools.github.io/hts-specs/SAMv1.pdf
- Nielsen R, et al. Nat Rev Genet 2011;12(6):443–451:https://pmc.ncbi.nlm.nih.gov/articles/PMC3593722/
- Li H. Bioinformatics 2011;27(21):2987–2993:https://pmc.ncbi.nlm.nih.gov/articles/PMC3198575/
- Compeau PEC, Pevzner PA, Tesler G. Nat Biotechnol 2011;29(11):987–991:https://pmc.ncbi.nlm.nih.gov/articles/PMC5531759/
- Miller JR, Koren S, Sutton G. Genomics 2010;95(6):315–327:https://pmc.ncbi.nlm.nih.gov/articles/PMC2874646/
- Zimin A, et al. Genetics 2014;196(3):875–890:https://pmc.ncbi.nlm.nih.gov/articles/PMC3948813/
- Neale DB, et al. Genome Biol 2014;15:R59:https://pmc.ncbi.nlm.nih.gov/articles/PMC4053751/
- Zimin AV, et al. GigaScience 2017;6(1):1–4:https://pmc.ncbi.nlm.nih.gov/articles/PMC5437942/

未確認:Nystedt B, et al. Nature 2013(挪威雲杉約 200 億個鹼基)只讀到摘要,頁面沒有引用。

### DNA 鑑定與分子標記(`dna-markers/`)

網頁:https://tung-beauregard.github.io/instrument-principles/dna-markers/

臺灣森林遺傳與林木改良研究常用的分子標記技術:用細胞核的 SSR(簡單重複序列,又叫微衛星)分辨每一棵樹,把查獲的木材比對回被砍的樹(個體鑑定)、判斷親本與雜交;用葉綠體 DNA 分辨物種,檢查加工過的木材與油品的原料(產品鑑定)。生化原理分區的動畫教材,版型和 PCR 與電泳相同。

- 8 章,共 127 秒:為什麼 DNA 能鑑定、SSR 的重複次數、讀出基因型(毛細管電泳的峰)、DNA 指紋(木材比對回樹頭)、親子鑑定、雜交與葉綠體 DNA、葉綠體 DNA 份數多、檢查苦茶油的原料
- 可以自己調:甲樹的重複次數、樣品樹、比對的位點數(1 到 28)、候選父本、植物類群(被子植物或針葉樹)、樣品(新鮮葉片、乾燥木材、油)、油品(小果油茶油、大果油茶油、兩種種子混榨、市售標示小果)
- 文字以台灣高中畢業看得懂為準

#### 原理重點

- SSR:1 到幾個鹼基的短序列連續重複(微衛星的重複單位在 1 到 10 個核苷酸;Vieira 2016)。DNA 複製時聚合酶滑動,重複次數就多一個或少一個,所以個體之間常常不同;在重複區兩側設計 18 到 25 個鹼基的引子做 PCR,產物長度反映重複次數;是共顯性、多等位的標記(Vieira 2016,Definition and genome occurrence 與 Genotyping 兩節)。
- 分型:一條引子的 5′ 端帶螢光,PCR 產物加上已知長度的標準片段做毛細管電泳,雷射激發後記成峰,可以分辨相差一個鹼基的片段(Thermo Fisher fragment analysis)。紅檜與臺灣扁柏的系統用螢光引子與 ABI 3500(GeneScan 600 LIZ)、ABI 3130XL(GeneScan 500 ROX)分析(Huang 2022、2020 的 Materials and methods)。
- 二倍體每個位點有兩個等位基因,各來自母本與父本;同型合子一個峰,異型合子兩個峰(OpenStax Biology 2e 12.2 的同型合子、異型合子定義)。
- 個體鑑定:單一位點的 PI = Σ(各基因型頻率)²,是隨機兩個個體在這個位點基因型相同的機率;多個位點的 CPI 是各位點 PI 相乘,每個連鎖群只取 PI 最低的一個位點,讓相乘的位點彼此不連鎖(Huang 2022)。這個估計假設比較的是不相干的個體;理論的 PI 常比實際觀察的低,近親(兄弟姊妹)的 PI 可以當保守的上限(Waits 2001)。
- 信心水準:CL = (1 − CPI)^N,N 是個體數;法院常用 99.99%、99% 或 95%(Huang 2022)。頁面由此解出 N = ln(CL) ÷ ln(1 − CPI)。
- 親子鑑定(排除法):親子在共顯性標記的每個位點至少共有一個等位基因;候選親本在任何一個位點都對不上就排除,實務上常要兩個位點不符才算有效,以防判讀錯誤、突變或不擴增的等位基因(Jones 2010,Box 1 與 Exclusion 一節)。
- 雜交:物種之間有固定差異的等位基因時,F1 在這些位點同時帶有兩個物種的等位基因;多個位點可以再分出 F2 與回交(Anderson & Thompson 2002)。葉綠體 SSR 可用來判斷雜交的方向(Wheeler 2014)。
- 葉綠體 DNA:通常單親遺傳、幾乎不重組,所以一棵樹多半只有一種型(Wheeler 2014;少數物種有雙親傳遞)。胞器 DNA 大多由母本遺傳,約三分之一研究過的物種有雙親傳遞的跡象(Greiner 2015,Box 3);針葉樹的葉綠體 DNA 由父本遺傳(Neale 1989),扁柏屬 *C. obtusa* × *C. pisifera* 的 4 個雜交後代,葉綠體與粒線體 DNA 都和父本 *C. pisifera* 相同(Kondo 1998)。葉綠體 SSR 多為 A/T 單鹼基重複(Vieira 2016;Wheeler 2014)。
- 份數:葉片細胞的葉綠體 DNA 可超過 10,000 份(Morley & Nielsen 2016 的摘要);核 DNA 每個位點兩份。乾燥木材的 DNA 多半已降解,短而份數多的序列(葉綠體、粒線體、重複的核序列)最容易驗到(Deguilloux 2002 的摘要)。精製油的 DNA 極少又嚴重斷裂,粗油與冷壓油比較多;油品的 PCR 產物常設計在 200 bp 以下(Xia 2025)。
- 苦茶油:臺灣的苦茶油原料是大果油茶(油茶 *Camellia oleifera*)與小果油茶(短柱山茶 *C. brevistyla*)的種子(農業部)。兩個葉綠體 SSR 標記分辨這兩種;小果油茶的後代與母樹基因型相同(母系遺傳穩定);製油的每一步都能判讀,最好的檢查點在粗油之前;並驗出兩款臺灣在地苦茶油是用進口種子榨的(Food Anal Methods 2023 的摘要)。

#### 數值與示意

有出處:

- 紅檜(*Chamaecyparis formosensis*):36 個多型 SSR 位點(9 個新開發、27 個已發表),每個位點 2 到 27 個等位基因、平均 7.916;單一位點 PI 0.114 到 0.897、平均 0.431;最多 28 個不連鎖位點,CPI 1.652 × 10⁻¹²,99.99% 信心下可分辨 6,000 萬棵,全臺族群 32.06 ± 3.20 百萬棵;最少 6 個位點,CPI 1.728 × 10⁻⁵,95% 信心下可分辨 2,900 棵;36 個位點中 23 個偏離哈溫平衡(Huang 2022,Results 的 Developing *C. formosensis* individual identification system 一節)。
- 臺灣扁柏(*Chamaecyparis taiwanensis*):23 個 gSSR 加 12 個 EST-SSR,系統用 30 個不連鎖位點,CPI 5.596 × 10⁻¹²,99.99% 信心下可分辨 1,800 萬棵;盜伐案用 19 個不連鎖位點,把 3 件查獲木材比對回 3 棵被害木;乾燥木材 22 個樣品 7 個成功(31.81%),每個樣品要抽兩次以上(Huang 2020,摘要與 Results;結論段寫五件木材,和摘要、結果的三件不一致,頁面用三件)。
- 頁面算的「分辨全臺紅檜所需」累積機率:−ln(0.9999) ÷ 32.06 × 10⁶ ≈ 3.1 × 10⁻¹²(由論文的 CL 公式與族群數換算,計算推估)。
- 葉片細胞的葉綠體 DNA 可超過 10,000 份(Morley & Nielsen 2016)。

示意(頁面「資料來源」最後一條也有寫):

- 序列、重複次數、兩側固定序列 84 bp(產物 = 84 + 2 × CA 個數)、所有等位基因長度與基因型(第 1 到 6 章)。
- 每個位點的 PI:論文逐位點的值在表格圖片裡,頁面改用示意值。28 個值落在 0.114 到 0.861、平均 0.435,由小到大排;前 6 個相乘 1.72 × 10⁻⁵、28 個相乘 1.65 × 10⁻¹²,對上論文的 1.728 × 10⁻⁵ 與 1.652 × 10⁻¹²。可分辨棵數往下取兩位有效數字。
- 毛細管電泳的到達時間、峰寬與峰高;標準片段只畫 90、100、110 bp。
- 第 7 章各樣品的份數、完整比例與斷裂方式(份數縮小很多,只為了比較核與葉綠體)。
- 苦茶油兩個葉綠體 SSR 的長度(標記 1:小果 152、大果 146 bp;標記 2:小果 203、大果 211 bp)、混榨時帶的強弱、製油流程各步驟的 DNA 量。論文全文沒有讀到,標記名稱與實際長度未確認。

教學示意:這份教材的序列、長度、機率曲線與電泳結果都是示意,不是實驗數據,不可用於實樣鑑定。

#### 技術

單一 HTML 檔(dna-markers/index.html),用共用的 assets/bio-lesson.js(播放器)與 assets/bio-draw.js(畫圖工具)在 2D canvas 繪圖,不需要建置,不使用到站人數計數。入口卡片概念圖 assets/dna-markers.svg。程式分區與修改方式見 dna-markers/MAINTENANCE.md。

#### 來源連結

- Huang CJ, et al. 2022, Sci Rep 12:4126(紅檜):https://pmc.ncbi.nlm.nih.gov/articles/PMC8904461/
- Huang CJ, et al. 2020, Sci Rep 10:22095(臺灣扁柏、盜伐案):https://pmc.ncbi.nlm.nih.gov/articles/PMC7744516/
- Vieira MLC, et al. 2016, Genet Mol Biol 39(3):312–328:https://pmc.ncbi.nlm.nih.gov/articles/PMC5004837/
- Thermo Fisher, How to Conduct Fragment Analysis:https://www.thermofisher.com/us/en/home/life-science/sequencing/sequencing-learning-center/capillary-electrophoresis-information/how-conduct-fragment-analysis.html
- OpenStax Biology 2e, 12.2 Characteristics and Traits:https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits
- Jones AG, et al. 2010, Mol Ecol Resour 10:6–30:https://doi.org/10.1111/j.1755-0998.2009.02778.x
- Waits LP, et al. 2001, Mol Ecol 10:249–256:https://doi.org/10.1046/j.1365-294x.2001.01185.x
- Anderson EC, Thompson EA 2002, Genetics 160:1217–1229:https://pmc.ncbi.nlm.nih.gov/articles/PMC1462008/
- Wheeler GL, et al. 2014, Appl Plant Sci 2(12):1400059:https://pmc.ncbi.nlm.nih.gov/articles/PMC4259455/
- Kondo T, et al. 1998, Breed Sci 48:177–179:https://doi.org/10.1270/jsbbs1951.48.177
- Neale DB, et al. 1989, PNAS 86:9347–9349:https://pmc.ncbi.nlm.nih.gov/articles/PMC298492/
- Greiner S, et al. 2015, BioEssays 37:80–94:https://pmc.ncbi.nlm.nih.gov/articles/PMC4305268/
- Morley SA, Nielsen BL 2016, Front Plant Sci 7:57:https://pmc.ncbi.nlm.nih.gov/articles/PMC4740508/
- Deguilloux MF, et al. 2002, Proc R Soc B 269:1039–1046:https://pmc.ncbi.nlm.nih.gov/articles/PMC1690996/
- Xia Y, et al. 2025, Foods 14(18):3186:https://pmc.ncbi.nlm.nih.gov/articles/PMC12469460/
- Food Anal Methods 2023;16(11–12):1635–1645(苦茶油的葉綠體 SSR,只讀到摘要):https://doi.org/10.1007/s12161-023-02532-2
- 農業部特用作物資料(大果油茶與小果油茶的學名):https://kmweb.moa.gov.tw/subject/subject.php?id=35465 (另一份林業研究專訊把小果種寫成細葉油茶 *C. tenuifolia*,分類有分歧;頁面依農業部與苦茶油那篇用 *C. brevistyla*。農業部那份是 PDF,內容由搜尋引擎的摘錄確認,PDF 的中文字沒能抽出來逐字核對)

### 基因選殖與蛋白表現(`cloning/`)

網頁:https://tung-beauregard.github.io/instrument-principles/cloning/

生化原理分區的教材,版型同 `pcr/`:八章 2D 動畫加字幕,共 129 秒。從「為什麼要讓細菌做酵素」講起,依序是 cDNA、限制酶與接合酶把基因接進質體、熱休克轉形與抗生素篩選、pET 系統的 IPTG 誘導、溫度與包涵體、His 標籤的金屬親和層析,最後用 SDS-PAGE 與西方墨點法確認。例子用臺灣杉單萜合成酶的研究(Ma LT, et al. 2021)。

- 第 1 章 目的:植物細胞裡目標酵素很少;基因接進質體、送進大腸桿菌、大量做出酵素,再加受質看產物
- 第 2 章 取得基因:外顯子與內含子、轉錄與剪接、反轉錄酶做 cDNA、PCR 放大從 ATG 到終止密碼的一段;控制項「PCR 的模板」(cDNA 或基因組 DNA)
- 第 3 章 載體:質體的複製起點、抗性基因、T7 啟動子、His 標籤與插入位置;EcoRI 在 GAATTC 錯開切斷、黏性末端配對、接合酶補上兩個缺口;控制項「切法」(兩種酶,或只用一種)
- 第 4 章 轉形與篩選:冰上、42 °C 熱休克、塗在含康黴素的培養基上、隔夜長出菌落;控制項「培養基加抗生素」「加入質體」
- 第 5 章 誘導:DE3 菌株染色體上的 T7 RNA 聚合酶基因被 LacI 擋住,IPTG 讓 LacI 離開,T7 RNA 聚合酶大量轉錄目標基因;控制項「加 IPTG」
- 第 6 章 溫度:37 °C 與 16 °C 並排,快速合成的長鏈黏成包涵體、慢慢做的摺好,打破細胞離心後看可溶與沉澱;控制項「加 IPTG」
- 第 7 章 純化:His 標籤抓住鎳或鈷、咪唑洗滌與沖提、組胺酸側鏈與咪唑是同一種環;控制項「接上 His 標籤」
- 第 8 章 確認:SDS-PAGE 六道(標準、未誘導、誘導、可溶、沉澱、純化),轉印後用抗 His 的抗體只讓目標蛋白顯色;控制項「加 IPTG」「接上 His 標籤」「電泳樣品的誘導溫度」
- 文字以台灣高中畢業看得懂為準

#### 數值與示意

為什麼要用 cDNA:植物基因的編碼序列被內含子打斷,內含子要在轉譯前精確剪掉(OpenStax Biology 2e 15.4);從 mRNA 用反轉錄酶做出的 cDNA 沒有內含子(OpenStax Microbiology 12.1;OpenStax Biology 2e 17.1 的 RT-PCR)。「大腸桿菌沒有剪接內含子的機制,所以要用 cDNA」這句在 Tymoczko 等《Biochemistry: A Short Course》3e 第 41.3 節,只在搜尋摘要讀到原句(出版社頁面連不上),頁面的字幕依 OpenStax 的內容改寫。

限制酶與接合酶:限制酶在 4 到 6 個鹼基、多半是回文的位置切斷,錯開切時留下互補的單股突出(黏性末端),接合酶以共價鍵接回骨架(OpenStax Microbiology 12.1;OpenStax Biology 2e 17.1 寫 2 或 4 個鹼基的突出)。EcoRI 認 G^AATTC、HindIII 認 A^AGCTT(Thermo Fisher 產品頁 ER0271、ER0501);頁面上 AATT 的突出由切點推得。兩端用兩種酶時只有一種接法;只用一種酶時基因可以正反兩種方向接進去,質體也會自己接回去,需要去磷酸化或篩選(Addgene blog, Plasmids 101: Restriction Cloning, 2016-02-18)。質體元件的作用:複製起點讓細菌複製質體、抗性基因讓帶質體的菌在抗生素下活下來、插入位置有多個限制酶切位、啟動子決定插入基因的轉錄(Addgene Molecular Biology Reference)。

轉形:Addgene 的熱休克流程是勝任細胞與 DNA 在冰上 20 到 30 分鐘、42 °C 水浴 30 到 60 秒(常以 45 秒最好)、回冰 2 分鐘、加 SOC 或 LB 在 37 °C 搖 45 分鐘、塗在含抗生素的 LB 培養基、37 °C 隔夜;頁面字幕只用「冰上、42 °C 30 到 60 秒」。只有帶質體的菌在含抗生素的培養基上長得出來(OpenStax Biology 2e 17.1 圖 17.7;OpenStax Microbiology 12.1)。每個菌落通常是一個細胞分裂出來的(JoVE Science Education〈Pure Cultures and Streak Plating〉,只在搜尋摘要讀到)。康黴素是例子:pET 手冊 p.19 的誘導對照表列 pET-28b(+) 帶康黴素抗性;Ma LT 2021 用的是 pET21(安比西林)或 pET28(康黴素)。

pET 系統(Novagen pET System Manual, 10th ed., TB055):目標基因接在強的 T7 啟動子後面,提供 T7 RNA 聚合酶才表現,全力誘導時目標蛋白在誘導後幾小時內可超過菌體蛋白的 50%(p.4);T7lac 啟動子下游有 lac 操縱子,載體自己帶 lacI,LacI 同時擋住染色體上 lacUV5 啟動子的 T7 RNA 聚合酶基因與載體上的 T7lac 啟動子(p.11);DE3 菌株是 λDE3 溶原菌,帶 lacI、lacUV5 啟動子與 T7 RNA 聚合酶的基因,加 IPTG 誘導(p.14);OD600 0.4 到 1(建議 0.6、約 3 小時)時加 IPTG,一般 T7 啟動子 0.4 mM、T7lac 1 mM,再培養 2 到 3 小時(p.33);同一瓶分兩半、一半不加 IPTG 當對照(p.42)。IPTG 是乳糖的不可分解類似物(Rosano 等 2014)。C41(DE3) 是由 BL21(DE3) 篩選來、適合不好表現的蛋白的菌株(同上)。

溫度與可溶比例:37 °C 時有些蛋白堆成包涵體,30 °C 時較多可溶、有活性的蛋白;有時低溫(15 到 20 °C)長時間(例如過夜)誘導可溶的產量最好;降低合成速率的條件通常提高可溶比例;可溶不一定代表摺疊正確(pET 手冊 p.34)。包涵體是蛋白質聚集的團塊,包涵體問題嚴重時建議在 15 到 25 °C 表現,慢一點讓新合成的蛋白有時間摺好(Rosano 等 2014)。頁面的可溶比例 16 °C 70%、37 °C 25% 是示意,只表示方向。

His 標籤與 IMAC(Bornhorst 等 2000):組胺酸是和固定化金屬結合最強的胺基酸,靠側鏈的咪唑環配位;常用 6 個組胺酸;Ni²⁺-NTA 與 Co²⁺ 樹脂留兩個配位位置給標籤;洗滌用低濃度咪唑(Ni-NTA 10 到 50 mM、鈷樹脂約 10 mM),沖提用高濃度咪唑(Ni-NTA 100 mM 以上、鈷樹脂 50 mM 以上),咪唑和標籤搶金屬;表現量高時一步可達約 95% 純度。pET 手冊 p.7 的標籤表:His•Tag 6、8 或 10 個胺基酸,用金屬螯合層析純化,也有單株抗體可做西方墨點法。

確認:SDS 蓋住蛋白質原本的電荷,讓聚丙烯醯胺膠只依大小分開,小的跑得快,與分子量標準比對,用考馬斯藍或銀染(OpenStax Microbiology 12.2)。西方墨點法把膠上的蛋白轉印到硝化纖維膜,一級抗體抓目標蛋白,二級抗體帶酵素或螢光,加呈色受質顯出位置(OpenStax Microbiology 20.2)。

實例(Ma LT, et al. 2021, Plants 10:2404,PMC8625326,方法段):臺灣杉組織抽 RNA,1 µg 用 SuperScript III 反轉錄;Phusion 聚合酶與專一引子放大,5′ 與 3′ RACE 補全長,接進 pGEM-T Easy 定序;開放讀框(去掉預測的質體轉運胜肽)再接進 pTYB12、pET21 或 pET28,轉形 E. coli C41(DE3);LB 37 °C 長到 OD600 0.6,加 IPTG 到 0.4 mM,16 °C 誘導 16 到 22 小時;用 TALON Superflow(鈷)或幾丁質樹脂純化,以膠體電泳與西方墨點法確認;GPP 為受質時 TcTPS13、14 做香葉醇(geraniol),TcTPS15 做沉香醇(linalool),TcTPS16 做 β-蒎烯,TcTPS17 沒有單萜產物。頁面只用到「臺灣杉的萜類合成酶就是這樣找出各自做哪一種單萜」與流程上的數值。

規格與數值的狀態:

| 畫面上的內容 | 出現的地方 | 狀態 | 依據 |
| --- | --- | --- | --- |
| EcoRI G^AATTC、切在 G 與 A 之間、留下 AATT 突出 | 第 3 章序列放大、字幕、重點整理 | 原廠資料(突出序列由切點推得) | Thermo Fisher ER0271 |
| HindIII A^AGCTT | 第 3 章結果面板 | 原廠資料 | Thermo Fisher ER0501 |
| 兩種酶定方向;一種酶會反接、自接 | 第 3 章結果面板與控制項 | 實驗指南 | Addgene Plasmids 101 |
| 42 °C 30 到 60 秒、冰上、37 °C 隔夜 | 第 4 章字幕、溫度計、標籤 | 實驗指南 | Addgene Bacterial Transformation |
| 康黴素 | 第 4 章 | 原廠資料(舉例) | pET 手冊 p.19 |
| DE3、lacUV5、LacI 同時擋兩處、IPTG | 第 5 章 | 原廠資料 | pET 手冊 p.11、p.14 |
| OD600 約 0.6 | 第 5 章字幕 | 原廠資料、實例 | pET 手冊 p.33;Ma LT 2021 |
| IPTG 0.4 到 1 mM | 重點整理 | 原廠資料、實例 | pET 手冊 p.33;Ma LT 2021(0.4 mM) |
| 可超過菌體蛋白一半 | 第 5 章字幕、右邊長條 | 原廠資料;長條上升的曲線是示意 | pET 手冊 p.4 |
| 37 °C 誘導約 2 到 3 小時;16 °C 16 到 22 小時 | 第 6 章標題 | 原廠資料、實例 | pET 手冊 p.33;Ma LT 2021 |
| 低溫提高可溶比例、可溶不一定有活性 | 第 6 章字幕 | 原廠資料、文獻 | pET 手冊 p.34;Rosano 2014 |
| 可溶 70%(16 °C)、25%(37 °C) | 第 6 章離心管、第 8 章可溶與沉澱兩道 | 示意 | 只表示方向 |
| 6 個組胺酸、鎳或鈷樹脂 | 第 7 章 | 文獻 | Bornhorst 2000;pET 手冊 p.7 |
| 咪唑洗 10 到 50 mM、沖提 100 mM 以上 | 第 7 章右下 | 文獻(Ni-NTA 的範圍) | Bornhorst 2000 |
| 目標蛋白 60 kDa | 第 8 章 | 示意 | 單萜合成酶的實際大小沒有查證 |
| 分子量標準 250、150、100、75、50、37、25、20、15、10 kDa 與位置 | 第 8 章 | 示意(數值是常見的一組) | 位置用 log 分子量線性換算 |
| 序列 `VEC`、`TOPF`;外顯子與內含子的數目與長度;質體元件的位置 | 第 2、3 章 | 示意 | |
| 菌落 28 個、8 隻菌裡 2 隻吃進質體、培養皿上的菌數 | 第 4 章 | 示意 | |
| 核糖體數與速度、長鏈命運的比例、蛋白質數量 | 第 5、6、7 章 | 示意 | |

#### 技術

單一 HTML 檔(cloning/index.html),2D canvas,用生化原理分區共用的 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖工具)、`assets/bio-lesson.css`(版面),不需要建置、沒有外部依賴、不使用到站人數計數。七個控制項都是 `restart: false`,`draw(g, t, S)` 只依時間與狀態畫,改了立刻反映。程式結構、各章時間軸與控制項見 cloning/MAINTENANCE.md。入口概念圖 `assets/cloning.svg`。

#### 來源連結

讀到內容的(2026-10-26):

- OpenStax Biology 2e 17.1 Biotechnology:https://openstax.org/books/biology-2e/pages/17-1-biotechnology
- OpenStax Biology 2e 15.4 RNA Processing in Eukaryotes:https://openstax.org/books/biology-2e/pages/15-4-rna-processing-in-eukaryotes
- OpenStax Microbiology 12.1 Microbes and the Tools of Genetic Engineering:https://openstax.org/books/microbiology/pages/12-1-microbes-and-the-tools-of-genetic-engineering
- OpenStax Microbiology 12.2 Visualizing and Characterizing DNA, RNA, and Protein:https://openstax.org/books/microbiology/pages/12-2-visualizing-and-characterizing-dna-rna-and-protein
- OpenStax Microbiology 20.2 Detecting Antigen-Antibody Complexes:https://openstax.org/books/microbiology/pages/20-2-detecting-antigen-antibody-complexes
- Addgene, Molecular Biology Reference(Plasmid elements):https://www.addgene.org/mol-bio-reference/plasmid-background/
- Addgene, Bacterial Transformation protocol:https://www.addgene.org/protocols/bacterial-transformation/
- Addgene blog, Plasmids 101: Restriction Cloning(2016-02-18):https://blog.addgene.org/plasmids-101-restriction-cloning
- Thermo Fisher EcoRI(ER0271):https://www.thermofisher.com/order/catalog/product/ER0271;HindIII(ER0501):https://www.thermofisher.com/order/catalog/product/ER0501
- Novagen pET System Manual, 10th ed.(TB055,PDF 的文字抽出後讀,頁碼依頁首):https://mcb.berkeley.edu/labs/krantz/pdf/vectors/pET_system_manual.pdf
- Bornhorst JA, et al. Purification of proteins using polyhistidine affinity tags. Methods Enzymol. 2000;326:245–254. PMC2909483:https://pmc.ncbi.nlm.nih.gov/articles/PMC2909483/
- Rosano GL, et al. Recombinant protein expression in Escherichia coli: advances and challenges. Front Microbiol. 2014;5:172. PMC4029002:https://pmc.ncbi.nlm.nih.gov/articles/PMC4029002/(只讀了前三分之一,包涵體、溫度、C41 的段落)
- Ma LT, et al. Unveiling Monoterpene Biosynthesis in Taiwania cryptomerioides via Functional Characterization. Plants. 2021;10(11):2404. PMC8625326:https://pmc.ncbi.nlm.nih.gov/articles/PMC8625326/

只在搜尋摘要看到、沒有讀到原文的:Tymoczko 等《Biochemistry: A Short Course》3e 第 41.3 節(細菌不能剪接內含子,所以表現真核基因要用 cDNA;出版社頁面 DNS 失敗);JoVE Science Education〈Pure Cultures and Streak Plating〉(菌落視為單一細胞的後代)。NEB 的 EcoRI、HindIII 產品頁回 403、REBASE 憑證錯誤,改用 Thermo Fisher 的產品頁;NCBI Bookshelf 的 Lodish《Molecular Cell Biology》要求人機驗證,沒有讀,SDS-PAGE 改以 OpenStax Microbiology 12.2 為準。pET 手冊第 11 版(哈佛的 PDF)字型無法抽出文字,改讀第 10 版。

#### 進階章節(2026-10-27)

原本的八章之後加了三章進階,代號 `#gibson`、`#golden-gate`、`#codon`,章名都以「進階:」開頭,共 53 秒(17 + 18 + 18)。整份教材變成 11 章、約 3 分 2 秒(182 秒),控制項 13 個。讀者假設已經看過前八章(限制酶選殖、轉形、誘導、純化)。

- 第 9 章 進階:Gibson 組裝 (17 s) 不用限制酶,相鄰兩段共用一段重疊序列;5′ 外切酶把 5′ 端吃掉露出 3′ 單股、重疊處配對、聚合酶補空隙、接合酶封口,50 °C 一管同溫。控制項「要接的片段數」(2 / 3 / 5 段)與「重疊長度」(10 到 40 bp)
- 第 10 章 進階:Golden Gate 組裝 (18 s) BsaI 認 GGTCTC 卻切在辨識序列外面,留下 4 個鹼基的突出端;辨識序列跟著丟掉的小段走,產物不再被切,接錯的還會被切開,所以切與接在同一管裡循環。控制項「突出端的組合」(都不一樣 / 有兩個一樣)與「切接反應的時間」(5 / 30 分鐘)
- 第 11 章 進階:密碼子最佳化 (18 s) 大腸桿菌少用的密碼子、核糖體停頓、CAI 的定義與算法、兩個做法,以及「CAI 高不保證表現高」。控制項「序列」(原始 / 最佳化後)與「用補充稀有 tRNA 的菌株」

##### 公式與算出來的數值

- 重疊的專一性:n 個鹼基排得出 4ⁿ 種組合。畫面現算 4¹⁰ = 1.0 × 10⁶、4²⁰ = 1.1 × 10¹²、4⁴⁰ = 1.2 × 10²⁴,用來說明為什麼 20 bp 左右的重疊就足以讓兩端只配得上設計好的那一段。重疊還要在 50 °C 下黏得住,這一點只在字幕與判語裡定性說明。
- 接點數與成功率:接進環狀載體時 f 段有 f 個接點,每個都要接對,整體 = p^f。畫面用 p = 0.97(示意)算出 0.97² = 94.1%、0.97³ = 91.3%、0.97⁵ = 85.9%。方向與 Potapov 等 2018 量到的「接點越多、正確率越低」一致(他們的 12 段預測 99%、實測 99.2 ± 0.6%;24 段預測 91%、實測 84 ± 5%)。
- BsaI 的切點:GGTCTC(1/5) 指上股在辨識序列之後第 1 個鹼基後切、下股在第 5 個後切,留下 4 個鹼基的 5′ 突出。畫面的引子末端寫成 TT + GGTCTC + A + GGAG + 片段,切完留下的突出端就是 GGAG,辨識序列留在被丟掉的那一小段裡。
- 突出端的組合:4 個鹼基有 4⁴ = 256 種,其中 16 種是回文(會自己和自己接),Engler 等 2008 因此說可用的是 240 種。
- 接得出哪些環:把每一段的左右突出端當節點,從載體的右端走到載體的左端列出所有路徑。四個接點都不一樣(GGAG / AATG / AGGT / GCTT)時只有「載體-1-2-3」;把第 3 個接點也設成 AATG 之後,另外多出「載體-1-3」(跳過第 2 段)與「載體-1-2-2-3」(第 2 段接了兩份)。這三種就是畫面在「有兩個一樣」時列出來的結果。
- CAI:w = 這個密碼子在同義家族裡的使用比例 ÷ 家族裡最高的那一個;CAI 是各 w 的幾何平均,寫成 (w₁ × w₂ × ⋯ × w_L)^(1/L),等價於 exp(ln w 的平均)。只有一個密碼子的家族(AUG、UGG)w 恆為 1,依 Sharp 與 Li 1987、Xia 2007 排除,所以示意序列的 L = 9。示意序列的 CAI:原始 0.2351(顯示 0.24)、最佳化後 1.0000(顯示 1.00);兩條序列每個位置的胺基酸相同(M A R L I R P G L K)。
- 稀有密碼子的門檻:每一千個密碼子出現不到 10 次,也就是低於 1%。示意序列裡 AGG 0.21%、AGA 0.36%、CTA 0.42%、ATA 0.68%、CCC 0.54%、GGA 0.95% 共 6 個,最佳化後 0 個;對照的常用密碼子 CGT 是 2.00%。

以上每一項都用 node 驗算過(4 的次方、0.97 的次方、由切點推出的突出端、路徑列舉、exp(平均 ln w))。

##### 哪些是示意

- 第 9 章:每段畫 56 bp、外切酶多吃 4 個鹼基、每個接點接對的機率 0.97、左下那個環的段數與顏色。反應條件(50 °C、一管、2 到 3 段 15 分鐘、4 段以上 1 小時、重疊 15 到 30 bp)有出處。
- 第 10 章:引子末端的序列是為畫面設計的(GGTCTC 與切點位置是真的);四個接合位取自 MoClo 的 GGAG、AATG、AGGT、GCTT,「有兩個一樣」那一組是把第 3 個接點也改成 AATG。白藍菌落數不是示意,是 Engler 等 2008 Table 1 的實測(Promega 緩衝液,37 °C 切接之後再 50 °C 與 80 °C 各 5 分鐘;5 分鐘 364 白 6 藍 = 98.4%,30 分鐘 1820 白 1 藍 = 99.9%;白色表示接到片段,藍色表示載體自己接回去)。
- 第 11 章:10 個密碼子的短序列是示意;w 與 CAI 依大腸桿菌全基因體的密碼子使用比例算出,真正的 CAI 以一組高表現基因當參考組,所以畫面上的值只用來看「換成常用密碼子之後怎麼變」,不是某個基因的實際 CAI。核糖體讀一個稀有密碼子慢 3.2 倍、「讀完要 2.3 倍時間」也是示意。

##### 來源連結

讀到內容的(2026-10-27):

- Addgene, Gibson Assembly Cloning protocol:https://www.addgene.org/protocols/gibson-assembly/
- SnapGene, Gibson Assembly:https://www.snapgene.com/guides/gibson-assembly
- SnapGene, Golden Gate Assembly:https://www.snapgene.com/guides/golden-gate-assembly
- Engler C, et al. A one pot, one step, precision cloning method with high throughput capability. PLoS ONE. 2008;3(11):e3647:https://pmc.ncbi.nlm.nih.gov/articles/PMC2574415/
- Weber E, et al. A modular cloning system for standardized assembly of multigene constructs. PLoS ONE. 2011;6(2):e16765:https://pmc.ncbi.nlm.nih.gov/articles/PMC3041749/
- Thermo Fisher Eco31I(BsaI)ER0291:https://www.thermofisher.com/order/catalog/product/ER0291
- Potapov V, et al. Comprehensive profiling of four base overhang ligation fidelity by T4 DNA ligase and application to DNA assembly. ACS Synth Biol. 2018;7(11):2665–2674;讀的是預印本 bioRxiv 322297:https://www.biorxiv.org/content/10.1101/322297v1.full
- Xia X. An improved implementation of codon adaptation index. Evol Bioinform Online. 2007;3:53–58:https://pmc.ncbi.nlm.nih.gov/articles/PMC2684136/
- Rosano GL, et al. Front Microbiol. 2014;5:172:https://pmc.ncbi.nlm.nih.gov/articles/PMC4029002/(這次讀的是密碼子使用與稀有 tRNA 菌株那幾段)
- Kudla G, et al. Coding-sequence determinants of gene expression in Escherichia coli. Science. 2009;324(5924):255–258:https://pmc.ncbi.nlm.nih.gov/articles/PMC3902468/
- GenScript 的大腸桿菌密碼子使用表:https://www.genscript.com/tools/codon-frequency-table

只讀到摘要或沒讀到原文的:

- Gibson DG, et al. Enzymatic assembly of DNA molecules up to several hundred kilobases. Nat Methods. 2009;6(5):343–345. doi:10.1038/nmeth.1318(nature.com 要登入;只確認摘要寫的是 5′ 外切酶、聚合酶、接合酶的一管同溫反應,先把末端削成單股讓它們專一退火再共價接起來。反應條件改用 Addgene 與 SnapGene 的說明)
- Sharp PM, Li WH. The codon adaptation index. Nucleic Acids Res. 1987;15(3):1281–1295(PMC340524 只給得到摘要與參考文獻,PDF 要通過 proof-of-work;公式改以 Xia 2007 為準)
- Kane JF. Effects of rare codon clusters on high-level expression of heterologous proteins in Escherichia coli. Curr Opin Biotechnol. 1995;6(5):494–500(PubMed 與 Europe PMC 都擋自動讀取;內容只透過 Rosano 等 2014 的引用)
- NEB 的 Gibson 與 Golden Gate 說明頁、FAQ:全部回 403,沒有引用。Kazusa 的 Codon Usage Database 查到的「Escherichia coli K12」只有 14 個 CDS,不適合當密碼子使用表,改用 GenScript 的表。

### 萜類合成酶(`terpene-synthase/`)

網頁:https://tung-beauregard.github.io/instrument-principles/terpene-synthase/

樹木精油裡的 pinene、limonene、linalool、geraniol 怎麼來:5 碳的 IPP 與 DMAPP 頭尾相接成 GPP,萜類合成酶在口袋裡拉走二磷酸,讓帶正電的碳鏈轉動、成環,最後放掉 H⁺ 或接上水;同一個 GPP 依酵素口袋的形狀走到不同產物,口袋裡的一個胺基酸也能改變產物。後半以臺灣杉的研究為例:從轉錄體找候選基因、選殖、在大腸桿菌表現、加 GPP 反應、SPME 收集、GC-MS 對照標準品,並看到序列最像 α-pinene 合成酶的基因實際做出 geraniol。生化原理分區的動畫教材,版型和 PCR 與電泳相同。

- 7 章,共 117 秒:精油裡的萜類、5 碳積木 IPP 與 DMAPP、口袋裡發生什麼事、同一個 GPP 不同產物、一個胺基酸的差別、找出基因與做出酵素、看層析圖認產物
- 可以自己調:接幾個 5 碳單位(GPP、FPP、GGPP)、酵素(geraniol、linalool、β-pinene 合成酶)、口袋旁的胺基酸(Tyr 或 Phe)、基因(TcTPS13 到 17)
- 文字以台灣高中畢業看得懂為準;結構式是線條式,原子編號照 GPP,動畫裡的分子可以由一個狀態漸變到下一個

#### 原理重點

- 積木:IPP 異構成 DMAPP,接長鏈的酵素(異戊烯基轉移酶)把兩者接成 GPP(10 碳),再接 IPP 成 FPP(15 碳)、GGPP(20 碳);GPP 做單萜、FPP 做倍半萜、GGPP 做雙萜(Bohlmann 1998,引言與 Enzymology and Mechanism of Terpenoid Cyclization 一節)。鏈延長是 1′-4(頭尾相接):DMAPP 的二磷酸離開成烯丙基陽離子,IPP 的雙鍵接上去成三級碳陽離子,再放掉 H⁺;口袋底的大胺基酸像一把「尺」決定鏈長(Christianson 2017,Prenyltransferases 一節與 Figure 11)。
- 拉走二磷酸:萜類合成酶要二價金屬離子,通常是 Mg²⁺ 或 Mn²⁺,裸子植物的酵素偏好 Mn²⁺;DDxxD 序列固定金屬離子(Bohlmann 1998)。第一類萜類環化酶用三個 Mg²⁺ 引發二磷酸離開,這三個離子由 DDXXD 與 NSE/DTE 兩段序列固定,二磷酸卡在口袋口(Christianson 2017,第一類萜類環化酶的概論與 (+)-Bornyl Diphosphate Synthase 一節)。臺灣杉的反應液加的是 10 μM MnCl₂(Ma 2021,3.5 節)。
- 成環:GPP 的 2、3 號碳雙鍵是反式,1 號碳碰不到 6 號碳;二磷酸先離開、再接到 3 號碳成 linalyl 二磷酸(LPP),2、3 號碳之間變成單鍵才能轉動,再離開後 1 號碳與 6 號碳接成六員環,得到 α-terpinyl 陽離子(Christianson 2017,Monoterpene Cyclases 一節與 Figure 30;Bohlmann 1998)。
- 結尾:碳陽離子放掉 H⁺ 成烯類(α-terpinyl 陽離子放掉 H⁺ 是 limonene),或被水接上成醇類(α-terpineol)(Bohlmann 1998)。geraniol 合成酶在 ¹⁸O 水中做出含 ¹⁸O 的 geraniol,氧來自水(Iijima 2004 的摘要)。
- 分岔:α-terpinyl 陽離子再接出四員環成 pinyl 陽離子,放掉環上或甲基上的 H⁺ 分別是 α-pinene、β-pinene;口袋的形狀是反應的模板,決定中間物能採取的形狀(Christianson 2017)。很多酵素以固定比例做出多種產物,冷杉的 pinene 合成酶做出 α- 與 β-pinene 約 2:3(Bohlmann 1998)。頁面的路線圖(geranyl 陽離子 → geraniol、linalool;LPP → α-terpinyl 陽離子 → limonene、terpinolene、pinyl 陽離子 → α-、β-pinene)是單萜常見的路線,依上述兩篇綜述的機制畫成。
- 一個胺基酸:兩支臺灣杉單萜合成酶(Tc-αPIN/TEO 與 Tc-TEO)胺基酸序列約 97% 相似、產物不同;Tc-αPIN/TEO 的 Y327、Y429、Y575 換成 Phe 後不再偏好 α-pinene,作者認為 Tyr 的羥基是形成雙環產物所需(Hsu 2015 的摘要)。另一個推測:臺灣杉的 α-pinene 合成酶在區域 1 的位置是 Cys、β-pinene 合成酶(TcTPS16)是 Ser,作者寫機制要再以實驗確認;冷杉 pinene 合成酶的 C372S、F579W 突變則偏向 α-pinene,方向相反(Ma 2021,2.3 節;冷杉的部分是 Ma 2021 引述 Hyatt & Croteau 2005,原文未核對)。
- 找基因與確認功能:Ma 2021 從臺灣杉針葉、毬果、木材的轉錄體以 BLASTx 搜尋,挑出 5 個候選(毬果 3 個、針葉 2 個;木材的片段短於 500 bp 不用),RACE 取得全長,選殖進 pGEM-T Easy 定序,再放進 pTYB12、pET21 或 pET28,必要時去掉質體轉運胜肽;在大腸桿菌 C41(DE3) 中 37 °C 養到 OD600 0.6,加 0.4 mM IPTG,16 °C 誘導 16 到 22 小時,純化(TALON 或 chitin);20 μL GPP 加 50 μL 酵素於 500 μL 緩衝液(50 mM HEPES pH 7.2、100 mM KCl、10 μM MnCl₂、5% 甘油、2 mM DTT),30 °C 1 小時;75 μm Carboxen-PDMS 纖維在室溫吸頂空 20 分鐘,注射口 250 °C 脫附,PolarisQ 離子阱 GC-MS、DB-5 管柱,60 °C 起每分鐘 5 °C 到 130 °C、每分鐘 30 °C 到 260 °C 停 5 分鐘;標準品 200 ppm,並比對 NIST 與 Wiley 資料庫(3.2 到 3.5 節)。
- 序列像不代表產物一樣:TcTPS13、15、16 的 BLAST 最佳結果都是紅檜 α-pinene 合成酶(GenBank ABW80964),TcTPS14 是日本扁柏 terpinolene 合成酶,TcTPS17 是臺灣杉已知的單萜合成酶(表 1);實際產物 TcTPS13、14 是 geraniol,TcTPS15 是 linalool,TcTPS16 是 β-pinene,TcTPS17 測不到單萜產物(2.3 節)。Bohlmann 1998 也寫到,只靠序列比對無法判定新酵素的功能。臺灣杉的葉與木材精油裡,單萜醇只有微量(Ma 2021,2.4 節),頁面沒有提這一點。

#### 數值與示意

有出處:

- 碳數:單萜 10、倍半萜 15、雙萜 20(Bohlmann 1998)。
- 滯留時間(DB-5,上述升溫程式):geraniol 12.46 與 12.48 分(TcTPS13、14 共同的產物)、linalool 8.44 分、β-pinene 5.61 分(Ma 2021,2.3 節與圖 3、4)。頁面把 geraniol 畫在 12.47 分、寫「約 12.5 分」。
- 質譜(70 eV,NIST WebBook 的 JCAMP 檔,取 m/z 39 以上、相對強度 3% 以上的峰,外加分子離子):geraniol 基峰 m/z 69,41(60)、68(21)、67(16)、93(14)、123(14),分子離子 154 約 1.2%;linalool 基峰 71,93(76)、55(64)、43(60)、41(56)、69(43)、80(32)、121(23),154 約 0.4%;β-pinene 基峰 93,41(61)、69(35)、39(32)、91(31)、77(28)、79(27)、121(11),136 約 8%。
- Tc-αPIN/TEO 與 Tc-TEO 約 97% 相似;突變位置 Y327、Y429、Y575(Hsu 2015 的摘要)。

示意(頁面「資料來源」最後一條也有寫):

- 酵素與口袋的形狀、螺旋、金屬離子與側鏈的位置;第 3、5 章把立體的轉動畫在平面上(第 5 章 7 號碳從環的右側繞進環中央,實際是從環的上方靠近)。
- 第 2 章口袋底的位置、IPP 進來的方式與時間;第 4 章路線圖的版面。
- 第 5 章的長條高度(Tyr 0.72、Phe 0.2),只表示 α-pinene 變少的方向,論文摘要沒有比例;也沒有畫比例變高的是哪一種產物。
- 第 7 章層析圖的峰形、峰高與雜訊(高斯峰 σ = 0.06 分);只有滯留時間是論文的值。質譜是 NIST 資料庫的譜,不是該研究的實測譜。
- 第 1 章臺灣杉小枝的樣子。

教學示意:這份教材的層析圖與質譜是用來說明「對照標準品與資料庫」的做法,不是實驗數據,不可用於實樣鑑定。

#### 技術

單一 HTML 檔(terpene-synthase/index.html),用共用的 assets/bio-lesson.js(播放器)與 assets/bio-draw.js(畫圖工具)在 2D canvas 繪圖,結構式由頁面裡的 `mol()` 畫;不需要建置,不使用到站人數計數。入口卡片概念圖 assets/terpene-synthase.svg。程式分區與修改方式見 terpene-synthase/MAINTENANCE.md。

#### 來源連結

- Ma LT, et al. 2021, Plants 10(11):2404(臺灣杉 TcTPS13 到 17):https://pmc.ncbi.nlm.nih.gov/articles/PMC8625326/
- Hsu LJ, et al. 2015, Tree Genet Genomes 11:796(只讀到摘要):https://doi.org/10.1007/s11295-014-0796-z
- Bohlmann J, et al. 1998, Proc Natl Acad Sci USA 95(8):4126–4133:https://pmc.ncbi.nlm.nih.gov/articles/PMC22453/
- Christianson DW 2017, Chem Rev 117(17):11570–11648:https://pmc.ncbi.nlm.nih.gov/articles/PMC5599884/
- Iijima Y, et al. 2004, Plant Physiol 134:370–379(geraniol 的氧來自水,只讀到摘要,頁面沒有列):https://doi.org/10.1104/pp.103.032946
- Degenhardt J, et al. 2009, Phytochemistry 70:1621–1637(單萜與倍半萜合成酶的綜述,只讀到摘要,頁面沒有列):https://doi.org/10.1016/j.phytochem.2009.07.030
- Hyatt DC, Croteau R 2005, Arch Biochem Biophys 439:222–233(冷杉 pinene 合成酶的突變,只讀到摘要,摘要沒有寫 C372S、F579W 的結果):https://doi.org/10.1016/j.abb.2005.05.017
- GenBank ABW80964(紅檜 α-pinene 合成酶,未發表的序列登錄):https://www.ncbi.nlm.nih.gov/protein/ABW80964.1
- NIST Chemistry WebBook 質譜:geraniol https://webbook.nist.gov/cgi/cbook.cgi?ID=C106241&Mask=200 ;linalool https://webbook.nist.gov/cgi/cbook.cgi?ID=C78706&Mask=200 ;β-pinene https://webbook.nist.gov/cgi/cbook.cgi?ID=C127913&Mask=200

### CRISPR 基因編輯(`crispr/`)

網頁:https://tung-beauregard.github.io/instrument-principles/crispr/

從細菌對抗噬菌體的免疫機制講起:細菌把病毒 DNA 的一小段存成 CRISPR 區裡的間隔序列,下次用轉錄出來的 RNA 帶著 Cas 蛋白認出並剪斷病毒。接著是實驗室的工具:Cas9 蛋白加一條嚮導 RNA,Cas9 先認 PAM、再從 PAM 旁邊打開雙股比對嚮導,配對夠長才在 PAM 往回數 3 個鹼基的地方把兩股剪斷;細胞用 NHEJ 直接接回(常有插入或缺失,讀框位移而剔除基因)或用 HDR 照模板修(精準改寫,但少得多)。最後是怎麼設計嚮導 RNA、避開脫靶,以及用途與限制。

- 8 章,約 2 分鐘,每章有字幕;最後一章之後停住
- 第 3 章可以換 Cas9 遇到的 DNA:完全相符、靠近 PAM 有不配對、旁邊沒有 PAM
- 第 5 章可以換 NHEJ 接回時少 1 個、多 1 個或少 3 個,看密碼子與蛋白質長度怎麼變
- 第 6 章可以切換照模板修(HDR)與直接接回(NHEJ)
- 第 7 章點畫面上的 PAM(或用右邊的選項)換一條嚮導,看切點與脫靶檢查的結果
- 文字以台灣高中畢業看得懂為準

#### 數值與示意

- PAM:化膿性鏈球菌(*Streptococcus pyogenes*)的 Cas9 認 5′-NGG-3′,在非目標股、緊接在目標序列的 3′ 端(Jinek 等 2012 Fig. 4;Sternberg 等 2014;Addgene 的 PAM 表寫 SpCas9 為 3′ NGG)。SpCas9 也會以約五分之一的效率切 NAG(Hsu 等 2013),頁面沒有提。
- 嚮導:約 20 個鹼基決定目標(Addgene;Jinek 等 2012 寫 crRNA 5′ 端的 20 個鹼基可以和目標配對)。天然是 crRNA 與 tracrRNA 兩條 RNA,可以接成一條(Jinek 等 2012 Fig. 5;Addgene 稱 gRNA 是兩者的合成融合)。
- 找位置的順序:先認 PAM 才檢查旁邊的序列,雙股從 PAM 這端開始打開、往遠端延伸;旁邊沒有 PAM 的完全相符序列會被略過,細菌自己 CRISPR 區裡的相符序列旁邊沒有 PAM,所以不會剪到自己(Sternberg 等 2014,摘要與討論)。
- 種子區:靠 PAM 那端約 10 個鹼基。Addgene 寫 8 到 10 個,Sternberg 等 2014 寫 8 到 12 個;Jinek 等 2012 在試管內測到靠 PAM 那端至少要連續配對 13 個,遠端連續 6 個不配仍可以切(Fig. 3)。頁面寫「約 10 個」。
- 切點:兩股都切在 PAM 上游 3 個鹼基(嚮導第 17 與 18 個之間),質體切割產生平整切口;HNH 剪和嚮導互補的那一股,RuvC 樣區剪另一股(Jinek 等 2012 Fig. 1、2)。Addgene 寫約 3 到 4 個鹼基。
- NHEJ:有效率但容易出錯,常在切點造成小的插入或缺失;不是 3 的倍數時讀框位移,常提早出現終止密碼子而失去功能,但剔除的效果要實驗確認(Addgene,Generating a Knockout)。三個鹼基一個密碼子、插入一兩個鹼基改變讀框、插入三個時蛋白質仍做得出來(OpenStax Biology 2e 15.1,Figure 15.4 是密碼表)。
- HDR:照著和切點兩側序列相同的模板修;效率一般低於修改過的對偶基因的 10%,大部分雙股斷裂仍由 NHEJ 修;在 S 與 G2 期進行;模板裡要加上防止再被剪的改動(Addgene,Small Precision Edits)。頁面寫「在大部分細胞裡比 NHEJ 少得多」「常不到一成」。
- 脫靶:能不能容忍不配對,看數目、位置與分布;靠近 PAM 的不配對比遠端的更不被容忍;3 個以上分散的不配對多半測不到切割;建議避開不到 3 個不配又帶 NGG 或 NAG 的相似位置(Hsu 等 2013)。頁面「會不會被剪」的五種說法是依這些定性結論訂的示意規則,不是任何軟體的打分。
- 由來:受噬菌體攻擊後,細菌加入來自噬菌體基因體的新間隔序列,間隔序列和噬菌體序列的相似度決定對哪一種有抵抗力(Barrangou 等 2007,摘要);新的間隔序列主要加在靠前導序列的那一端(Horvath 等 2008),第 1 章依此畫在最前面。CRISPR 是 clustered regularly interspaced short palindromic repeats 的縮寫,頁面譯為「成簇、規律間隔的短回文重複序列」(MedlinePlus)。
- 用途與限制的例子:楊樹同時編輯最多 6 個木質素生合成基因,碳水化合物與木質素的比值最高到野生型的 228%,製漿更有效率(Sulis 等 2023,摘要);2023-12-08 美國 FDA 核准第一個用 CRISPR/Cas9 的療法 Casgevy,取出 12 歲以上鐮刀型貧血症病人的造血幹細胞編輯後輸回(FDA 新聞稿);改到生殖細胞或胚胎會遺傳給後代,美國與許多國家目前不允許(MedlinePlus,2022-03-22 更新);遞送是 CRISPR 在體內使用最難的關卡(Lino 等 2018,摘要);作物的基因編輯仰賴轉殖與再生,這兩步是瓶頸(Altpeter 等 2016,摘要)。

教學示意:所有序列(第 3 到 6 章共用的 45 個鹼基「基因」、第 2 章換的兩組嚮導、第 7 章的 42 個鹼基與脫靶候選)都是為畫面設計的,不是實際基因;蛋白質全長約 300 個胺基酸、模板兩端各 8 個鹼基、24 個細胞裡 2 個走 HDR、R 環每 0.2 秒配一個鹼基、Cas9 與支架的形狀都是示意。NHEJ 只畫少 1、多 1、少 3 三種常見類型。第 7 章只看上面這一股的 NGG。不可用於實際挑選嚮導或判斷脫靶。

#### 技術

單一 HTML 檔(crispr/index.html),2D canvas 動畫,用生化原理分區共用的 assets/bio-lesson.js(播放器)、assets/bio-draw.js(畫圖工具)、assets/bio-lesson.css(版面),不需要建置,不使用到站人數計數。程式分區與修改方式見 crispr/MAINTENANCE.md。

#### 來源連結

- Barrangou R, et al. CRISPR provides acquired resistance against viruses in prokaryotes. Science. 2007;315(5819):1709–1712. doi:10.1126/science.1138140(摘要)
- Horvath P, et al. Diversity, activity, and evolution of CRISPR loci in *Streptococcus thermophilus*. J Bacteriol. 2008;190(4):1401–1412:https://pmc.ncbi.nlm.nih.gov/articles/PMC2238196/
- Jinek M, et al. A programmable dual-RNA–guided DNA endonuclease in adaptive bacterial immunity. Science. 2012;337(6096):816–821:https://pmc.ncbi.nlm.nih.gov/articles/PMC6286148/ (Fig. 1 切點與平整切口、Fig. 2 HNH 與 RuvC、Fig. 3 配對長度與種子區、Fig. 4 PAM、Fig. 5 單一嚮導)
- Sternberg SH, et al. DNA interrogation by the CRISPR RNA-guided endonuclease Cas9. Nature. 2014;507(7490):62–67:https://pmc.ncbi.nlm.nih.gov/articles/PMC4106473/ (摘要、討論、Fig. 4c 圖說)
- Addgene, CRISPR Guide:https://www.addgene.org/guides/crispr/ (CRISPR Overview、Basic Mechanisms、Cas Enzymes and PAM Sequences、Generating a Knockout、Small Precision Edits、Glossary)
- Hsu PD, et al. DNA targeting specificity of RNA-guided Cas9 nucleases. Nat Biotechnol. 2013;31(9):827–832:https://pmc.ncbi.nlm.nih.gov/articles/PMC3969858/
- OpenStax Biology 2e, 15.1 The Genetic Code:https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code
- Sulis DB, et al. Multiplex CRISPR editing of wood for sustainable fiber production. Science. 2023;381(6654):216–221. doi:10.1126/science.add4514(摘要)
- U.S. FDA, FDA Approves First Gene Therapies to Treat Patients with Sickle Cell Disease(2023-12-08):https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapies-treat-patients-sickle-cell-disease
- MedlinePlus Genetics, What are genome editing and CRISPR-Cas9?:https://medlineplus.gov/genetics/understanding/genomicresearch/genomeediting/
- Lino CA, et al. Delivering CRISPR: a review of the challenges and approaches. Drug Deliv. 2018;25(1):1234–1257:https://pmc.ncbi.nlm.nih.gov/articles/PMC6058482/ (摘要)
- Altpeter F, et al. Advancing crop transformation in the era of genome editing. Plant Cell. 2016;28(7):1510–1520. doi:10.1105/tpc.16.00196(摘要)

Doudna JA、Charpentier E. 2014 Science 346:1258096 的綜論全文這次讀不到(出版社網站擋自動讀取),只確認了摘要,頁面沒有引用。

#### 進階章節(2026-10-27)

在原本八章後面加了三章,`name` 都以「進階:」開頭,代號是 `#base-edit`、`#prime-edit`、`#off-target`。這三章假設讀者看過前面,直接寫出窗口位置、公式與實際的效率數字;前八章不動。加完是 11 章、約 176 秒。

- 第 9 章「進階:鹼基編輯」(18 秒):一邊切割能力壞掉的 Cas9(nickase)接上去胺酶,不切斷雙股。CBE 把編輯窗口裡的 C 去胺成 U、被讀成 T(另一股的 G 跟著變 A),ABE 把 A 去胺成次黃嘌呤、被聚合酶讀成 G。窗口從離 PAM 最遠的那一格算起:CBE 約第 4 到 8 格,ABE7.10 約第 4 到 7 格。窗口裡同一種鹼基會一起被改(旁觀編輯),所以畫面上的「編輯後」是由編輯器決定的,不是由使用者挑的那一格決定。控制項:編輯器種類(CBE / ABE)、想改的鹼基在第幾格(1 到 20)。
- 第 10 章「進階:先導編輯」(18 秒):Cas9 H840A nickase 接反轉錄酶,嚮導換成 pegRNA,3′ 端多了引子結合區(PBS)與反轉錄模板。切開帶 PAM 的那一股,露出的 3′ 端黏回引子結合區當引子,反轉錄出帶著改變的新序列,舊的那一段被當成多餘的瓣切掉,接好之後是異雙股,由錯配修補決定結果。12 種鹼基替換與小的插入缺失都能做。控制項:想做的改變(替換 / 插入 3 個 / 缺失 3 個,pegRNA 的模板跟著重算)、引子結合區長度(6 到 17,畫面跟著算那一段基因體的 G 與 C 比例並依原文的 13 個給評語)。
- 第 11 章「進階:脫靶評分」(17 秒):把第 7 章的定性判斷換成數字。CFD 分數把每個不配對的權重(看位置,也看是哪一種不配對)相乘;MIT 分數是位置權重相乘,再乘上不配對的平均間距那一項與 1 除以個數的平方。一條嚮導的整體特異性要把基因體裡所有候選位置的分數加起來。最後是 GUIDE-seq:34 bp 的雙股標籤被 NHEJ 接進 Cas9 切出的斷口,再定序找標籤落在哪裡,找到的脫靶位置大多是預測漏掉的。控制項:不配對的位置(1 到 20)、不配對的數目(1 到 3),分數即時重算。

#### 進階章節的數值與示意

- 鹼基編輯的窗口:CBE 約 5 個鹼基、典型是間隔序列第 4 到 8 格,原文明寫「counting the end distal to the PAM as position 1」(Komor 等 2016);ABE7.10 約 4 到 6 格寬、大約第 4 到 7 格,原文把 PAM 算成第 21 到 23 格(Gaudelli 等 2017),兩篇的第 1 格都在 PAM 遠端。兩篇都說邊界會隨標的序列而變。
- 鹼基編輯的化學:C 去胺成 U,U 的配對性質和 T 一樣(Komor 等 2016);A 去胺成次黃嘌呤,在聚合酶的活性中心和 C 配對,所以被讀成 G,修補或複製後 A·T 變成 G·C(Gaudelli 等 2017)。
- 鹼基編輯器的構造:rAPOBEC1 接在 dCas9 的 N 端(中間 16 個殘基的 XTEN 連接子),BE3 把 Cas9 第 840 位的 His 補回去,只切沒被編輯的那一股,並接上 UGI 擋住尿嘧啶 DNA 醣苷酶(Komor 等 2016);ABE7.10 是 wtTadA 與演化過的 TadA* 的異二聚體接 Cas9 nickase(Gaudelli 等 2017)。
- 效率:BE3 在人類細胞最高 37%、摘要寫 15 到 75%,六個位置的插入缺失平均 1.1%(Komor 等 2016);ABE7.10 在 17 個位置平均 53%,產物純度通常 99.9% 以上、插入缺失通常 0.1% 以下(Gaudelli 等 2017)。
- 旁觀編輯:去胺酶是連著作用的,窗口裡的 C 多半一起被改,體外實驗有超過 93% 的被編輯股不只改一個 C(Komor 等 2016);晚期的 ABE 對鄰近的腺嘌呤也是連著改(Gaudelli 等 2017)。
- 先導編輯的機制與建議長度:切帶 PAM 的那一股;3′ 端和引子結合區配對、反轉錄出帶改變的 3′ 瓣、5′ 瓣被切掉與接合、異雙股由錯配修補決定結果;建議引子結合區從 13 個鹼基開始,引子區的 G 與 C 偏離 40 到 60% 時要試別的長度、G 與 C 低時通常要更長;反轉錄模板建議從 10 到 16 個開始(Anzalone 等 2019)。
- 先導編輯的範圍與效率:12 種鹼基替換、最多 44 bp 的插入與 80 bp 的缺失;PE3 用第二條嚮導在沒被編輯的那一股切一刀,效率約 3 倍但插入缺失變多;PE3 在 HEK293T 常 20 到 50%、插入缺失 1 到 10%(Anzalone 等 2019)。
- CFD:方法一節寫得很清楚,依補充資料 Supplementary Table 19 的活性比例查值,兩個以上的不配對把各自的值相乘,原文舉例第 7 格的 rG:dA 是 0.57、第 10 格的 rC:dT 是 0.87,乘起來 0.50(Doench 等 2016)。**原文的 CFD 定義裡沒有 PAM 這一項**;PAM 的數字是另外量的,NGG 的嚮導 91% 有活性,NAG 26%、NCG 11%、NGA 7%。原文也沒有寫位置是從哪一端數起。
- MIT 分數:Hsu 等 2013 本文只說建立了一套打分演算法,沒有寫出公式與權重,公式放在該團隊的設計網站;本文的位置是從緊鄰 PAM 的那一格數起,方向和本頁相反。頁面上有註明公式的出處。
- GUIDE-seq:34 bp、5′ 磷酸化、兩端有硫代磷酸鍵的雙股寡核苷酸被 NHEJ 接進平整的斷口;十三條嚮導在兩種人類細胞裡,每條找到 0 到 150 個以上的脫靶位置,大多是既有的計算方法與 dCas9 ChIP-seq 沒找到的;找到的位置最多差 6 個鹼基,也有差一格的凸起;可以偵測到突變頻率低到 0.1% 的位置(Tsai 等 2015)。
- 植物的例子:水稻與小麥的腺嘌呤鹼基編輯,有效窗口是間隔序列第 4 到 8 格,原生質體 0.1 到 7.5%、再生水稻植株 15.8 到 59.1%,插入缺失低於 0.1%,表 1 有同一個窗口裡兩個腺嘌呤一起被改的基因型,OsACC 的 C2186R 讓水稻耐 haloxyfop-R-methyl(Li 等 2018);水稻的先導編輯把 OsALS 的 W548L 做出來,引子結合區 13 bp、反轉錄模板 15 bp,轉形癒合組織 0.26 到 2%,在含 bispyribac-sodium 的培養基上長出抗性苗,PE3 在植物裡沒有比 PE2 好(Butt 等 2020)。

教學示意:第 9、10 章用另一段 45 個鹼基、15 個密碼子的示意基因,窗口裡刻意放了兩個 C 與兩個 A,旁觀編輯才看得出來;它不是實際基因。第 10 章把舊的與新的那一段都畫成 12 格,插入與缺失造成的長度變化只在下面的密碼子對照看得到,pegRNA 的嚮導與支架沒有畫。第 11 章的位置權重與不配對種類的係數都是示意值:**原文 CFD 的權重表在補充資料,本頁沒有用到**,畫面上只引用原文自己舉的例子來說明「相乘」這件事,並寫明權重是示意。「整體特異性 = 1 ÷ (1 + 分數總和)」是常見的彙總做法,原文沒有給這個式子;拿來加總的另外三個候選位置也是示意。CFD 不處理多一格少一格的凸起,本頁也沒有畫。畫面上的分數不能拿來實際挑嚮導。本頁一律用「第 1 格在 PAM 遠端」的編號,和第 4、7 章一致。

#### 進階章節的來源連結

- Komor AC, et al. Programmable editing of a target base in genomic DNA without double-stranded DNA cleavage. Nature. 2016;533(7603):420–424:https://pmc.ncbi.nlm.nih.gov/articles/PMC4873371/
- Gaudelli NM, et al. Programmable base editing of A•T to G•C in genomic DNA without DNA cleavage. Nature. 2017;551(7681):464–471:https://pmc.ncbi.nlm.nih.gov/articles/PMC5726555/ (PMC 頁面標示有 2018 年的更正,未讀到更正內容)
- Anzalone AV, et al. Search-and-replace genome editing without double-strand breaks or donor DNA. Nature. 2019;576(7785):149–157:https://pmc.ncbi.nlm.nih.gov/articles/PMC6907074/
- Doench JG, et al. Optimized sgRNA design to maximize activity and minimize off-target effects of CRISPR-Cas9. Nat Biotechnol. 2016;34(2):184–191:https://pmc.ncbi.nlm.nih.gov/articles/PMC4744125/ (CFD 的定義在方法一節;權重表是補充資料 Supplementary Table 19,未讀到)
- Hsu PD, et al. DNA targeting specificity of RNA-guided Cas9 nucleases. Nat Biotechnol. 2013;31(9):827–832:https://pmc.ncbi.nlm.nih.gov/articles/PMC3969858/ (本文沒有打分公式)
- Tsai SQ, et al. GUIDE-seq enables genome-wide profiling of off-target cleavage by CRISPR-Cas nucleases. Nat Biotechnol. 2015;33(2):187–197:https://pmc.ncbi.nlm.nih.gov/articles/PMC4320685/
- Li C, et al. Expanded base editing in rice and wheat using a Cas9-adenosine deaminase fusion. Genome Biol. 2018;19:59:https://pmc.ncbi.nlm.nih.gov/articles/PMC5972399/
- Butt H, et al. Engineering herbicide resistance via prime editing in rice. Plant Biotechnol J. 2020;18(12):2370–2372:https://pmc.ncbi.nlm.nih.gov/articles/PMC7680537/

這幾篇讀到的都是 PMC 的作者原稿版,引用數字時要和出版社的正式版再對一次。Zong 等 2017(水稻、小麥、玉米的胞嘧啶鹼基編輯,Nat Biotechnol 35:438)這次拿不到全文或正式摘要,頁面與本節都沒有引用。

### 抗體檢測:西方墨點法與 ELISA(`immunoassay/`)

網頁:https://tung-beauregard.github.io/instrument-principles/immunoassay/

從抗體的構造講起(Y 字形、重鏈與輕鏈、可變區專一地抓住抗原決定位,一級抗體認目標、二級抗體認一級抗體並帶著酵素),接著是西方墨點法的三步(SDS-PAGE 依大小分開、用電轉印到膜上、阻斷與抗體偵測後用冷光拍下條帶),再來是三明治 ELISA(捕捉抗體、偵測抗體、HRP 讓 TMB 變色、讀 450 nm 吸光度)與標準曲線定量,最後比較兩種方法。版型和 PCR 與電泳相同(共用 `assets/bio-lesson.js`)。

- 7 章,共 106 秒,每章有字幕;最後一章播完停住
- 第 4 章「自己調整」:阻斷(有、沒有)與清洗(不洗、洗 3 次、洗太久),左邊放大的膜表面與右邊拍到的膜跟著變(背景、雜帶、條帶亮度)
- 第 6 章「自己調整」:樣品實際濃度(0.1 到 500 ng/mL)與稀釋倍數(不稀釋、10 倍、100 倍),看讀值落在標準曲線哪裡、推回的濃度、讀值差 ±0.05 時濃度的範圍,以及要不要再稀釋
- 文字以台灣高中畢業看得懂為準

#### 數值與示意

抗體:

- 抗體單體由四條鏈組成,兩條相同的重鏈、兩條相同的輕鏈,用雙硫鍵連成 Y 字形;Y 的兩個手臂是 Fab 區,末端的可變區是抗原結合的位置,柄是 Fc 區;IgG 有兩個抗原結合位、分子量約 150,000 道耳頓(OpenStax Microbiology 18.1,內文與 Figure 18.6 的表)。抗體認的是抗原表面露出的一小塊(抗原決定位,epitope),一個蛋白質抗原常有好幾個抗原決定位(同節,Figure 18.4 圖說)。
- 西方墨點法用一級抗體認目標蛋白,再用帶著分子信標(酵素或螢光分子)的二級抗體認一級抗體(OpenStax Microbiology 20.2,Western blot 段落)。二級抗體是針對一級抗體做的抗體,例如用兔子的 IgG 免疫山羊得到山羊抗兔抗體,常接 HRP 或螢光染料(Thermo Fisher〈How to Select a Secondary Antibody〉)。頁面第 1 章的「酵素或螢光分子」與「酵素 HRP」依此。

SDS-PAGE:

- SDS 是陰離子清潔劑,和疏水區結合使蛋白質的二、三、四級結構變性,並帶上淨負電,使電荷質量比固定;樣品緩衝液要加還原劑(DTT 或 β-巰基乙醇)切斷雙硫鍵(Bio-Rad Tech Note 3133,第 1 頁 SDS-PAGE Conditions for MW Determination)。大部分多肽以固定的重量比結合 SDS(每 1 克多肽約 1.4 克 SDS);樣品在過量 SDS 與硫醇試劑中加熱到 70 到 100 °C 時雙硫鍵被切開(Thermo Fisher〈Overview of Electrophoresis〉)。頁面寫「每單位質量帶的負電差不多」「和質量成比例的負電」依此;溫度計畫到 95 °C 是示意(在上述範圍內;Mahmood 與 Yang 的步驟是 100 °C 加熱 5 分鐘)。
- 帶 SDS 的蛋白質往正極移動,質量小的跑得快;膠的孔洞大小和聚丙烯醯胺濃度成反比(Thermo Fisher〈Overview of Electrophoresis〉)。
- 估分子量:和分子量標準跑同一片膠,以 log 分子量對相對移動距離(Rf)作圖內插;只有在一段範圍內是直線,誤差約 ±10%,醣蛋白、很酸或很鹼的蛋白會跑得不照分子量(Bio-Rad Tech Note 3133,第 1 到 3 頁)。頁面的分子量標準 250、150、100、75、50、37、25、20、15、10 kDa 取自該文件 Figure 1 的 Precision Plus Protein 標準;條帶位置用 log 分子量線性對應是示意(實際兩端會彎)。

轉印、阻斷與偵測(Mahmood 與 Yang 2012):

- 轉印時膜放在膠與正極之間,帶負電的蛋白質從膠移到膜上;膜有硝化纖維素與 PVDF 兩種,PVDF 機械強度較好、可重複偵測,但背景較高(Theory 的 Blotting 段;Technique 的 Electrotransfer 段)。
- 阻斷用 5% BSA 或脫脂奶粉(溶在 TBST),防止抗體非專一地黏在膜上;一級抗體與二級抗體之後各用 TBST 洗 3 次、每次 5 分鐘;清洗減少背景、洗掉沒結合的抗體,但洗太久訊號也會變弱(Technique 的 Blocking and antibody incubation 段;Theory 的 Washing, blocking and antibody incubation 段)。頁面控制項「洗 3 次」與「洗太久時條帶變淡」依此。
- 二級抗體通常接 HRP,加 ECL 試劑後用底片記錄;背景太高常是抗體濃度太高或洗得不夠(Theory 與 Troubleshooting 段)。化學冷光受質是最靈敏的偵測方式,也可以用 CCD 數位影像系統取代底片(Thermo Fisher〈Overview of Western Blotting〉)。
- 西方墨點法的結果通常只算半定量(Theory 的 Quantification 段)。
- 頁面裡沒有阻斷、不洗、洗太久時背景與條帶的亮度是示意,只表現方向(背景變亮、多出雜帶、條帶變淡),不是實測數據;目標蛋白 60 kDa 也是示意。

ELISA:

- 三明治 ELISA:先把一級抗體加進微孔盤的每一孔(靠疏水作用黏在塑膠上),洗掉沒黏上的,再加阻斷用的蛋白(例如白蛋白或牛奶的酪蛋白);加入樣品,抗原被抓住,洗後加入接了酵素、認抗原上其他抗原決定位的二級抗體,最後加無色的受質,酵素把它變成有顏色的產物;最常用的酵素是鹼性磷酸酶與 HRP;顏色用分光光度計量吸光度,和抓到的抗原量成正比;部分孔放已知量的抗原做標準曲線;靈敏度可到每毫升奈克等級(OpenStax Microbiology 20.4,ELISA 段落與 Figure 20.24 圖說)。
- 捕捉抗體與偵測抗體要認兩個不重疊的抗原決定位;偵測可以用直接標記的抗體,或用標記的二級抗體;TMB 被 HRP 氧化成藍色,加硫酸或磷酸後變黃(Thermo Fisher〈ELISA 概述〉)。藍色產物的吸收峰 370 與 652 nm,加酸變黃後在 450 nm 測(Thermo Fisher 1-Step TMB 產品頁,34021)。終止液是 0.16 M 硫酸,55 mL 約夠 5 個 96 孔盤(Thermo Fisher N600 產品頁)。頁面「96 孔的孔盤」「加酸」「450 nm」依此。
- 定量:每一盤都做標準曲線,用曲線擬合軟體,四參數算法擬合最好;落在曲線上下兩端的讀值誤差較大,樣品要稀釋到曲線範圍內,算濃度時乘回稀釋倍數;每個標準品與樣品做二或三重複,CV 小於 20%(Thermo Fisher〈ELISA Data Analysis〉)。配體結合分析的反應對濃度通常是 S 形,四參數羅吉斯模型是公認的參考模型(Findlay 與 Dillard 2007 的摘要)。
- 四參數曲線:A = d + (a − d) / (1 + (x / c)^b),a 是濃度為 0 時的吸光度(下平台)、d 是很濃時的吸光度(上平台)、c 是中點的濃度、b 決定陡度;和 GraphPad Prism 的「[Agonist] vs. response, Variable slope」寫法 Y = Bottom + X^HillSlope × (Top − Bottom) / (X^HillSlope + EC50^HillSlope) 相同。頁面取 a 0.06、b 1.15、c 4 ng/mL、d 3.0,標準品 10 ng/mL 起兩倍稀釋到 0.156 ng/mL,讀值誤差 ±0.05:都是示意值,不是某個試劑組的數據。用這組數值算:5 ng/mL 的吸光度 1.72,讀值 ±0.05 反推 4.7 到 5.3 ng/mL;0.2 ng/mL 的吸光度 0.15,反推約 0.10 到 0.30 ng/mL(上下界差 3 倍,所以頁面說靠近曲線一端時誤差大);第 5 章的 A₄₅₀ 1.29 是 3 ng/mL 代入同一條曲線。
- 頁面「靠近曲線一端」的判斷:讀值 ±0.05 反推的上下界比值超過 1.6,或推不出邊界(示意的門檻)。
- ELISA 與 EIA 由瑞典斯德哥爾摩大學 Peter Perlmann 與 Eva Engvall 的團隊、荷蘭 Anton Schuurs 與 Bauke van Weemen 的團隊各自同時發展(Lequin 2005 摘要);兩組的第一篇論文:Engvall 與 Perlmann,Immunochemistry 1971 年 9 月;Van Weemen 與 Schuurs,FEBS Letters 1971 年 6 月(PubMed 書目)。

兩種方法比較:

- 「一片膠十幾到二十幾道」:依 Bio-Rad Tech Note 3133 第 4 頁 Criterion 膠的梳子規格(12+2、18、26 孔)。
- 在膜上看到一條預期大小的條帶,不一定代表抗體專一;多出的條帶可能是蛋白降解或修飾造成的;用在西方墨點法的抗體不一定適合其他方法(Pillai-Kastoori 等 2020,Validating antibody specificity 與 Orthogonal and independent approaches 兩段)。頁面第 7 章「較小的條帶:可能是被切斷的片段」與「同一支抗體不一定兩種方法都能用」依此;「西方墨點法的蛋白質被 SDS 攤開、ELISA 抓的是摺好的原樣」是依兩種方法的步驟(SDS 變性與否)寫的說明,原文沒有這樣比較。

教學示意:抗體、蛋白質、SDS 的形狀與大小,蛋白質摺疊與攤開的樣子,樣品的條帶與亮度,背景與雜帶,ELISA 的標準品濃度、吸光度、四參數曲線的參數與讀值誤差,都是為了說明原理設定的,不是實測結果,不可用於判讀實際的實驗。

#### 技術

單一 HTML 檔(immunoassay/index.html),2D canvas 繪圖,共用 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖小工具)、`assets/bio-lesson.css`(版面),不需要建置。程式分區與修改方式見 immunoassay/MAINTENANCE.md。

#### 來源連結

- Mahmood T, Yang PC. Western blot: technique, theory, and trouble shooting. N Am J Med Sci. 2012;4(9):429–434. doi:10.4103/1947-2714.100998:https://pmc.ncbi.nlm.nih.gov/articles/PMC3456489/
- Bio-Rad Tech Note 3133, Molecular Weight Determination by SDS-PAGE(Bulletin 3133):https://www.bio-rad.com/webroot/web/pdf/lsr/literature/Bulletin_3133.pdf
- OpenStax Microbiology 18.1 Overview of Specific Adaptive Immunity:https://openstax.org/books/microbiology/pages/18-1-overview-of-specific-adaptive-immunity
- OpenStax Microbiology 20.2 Detecting Antigen-Antibody Complexes:https://openstax.org/books/microbiology/pages/20-2-detecting-antigen-antibody-complexes
- OpenStax Microbiology 20.4 EIAs and ELISAs:https://openstax.org/books/microbiology/pages/20-4-eias-and-elisas
- Thermo Fisher, Overview of Electrophoresis:https://www.thermofisher.com/us/en/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/overview-electrophoresis.html
- Thermo Fisher, Overview of Western Blotting:https://www.thermofisher.com/us/en/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/overview-western-blotting.html
- Thermo Fisher, How to Select a Secondary Antibody:https://www.thermofisher.com/us/en/home/life-science/antibodies/secondary-antibodies/secondary-antibody-selection-guide.html
- Thermo Fisher, ELISA 概述(Overview of ELISA):https://www.thermofisher.com/us/en/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/overview-elisa.html
- Thermo Fisher, ELISA Data Analysis:https://www.thermofisher.com/us/en/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/elisa-data-analysis.html
- Thermo Fisher, 1-Step TMB ELISA Substrate Solutions(34021):https://www.thermofisher.com/order/catalog/product/34021
- Thermo Fisher, Stop Solution for TMB Substrates(N600):https://www.thermofisher.com/order/catalog/product/N600
- Findlay JWA, Dillard RF. Appropriate calibration curve fitting in ligand binding assays. AAPS J. 2007;9(2):E260–E267:https://pmc.ncbi.nlm.nih.gov/articles/PMC2751416/
- GraphPad Prism Curve Fitting Guide, [Agonist] vs. response, Variable slope:https://graphpad.com/guides/prism/latest/curve-fitting/reg_dr_stim_variable_2.htm
- Lequin RM. Enzyme immunoassay (EIA)/enzyme-linked immunosorbent assay (ELISA). Clin Chem. 2005;51(12):2415–2418:https://doi.org/10.1373/clinchem.2005.051532
- Engvall E, Perlmann P. Enzyme-linked immunosorbent assay (ELISA). Quantitative assay of immunoglobulin G. Immunochemistry. 1971;8(9):871–874. doi:10.1016/0019-2791(71)90454-x
- Van Weemen BK, Schuurs AHWM. Immunoassay using antigen-enzyme conjugates. FEBS Lett. 1971;15(3):232–236:https://pubmed.ncbi.nlm.nih.gov/11945853/
- Pillai-Kastoori L, et al. Antibody validation for Western blot: By the user, for the user. J Biol Chem. 2020;295(4):926–939:https://pmc.ncbi.nlm.nih.gov/articles/PMC6983856/

未確認:Lequin 2005、Findlay 與 Dillard 2007 只讀到摘要(全文需要訂閱或沒有讀到);Engvall 與 Perlmann 1971、Van Weemen 與 Schuurs 1971 只核對了書目,沒有讀到全文。頁面只用到這幾篇摘要與書目層級的內容(發展的團隊與年份、S 形曲線與四參數模型)。

#### 進階章節(2026-10-27)

第 8 章 `fit4pl`(四參數擬合)與第 9 章 `lod`(偵測極限與定量極限),給做過儀器分析的大學部高年級與研究生,兩章共 36 秒。兩章沿用第 6 章的示意曲線(a 0.06、b 1.15、c 4 ng/mL、d 3.0),濃度可以和第 6 章對照。控制項:擬合方式(直線、四參數)、擬合用的標準品(中段 4 點、6 點、全部 8 點)、空白的雜訊 SD(0.004 到 0.016)、重複次數(5、20、60 次)。擬合、反推、LoB、LoD、LoQ 都在頁面上照公式算。

第 8 章:四參數擬合

- S 形的原因:濃度高到捕捉抗體都被占滿時讀值不再增加(上平台),很低時只剩背景(下平台);配體結合分析的反應對濃度是 S 形,四參數羅吉斯模型(4PL)是公認的參考模型,在上下兩端比其他模型好;曲線不對稱時加第五個參數(5PL)可能更好;加權通常有幫助(Findlay 與 Dillard 2007 的摘要)。頁面的「捕捉抗體都占滿」是依三明治 ELISA 的原理寫的說明。
- 公式:y = d + (a − d) ÷ (1 + (x/c)^b),a 是濃度 0 的讀值(下平台)、d 是很濃時的讀值(上平台)、c 是反曲點的濃度、b 是斜率;反推 x = c × ((a − d)/(y − d) − 1)^(1/b),讀值不在 a 與 d 之間時推不回來。五參數:y = d + (a − d) ÷ (1 + (x/c)^b)^s,s = 1 時就是 4PL;s ≠ 1 時 c 不再是反曲點(GraphPad Prism 說明的 Asymmetrical (five parameter) 一節,寫法換成本頁的符號;頁面只在字幕與重點整理提到 5PL,沒有做五參數擬合)。
- 擬合:非線性最小平方(Levenberg-Marquardt),從粗估值(兩端取最小與最大讀值、斜率 0.5、反曲點取 log 濃度的平均)開始一步步調,畫面顯示每一步的曲線與殘差平方和。直線是吸光度對 log10 濃度的最小平方直線。
- 判斷可不可信:ICH M10(2022)4.2.3 節,標準曲線至少 6 個濃度加空白,點靠近上下漸近線時最常用 4PL 或 5PL,範圍外可以加錨點,標準品反推值在標示值 ±20% 內(最低與最高的定量點 LLOQ、ULOQ ±25%);4.2.4.2 節,檢查樣品的準確度在 ±20% 內(LLOQ、ULOQ ±25%)。頁面一律用 ±20% 判斷,範圍外的樣品標「範圍外」。
- 示意的數據:標準品 100 ng/mL 起三倍稀釋 8 點、各兩重複,讀值 = 示意曲線 + 雜訊(SD = 0.004 + 讀值的 3%,固定亂數);檢查樣品 0.1、1、10、50 ng/mL 的讀值直接取示意曲線(誤差只來自擬合)。這組數據算出:4PL 全部 8 點 a 0.0539、b 1.152、c 3.948 ng/mL、d 3.016(殘差平方和 0.0306),檢查樣品誤差 +11%、−1%、−3%、−10%;4PL 中段 4 點(0.41 到 11.1 ng/mL)a 0.105、d 2.65,0.1 與 50 ng/mL 推不回來;4PL 6 點時範圍外的 0.1 與 50 ng/mL 誤差 +41% 與 −25%;直線全部 8 點 +29%、−64%、+70%、+36%;直線中段 4 點時 1 與 10 ng/mL 是 −20% 與 +16%,範圍外的 0.1 ng/mL 是 +292%。LM 的結果用 Nelder-Mead 另外驗算,參數與殘差平方和相同。

第 9 章:偵測極限與定量極限

- LoB(空白極限)= 空白平均 + 1.645 SD:假設常態,空白的 95% 在它以下,其餘 5% 會被誤判成有待測物(偽陽性 α)。LoD(偵測極限)= LoB + 1.645 × 低濃度樣品的 SD:濃度在 LoD 的樣品只有 5% 低於 LoB(偽陰性 β)。LoQ(定量極限)≥ LoD,而且要達到偏差與不精密度的目標;功能靈敏度是 CV 20% 的濃度。廠商建立時建議 60 次、實驗室驗證時 20 次。傳統的「空白平均 + 2 SD」(或 3、4、10 SD)只證明能量到「沒有」(Armbruster 與 Pry 2008,依 CLSI EP17)。兩個 SD 相同時 LoD = 平均 + 3.29 SD,和常見的 3 SD 接近(由上面的式子推得)。
- ICH Q2(R2)(2023)3.2.3.3 節:偵測極限 3.3σ/S、定量極限 10σ/S(σ 是讀值的 SD、S 是檢量線斜率);頁面的「平均 + 10 SD」對應這個定義。
- SD 估計的可信度:n 次量測的 SD,95% 信賴區間用卡方分布(自由度 n − 1)算:n = 5 是估計值的 0.60 到 2.87 倍、20 是 0.76 到 1.46、60 是 0.85 到 1.22(node 算分位數,和卡方表相同)。
- 模型:空白讀值 = 0.06(示意曲線的下平台)+ σB × 常態亂數;讀值的 SD = √(σB² + (3% × (讀值 − 0.06))²);低濃度樣品的平均放在真正的 LoD;LoB、LoD 在讀值上算,再用示意曲線換成濃度。精密度曲線用誤差傳遞:CV = 讀值的 SD ÷ (濃度 × 曲線斜率),CV 剛好 20% 的低濃度端是 LoQ、高濃度端是上限(二分法)。預設(σB 0.010、20 次)得 LoB 0.049、LoD 0.077(模擬的真值 0.081)、平均 + 3 SD 0.085、LoQ 0.11、平均 + 10 SD 0.26 ng/mL;σB 0.004 時 LoQ 0.047,0.016 時 0.16 ng/mL。驗算:低濃度樣品在真正 LoB 的 z 值是 −1.645;LoQ 處的 CV 是 20.0%。
- 示意:空白的平均與 SD、讀值的 SD 模型(3%)、低濃度樣品、固定的亂數(種子 29),都不是實測。EP17 是用樣品的濃度結果算,頁面為了畫在同一條讀值軸上改在讀值上算(示意的簡化)。

教學示意:第 8 章的標準品濃度、讀值雜訊與檢查樣品,第 9 章的空白讀值、雜訊與重複的亂數,都是為了說明原理設定的,不是實驗數據,不可用於判讀實際的實驗。

來源連結:

- Findlay JWA, Dillard RF. Appropriate calibration curve fitting in ligand binding assays. AAPS J. 2007;9(2):E260–E267:https://pmc.ncbi.nlm.nih.gov/articles/PMC2751416/
- ICH M10 Bioanalytical Method Validation and Study Sample Analysis(2022,Step 4)4.2.3、4.2.4.2 節:https://database.ich.org/sites/default/files/M10_Guideline_Step4_2022_0524.pdf
- GraphPad Prism Curve Fitting Guide, Asymmetrical (five parameter):https://www.graphpad.com/guides/prism/latest/curve-fitting/reg_asymmetric_dose_response_ec.htm
- Gottschalk PG, Dunn JR. The five-parameter logistic: a characterization and comparison with the four-parameter logistic. Anal Biochem. 2005;343(1):54–65(經 GraphPad 說明引用,沒有讀原文)
- Armbruster DA, Pry T. Limit of blank, limit of detection and limit of quantitation. Clin Biochem Rev. 2008;29(Suppl 1):S49–S52:https://pmc.ncbi.nlm.nih.gov/articles/PMC2556583/
- CLSI EP17-A2, Evaluation of Detection Capability for Clinical Laboratory Measurement Procedures, 2nd ed.(2012):https://clsi.org/standards/products/method-evaluation/documents/ep17/
- ICH Q2(R2) Validation of Analytical Procedures(2023)3.2.3.3 節:https://database.ich.org/sites/default/files/ICH_Q2%28R2%29_Guideline_2023_1130.pdf

未確認:Findlay 與 Dillard 2007 只讀到摘要;CLSI EP17-A2 沒有讀到原文,LoB、LoD、60 與 20 次的內容依 Armbruster 與 Pry 2008;ICH Q2(R2) 的式子在 PDF 裡是符號字型,3.3 與 10 的係數另外對照了引用它的說明;NCBI Assay Guidance Manual 的免疫分析章節(Cox KL, et al.)因為網站要求驗證沒有讀到,頁面沒有用到它的內容。

### 流式細胞儀(`flow-cytometry/`)

網頁:https://tung-beauregard.github.io/instrument-principles/flow-cytometry/

教學內容:流體聚焦讓細胞排成一列通過雷射、前向與側向散射光的意義、抗體上的螢光經分色鏡與濾鏡分到不同的光電倍增管、FSC 對 SSC 點圖的圈選與螢光直方圖的陰性陽性、植物細胞核的 DNA 含量(切碎法、PI 或 DAPI 染色、G1 與 G2 峰、倍性與 2C 值的算法)、靜電液滴分選。

| 項目 | 內容 | 狀態與來源 |
|---|---|---|
| 每秒量多少 | 一般的流式細胞儀每秒約 10,000 個細胞;頁面標題寫「一秒量幾千個」,字幕寫「幾千到上萬」 | McKinnon KM 2018,Curr Protoc Immunol 120:5.1.1–5.1.11(PMC5939936),Mass Cytometers 一節的比較 |
| 植物細胞核的速度 | 細胞核濃度低,每秒常只有 20 到 50 個;一般寫法是每秒 100 到 1,000 個 | Doležel J, et al. 2007,Nat Protoc 2:2233–2244,第 2238 頁 Step 2A(ii) 與第 2233 頁引言 |
| 流體聚焦 | 鞘液(鹽水或 PBS)流得比樣品快,把樣品擠成中心的細流,細胞排成一列 | Adan A, et al. 2017,Crit Rev Biotechnol 37:163–176,Fluidic system(early online 版第 2 頁);Thermo Fisher「Fluidics of a Flow Cytometer」 |
| 流速與準度 | 加壓或提高流速時中心流變粗、可能同時通過多個細胞、數據變散;DNA 含量與細胞週期分析用低流速、低濃度;免疫表型這類定性測量可用高流速 | Thermo Fisher「Fluidics of a Flow Cytometer」;Adan 2017 Fluidic system;Doležel 2007 第 2238 頁(流速太高峰變寬、CV 變大) |
| 前向散射 FSC | 沿雷射方向收集,主要是繞射光,正比於細胞表面積或大小(只是大致) | Adan 2017 Optical system 與 Figure 2;McKinnon 2018 Introduction |
| 側向散射 SSC | 約 90° 收集,反映顆粒與內部複雜度 | Adan 2017 Optical system;McKinnon 2018 |
| 偵測器 | FSC 光較強,常用光二極體;SSC 與螢光較弱,用光電倍增管(PMT);光變成電流再變成電壓脈衝,細胞在光束中心時最高 | Adan 2017 Signal detection(第 3 頁);PMT 可把單一光子的能量放大數百萬倍、光二極體用在最亮的前向散射見 Thermo Fisher「Optics of a Flow Cytometer」(https://www.thermofisher.com/tw/zt/home/life-science/cell-analysis/cell-analysis-learning-center/molecular-probes-school-of-fluorescence/flow-cytometry-basics/flow-cytometry-fundamentals/optics-flow-cytometer.html) |
| 濾鏡與分色鏡 | 帶通濾鏡只讓一段波長通過;長通、短通;分色鏡反射一段波長、讓其他通過,把光導到各偵測器 | Adan 2017 Optical system;McKinnon 2018;Thermo Fisher「Optics of a Flow Cytometer」(525/30 只讓 510 到 540 nm 通過、500LP 分色鏡讓 500 nm 以上穿過並反射 500 nm 以下) |
| 螢光染料 | FITC 激發/放射約 495/520 nm(綠)、PE 約 565/578 nm(橘黃),都能被 488 nm 的氬離子雷射激發;螢光強度正比於結合上去的染料量 | Adan 2017 第 1、5 頁 |
| 圈選與直方圖 | 在 FSC 對 SSC 圖上圈出淋巴球等族群,之後只看圈內細胞的螢光;直方圖橫軸是訊號、縱軸是細胞數;表面標記用對數刻度,DNA 用線性刻度 | Adan 2017 Data analysis、Gates and regions(第 6 頁)、Signal detection(第 3 頁) |
| 白血球在點圖上的位置 | 顆粒球 SSC 高;淋巴球較小、顆粒少;碎片的 FSC 與 SSC 最低 | Boster Bio「Flow Cytometry Gating Strategies」;Adan 2017 Figure 8 |
| 植物細胞核的製備 | 不量整個植物細胞(大小、形狀、細胞核位置、染劑不易進入、自發螢光);用刀片在冰的緩衝液裡切新鮮嫩葉(約 20 mg、1 ml),過 42 µm 尼龍網,加染劑 | Doležel 2007 第 2234 頁(原因與 Galbraith 的切碎法)、第 2236 到 2237 頁(材料與 Step 1A) |
| 染劑 | PI 與 EB 插入雙股、不挑鹼基,也會染雙股 RNA,要同時加 RNase(PI 50 µg/ml、RNase 50 µg/ml);DAPI 偏好 AT,解析度高、不用 RNase,適合同一系列的倍性比較,不適合算絕對含量 | Doležel 2007 第 2235 頁與表 1、第 2237 頁 Step 1A(vi)、第 2240 頁 Step 2D(iii) |
| G1 與 G2 峰 | 新鮮葉片通常一個大的 G1 峰、一個小的 G2 峰;G2 在 G1 的約 2 倍位置(儀器線性的檢查是 4C/2C 在 1.98 到 2.02);DNA 直方圖一般用線性刻度 | Doležel 2007 第 2237 頁(線性檢查)、第 2241 到 2242 頁 Anticipated results 與 Figure 1 |
| 峰的品質 | CV = 峰的標準差 ÷ 峰的平均位置 × 100%;小於 3% 算好,超過 5% 不採用;CV 只在線性刻度有意義;量 5,000 個 | Doležel 2007 第 2238 到 2239 頁 Step 2A(iv)–(v) |
| 倍性 | 外標準:把已知二倍體的 G1 調在 1,024 道的第 200 道左右;樣品倍性 = 參考倍性 × 樣品 G1 位置 ÷ 參考 G1 位置;峰重疊表示倍性相同;只靠 DNA 量推的倍性要寫「DNA 倍性」 | Doležel 2007 第 2239 頁 Step 2B、2C,第 2235 頁(用語,引 Suda et al. 2006 Taxon 55:447) |
| 2C 值 | 內標準與樣品一起切、一起染,用 PI;樣品 2C = 標準品 2C × 樣品 G1 位置 ÷ 標準品 G1 位置;標準品與樣品相差不超過兩倍,也至少差 15 到 20% | Doležel 2007 第 2239 到 2240 頁 Step 2D |
| 標準品 | 番茄 *Solanum lycopersicum* 'Stupické polní rané' 2C = 1.96 pg(表 2 另有蘿蔔 1.11、大豆 2.50、玉米 5.43、豌豆 9.09、黑麥 16.19、蠶豆 26.90、洋蔥 34.89 pg) | Doležel 2007 第 2235 頁表 2 |
| 換算 | 1 pg DNA = 0.978 × 10⁹ bp | Doležel 2007 第 2240 頁 Step 2D(viii),引 Doležel et al. 2003 Cytometry A 51:127 |
| 細胞分選 | 噴嘴振動讓液流斷成規則的液滴;含要收的細胞的液滴帶電,正電的液滴偏向負極板,沒帶電的進廢液;一滴通常只包一個細胞 | Adan 2017 Electrostatic cell sorting 與 Figure 4;McKinnon 2018 Cell Sorters;Basu S, et al. 2010,J Vis Exp (41):1546(doi:10.3791/1546,PMC3144656) |
| 液滴延遲 | 細胞從雷射流到液滴斷開點有一段時間差,儀器在那時給電,液滴斷開後帶著電 | US Patent 6,372,506 B1(Becton Dickinson,2002)Background |
| 示意值 | 第 1 章點圖與計數速度;第 2 章樣品流寬度、細胞間隔與分布寬度;第 3 章 FSC、SSC 與大小、顆粒的對應(線性)與三群白血球的位置;第 4 章蛋白與抗體的數量、光路的排法;第 5 章各族群的位置、大小、陽性比例(70%、15%、5%)與螢光強度;第 6、7 章峰的 CV 3%、細胞核數、G2 比例、碎片、樣品 2C = 1.30 pg(番茄的峰位置由此換算為第 301.5 通道);第 8 章液滴大小、速度、延遲與偏轉路徑 | 示意,不是實驗結果 |

#### 進階章節(2026-10-27)

接在原本 8 章之後的兩章,章名以「進階:」開頭,章節代號 `compensation`、`endoreduplication`(網址 `#compensation`、`#endoreduplication`)。共 10 章。

**第 9 章 進階:多色螢光的補償(18 秒)**

- 內容:FITC 的放射光拖著長尾巴,一段落進 PE 偵測器的範圍(溢漏);用只染 FITC 的單染對照算溢漏係數;補償就是從 PE 扣掉 k × FITC,顏色多時把溢漏係數排成矩陣 S、乘上它的反矩陣;補償不足時 FITC 陽性的細胞斜斜往上,過度時被壓到零以下;補償剛好時,光子計數的誤差讓那一群在 PE 方向變寬,補償扣不掉。
- 公式:溢漏係數 s = (陽性的 PE 中位數 − 陰性的 PE 中位數) ÷ (陽性的 FITC 中位數 − 陰性的 FITC 中位數);PE(補償後)= PE − k × FITC;多色時「真的 = 量到 × S⁻¹」。補償正確的判準:補償後,FITC 很亮的細胞和陰性細胞在 PE 偵測器的中位數相同(Roederer 2001 第 201 頁)。寬度用穩健標準差 rSD = (第 84.13 − 第 15.87 百分位) ÷ 2。
- 控制項:補償 k(0 到 30%,預設 18%)、FITC 陽性細胞的亮度(暗 1,500、中 8,000、亮 40,000 單位)。
- 示意的模型與數值:FITC 溢到 PE 偵測器 18%(PE 溢到 FITC 設成 0);每 1 單位訊號 0.1 個光電子(Poisson,用常態近似)加 15 單位電子雜訊;自發螢光 FITC 100、PE 60;染料量是對數常態(CV 30%);樣品陰性 1,400、FITC 陽性 1,100、PE 陽性 900 個,單染對照陰性與陽性(亮度 20,000)各 800 個,固定亂數種子;放射光譜的形狀(峰在 FITC 520、PE 578 nm,照 Adan 等 2017)與濾鏡範圍(515 到 545、564 到 606 nm)是示意;點圖用反雙曲正弦刻度 asinh(x ÷ 150)(Logicle 一類的畫法,參數是示意);「剛好」的容許範圍 max(陰性 rSD, 0.35 × 陽性 rSD) 是為了畫面判斷訂的。
- node 驗算(用頁面本身的程式):單染對照 s = (3,647.4 − 61.2) ÷ (20,116.7 − 97.5) = 17.91%;補償 18% 時 FITC 陽性與陰性在 PE 的中位數 38.6 對 42.3(暗)、37.7 對 42.3(中)、37.3 對 42.3(亮);中亮度不補償 1,497.5、補償 30% 時 −931.2;補償剛好時 FITC 陽性的寬度 66、138、299(陰性約 29),亮 ÷ 中 = 2.17,接近 √(40,000 ÷ 8,000) = 2.24,符合「光子計數的誤差和訊號的平方根成正比」。
- 來源:Roederer 2001(補償的定義、模型、光子計數的誤差和平方根成正比且過度補償也消不掉、對數刻度看不準中位數、FMO 對照);Maecker 與 Trotter 2006(單染對照要和樣品一樣亮或更亮、先設好電壓);Roca 等 2021(溢漏係數是陽性與陰性中位數連線的斜率、補償是乘上溢漏矩陣的反矩陣、變異數隨強度線性增加);Parks 等 2006(只讀摘要:補償後有負值,對數刻度畫不出來,Logicle 是廣義的雙曲正弦)。

**第 10 章 進階:核內複製(17 秒)**

- 內容:細胞不分裂而 DNA 繼續複製(核內複製),每一輪細胞核的 DNA 加倍;直方圖出現 2C、4C、8C、16C 一串峰,用對數橫軸看才等距;數每個峰的細胞核比例,算核內複製指數;4C 峰也混著還在 G2 期的細胞核,流式分不出來;量基因體大小要用幼嫩的葉。
- 公式:核內複製指數(Barow 與 Meister 2003 的 cycle value)EI = Σ(i × pᵢ) ÷ Σ pᵢ,i 是複製輪數(2C 為 0、4C 為 1……),pᵢ 是各峰的細胞核比例。
- 控制項:器官(葉、莖)、倍性(二倍體、人工四倍體)。
- 實測數據(不是示意):阿拉伯芥 Ag-0 各 DNA 等級的細胞核比例(%),Pacey 等 2020 附錄表 A2(葉,抽薹第一天最大的蓮座葉)與表 A3(莖),依序 2C、4C、8C、16C、32C、64C、128C、256C、512C:葉 2x 12.02、18.66、23.61、37.61、7.15、0.81、0.11、0.02、0.02;葉 4x 21.80、24.85、38.35、13.99、0.92、0.04、0、0.06、0;莖 2x 13.61、52.55、26.06、7.19、0.40、0.18、0.01;莖 4x 26.48、56.77、15.22、1.38、0.13、0.02。
- node 驗算:葉 2x 212.32 ÷ 100.01 = 2.12、葉 4x 147.82 ÷ 100.01 = 1.48、莖 2x 128.80 ÷ 100.00 = 1.29、莖 4x 91.97 ÷ 100.00 = 0.92(Pacey 等 2020 全部 55 個品系的平均:葉 2.1 與 1.8、莖 1.3 與 1.0)。
- 示意:峰寬(log2 單位的標準差 0.05,約 CV 3.5%)、碎片、雜訊、細胞與細胞核的畫法;四倍體的峰在以二倍體為準的橫軸上右移一格,EI 仍從自己最左邊的峰算起。
- 來源:Pacey 等 2020(EI 公式的轉述、Ag-0 的數據、PI 染色與對數刻度、每個樣品至少 5,000 個細胞核、基因體大或倍性高的物種常常很少或沒有核內複製);Lee 等 2009(核內複製是只有 S 期與 G 期、沒有細胞分裂的循環);Galbraith 等 1991(只讀摘要:阿拉伯芥除了花序,各組織都有核內複製,程度隨組織的年齡與位置而變);Doležel 等 2007(幼嫩的葉最好、分化與老化的組織核內多倍的細胞核多,第 2236 頁;8C 以上的峰用對數橫軸,第 2242 頁圖 1;老葉可能有很多 G2 期的細胞核;CV 在對數刻度上沒有意義,第 2239 頁)。Barow 與 Meister 2003 的原文出版社擋自動讀取,沒有讀到,公式依 Pacey 等 2020 的轉述。

**沒有做的**:DNA 直方圖的細胞週期擬合(G1、S、G2 的比例)這次沒有做;三色以上的補償矩陣、光譜流式、雙細胞排除也沒有談。

##### 來源連結

- Roederer M. Spectral compensation for flow cytometry: visualization artifacts, limitations, and caveats. Cytometry. 2001;45(3):194–205:https://pubmed.ncbi.nlm.nih.gov/11746088/ (全文 PDF:https://biotech.ufl.edu/wp-content/uploads/2021/04/Roederer-2001-Cytometry-1.pdf )
- Maecker HT, Trotter J. Flow cytometry controls, instrument setup, and the determination of positivity. Cytometry A. 2006;69:1037–1042:https://doi.org/10.1002/cyto.a.20333
- Roca CP, et al. AutoSpill is a principled framework that simplifies the analysis of multichromatic flow cytometry data. Nat Commun. 2021;12:2890:https://pmc.ncbi.nlm.nih.gov/articles/PMC8129071/
- Parks DR, Roederer M, Moore WA. A new "Logicle" display method avoids deceptive effects of logarithmic scaling for low signals and compensated data. Cytometry A. 2006;69(6):541–551(只讀摘要)
- Pacey EK, Maherali H, Husband BC. The influence of experimentally induced polyploidy on the relationships between endopolyploidy and plant function in *Arabidopsis thaliana*. Ecol Evol. 2020;10(1):198–216:https://pmc.ncbi.nlm.nih.gov/articles/PMC6972801/
- Barow M, Meister A. Endopolyploidy in seed plants is differently correlated to systematics, organ, life strategy and genome size. Plant Cell Environ. 2003;26:571–584:https://doi.org/10.1046/j.1365-3040.2003.00988.x (未讀到原文)
- Lee HO, Davidson JM, Duronio RJ. Endoreplication: polyploidy with purpose. Genes Dev. 2009;23(21):2461–2477:https://pmc.ncbi.nlm.nih.gov/articles/PMC2779750/
- Galbraith DW, Harkins KR, Knapp S. Systemic endopolyploidy in *Arabidopsis thaliana*. Plant Physiol. 1991;96(3):985–989:https://pmc.ncbi.nlm.nih.gov/articles/PMC1080875/ (只讀摘要)
- Doležel J, et al. Estimation of nuclear DNA content in plants using flow cytometry. Nat Protoc. 2007;2(9):2233–2244:https://doi.org/10.1038/nprot.2007.310 (基礎章節已列)

### 蛋白質質譜定序(`proteomics/`)

網頁:https://tung-beauregard.github.io/instrument-principles/proteomics/

蛋白質怎麼用質譜認出來(由下而上的蛋白質體學,bottom-up proteomics):先用胰蛋白酶切成胜肽,經逆相液相層析分開、電灑游離帶上質子,第一次質譜(MS1)量出胜肽離子的 m/z,挑訊號強的離子碰撞碎裂(CID),從碎片(b 與 y 離子)相鄰峰的質量差讀出胺基酸,最後和資料庫裡「理論上切開、碎開」的胜肽比對。生化原理分區的教材,7 章,用共用播放器 `assets/bio-lesson.js`。

- 第 1 章:胺基酸鏈、兩個胺基酸脫水接成肽鍵、20 種殘基的單同位素質量(框出 I 與 L 一樣重、Q 與 K 只差 0.036)
- 第 2 章:三段示意蛋白質(甲、乙、丙)任選,胰蛋白酶沿鏈走,在 K、R 後面切、後面是 P 不切,列出每段胜肽的序列、長度與質量
- 第 3 章:乙腈比例增加,四個胜肽依疏水性先後流出管柱,層析圖一支一支長出,出口接電灑噴針
- 第 4 章:游標沿層析圖移到選定的胜肽,看那一刻的 MS1;放大看同位素峰間隔 0.5(2 價),算 (M + 2 × 1.007) ÷ 2,挑最強的離子
- 第 5 章:碰撞室裡胜肽依序斷在每個肽鍵,分成 b(藍)與 y(紅)兩段並標 m/z,下方的 MS/MS 一根一根長出;點兩顆珠子之間可以自己指定斷點
- 第 6 章:讀序列;y 系列由右往左(從 [M+H]⁺ 起)、b 系列由左往右(從 H⁺ 起),逐一標出相鄰兩點的質量差與胺基酸,格子依 N 端到 C 端填字
- 第 7 章:2,000 條隨機蛋白質加三段示意蛋白質組成的資料庫,母離子容許誤差 ±0.5、±0.05、±0.005 Da 時的候選數,與碎片比對的前五名
- 控制項:蛋白質(甲、乙、丙)、跟著看的胜肽(1 到 4)、讀哪一組(y 或 b)、母離子質量的容許誤差;第 5 章可點畫面
- 文字以台灣高中畢業看得懂為準;電灑游離與離子阱本身連到「離子阱質譜」(`lcq/`)

#### 數值與示意

質量(單位 Da,單同位素):

- 殘基質量照 Matrix Science「Amino acid reference data」:G 57.021464、A 71.037114、S 87.032028、P 97.052764、V 99.068414、T 101.047679、C 103.009185、L 與 I 113.084064、N 114.042927、D 115.026943、Q 128.058578、K 128.094963、E 129.042593、M 131.040485、H 137.058912、F 147.068414、R 156.101111、Y 163.06332、W 186.079313(頁面顯示到小數 2 位)。
- 質子 1.007276(NIST CODATA 2022:1.0072764665789 u);水 18.010565(Unimod 元素質量 H 1.007825035、O 15.99491463 算出);¹³C 13.00335483507(NIST),同位素峰間隔 1.003355 ÷ 電荷。
- 公式:中性胜肽 M = 殘基總和 + 18.010565;[M+zH]^z+ 的 m/z = (M + z × 1.007276) ÷ z;帶 1 個電荷的 b_i = 前 i 個殘基總和 + 1.007276,y_i = 後 i 個殘基總和 + 18.010565 + 1.007276(Matrix Science「Peptide fragmentation」:b 的 Mr = [N] + [M] − H、y 的 Mr = [C] + [M] + H,N 端基團 H、C 端基團 OH,再加質子)。互補關係 b_i + y_(n−i) = [M+H]⁺ + 1.007276。
- 驗證:三段示意蛋白質的 12 個胜肽,b、y 與 [M+H]⁺ 和 Protein Prospector MS-Product 6.9.1 一致(最大差 0.00006,對方印到小數 4 位);切法與中性質量和 Expasy PeptideMass(Trypsin、不漏切、單同位素)一致。手算例子 VNLQDAFGIK:殘基總和 1085.586945、M 1103.597510、[M+H]⁺ 1104.6048、[M+2H]²⁺ 552.8060、b2 214.1186、y1 147.1128、y2 260.1969、y3 317.2183;y3 − y2 = 57.02146(G)、y2 − y1 = 113.08406(L 或 I)(詳見 `proteomics/MAINTENANCE.md`)。
- 有些表格用氫原子質量 1.0078 算 b、y(例如 Medzihradszky 與 Chalkley 2015 的 Table 3),會比用質子大 0.00055(一個電子)。

原理:

- 20 種常見胺基酸、差在側鏈;羧基與胺基接起來放出一分子水(肽鍵);N 端、C 端:OpenStax Biology 2e 3.4 的 Amino Acids 小節。
- 胰蛋白酶只在 R、K 的羧基端切(Olsen 等 2004,高準確度質譜下非胰蛋白酶胜肽只來自蛋白質 C 端與內部脯胺酸前的斷片);後面是 P 時通常不切(Zhang 等 2013 的 Table 1 規則「-K,R-↑-Z- not -K,R-↑-P-」、Expasy PeptideCutter),但實際上 P 前面也有相當數量的切斷(Rodriguez 等 2008),頁面寫「通常不切」。
- 胜肽比整條蛋白質容易分離、游離與碎裂(Zhang 等 2013 第 1 節);胜肽依疏水性分離後直接從毛細管尖端電灑(第 2.5 節);胰蛋白酶胜肽在 pH 2.7 通常帶 +2(第 3.1.1 節);先做 precursor scan 找訊號強的離子,逐一留下來碎裂(第 2.6 節);CID 是加速離子去撞 target gas,最常見的是肽鍵斷裂產生的 b、y(第 2.6 節與 Figure 4);用蛋白質資料庫產生理論碎片比對,只考慮長度 6 到 50 的胰蛋白酶胜肽(第 5.1 節);一般要兩個胜肽才算鑑定到一個蛋白質(第 5.2 節)。
- 電荷留在 N 端那段是 a、b、c,留在 C 端那段是 x、y、z;低能量 CID(三段四極柱或離子阱)主要沿主鏈斷,產生 b 與 y(Matrix Science)。離子阱裡的碰撞氣體是氦(見本站「離子阱質譜」一節)。
- 讀序列:同一系列相鄰離子的質量差就是殘基;胰蛋白酶胜肽的 y 離子多;2+ 母離子的碎片多半帶 1 個電荷;Leu 與 Ile 在 CID 分不出來;Gln 與 Lys 差 36 mmu,量得夠準才分得開;b1 通常量不到;m/z 147 表示 C 端是 Lys、175 是 Arg(Medzihradszky 與 Chalkley 2015,第 II 節與 Table 1、Table 5 的註)。
- 質量量得越準,候選越少:Olsen 等 2004 的摘要(高準確度使鑑定的可信度提高百倍以上)。

示意(頁面「資料來源」最後一條也有寫):

- 三段蛋白質序列(甲 GKVNLQDAFGIKSEDYTGWNKARHDGTAKPVSFYRELPAFVLSR、乙 GSRVLEAFDTPYKRNIGTEAVSRPEKFYAGLLVDKSQDHWLR、丙 AGVKEYTDIAKPLSGRNFEQHGAVSKRGWLTEPYLDIKSAFVQDLR)是自己編的,刻意不放 C 與 M(實驗上常被修飾),每段切出 4 個 6 個胺基酸以上的胜肽,並各有一處 K-P 或 R-P。
- 流出時間:Browne 等 1982 的 TFA 滯留係數(Expasy ProtScale)加總後換算,rt = 10 + (加總 + 10) × 0.3 分鐘;峰寬(σ 0.32 分)、乙腈 5% 到 45%、MS1 強度、背景離子、同位素峰高度(Poisson,λ = 0.000536 × M)、碎片強度(y 比 b 強)都是示意。所有胜肽都當成帶 2 個電荷。
- 資料庫:2,000 條隨機蛋白質(長度 150 到 579,胺基酸比例照 UniProtKB/Swiss-Prot 2026_03 的統計)加三段示意蛋白質,切成 6 到 50 個胺基酸、不漏切,共 44,347 個胜肽。例如 VNLQDAFGIK(M 1103.598)在 ±0.5、±0.05、±0.005 Da 內分別有 27、15、2 個候選;碎片在 ±0.02 內比對(只比 b 與 y),答案 17 根全對上,次高的只有 2 根。這些數字只是示範量級,不是實際搜尋的結果。

教學示意:管柱裡色塊等速移動(實際上胜肽多半先停在管柱前端,等乙腈夠多才往前走);碎片只畫 1+ 的 b 與 y;比對分數只數「對上幾根」,不是搜尋引擎的計分;不可用於實樣鑑定。

#### 技術

單一 HTML 檔(proteomics/index.html),共用 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖)、`assets/bio-lesson.css`,不需要建置、沒有外部依賴;資料庫在瀏覽器裡產生(桌機約 60 毫秒,頁面載入後閒置時先做)。入口卡片圖 `assets/proteomics.svg`。程式分區、每章的時間點與修改方式見 proteomics/MAINTENANCE.md。

#### 來源連結

- OpenStax Biology 2e, 3.4 Proteins(Amino Acids):https://openstax.org/books/biology-2e/pages/3-4-proteins
- Matrix Science, Amino acid reference data:https://www.matrixscience.com/help/aa_help.html
- Matrix Science, Peptide fragmentation:https://www.matrixscience.com/help/fragmentation_help.html
- NIST CODATA 2022 質子質量:https://physics.nist.gov/cgi-bin/cuu/Value?mpu ;Unimod 元素質量:https://www.unimod.org/masses.html ;NIST 碳的同位素質量:https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=C
- Zhang Y, et al. Protein analysis by shotgun/bottom-up proteomics. Chem Rev. 2013;113(4):2343–2394:https://pmc.ncbi.nlm.nih.gov/articles/PMC3751594/
- Olsen JV, et al. Trypsin cleaves exclusively C-terminal to arginine and lysine residues. Mol Cell Proteomics. 2004;3(6):608–614:https://doi.org/10.1074/mcp.T400003-MCP200
- Expasy PeptideCutter 的酵素規則:https://web.expasy.org/peptide_cutter/peptidecutter_enzymes.html ;Rodriguez J, et al. Does trypsin cut before proline? J Proteome Res. 2008;7(1):300–305:https://doi.org/10.1021/pr0705035
- Medzihradszky KF, Chalkley RJ. Lessons in de novo peptide sequencing by tandem mass spectrometry. Mass Spectrom Rev. 2015;34(1):43–63:https://pmc.ncbi.nlm.nih.gov/articles/PMC4367481/
- Tripet B, et al. J Chromatogr A. 2007;1141(2):212–225:https://pmc.ncbi.nlm.nih.gov/articles/PMC2722105/ ;Browne CA, et al. Anal Biochem. 1982;124:201–208 的 TFA 滯留係數:https://web.expasy.org/protscale/pscale/HPLCTFA.html
- UniProtKB/Swiss-Prot 2026_03 統計:https://web.expasy.org/docs/relnotes/relstat.html
- 驗證用的工具:Protein Prospector MS-Product(https://prospector.ucsf.edu/prospector/cgi-bin/msform.cgi?form=msproduct)、Expasy PeptideMass(https://web.expasy.org/peptide_mass/)

未確認:Steen H, Mann M. Nat Rev Mol Cell Biol. 2004;5:699–711 與 Aebersold R, Mann M. Nature. 2003;422:198–207 全文需訂閱,這次沒有讀到內文,沒有拿來當依據。三段蛋白質序列、流出時間、強度、資料庫都是示意。

#### 進階章節(2026-10-27)

接在原本 7 章之後的三章,章名以「進階:」開頭,章節代號 `quant`、`tmt`、`fdr`(網址 `#quant`、`#tmt`、`#fdr`)。共 10 章。定量拆成兩章(MS1 定量一章、MS2 的同重標記一章),因為兩種做法看的是不同的譜圖,放在同一章時字幕和畫面對不起來。進階定量沿用頁面原本的示意蛋白質與「跟著看的胜肽」控制項。

**第 8 章 進階:定量(一)不標記與 SILAC(17 秒)**

- 內容:不標記是兩個樣品分開跑,比同一個胜肽的層析峰面積(或數鑑定到的譜圖);分開跑會帶進每一針的差異,要用全部胜肽比例的中位數標準化(前提是大部分蛋白質沒變)。SILAC 讓樣品 B 的細胞吃重的離胺酸與精胺酸,收細胞後就和 A 混在一起;同一個胜肽在 MS1 成對出現,面積比就是 B : A,進樣多少不影響。
- 公式:SILAC 質量差 Δ = 8.014199 × K 的個數 + 10.008269 × R 的個數(Unimod #259、#267;胜肽內部接 P 而沒切開的 K、R 也算),2+ 時兩峰相差 Δ ÷ 2;不標記的面積比 = 真的比例 × (1 + 進樣差),標準化後除以全部胜肽比例的中位數。
- 控制項:兩樣品的真實比例 B : A(1、2、4、10)、第 2 針的進樣量(−40% 到 +40%),加上原本的蛋白質與跟著看的胜肽。
- 驗算(node,用頁面本身的程式):VNLQDAFGIK(1 個 K)Δ = 8.014199,2+ 的 m/z 552.8060 → 556.8131;HDGTAKPVSFYR(1 個 K、1 個 R)Δ = 18.022468,689.3491 → 698.3604;ELPAFVLSR(1 個 R)Δ = 10.008269,516.2978 → 521.3020;12 個示意胜肽都列在 proteomics/MAINTENANCE.md。
- 示意:兩個樣品的比例、進樣量、第 2 針的滯留時間偏移 0.22 分、標準化剛好除掉進樣差、同位素峰高度(和第 4 章同一個 Poisson 近似)。SILAC 畫成完全標記。

**第 9 章 進階:定量(二)TMT 與比例壓縮(17 秒)**

- 內容:TMT 標籤接在胜肽 N 端與 K 上,每個樣品一種,總質量相同,所以同一個胜肽在 MS1 疊成一根;碎裂時放出 m/z 126、127 的報導離子,強度比就是 B : A;挑母離子的視窗裡混進別的胜肽時,它們的報導離子一起加進來,比例被拉向 1 : 1(比例壓縮);MS3(再挑一根碎片碎裂)幾乎去掉干擾,代價是鑑定數少一些。
- 公式:標記後 M = M + 229.162932 × (1 + K 的個數)(Unimod #737);報導離子 126.12773(樣品 A)、127.12476(樣品 B);共分離干擾 f = 視窗裡別的胜肽 ÷ 全部,假設別的胜肽在兩個通道一樣多,每個通道多 I = f × (A + B) ÷ (2 × (1 − f)),量到 = (B + I) ÷ (A + I)。
- 控制項:真實比例(和上一章共用)、共分離的干擾(0% 到 60%)、改用 MS3(開關),加上原本的蛋白質與胜肽。
- 驗算:VNLQDAFGIK 標記後 M = 1103.597510 + 2 × 229.162932 = 1561.923374,2+ 的 m/z 781.9690;4 : 1、f = 30% 時 I = 1.0714、量到 2.448;10 : 1、f = 35% 時 I = 2.9615、量到 3.272(壓縮 3.06 倍;Ting 等 2011 量到預期 10 : 1 的比例中位數被壓縮 3.2 倍,同一個量級);f = 0 時量到 = 真的。
- 示意:干擾比例與「兩個通道一樣多」的假設、挑選視窗旁兩根別的胜肽的位置與高度、MS3 畫成完全去掉干擾(理想化;Ting 等 2011 有干擾時 10 : 1 量到 10.5,沒干擾時 11.7)、只畫兩個通道。挑選視窗寬 2 m/z 是 Ting 等 2011 用的寬度之一。

**第 10 章 進階:誘餌資料庫與錯誤率(18 秒)**

- 內容:每張譜圖都會配到分數最高的胜肽,所以一定有錯配;把序列反轉當誘餌和目標一起搜尋,配到誘餌一定是錯的,錯配落在兩邊的機會一樣,所以門檻以上錯的目標約等於誘餌數;FDR ≈ 誘餌數 ÷ 目標數;q 值是讓那一筆被接受的最低 FDR,常用 1% 當門檻。
- 公式:FDR(s) = D(s) ÷ T(s)(門檻 s 以上的誘餌數與目標數);第 i 筆目標的 q 值 = 所有能接受它的門檻(分數 ≤ 它)中 FDR 的最小值。
- 控制項:分數門檻(0.5 到 5.5,也可以在直方圖上拖)、顯示答案(只有模擬才知道哪些目標是錯的)、「設在 FDR 1%」按鈕。
- 模擬(示意,固定亂數種子 7):20,000 張譜圖,30% 有正確的胜肽,正確配對的分數 ~ 常態(平均 3.0、標準差 0.7),目標與誘餌各一個最好的錯配 ~ 常態(平均 1.0、標準差 0.7),取最高的那一個(串接搜尋)。分數形狀借用 Käll 等 2008 圖 5 的模擬設定;20,000 張、30% 是為了畫面訂的。
- 驗算:目標 12,884、誘餌 7,116、正確 5,782;門檻 2.5 時目標 4,848、誘餌 227、FDR 4.68%(模擬的實際錯誤 5.51%);門檻 3.0 時 3,091、34、1.10%(實際 1.23%);q ≤ 1% 的門檻 3.0346:目標 2,968、誘餌 29、FDR 0.98%(實際錯了 33,1.11%)。二分搜尋的累計數和直接數的一樣,q 值隨分數單調。誘餌數也有隨機誤差,門檻高時只剩幾十個,估計值和實際值差 0.1 到 0.9 個百分點。
- 頁面上的誘餌示意:畫面上方是示意蛋白質的序列與反轉後的序列(K、R 標色,看得出組成一樣)。

##### 來源連結

- Zhang Y, et al. Protein analysis by shotgun/bottom-up proteomics. Chem Rev. 2013;113(4):2343–2394:https://pmc.ncbi.nlm.nih.gov/articles/PMC3751594/ (第 4.1 節定量、第 5.1 節誘餌;基礎章節已列)
- Ong SE, et al. Stable isotope labeling by amino acids in cell culture, SILAC, as a simple and accurate approach to expression proteomics. Mol Cell Proteomics. 2002;1(5):376–386:https://doi.org/10.1074/mcp.M200025-MCP200 (讀摘要;原文用氘標記的白胺酸)
- Unimod #259 Label:13C(6)15N(2):https://www.unimod.org/modifications_view.php?editid1=259 ;#267 Label:13C(6)15N(4):https://www.unimod.org/modifications_view.php?editid1=267 ;#737 TMT6plex:https://www.unimod.org/modifications_view.php?editid1=737
- Thompson A, et al. Tandem mass tags: a novel quantification strategy for comparative analysis of complex protein mixtures by MS/MS. Anal Chem. 2003;75(8):1895–1904:https://doi.org/10.1021/ac0262560 (讀摘要)
- Ting L, Rad R, Gygi SP, Haas W. MS3 eliminates ratio distortion in isobaric multiplexed quantitative proteomics. Nat Methods. 2011;8(11):937–940:https://pmc.ncbi.nlm.nih.gov/articles/PMC3205343/ (注意:不是 PMC3205864)
- Elias JE, Gygi SP. Target-decoy search strategy for increased confidence in large-scale protein identifications by mass spectrometry. Nat Methods. 2007;4(3):207–214:https://doi.org/10.1038/nmeth1019 (讀摘要)
- Elias JE, Gygi SP. Target-decoy search strategy for mass spectrometry-based proteomics. Methods Mol Biol. 2010;604:55–71:https://pmc.ncbi.nlm.nih.gov/articles/PMC2922680/
- Käll L, Storey JD, MacCoss MJ, Noble WS. Assigning significance to peptides identified by tandem mass spectrometry using decoy databases. J Proteome Res. 2008;7(1):29–34:https://doi.org/10.1021/pr700600n
- Deutsch EW, et al. Human Proteome Project mass spectrometry data interpretation guidelines 2.1. J Proteome Res. 2016;15(11):3961–3970:https://pmc.ncbi.nlm.nih.gov/articles/PMC5096969/

## 生化進階

入口的「生化進階」一區(2026-10-27 起)給做過基礎實驗的大學部高年級與研究生:假設讀者看過「生化原理」對應的那一份,直接用公式、統計與接近真實的數據樣子,並在畫面上讓讀者調參數看計算結果怎麼變。和生化原理共用同一個播放器與版面;動畫裡的計算照公式真的算,模擬資料(計數、頻率、序列、曲線)是示意,各節列出公式與數值的來源。

### 轉錄體分析:從定序資料找出候選基因(`transcriptomics/`)

網頁:https://tung-beauregard.github.io/instrument-principles/transcriptomics/

RNA-seq 資料怎麼分析到挑出萜類合成酶候選:FASTQ 與 Phred 品質分數、修剪接頭與低品質尾巴;有參考基因體時跨過內含子比對,沒有時(很多針葉樹)用 k-mer 與 de Bruijn 圖從頭組裝;計數、RPKM 與 TPM、DESeq2 的 size factor;生物重複與負二項變異;Benjamini–Hochberg 校正與火山圖;最後用 BLAST、Pfam 結構域、完整讀框、處理後上升與和萜類含量的相關挑出候選,再交給選殖、酵素反應與 qPCR 確認。生化進階分區的教材,8 章,138 秒,用共用播放器 `assets/bio-lesson.js`。先看的基礎教材是 `sequencing/`(DNA 定序)與 `terpene-synthase/`(萜類合成酶)。

- 第 1 章 `#fastq`:一條 60 個鹼基的 read 的 FASTQ 四行;品質字元 → ASCII − 33 → Q → p(I、?、+ 三個例子);品質長條圖、讀進接頭的 12 個;先切接頭,再用 4 個鹼基的窗格照 Trimmomatic 的規則修剪,寫出保留幾個與 Σp
- 第 2 章 `#align`:外顯子接成 mRNA,40 條 read 對回基因體,跨接點的 10 條拆成兩段跳過內含子;不會跨內含子時少算 25%;6 條落在和另一個很像的萜類合成酶相同的那段,兩邊都對得上
- 第 3 章 `#assemble`:挪威雲杉與阿拉伯芥的基因體大小;兩種異構體(外顯子 2 有或沒有)切成 k-mer 的 de Bruijn 圖,分岔與會合;k = 3、5 時重複的小段被黏成同一個節點、出現多餘的岔路與環,k = 7 時只剩兩種剪接造成的分岔;Trinity 的輸出命名
- 第 4 章 `#tpm`:5 個基因的轉錄體,原始計數、RPKM、TPM 三欄並排,對照與處理(定序量 2 倍)各一條;萜類合成酶增加 8 倍時 TPM 加總仍是一百萬、RPKM 加總改變、沒變的肌動蛋白 TPM 少了 29%
- 第 5 章 `#size-factor`:2,000 個基因,處理組 80 個基因大量上升占掉讀數;B ÷ A 的直方圖、總讀數比與 size factor(median of ratios)的位置,沒變的基因用兩種方法校正後是幾倍
- 第 6 章 `#replicates`:一個真的上升 2 倍的基因在 2、3、5 個重複時的點、95% 範圍與 p 值;4,000 個基因的平均與變異數(卜瓦松的線與負二項的曲線);CV² = 1/μ + α 拆成定序與個體兩項
- 第 7 章 `#de-test`:p 值直方圖(有差異的與沒有差異的分開上色)、只看 p < 0.05 時選出的基因裡多少其實沒有差異;BH 的排序圖與 (i/m)·q 線;火山圖從未校正的 p 移到校正後的 p,依門檻分上下調
- 第 8 章 `#candidates`:46 → 31 → 19 → 處理後上升 → 和單萜含量相關的篩選;參考的大冷杉 pinene 合成酶(UniProt O24475)與候選的結構域地圖;12 棵樹的表現量與含量散布圖、r 與五項檢查表;候選 A(五關都過)、B(讀框缺 5′ 端)、C(P450,不是萜類合成酶)
- 控制項:修剪門檻 Q15、Q20、Q30;會不會跨內含子;k = 3、5、7;處理組萜類合成酶增加 8 倍(開關);大量上升的基因占掉的讀數(不變、約 20%、約 40%);每組 2、3、5 個生物重複;FDR 0.01、0.05、0.1;倍數門檻 1.5、2、4 倍;候選 A、B、C
- 計算都在瀏覽器裡照公式算(固定亂數種子),不是寫死的數字

#### 數值與示意

有出處的定義與數值:

- FASTQ 每筆四種行:@ 名稱、序列、+、品質;Sanger FASTQ 用 ASCII 33 到 126 表示 PHRED 0 到 93(舊的 Illumina 1.3+ 用 64)(Cock 等 2010)。名稱行範例 `@SIM:1:FCX:1:15:6329:1045 1:N:0:2` 取自 Illumina BaseSpace 的 FASTQ 說明。
- Q = −10·log₁₀(e),Q10、Q20、Q30 判讀錯的機率 1/10、1/100、1/1,000(Illumina Quality Scores 頁);phred 為每個鹼基估計錯誤機率(Ewing 與 Green 1998,摘要)。
- 品質越往 3′ 端越差,太低時要修掉(Conesa 等 2016);片段比讀長短時讀進接頭(Bolger 等 2014);Trimmomatic 的滑動窗格:`SLIDINGWINDOW:4:15` 表示 4 個鹼基平均低於 15 就切(README),切點與去尾巴的細節照 `SlidingWindowTrimmer.java`;TruSeq 第一讀接頭 AGATCGGAAGAGCACACGTCTGAACTCCAGTCA(cutadapt 文件,頁面用前 12 個)。
- 比對要用能跨接點(spliced)的軟體(Conesa 等 2016;STAR 見 Dobin 等 2013,HISAT2 見 Kim 等 2019);多處比對主要來自重複序列與旁系同源基因的共同結構域,HTSeq-count、featureCounts 常丟掉,RSEM、eXpress、Sailfish、kallisto 依機率分配(Conesa 等 2016)。雲杉至少 69 個有轉錄的萜類合成酶(Keeling 等 2011)。
- 挪威雲杉基因體約 20 Gb,第一個裸子植物基因體,阿拉伯芥小 100 倍以上,很多超過 10,000 bp 的內含子(Nystedt 等 2013,摘要);火炬松內含子平均超過 2.7 kbp、有的超過 100 kbp,重複序列約 82%(Neale 等 2014)。頁面寫「針葉樹的內含子常有幾千個鹼基,有的超過 10 萬」。
- de Bruijn 圖:節點是 k 個鹼基、重疊 k − 1 個就連邊,預設 k = 25;報出異構體;在不同基因裡重複的序列造成模糊(Grabherr 等 2011)。命名 `TRINITY_DN1000_c115_g5_i1`:read 群、基因、異構體(Trinity wiki)。沒有基因體時,組裝的轉錄體對找松樹的萜類合成酶很重要(Hall 等 2013:受傷加茉莉酸甲酯處理的莖,Trinity 組裝,BLAST e 值小於 10⁻⁵)。
- RPKM = 計數 × 10⁹ ÷(長度 × 總讀數);TPM = 10⁶ × (計數 ÷ 長度) ÷ Σ(計數 ÷ 長度)(Zhao 等 2020);RPKM 的平均依樣品而變,TPM 修正了這一點(Wagner 等 2012,摘要);RPKM 與 FPKM 在單端定序時相同,三者都是樣品內的量,遇到少數高表現又有差異的基因時表現不好(Conesa 等 2016)。
- size factor:各樣品計數對幾何平均的比值取中位數(Anders 與 Huber 2010;Love 等 2014);一個條件裡有大量獨有或高表現的基因時,只用總讀數校正會偏(Robinson 與 Oshlack 2010)。
- 負二項:平均 = size factor × q,變異數 μ + αμ²(Love 等 2014);卜瓦松的變異數等於平均(Anders 與 Huber 2010);同一管 RNA 重測照卜瓦松變,CV² = 1/μ + φ,技術的 CV 隨計數變大而變小,BCV 不會(edgeR User's Guide 2.9.2 節,2026-04-25 版)。
- 重複:至少 3 個生物重複(Conesa 等 2016);建議至少 6 個,3 個重複時多數工具只找到 20% 到 40% 的顯著差異基因(Schurch 等 2016)。
- BH:k 為最後一個 P₍ᵢ₎ ≤ (i/m)q* 的 i,拒絕前 k 個,獨立時控制 FDR 於 q*(Benjamini 與 Hochberg 1995 第 3.1 節);校正後 p = min(m·p₍ᵢ₎/i, 1) 再由大往小取最小值(PSU STAT 555 第 4.3 節,R 的 `p.adjust` 同法)。DESeq2 用 Wald 檢定與 BH 校正(Love 等 2014)。火山圖:−log₁₀ p 對 log₂ 倍數(Cui 與 Churchill 2003)。
- E 值:分數至少 S 的比對碰巧出現的預期個數(NCBI BLAST 統計說明;Karlin 與 Altschul 1990)。
- Pfam:PF01397 Terpene synthase, N-terminal domain(IPR001906);PF03936 Terpene synthase family, metal binding domain(IPR005630);PF00067 Cytochrome P450(InterPro)。
- UniProt O24475(大冷杉 pinene 合成酶):628 個胺基酸,轉運胜肽 1–36,DDXXD 379–383,Mg²⁺ 結合位 379、383、531;InterPro 的 Pfam 位置 PF01397 74–265、PF03936 332–566(2026-10-27 查)。
- 單萜合成酶 600 到 650 個胺基酸、N 端有送進質體的轉運胜肽、DDxxD 固定二價金屬離子、只靠序列比對不能判定功能(Bohlmann 等 1998);只看序列相似度無法準確預測功能(Keeling 等 2011)。臺灣杉的 5 個候選 593 到 628 個胺基酸、BLAST 的 E 值都是 0.0、用 RACE 取得全長(Ma 等 2021)。

示意(頁面「資料來源」最後一條也有寫):

- 第 1 章的插入片段與 60 個品質分數;第 2 章 900 個鹼基的 mRNA、40 條讀長 100 的 read 與相同的那一段(610 到 860);第 3 章三個外顯子序列(ATGGCGGGTTCG、AGCCATGT、TCGGATAACCAC,刻意設計成 k = 5 時有一個重複的小段);第 4 章 5 個基因的長度與分子數、總讀數 1,000 萬與 2,000 萬(整個轉錄體只有 5 個基因,所以 RPKM、TPM 的數值比實際大);第 5 章 2,000 個基因(其中 80 個上升)、總讀數 1,000 萬與 1,500 萬。
- 第 6 到 8 章:4,000 個基因、每組最多 5 個重複,10% 有差異,離散度趨勢 α = 0.06 + 1/μ;例子基因(對照 260、處理後 2 倍);46 個像萜類合成酶的基因與 31、19 的篩選個數;12 棵樹的單萜含量;候選 A、B、C 的長度、結構域位置與 BLAST 結果。檢定是簡化的 Wald 檢定(離散度直接用趨勢值),不是完整的 DESeq2;換 30 個種子平均,FDR 0.05 時實際的偽發現比例約 4% 到 5%,頁面用的種子在 3.2% 到 4.9%。
- 驗算過的數值(node,用頁面的計算區段):Q20 修剪保留 43 個,Σp 2.246 → 0.035;萜類合成酶增加 8 倍時 B 的 RPKM 加總 478,088(A 為 469,613)、TPM 加總都是 1,000,000、肌動蛋白 TPM 352,941 → 250,000;占掉 40% 時沒變的基因用總讀數校正 0.663 倍、用 size factor 0.988 倍;每組 3 重複時 p < 0.05 有 455 個(164 個其實沒差異),FDR 0.05 時 227 個(10 個沒差異);BH 原論文第 3.2 節的 15 個 p 值,本頁的 `bhK` 也是拒絕 4 個。

教學示意:不可用於實際的差異表現分析或候選判斷。

#### 技術

單一 HTML 檔(transcriptomics/index.html),2D canvas 動畫,用生化原理分區共用的 assets/bio-lesson.js(播放器)、assets/bio-draw.js(畫圖工具,含固定種子的 `rng`)、assets/bio-lesson.css(版面),不需要建置、沒有外部依賴;示意資料與所有統計在載入時於瀏覽器裡算(約 40 毫秒),計算區段夾在 `// ===== 計算開始` 與 `// ===== 計算結束` 之間,可以單獨抽出來用 node 驗算。入口卡片圖 assets/transcriptomics.svg。程式分區、每章的時間點、預期的驗算值與修改方式見 transcriptomics/MAINTENANCE.md。

#### 來源連結

- Conesa A, et al. A survey of best practices for RNA-seq data analysis. Genome Biol. 2016;17:13:https://pmc.ncbi.nlm.nih.gov/articles/PMC4728800/
- Cock PJ, et al. The Sanger FASTQ file format for sequences with quality scores, and the Solexa/Illumina FASTQ variants. Nucleic Acids Res. 2010;38(6):1767–1771:https://pmc.ncbi.nlm.nih.gov/articles/PMC2847217/
- Ewing B, Green P. Base-calling of automated sequencer traces using phred. II. Error probabilities. Genome Res. 1998;8(3):186–194:https://doi.org/10.1101/gr.8.3.186 (只讀到摘要)
- Illumina, Quality Scores for Next-Generation Sequencing:https://www.illumina.com/science/technology/next-generation-sequencing/plan-experiments/quality-scores.html ;BaseSpace FASTQ files:https://help.basespace.illumina.com/files-used-by-basespace/fastq-files
- Bolger AM, et al. Trimmomatic: a flexible trimmer for Illumina sequence data. Bioinformatics. 2014;30(15):2114–2120:https://pmc.ncbi.nlm.nih.gov/articles/PMC4103590/ ;Trimmomatic 原始碼與 README:https://github.com/usadellab/Trimmomatic
- cutadapt 使用說明(TruSeq 接頭):https://cutadapt.readthedocs.io/en/stable/guide.html
- Dobin A, et al. STAR: ultrafast universal RNA-seq aligner. Bioinformatics. 2013;29(1):15–21:https://pmc.ncbi.nlm.nih.gov/articles/PMC3530905/ ;Kim D, et al. HISAT2. Nat Biotechnol. 2019;37:907–915:https://pmc.ncbi.nlm.nih.gov/articles/PMC7605509/
- Nystedt B, et al. The Norway spruce genome sequence and conifer genome evolution. Nature. 2013;497:579–584:https://doi.org/10.1038/nature12211 (只讀到摘要)
- Neale DB, et al. Decoding the massive genome of loblolly pine. Genome Biol. 2014;15:R59:https://pmc.ncbi.nlm.nih.gov/articles/PMC4053751/
- Grabherr MG, et al. Trinity: reconstructing a full-length transcriptome without a genome from RNA-Seq data. Nat Biotechnol. 2011;29(7):644–652:https://pmc.ncbi.nlm.nih.gov/articles/PMC3571712/ ;Trinity 輸出說明:https://github.com/trinityrnaseq/trinityrnaseq/wiki/Output-of-Trinity-Assembly
- Hall DE, et al. Transcriptome resources and functional characterization of monoterpene synthases for two host species of the mountain pine beetle. BMC Plant Biol. 2013;13:80:https://pmc.ncbi.nlm.nih.gov/articles/PMC3668260/
- Keeling CI, et al. Transcriptome mining, functional characterization, and phylogeny of a large terpene synthase gene family in spruce. BMC Plant Biol. 2011;11:43:https://pmc.ncbi.nlm.nih.gov/articles/PMC3058080/
- Mortazavi A, et al. Mapping and quantifying mammalian transcriptomes by RNA-Seq. Nat Methods. 2008;5:621–628:https://doi.org/10.1038/nmeth.1226
- Wagner GP, et al. Measurement of mRNA abundance using RNA-seq data: RPKM measure is inconsistent among samples. Theory Biosci. 2012;131(4):281–285:https://doi.org/10.1007/s12064-012-0162-3 (只讀到摘要)
- Zhao S, et al. Misuse of RPKM or TPM normalization when comparing across samples and sequencing protocols. RNA. 2020;26(8):903–909:https://doi.org/10.1261/rna.074922.120
- Love MI, et al. Moderated estimation of fold change and dispersion for RNA-seq data with DESeq2. Genome Biol. 2014;15:550:https://pmc.ncbi.nlm.nih.gov/articles/PMC4302049/
- Anders S, Huber W. Differential expression analysis for sequence count data. Genome Biol. 2010;11:R106:https://pmc.ncbi.nlm.nih.gov/articles/PMC3218662/
- Robinson MD, Oshlack A. A scaling normalization method for differential expression analysis of RNA-seq data. Genome Biol. 2010;11:R25:https://pmc.ncbi.nlm.nih.gov/articles/PMC2864565/
- Schurch NJ, et al. How many biological replicates are needed in an RNA-seq experiment and which differential expression tool should you use? RNA. 2016;22(6):839–851:https://pmc.ncbi.nlm.nih.gov/articles/PMC4878611/
- edgeR User's Guide(Bioconductor,2026-04-25 版):https://bioconductor.org/packages/release/bioc/html/edgeR.html
- Benjamini Y, Hochberg Y. Controlling the false discovery rate: a practical and powerful approach to multiple testing. J R Stat Soc B. 1995;57(1):289–300:https://doi.org/10.1111/j.2517-6161.1995.tb02031.x ;Penn State STAT 555, 4.3:https://online.stat.psu.edu/stat555/node/59/
- Cui X, Churchill GA. Statistical tests for differential expression in cDNA microarray experiments. Genome Biol. 2003;4:210:https://pmc.ncbi.nlm.nih.gov/articles/PMC154570/
- NCBI, The Statistics of Sequence Similarity Scores:https://www.ncbi.nlm.nih.gov/BLAST/tutorial/Altschul-1.html ;Karlin S, Altschul SF. PNAS. 1990;87(6):2264–2268:https://pmc.ncbi.nlm.nih.gov/articles/PMC53667/
- InterPro PF01397:https://www.ebi.ac.uk/interpro/entry/pfam/PF01397/ ;PF03936:https://www.ebi.ac.uk/interpro/entry/pfam/PF03936/ ;UniProt O24475:https://www.uniprot.org/uniprotkb/O24475/entry
- Bohlmann J, et al. Plant terpenoid synthases: molecular biology and phylogenetic analysis. PNAS. 1998;95(8):4126–4133:https://pmc.ncbi.nlm.nih.gov/articles/PMC22453/
- Ma LT, et al. Unveiling monoterpene biosynthesis in *Taiwania cryptomerioides* via functional characterization. Plants. 2021;10(11):2404:https://pmc.ncbi.nlm.nih.gov/articles/PMC8625326/
- 只寫在 MAINTENANCE.md、頁面沒有列的:Foster AJ, et al. Plant Physiol. 2013;161(4):1993–2004(西部紅側柏腺體,依摘要);Martin D, et al. Plant Physiol. 2002;129(3):1003–1018(茉莉酸甲酯與創傷樹脂道,依摘要);Chen C, et al. BMC Genomics. 2018;19:550(樟樹化學型的 RNA-seq,https://pmc.ncbi.nlm.nih.gov/articles/PMC6057064/ );Everaert C, et al. Sci Rep. 2017;7:1559(RNA-seq 與 qPCR 的一致性,https://pmc.ncbi.nlm.nih.gov/articles/PMC5431503/ );TransDecoder wiki(https://github.com/TransDecoder/TransDecoder/wiki )

未確認:Compeau PEC 等 2011(Nat Biotechnol 29:987–991,de Bruijn 圖的教學)這次讀不到內文,沒有拿來當依據;重複小段讓圖打結的說法依 Grabherr 等 2011。

### 萜類前驅物:MEP 與 MVA 兩條路(`terpenoid-precursors/`)

網頁:https://tung-beauregard.github.io/instrument-principles/terpenoid-precursors/

萜類的 5 碳積木 IPP 與 DMAPP 從哪裡來:質體的 MEP 路徑(丙酮酸 + G3P → DXP → MEP → … → HMBPP → IPP 與 DMAPP)與細胞質的 MVA 路徑(3 個乙醯輔酶 A → HMG-CoA → 甲羥戊酸 → IPP,IDI 換成 DMAPP)。算兩條路的碳與輔因子帳,看接長鏈時 DMAPP 與 IPP 要怎麼配、IDI 要轉多少,用金魚草花的抑制劑與氘標記實驗說明怎麼判斷萜類的碳從哪條路來,最後是內質網上的 CYP720B 把雙萜骨架氧化成針葉樹的樹脂酸。生化進階分區的動畫教材,接在「萜類合成酶」(`terpene-synthase/`)之後,版型和生化原理分區相同。

- 8 章,共 131 秒:細胞裡的兩個工廠、MVA 路徑、MEP 路徑、接長鏈(IPP 與 DMAPP 要怎麼配)、抑制劑、同位素標記(質譜上的 +2、+4、+6)、P450 做出樹脂酸、從光合作用到精油與樹脂
- 可以自己調:接成多長的鏈(GPP、FPP、GGPP;第 4、8 章)、抑制劑(不加、lovastatin、fosmidomycin)、標記前驅物(²H₂-DOX、²H₂-MVL)與每個 5 碳單位帶標記的機率 p、P450(CYP720B1、CYP720B4)、走哪一條路(MEP、MVA)
- 第 2、3 章的分子畫成碳珠(依來源上色:三個乙醯基;丙酮酸與 G3P),可以看出哪個碳變成 CO₂、DXR 怎麼把直鏈重排成分岔;第 7 章是松香烷骨架的線條式

#### 數值與示意

有出處:

- 分區與產物:MVA 在細胞質,主要做倍半萜、三萜、固醇(與油菜素固醇、泛醌側鏈);MEP 在質體,主要做異戊二烯、單萜、雙萜(含吉貝素)、類胡蘿蔔素、葉綠素與生育醇、質體醌的側鏈(Laule 2003、Bick & Lange 2003、Tholl & Lee 2011)。HMGR 在內質網膜上、是限速步驟之一(Leivar 2005);PMK、MVD 在過氧化體(Simkin 2011),IDI 也在過氧化體(Sapir-Mir 2008)。被子植物在一般條件下,葉綠素的側鏈、三萜、類胡蘿蔔素幾乎只來自各自的路,其他萜類常有兩種來源(Hemmerlin 2012 的摘要)。
- 反應式(KEGG M00095、M00096 的各步反應):MVA 每個 IPP 用 3 乙醯輔酶 A + 2 NADPH + 3 ATP,放 1 個 CO₂;MEP 每個 IPP 或 DMAPP 用丙酮酸 + G3P + NADPH + CTP + ATP + 4 個還原態鐵氧化還原蛋白,放 1 個 CO₂。
- HDR 的產物 IPP:DMAPP:菸草 BY-2 細胞 85:15(Tritsch 2010 的摘要),大腸桿菌的 IspH 5:1(Rohdich 2002;Zhao 2013),Tholl & Lee 2011 寫「5 到 6:1」。頁面用 85:15。
- 抑制劑:lovastatin(mevinolin)是 HMGR 的競爭性抑制劑,Ki 0.6 nM(Alberts 1980);fosmidomycin 抑制 DXR(Mueller 2000;Jomaa 1999)。
- 金魚草(Dudareva 2005,PMC545543):花枝插在含 2 mg/mL [5,5-²H₂]-DOX 或 3 mg/mL [2,2-²H₂]-MVL 的 5% 蔗糖水;GC-MS 以位移離子 ÷(位移 + 未位移)算標記比例,月桂烯用 m/z 93、95、97;DOX 讓單萜出現 +2、+4、橙花叔醇出現 +2、+4、+6,MVL 沒有標記單萜但標記橙花叔醇;fosmidomycin 100 μM 讓單萜 3 小時內少 60%,橙花叔醇較慢下降;mevinolin 100 μM 對橙花叔醇幾乎沒有影響;花瓣的 MVA 在甲羥戊酸之前停住;+6 表示質體送出的是 IPP 或 DMAPP(只送 GPP 時倍半萜最多 +4)。
- 阿拉伯芥幼苗:lovastatin 讓固醇先降、再回升到高於對照,類胡蘿蔔素與葉綠素暫時增加(Laule 2003)。
- [1-¹³C] 葡萄糖經糖解後,5 碳單位的 1 號碳只經 MEP 帶標記,2、4 號碳只經 MVA,5 號碳兩條都會,約為葡萄糖標記的 50%(Skorupinska-Tudek 2008)。頁面依反應追出的碳對應(MVA:IPP 的 1、2 號碳來自第一個乙醯基、3 號與 5 號碳來自第二個、4 號碳來自第三個,第三個的羰基碳變成 CO₂;MEP:IPP 的 1、2、4 號碳來自 G3P,3、5 號碳來自丙酮酸)與此一致。
- 樹脂酸:火炬松 CYP720B1 在 18 號碳做醇 → 醛 → 酸,微粒體對 abietadiene 測不到活性、酵母中約 2%(Ro 2005);LAS 做出 levopimaradiene、abietadiene、palustradiene、neoabietadiene,LAS 在質體、CYP720B1 在內質網(Ro & Bohlmann 2006 的摘要);西加雲杉 CYP720B4 能氧化 24 種雙萜,在酵母裡把 abietadiene 一路做到松香酸;莖外層雙萜類 92% 樹脂酸、5% 醛、3% 醇、不到 1% 烯(Hamberger 2011)。GC-MS 前樹脂酸先甲基化(Ro 2005 的方法)。松節油來自單萜合成酶、松香是雙萜樹脂酸的部分(Phillips 2003 的摘要);木材抽出物與硫酸鹽法製漿的妥爾油含樹脂酸(Foster 1980 的摘要)。
- 理論質量產率(由葡萄糖、含輔因子的成本):MEP 30%、MVA 25%(Zhao 2013)。

照公式算(頁面裡真的計算,用 node 驗算過):

- 碳帳(從三碳化合物算起):MEP 每個 5 碳單位進 6 個碳、放 1 個 CO₂,留 5/6 = 83.3%;MVA 進 9 個碳(3 個丙酮酸)、放 4 個 CO₂,留 5/9 = 55.6%。C₁₀、C₁₅、C₂₀ 依次是 MEP 12、18、24 個碳,MVA 18、27、36 個碳。
- IDI:5n 個碳的鏈要 DMAPP 1/n,原料已有 d₀,IDI 要轉 1/n − d₀:GPP(質體,d₀ = 0.15)35%、FPP(細胞質,d₀ = 0)33.3%、GGPP(質體)10%;60 格原料池分別轉 21、20、6 格。
- 二項分布:P(+2k) = C(n,k)·p^k·(1 − p)^(n−k),被標記的比例 1 − (1 − p)^n。p = 0.3:單萜 49%、42%、9%(51%),倍半萜 34.3%、44.1%、18.9%、2.7%(65.7%)。

示意(頁面「資料來源」最後一條也有寫):

- 細胞與胞器的形狀;分子畫成碳珠加部分官能基;MEcPP 的環畫成一條弧。
- 第 4 章的 60 格原料池與 IDI 轉換量只算單一產物的帳;實際的 IDI 量由整體需求與調控決定。
- 第 5 章的時間曲線:只有「fosmidomycin 讓單萜 3 小時內少 60%」取自論文;橙花叔醇下降的形狀(3 小時約 74、12 小時 48)、lovastatin 的平線(100 ± 1.5)、照課本分工的預期(虛線)都是依論文文字畫的示意;lovastatin 下的單萜論文沒有給數據,頁面不畫。
- 第 6 章的二項分布模型、p 值與長條高度(論文沒有用這個模型,長條不是實測,沒有計入天然同位素與氘的同位素效應)。
- 第 7 章的酵素形狀;第 8 章的流程圖版面,碳帳不含運輸、輔因子再生與光合作用本身的成本。

教學示意:長條、曲線與碳帳是用來說明判斷的方法,不是實驗數據,不可用來推定實樣的生合成來源。

#### 技術

單一 HTML 檔(terpenoid-precursors/index.html),2D canvas 動畫,用共用的 assets/bio-lesson.js(播放器)、assets/bio-draw.js(畫圖工具)與 assets/bio-lesson.css(版面);分子由頁面裡的 `drawMol()` 畫(兩個狀態之間內插位置、鍵與官能基),不需要建置,不使用到站人數計數。入口卡片概念圖 assets/terpenoid-precursors.svg。分頁列暫時只有「← 儀器入口」與本頁(`aria-label="生化進階"`),等生化進階分區成立後換成整區的分頁列。程式分區、每章的時間點與修改方式見 terpenoid-precursors/MAINTENANCE.md。

#### 來源連結

- Hemmerlin A, et al. 2012, Prog Lipid Res 51(2):95–148(只讀到摘要):https://doi.org/10.1016/j.plipres.2011.12.001
- Tholl D, Lee S. 2011, Arabidopsis Book 9:e0143:https://pmc.ncbi.nlm.nih.gov/articles/PMC3268506/
- Laule O, et al. 2003, Proc Natl Acad Sci USA 100:6866–6871(只讀到摘要):https://doi.org/10.1073/pnas.1031755100
- Bick JA, Lange BM. 2003, Arch Biochem Biophys 415:146–154(只讀到摘要):https://doi.org/10.1016/s0003-9861(03)00233-9
- Leivar P, et al. 2005, Plant Physiol 137:57–69(只讀到摘要):https://doi.org/10.1104/pp.104.050245
- Simkin AJ, et al. 2011, Planta 234:903–914(只讀到摘要):https://doi.org/10.1007/s00425-011-1444-6
- Sapir-Mir M, et al. 2008, Plant Physiol 148:1219–1228(依標題):https://doi.org/10.1104/pp.108.127951
- KEGG 模組 M00095:https://www.kegg.jp/module/M00095 ;M00096:https://www.kegg.jp/module/M00096 ;反應式以 KEGG REST 讀取(例如 https://rest.kegg.jp/get/R01121)
- Tritsch D, et al. 2010, FEBS Lett 584(1):129–134(只讀到摘要):https://doi.org/10.1016/j.febslet.2009.11.010
- Rohdich F, et al. 2002, Proc Natl Acad Sci USA 99:1158–1163:https://pmc.ncbi.nlm.nih.gov/articles/PMC122160/
- Zhao L, et al. 2013, Annu Rev Biochem 82:497–530:https://pmc.ncbi.nlm.nih.gov/articles/PMC5031371/
- Alberts AW, et al. 1980, Proc Natl Acad Sci USA 77:3957–3961:https://pmc.ncbi.nlm.nih.gov/articles/PMC349746/ ;PubChem lovastatin(同義名 mevinolin):https://pubchem.ncbi.nlm.nih.gov/compound/53232
- Mueller C, et al. 2000, Biochem Soc Trans 28:792–793(只讀到摘要):https://doi.org/10.1042/bst0280792 ;Jomaa H, et al. 1999, Science 285:1573–1576(只讀到摘要):https://doi.org/10.1126/science.285.5433.1573
- Dudareva N, et al. 2005, Proc Natl Acad Sci USA 102(3):933–938:https://pmc.ncbi.nlm.nih.gov/articles/PMC545543/
- Hemmerlin A, et al. 2006, Plant Physiol 142:441–457(DOX 在細胞質被磷酸化,只讀到摘要):https://doi.org/10.1104/pp.106.086652
- Skorupinska-Tudek K, et al. 2008, J Biol Chem 283(30):21024–21035:https://pmc.ncbi.nlm.nih.gov/articles/PMC3258935/
- Lichtenthaler HK, et al. 1997, FEBS Lett 400(3):271–274(只讀到摘要):https://doi.org/10.1016/s0014-5793(96)01404-4 ;Rohmer M, et al. 1993, Biochem J 295:517–524(只讀到摘要):https://pmc.ncbi.nlm.nih.gov/articles/PMC1134910/
- Ro DK, et al. 2005, Proc Natl Acad Sci USA 102(22):8060–8065:https://pmc.ncbi.nlm.nih.gov/articles/PMC1138258/
- Ro DK, Bohlmann J. 2006, Phytochemistry 67(15):1572–1578(只讀到摘要):https://doi.org/10.1016/j.phytochem.2006.01.011
- Hamberger B, et al. 2011, Plant Physiol 157(4):1677–1695:https://pmc.ncbi.nlm.nih.gov/articles/PMC3327196/
- Phillips MA, et al. 2003, Arch Biochem Biophys 411:267–276(只讀到摘要):https://doi.org/10.1016/s0003-9861(02)00746-4
- Foster DO, Zinkel DF, Conner AH. 1980, Tappi 63(12):103–105(只讀到摘要):https://research.fs.usda.gov/treesearch/30550
- Kasahara H, et al. 2002, J Biol Chem 277:45188–45194(只讀到摘要,頁面沒有列):https://doi.org/10.1074/jbc.m208659200
- Estévez JM, et al. 2001, J Biol Chem 276:22901–22909(只讀到摘要,頁面沒有列):https://doi.org/10.1074/jbc.m100854200
- Fatland BL, et al. 2002, Plant Physiol 130:740–756(只讀到摘要,頁面沒有列):https://doi.org/10.1104/pp.008110
- Zeidler J, Lichtenthaler HK. 2001, Planta 213:323–326(西黃松針葉的半萜由 MEP 來,只讀到摘要,頁面沒有列):https://doi.org/10.1007/s004250100562
- OpenStax Biology 2e, 8.3 Using Light Energy to Make Organic Molecules:https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules

未確認:Vranová E, et al. 2013 Annu Rev Plant Biol 64:665–700 與 Tholl D. 2015 Adv Biochem Eng Biotechnol 148:63–106 只讀到摘要,沒有拿來當具體數字的依據。Schwender 1996 與 Lichtenthaler 1997 的全文(標記位置的原始表格)這次讀不到,標記位置改用 Skorupinska-Tudek 2008 的全文。

### 酵素動力學:Km 與 kcat 怎麼量(`enzyme-kinetics/`)

網頁:https://tung-beauregard.github.io/instrument-principles/enzyme-kinetics/

酵素有多快、對受質多敏感,要從初速度對受質濃度的曲線求出來。生化進階分區的教材,7 章(約 2 分鐘),用共用播放器 `assets/bio-lesson.js`;例子以西加雲杉(*Picea sitchensis*)的單萜合成酶為主,先看的基礎教材是「萜類合成酶」與「基因選殖與蛋白表現」。

- 第 1 章:E + S ⇌ ES → E + P 與 k₁、k₋₁、kcat;同一個酵素一次一次做出產物;產物對時間的曲線為什麼變彎(受質變少、產物抑制、酵素失活),初速度 v₀ 是開頭直線段的斜率
- 第 2 章:萜類合成酶的測法:緩衝液裡放酵素、GPP、Mg²⁺,上蓋含內標(異丁基苯)的戊烷,30 °C 反應後搖勻,戊烷層打進 GC-MS,用產物峰對內標峰的面積比換算產物量;時間曲線上改取樣時間,看受質用掉幾 % 與 P ÷ t 低估多少
- 第 3 章:9 個濃度的初速度連成飽和曲線,v₀ = Vmax[S]/(Km + [S]),Km 是速度一半時的 [S];低濃度近乎直線(斜率 Vmax/Km)、高濃度趨近 Vmax;Km = (k₋₁ + kcat)/k₁,kcat 遠小於 k₋₁ 時才約等於解離常數
- 第 4 章:kcat = Vmax/[E]ₜ 與從蛋白質濃度換算 [E]ₜ;兩個酵素分子用真實時間做產物(PsTPS-3car2 每秒 0.098 個、酵素的中位數每秒約 10 個);kcat 與 kcat/Km 的對數數線
- 第 5 章:雙倒數圖(Lineweaver–Burk)把低濃度點的誤差放大(δ/v₀²);非線性迴歸直接擬合原始數據;同樣的實驗模擬 200 次,比較兩種方法 Km 的中間 95%
- 第 6 章:競爭型、非競爭型、反競爭型抑制的曲線、雙倒數圖的型態、和誰結合、速率式與表觀參數
- 第 7 章:PsTPS-3car2 的 596 號 Leu 換成 Phe(或 PsTPS-sab 反過來):產物比例、kcat 與 Km 的變化
- 控制項:取樣時間(第 2 章)、受質濃度範圍(第 3、5 章)、量測誤差與「換一組誤差」(第 5 章)、抑制型態與 [I]/Ki(第 6 章)、突變方向(第 7 章)

#### 數值與示意

公式(第 3 到 6 章都即時照公式算,不是寫死的數字):

- v₀ = Vmax[S]/(Km + [S]);Km = (k₋₁ + kcat)/k₁;kcat = Vmax/[E]ₜ;[E]ₜ = 蛋白質濃度 ÷ 分子量;[S] 遠小於 Km 時 v₀ ≈ (kcat/Km)[E]ₜ[S];kcat/Km 的單位換算 μM⁻¹min⁻¹ × 10⁶ ÷ 60 = M⁻¹s⁻¹。
- 雙倒數 1/v₀ = (Km/Vmax)(1/[S]) + 1/Vmax;誤差傳遞 δ(1/v₀) ≈ δ/v₀²。
- 抑制,α = 1 + [I]/Ki:競爭型 v₀ = Vmax[S]/(αKm + [S]);非競爭型 v₀ = (Vmax/α)[S]/(Km + [S])(和 E、ES 結合的解離常數相同);反競爭型 v₀ = Vmax[S]/(Km + α[S])。
- 非線性擬合:K 固定時最佳 V = Σv·f ÷ Σf²(f = [S]/(K + [S])),在 log K(0.01 到 10⁴ μM)上用格點加黃金分割找殘差平方和最小;雙倒數擬合是 1/v 對 1/[S] 的一般線性迴歸,v ≤ 0 的點拿掉,截距或斜率 ≤ 0 算「算不出來」。
- 時間曲線:d[S]/dt = −V·e^(−kd·t)·[S]/(K(1 + [P]/Kp) + [S]),四階 Runge–Kutta。

用 node 驗算過:沒有誤差時兩種擬合都拿回真值;非線性擬合和 20 萬格的暴力格點一致;時間曲線和積分式 Km·ln([S]₀/[S]) + ([S]₀ − [S]) = Vt 一致(差 10⁻⁷ 以內);抑制式等於用表觀參數算的 Michaelis–Menten;論文表 3 的 kcat/Km 與 kcat ÷ Km 一致。範圍 1 到 60 μM、誤差 2% 時,200 次重做的 Km 中間 95% 是非線性 13.9 到 18.9 μM、雙倒數 5.9 μM 到算不出(35 次截距或斜率 ≤ 0);範圍只到 8 μM、誤差 4% 時非線性擬合也有 20 次定不出 Km。

實測(取自論文):

- Roach et al. 2014 表 3(kcat 每分鐘、Km μM、kcat/Km μM⁻¹min⁻¹):PsTPS-3car2 野生型 5.86、15.8、0.37;L596F 38.57、15.3、2.52;PsTPS-sab 野生型 32.68、35.7、0.92;F596L 4.95、31.6、0.16。L596F 的 kcat 是野生型的 6.6 倍,內文的 kcat/Km 寫 2.2,頁面用表的 2.52(等於 38.57 ÷ 15.3)。表 1 的產物比例(%,(+)-3-carene、(−)-sabinene、terpinolene、其他):3car2 野生型 67.5、6.9、15.4、10.2;L596F 12.3、37.4、35.4、14.9;sab 野生型 1.3、44.7、35.9、18.1;F596L 28.6、18.7、24.9、27.8。
- Roach et al. 2014 的方法:500 μL 反應(25 mM HEPES、100 mM KCl、10 mM MgCl₂、5 mM DTT、10% 甘油)、GPP 1 到 60 μM 共 9 個濃度、酵素 pM 級、30 °C 10 分鐘(3car2 野生型 20 分鐘)、上蓋 500 μL 含 2.5 μM 異丁基苯的戊烷、渦旋 30 秒後離心分層、GC-MS 以內標的校正係數定量、非線性迴歸(ANEMONA);同源模型裡 Phe596 離 α-terpinyl 陽離子 4 號碳不到 4 Å、Leu596 在 5 Å 外。
- 第 4 章的萜類合成酶:檸檬烯合成酶 Km 12.6 μM、kcat 0.037 s⁻¹(Srividya et al. 2015);青蒿 β-farnesene 合成酶放射性方法 kcat 0.020 s⁻¹、Km 1.9 μM、kcat/Km 10.3 mM⁻¹s⁻¹(Vardakou et al. 2014;同一支酵素 GC-MS 方法量到 0.198 s⁻¹、11.9 μM、16.6 mM⁻¹s⁻¹,Km 與 kcat 差約 7 倍,kcat/Km 接近)。
- 酵素 kcat 中位數約 10 s⁻¹、kcat/Km 中位數約 10⁵ M⁻¹s⁻¹、次級代謝的 kcat 中位數 2.5 s⁻¹(Bar-Even et al. 2011,依摘要與 BioNumbers);擴散上限 10⁸ 到 10⁹ M⁻¹s⁻¹(LibreTexts)。
- 1913 年 Michaelis 與 Menten 用蔗糖酶、只量反應早期,蔗糖的常數 16.7 mM(Johnson 與 Goody 2011)。
- 動力學實驗把反應時間調到受質用掉不超過 20%(Srividya et al. 2015);先用時間曲線找出直線段再做穩定態實驗(Vardakou et al. 2014)。

示意(頁面「資料來源」最後一條也有寫):第 1、2 章的時間曲線與常數(第 1 章 [S]₀ 10 μM、V 0.3 μM/min、失活 0.015 min⁻¹、產物抑制常數 8 μM;第 2 章 [S]₀ 5 μM、V 0.2 μM/min)、反應瓶與層析圖的樣子、峰面積比與校正係數(內標量 1.25 nmol 由 2.5 μM × 0.5 mL 算出);第 3、5、6 章以 Km 15.8 μM、Vmax = 1 的相對速度畫曲線,9 個濃度等比取;第 5 章的誤差是固定標準差的常態分布;第 4 章從蛋白質濃度換算的例子(0.65 mg/mL、65 kDa、稀釋 50 萬倍、20 pM、117.2 pM/min);第 6 章的抑制劑與 Ki;第 7 章 helix J、側鏈與陽離子的畫法。模擬的數據不是任何實驗的實測結果,不能拿來估計真實酵素的參數。

#### 技術

單一 HTML 檔(enzyme-kinetics/index.html),2D canvas 動畫,用生化原理與生化進階共用的 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖)、`assets/bio-lesson.css`(版面),不需要建置、沒有外部依賴。計算(擬合、模擬、時間曲線)在瀏覽器裡做,第 5 章 200 次重做的擬合在設定改變時才重算。數學集中在 module 裡 `// BEGIN-MATH` 到 `// END-MATH` 之間,可以抽出來用 node 驗算。入口卡片圖 `assets/enzyme-kinetics.svg`。程式分區、每章的時間點與修改方式見 enzyme-kinetics/MAINTENANCE.md。

#### 來源連結

- Johnson KA, Goody RS. The original Michaelis constant: translation of the 1913 Michaelis–Menten paper. Biochemistry. 2011;50(39):8264–8269:https://pmc.ncbi.nlm.nih.gov/articles/PMC3381512/
- Jakubowski H, Flatt P. Fundamentals of Biochemistry(LibreTexts)6.3 Kinetics with Enzymes:https://bio.libretexts.org/Bookshelves/Biochemistry/Fundamentals_of_Biochemistry_(Jakubowski_and_Flatt)/01%3A_Unit_I-_Structure_and_Catalysis/06%3A_Enzyme_Activity/6.03%3A_Kinetics_with_Enzymes ;6.4 Enzyme Inhibition:https://bio.libretexts.org/Bookshelves/Biochemistry/Fundamentals_of_Biochemistry_(Jakubowski_and_Flatt)/01%3A_Unit_I-_Structure_and_Catalysis/06%3A_Enzyme_Activity/6.04%3A_Enzyme_Inhibition
- GraphPad Prism Curve Fitting Guide, Avoid Scatchard, Lineweaver-Burk and similar transforms:https://www.graphpad.com/guides/prism/latest/curve-fitting/avoidscatchard_lineweaver_burkeandsimilartransforms.htm
- Roach CR, et al. Plasticity and evolution of (+)-3-carene synthase and (−)-sabinene synthase functions of a Sitka spruce monoterpene synthase gene family associated with weevil resistance. J Biol Chem. 2014;289(34):23859–23869:https://pmc.ncbi.nlm.nih.gov/articles/PMC4156071/ (方法、表 1、表 3、同源模型與討論)
- Vardakou M, et al. Comparative analysis and validation of the malachite green assay for the high throughput biochemical characterization of terpene synthases. MethodsX. 2014;1:187–196:https://pmc.ncbi.nlm.nih.gov/articles/PMC4472957/
- O'Maille PE, et al. A single-vial analytical and quantitative gas chromatography-mass spectrometry assay for terpene synthases. Anal Biochem. 2004;335(2):210–217:https://doi.org/10.1016/j.ab.2004.09.011 (摘要)
- Srividya N, et al. Functional analysis of (4S)-limonene synthase mutants reveals determinants of catalytic outcome in a model monoterpene synthase. Proc Natl Acad Sci USA. 2015;112(11):3332–3337:https://pmc.ncbi.nlm.nih.gov/articles/PMC4371936/
- Bar-Even A, et al. The moderately efficient enzyme: evolutionary and physicochemical trends shaping enzyme parameters. Biochemistry. 2011;50(21):4402–4410:https://doi.org/10.1021/bi2002289 (摘要);BioNumbers 111411、111412、111415:https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111415

未確認:Berg、Tymoczko、Stryer《Biochemistry》第 5 版 8.4 節(NCBI Bookshelf)這次被網站的驗證頁擋住,沒有讀到內文,改用 LibreTexts 的教科書;Christianson 2017(PMC5599884)讀到的部分沒有萜類環化酶的 kcat 範圍,沒有引用;Bar-Even 2011 與 O'Maille 2004 只核對到摘要(Bar-Even 另有 BioNumbers 引用的內文數值)。

### 族群遺傳與產地鑑定(`population-genetics/`)

網頁:https://tung-beauregard.github.io/instrument-principles/population-genetics/

從一棵棵樹的 SSR 基因型算到族群層次:等位基因頻率與期望異質度、哈溫平衡與近親係數 F、Ho 比 He 少的三種原因(近親、混群、無效等位基因)、Fst 與基因流(島嶼模型)、STRUCTURE 分群與 Evanno 的 ΔK,最後用指派檢定(Rannala 與 Mountain 的貝氏基因型機率)與排除檢定(模擬個體)推回查獲木材的產區,並以紅檜 4 區與桃花心木的研究說明產地鑑定的限制。生化進階分區的動畫教材,基礎是「DNA 鑑定」(`dna-markers/`),用共用播放器 `assets/bio-lesson.js`。

- 8 章,共 132 秒:從一棵棵樹到等位基因頻率、哈溫平衡與近親係數 F、Ho 比 He 少的三種原因、Fst、基因流、STRUCTURE、指派檢定與排除檢定、產地鑑定的實務與限制
- 可以自己調:取樣棵數(5、10、30、100)、等位基因頻率 p 與近親係數 F、兩群的差異、每代移入數 Nm(0.1、1、4、10)、群數 K(2 到 5)、查獲的木材(三件)與使用的位點數(1 到 12)
- 畫面上的計算都由公式即時算出:He 與 2N/(2N − 1) 修正、95% 誤差棒、p² + Fpq、Fst = (Ht − Hs)/Ht、島嶼模型的逐代模擬、混合模型的 EM、ΔK、多位點基因型的 log₁₀ 概似值與相對分數、排除檢定的 p 值

#### 數值與示意

有出處:

- 紅檜(*Chamaecyparis formosensis*,Huang 2022):4 區 92 棵(西南 MM 20、西北 HV 25、西北 GW 23、東部 SY 24)、36 個 SSR;各區 Fis 0.132 到 0.242(Fis = 1 − Ho/He);36 個位點有 23 個偏離哈溫平衡;兩兩 Fst 0.035(HV–GW,論文視為沒有分化)到 0.074(MM–HV),Nm 3.141 到 6.832;STRUCTURE K = 1 到 5、每個 K 20 次,以 Structure Harvester 的 ΔK 選 K = 3(SY、MM 各一群,HV 與 GW 同一群);GeneClass 2.0 自我指派 81/92 = 88.0%(MM 95%、HV 88%、GW 69.6%、SY 100%),GW 有 4 棵被判到 HV、3 棵被判到 MM。論文摘要寫 88.44%,Table 6 與內文是 88.04%,頁面用 81/92。
- 計算推估:紅檜論文的 Nm 和 (1/Fst − 1) ÷ 4 一致(例如 0.074 → 3.13,論文 3.141;0.035 → 6.89,論文 6.832),差別來自 Fst 只印到小數 3 位;論文沒有寫出換算式。
- 臺灣扁柏乾燥木材 22 件 7 件驗出(Huang 2020)。
- 桃花心木(Degen 2013):31 個林分、1,971 棵、6 個核 SSR,遺傳距離與地理距離 r = 0.82,兩批木材都指派回正確國家。
- 每族群 25 到 30 個就能把頻率估準(Hale 2012);約 10 個位點、每區 30 到 50 個、Fst 約 0.1 時貝氏指派可接近全對(Cornuet 1999 的摘要);GeneClass2 預設 1,000 個模擬個體、α = 0.01;用 ΔK 的研究 54% 選出 K = 2(Janes 2017 的摘要)。
- 公式:p² + Fpq、2pq(1 − F)、F = 1 − Ho/He、部分自交平衡 F = s/(2 − s)、Wahlund 效應、Fst = (Ht − Hs)/Ht、樣本 He 乘 n/(n − 1)(Holsinger 講義);島嶼模型 Fst ≈ 1/(4Nm + 1)(Holsinger 與 Weir 2009),它的假設很少成立(Whitlock 與 McCauley 1999);ΔK = |L(K+1) − 2L(K) + L(K−1)| ÷ sd(L(K))(Evanno 2005,算法照 Structure Harvester 的程式);基因型機率 (n_h + 1/k)(n_h + 1 + 1/k)/((n + 2)(n + 1)) 與 2(n_h + 1/k)(n_g + 1/k)/((n + 2)(n + 1))(Rannala 與 Mountain 1997 式 9)。

示意(頁面「資料來源」最後一條也有寫):

- 五個產區(A 到 E,E 沒有取樣)的頻率由 Balding–Nichols 模型與固定種子產生,參考樣本每區 25 棵,D 區另有一棵從 A 移入、一棵 A × D 混血;樣本算出的兩兩 Fst:B–C 0.035(刻意最像),其他 0.060 到 0.126。三件木材分別來自 A、C、E。
- 第 3 章的自交比例 1/3、A 與 D 各半混合、無效等位基因頻率 0.15 與 0.25(期望值,沒有取樣誤差)。
- 第 4 章兩群在一個位點的頻率;第 5 章 8 個族群、每個 25 棵、40 個位點、起始 Fst 0.3 的島嶼模擬(第 100 到 150 代平均 Fst 對 1/(4Nm + 1):0.707 對 0.714、0.183 對 0.200、0.060 對 0.059、0.027 對 0.024)。
- 第 6 章每個 K 的 ln P(D)(10 次,示意);長條是用 EM 求混合模型最大概似算出的,不是 STRUCTURE 的 MCMC。示意資料的 ΔK:K = 2 為 52.4、K = 3 為 95.8、K = 4 為 0.6、K = 5 為 0.3。
- 指派結果(12 個位點):木材 1 指向 A(100%,p = 0.434,其他三區 p < 0.001);木材 2 是 C 85.2%、B 14.8%,兩區都不能排除;木材 3 的分數 A 100% 卻 p = 0.003,四區都被排除(只用 8 個位點時 A 的 p = 0.128,排除不了)。

教學示意:族群、頻率、基因型、木材與模擬都是示意,不是任何實驗的資料,不可用於實樣鑑定。

#### 技術

單一 HTML 檔(population-genetics/index.html),共用 `assets/bio-lesson.js`、`assets/bio-draw.js`、`assets/bio-lesson.css`,不需要建置、沒有外部依賴,不使用到站人數計數。示意資料在瀏覽器裡用固定種子產生;比較慢的計算(各 K 的 EM 約 0.1 秒、排除檢定的模擬、島嶼模擬)在頁面載入後閒置時分批先算,結果有快取。入口卡片圖 `assets/population-genetics.svg`。程式分區、每章的時間點、驗算值與修改方式見 population-genetics/MAINTENANCE.md。

#### 來源連結

- Huang CJ, et al. 2022, Sci Rep 12:4126(紅檜):https://pmc.ncbi.nlm.nih.gov/articles/PMC8904461/
- Huang CJ, et al. 2020, Sci Rep 10:22095(臺灣扁柏):https://pmc.ncbi.nlm.nih.gov/articles/PMC7744516/
- Holsinger KE, Weir BS 2009, Nat Rev Genet 10:639–650:https://pmc.ncbi.nlm.nih.gov/articles/PMC4687486/
- Holsinger KE, EEB 5348 Population Genetics 講義(CC BY 4.0):https://darwin.eeb.uconn.edu/eeb348-notes/inbreeding.pdf 、https://darwin.eeb.uconn.edu/eeb348-notes/genetic-structure.pdf
- Weir BS, Cockerham CC 1984, Evolution 38:1358–1370:https://doi.org/10.1111/j.1558-5646.1984.tb05657.x
- Whitlock MC, McCauley DE 1999, Heredity 82:117–125(FST ≠ 1/(4Nm+1))
- Rousset F 1997, Genetics 145:1219–1228(距離隔離):https://pmc.ncbi.nlm.nih.gov/articles/PMC1207888/
- Pritchard JK, et al. 2000, Genetics 155:945–959:https://pmc.ncbi.nlm.nih.gov/articles/PMC1461096/
- STRUCTURE 2.3 說明文件:https://web.stanford.edu/group/pritchardlab/structure_software/release_versions/v2.3.4/structure_doc.pdf
- Evanno G, et al. 2005, Mol Ecol 14:2611–2620:https://doi.org/10.1111/j.1365-294X.2005.02553.x (全文沒有讀到)
- Structure Harvester(Earl DA, vonHoldt BM 2012, Conserv Genet Resour 4:359–361)的程式:https://github.com/dentearl/structureHarvester
- Janes JK, et al. 2017, Mol Ecol 26:3594–3602:https://doi.org/10.1111/mec.14187
- Rannala B, Mountain JL 1997, PNAS 94:9197–9201:https://pmc.ncbi.nlm.nih.gov/articles/PMC23111/
- Cornuet JM, et al. 1999, Genetics 153:1989–2000(摘要)
- GeneClass2(Piry S, et al. 2004, J Hered 95:536–539)說明文件:https://www1.montpellier.inrae.fr/CBGP/software/GeneClass/GeneClass2/Help.pdf
- Chapuis MP, Estoup A 2007, Mol Biol Evol 24:621–631:https://academic.oup.com/mbe/article/24/3/621/1246960
- Van Oosterhout C, et al. 2006, Mol Ecol Notes 6:255–256:https://assets.uea.ac.uk/f/185167/x/3d0a8c7abd/van-oosterhout-et-al-2006-men.pdf
- Hale ML, et al. 2012, PLoS ONE 7:e45170:https://pmc.ncbi.nlm.nih.gov/articles/PMC3440332/
- Degen B, et al. 2013, Forensic Sci Int Genet 7:55–62:https://doi.org/10.1016/j.fsigen.2012.06.003 (摘要)
- Dormontt EE, et al. 2015, Biol Conserv 191:790–798:https://doi.org/10.1016/j.biocon.2015.06.038 (摘要)

未確認:Paetkau D, et al. 1995(Mol Ecol 4:347–354)與 Manel S, et al. 2005(Trends Ecol Evol 20:136–142)的全文沒有讀到,頁面沒有拿來當依據。

### 演化樹:從序列推親緣關係(`phylogenetics/`)

網頁:https://tung-beauregard.github.io/instrument-principles/phylogenetics/

怎麼從序列推出演化樹,以及怎麼判斷樹可不可信:多序列比對(同源、空格、保守位置,附真的萜類合成酶 DDxxD)、p 距離與 Jukes–Cantor 校正、UPGMA 與鄰接法(Q 矩陣一步一步算)、簡約法與概似法、怎麼讀樹(無根與有根、外群、分支、枝長單位、轉動節點、中點定根)、bootstrap(抽出放回、70% 與 95% 的解讀、方法錯時錯的分支也會高支持),最後用萜類合成酶家族收尾:TPS-a 到 TPS-h 七群、裸子植物的 TPS-d 再分 d1、d2、d3,柏科同一群的酵素產物各不相同,功能要靠實驗。生化進階分區的教材,8 章、約 2 分 16 秒,用共用播放器 `assets/bio-lesson.js`。先看 `sequencing/` 與 `terpene-synthase/`。

- 第 1 章:模擬的祖先序列複製成 6 條後代,突變加框;C 少 3 個鹼基,比對時補空格;6 條都一樣的保守欄;下方是 6 個真的萜類合成酶在 DDxxD 附近的 13 個胺基酸;有空格的欄整欄拿掉(50 → 47 欄)
- 第 2 章:A 對 B、E 對 O 哪幾欄不同與 p;距離矩陣;p 對 d 的圖(d = p 與 JC 曲線、0.75 飽和);同一位置換兩次看不出來
- 第 3 章:UPGMA 一步一步合併(矩陣與長出來的樹),結果 C、D 被併在一起、E 被放到最外面,和模擬時用的樹比對;可切換鄰接法
- 第 4 章:鄰接法第一步的 r、Q 矩陣與算式,D、E 的距離不是最小卻 Q 最小;枝長 δ 與新距離的算法;後面幾步與整棵無根樹
- 第 5 章:A、B、D、E 的 3 種無根樹,逐欄的最少改變次數(簡約)與 JC 下的 ln L(概似);(2n − 5)!! 的表
- 第 6 章:無根樹與外群定根的有根樹;分支(clade);比例尺;轉動節點;中點定根在速率不等時放錯;常見誤讀
- 第 7 章:第 1 次重抽每欄被抽到幾次;重抽次數跑到 10、100 或 1000,支持度跟著變;50%、70%、95% 的刻度
- 第 8 章:7 群的示意圖與 d1、d2、d3;柏科單萜合成酶的兩個群,照最像的已知酵素猜產物與實驗結果
- 控制項:距離(p、JC)、建樹方法(第 3 章)、定根方式與轉動節點(第 6 章)、重抽次數、建樹方法與「拿掉支持 D+E 的 3 欄」(第 7 章)、新基因的產物(猜的或實驗結果)
- 文字以看過基礎教材的大學部高年級與研究生為準;公式寫出來,符號第一次出現時說明

#### 數值與示意

公式:

- p 距離 = 不同的欄 ÷ 比較的欄;Jukes–Cantor d = −(3/4)·ln(1 − 4p/3),由 p = (3/4)(1 − e^(−4d/3)) 反推,d 是每個位置的替換數,p → 0.75 時 d → ∞(Jukes 與 Cantor 1969 原書未讀;在模型下模擬 20 萬個位置,d = 0.1、0.5、1 校正回 0.1007、0.4990、0.9997)。
- UPGMA:合併最近的兩群,高度 = 距離 ÷ 2,新距離依兩群大小加權平均(維基百科 UPGMA 條目;例子的高度 8.5、11、14、16.5 驗算相同)。
- 鄰接法:Q(i,j) = (n − 2)·d(i,j) − r(i) − r(j);δ(f,u) = d(f,g)/2 + (r(f) − r(g)) / (2(n − 2));d(u,k) = (d(f,k) + d(g,k) − d(f,g)) / 2(Saitou 與 Nei 1987;Q 的寫法是 Studier 與 Keppler 1988,依 Gascuel 與 Steel 2006 的整理;維基百科的例子 Q = −50…、枝長 2 與 3 驗算相同)。
- 簡約用 Fitch 的交集與聯集(和窮舉內部節點狀態的結果逐欄相同);概似用 JC、鹼基頻率各 1/4,對內部節點狀態加總,5 條枝長一起最大化(和逐欄窮舉相同,最佳值附近每條枝 ±2% 都不會更大)。
- Bootstrap:欄位抽出放回重抽一樣多次、重新建樹,支持度 = 出現次數 ÷ 重抽次數(Felsenstein 1985)。無根二分樹的數目 (2n − 5)!!(逐步加入法列舉 4 到 8 條驗算)。

示意(頁面「資料來源」最後一條也有寫):

- 6 條 DNA(A、B、C、D、E 與外群 O,50 欄)是在樹 ((A:0.06,B:0.08):0.10,(C:0.07,(D:0.05,E:0.35):0.08):0.06,O:0.30) 上用 JC 模型模擬的(亂數種子 321,做法寫在 `phylogenetics/MAINTENANCE.md`),E 演化最快;C 在第 21 到 23 欄的空格也是設定的。距離取到小數第 2 位後建樹。
- 由這組資料算出:A 對 B 4/47(p 0.085、d 0.090),E 對 O 24/47(p 0.511、d 0.857);UPGMA 依序合併 A+B(0.09)、C+D(0.14)、AB+CD(0.33)、O(0.43)、E(0.5625),錯;鄰接法第一步 r(E) = 2.81 最大,Q(D,E) = −3.08 < Q(A,B) = −3.02 < Q(C,D) = −2.83,δ(D) = 0.0625、δ(E) = 0.3175,得到正確的樹;簡約 27、32、33 次;ln L = −167.212、−174.214、−174.439(差 7.0,約 1,099 倍);bootstrap(種子 7、1000 次)鄰接法 A+B 85%、D+E 73%、C+D+E 72%,UPGMA 的錯分支 C+D 95%,拿掉只有 D、E 相同的 3 欄(第 2、33、35 欄)後鄰接法改成 C+D 86%、D+E 剩 4%;中點定根落在 (D,E) 與其他之間,外群 O 跑進群內。
- 第 6 章根放在外群枝的中間、第 8 章 7 群從同一點分出與群內順序都是示意;「照最像的已知酵素猜」是頁面的示範(第 1 群猜紅檜的 α-pinene,TcTPS14 照最佳 BLAST 結果日本扁柏 terpinolene 合成酶猜 terpinolene,TcTPS17 的最佳結果是臺灣杉一支已知的萜類合成酶 GenBank AIO10963,第 2 群裡已知的臺灣杉酵素都做 terpinolene,所以也猜 terpinolene)。

查來的:

- DDxxD 附近的胺基酸(NCBI 蛋白質):臺灣杉 TcTPS13(QHZ00920.1,第一個 D 在第 380 個)、TcTPS15(QHZ00922.1,362)、TcTPS16(QHZ00923.1,369)、紅檜 α-pinene 合成酶(ABW80964.1,381)、大冷杉 pinene 合成酶(UniProt O24475,379)、綠薄荷 limonene 合成酶(Q40322,352);畫面取 D 前後各 4 個。TcTPS14(QHZ00921.1)在同一位置是 ADTYH,頁面沒有放。
- Bootstrap 的解讀:Felsenstein 1985 以 95% 以上為顯著,並指出用的方法本身不一致(例如依整體相似度分群而各支速率差很多)時 bootstrap 不能補救;Hillis 與 Bull 1993 的模擬(等速、對稱的樹、節點之間改變不超過 20% 的欄)裡 70% 以上多半對應 95% 以上的機率是真的,速率很不相等時 50% 以上會高估;Baldauf 2003 寫 70% 以上多半可靠、慣例上只標 50% 以上;EMBL-EBI 的課程寫一般接受 80%(或 90%)以上,前提是用了合適的模型,而且解讀仍有爭議。
- TPS 家族:Chen 等 2011 一般分 7 群(摘要);各群內容照 Karunanithi 與 Zerbe 2019、Jiang 等 2019(後者在鳳梨與地錢也找到 TPS-d);Martin 等 2004 TPS-d1 主要是單萜、d2 倍半萜、d3 雙萜,針葉樹的單萜合成酶都在 d1;Bohlmann 等 1998 序列能歸群、不能判定功能,唇形科與大冷杉的 limonene 合成酶只有 30 到 35% 相同。
- 柏科的例子:Ma 等 2021 以 MUSCLE 比對、MEGA X 鄰接法與 100 次 bootstrap 建樹,TcTPS13、15、16 和紅檜 α-pinene 合成酶一群,TcTPS14、17 和日本扁柏 terpinolene 合成酶及臺灣杉的 terpinolene/α-pinene 合成酶一群;產物 TcTPS13、14 geraniol,15 linalool,16 β-pinene,17 測不到;作者寫單萜的功能不跟著親緣。

教學示意:模擬資料只有 47 欄,用來示範演算法與 bootstrap 的意義;頁面全部用 JC 距離,沒有講速率變異(Γ)、搜尋法與貝氏法;不可用於實際資料的分析或判讀。

#### 技術

單一 HTML 檔(phylogenetics/index.html),共用 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖)、`assets/bio-lesson.css`,不需要建置、沒有外部依賴,不使用到站人數計數。距離、UPGMA、鄰接法、Fitch 在載入時算;最大概似在第一次畫第 5 章時算;bootstrap 每種組合第一次用到時算 1000 次後快取(桌機 Chrome 量到:第一次畫第 5 章約 60 毫秒,第 7 章每種組合 16 到 37 毫秒,之後每一格不到 1 毫秒)。計算都在 module 開頭 `// ==== 計算 ====` 那一段,可以抽出來用 node 驗算。入口卡片圖 `assets/phylogenetics.svg`。程式分區、每章的時間點與修改方式見 phylogenetics/MAINTENANCE.md。

#### 來源連結

- Saitou N, Nei M. 1987, Mol Biol Evol 4(4):406–425(摘要):https://doi.org/10.1093/oxfordjournals.molbev.a040454
- Studier JA, Keppler KJ. 1988, Mol Biol Evol 5(6):729–731(原文未讀):https://doi.org/10.1093/oxfordjournals.molbev.a040527 ;Gascuel O, Steel M. 2006, Mol Biol Evol 23(11):1997–2000:https://academic.oup.com/mbe/article/23/11/1997/1333126
- Felsenstein J. 1985, Evolution 39(4):783–791:https://doi.org/10.1111/j.1558-5646.1985.tb00420.x
- Hillis DM, Bull JJ. 1993, Syst Biol 42(2):182–192(摘要):https://doi.org/10.1093/sysbio/42.2.182
- Baldauf SL. 2003, Trends Genet 19(6):345–351:https://doi.org/10.1016/S0168-9525(03)00112-4
- Felsenstein J. 1981, J Mol Evol 17(6):368–376(摘要):https://doi.org/10.1007/BF01734359
- EMBL-EBI, Introduction to phylogenetics:https://www.ebi.ac.uk/training/online/courses/introduction-to-phylogenetics/
- Kummer TA, et al. 2016, J Microbiol Biol Educ 17(3):389–398:https://pmc.ncbi.nlm.nih.gov/articles/PMC5134942/
- Chen F, et al. 2011, Plant J 66(1):212–229(摘要):https://doi.org/10.1111/j.1365-313X.2011.04520.x
- Karunanithi PS, Zerbe P. 2019, Front Plant Sci 10:1166:https://doi.org/10.3389/fpls.2019.01166 ;Jiang SY, et al. 2019, Genome Biol Evol 11(8):2078–2098:https://pmc.ncbi.nlm.nih.gov/articles/PMC6681836/
- Bohlmann J, et al. 1998, PNAS 95(8):4126–4133:https://pmc.ncbi.nlm.nih.gov/articles/PMC22453/
- Martin DM, et al. 2004, Plant Physiol 135(4):1908–1927:https://pmc.ncbi.nlm.nih.gov/articles/PMC520763/
- Ma LT, et al. 2021, Plants 10(11):2404:https://pmc.ncbi.nlm.nih.gov/articles/PMC8625326/
- NCBI 蛋白質序列:QHZ00920.1、QHZ00921.1、QHZ00922.1、QHZ00923.1(https://www.ncbi.nlm.nih.gov/protein/QHZ00923.1 ,其餘同一格式)、ABW80964.1、AIO10963.1、BAI53108.1;UniProt O24475(https://www.uniprot.org/uniprotkb/O24475 )、Q40322
- 公式核對:維基百科 Neighbor joining(https://en.wikipedia.org/wiki/Neighbor_joining )與 UPGMA(https://en.wikipedia.org/wiki/UPGMA )條目的例子

未確認:Studier 與 Keppler 1988、Sokal 與 Michener 1958、Jukes 與 Cantor 1969 的原文,以及 Chen 2011 的全文(出版社擋自動讀取)都沒有讀到;Ma 2021 的圖 2(樹的圖)本身沒有讀到,柏科兩群只依文字描述,群內順序沒有畫。

### 在植物裡驗證基因功能(`gene-function/`)

網頁:https://tung-beauregard.github.io/instrument-principles/gene-function/

生化進階分區的教材,接在 `cloning/`(在大腸桿菌裡做出酵素)、`terpene-synthase/` 與 `crispr/` 後面。主題是「大腸桿菌裡做得出產物,不代表植物裡真的這樣用」:純化的酵素加上受質,測到的是它能做什麼;植物細胞還有胞器位置、前驅物供應與其他酵素的搭配。7 章、115 秒,每章有字幕,第 1、3、4、5、6 章可以自己調。

- 第 1 章:試管裡測到的產物對上植物細胞的兩個區(質體的 MEP 途徑供 GPP 與 GGPP、細胞質的 MVA 途徑供 FPP);酵素移進選到的那一區,遇到的受質與做出的產物跟著換
- 第 2 章:農桿菌的 Ti 質體與雙元載體、25 個鹼基對的邊界、傷口汁液與乙醯丁香酮打開 vir、針筒把菌液推進葉背、T-DNA 進細胞核後不嵌進染色體也會表現幾天;下方是 T-DNA 的線性圖(左邊界、35S 啟動子、要表現的基因、終止子、右邊界)
- 第 3 章:DCL4 與 DCL2 把轉殖基因的雙股 RNA 切成 21 到 22 個核苷酸的 siRNA、AGO 切掉 mRNA、p19 二聚體夾住 siRNA;右邊是表現量對天數的對數曲線,可以改天數與要不要打 p19,讀出兩條曲線的倍數
- 第 4 章:3 到 5 天後用固相微萃取吸頂空或葉片浸己烷,GC-MS 的三條訊號(打酵素的葉片、只打空載體的葉片、標準品);可以切換要不要一起打上游的 DXS 與 GGPPS
- 第 5 章:接上 GFP 的融合蛋白、共軛焦的綠色通道與葉綠素自發螢光的紅色通道與疊圖;切掉轉運胜肽後綠色訊號改落在葉綠體之間;下方是示意的轉運胜肽序列與算出來的組成
- 第 6 章:TRV1 與 TRV2 的分工、目標片段滑進 TRV2、新長出來的葉子被沉默;三種目標(空載體、PDS、萜類合成酶)的葉色、兩條轉錄本與產物峰
- 第 7 章:進入生殖期的年數長條圖(柳、楊樹、赤松、歐洲雲杉、橡),加上楊樹是模式樹、針葉樹難轉殖、替代做法三張卡
- 控制項:前端的轉運胜肽(有、沒有)、一起打 p19(打、不打)、浸潤後第幾天(1 到 12)、上游酵素(不打、DXS + GGPPS)、VIGS 的目標(空載體、PDS、萜類合成酶)
- 讀者是做森林化學與植物天然物的大學部高年級與研究生,假設已經看過上面三份基礎教材

#### 數值與示意

區室與前驅物:

- 質體的 MEP 途徑一般供應半萜、單萜與雙萜的受質,細胞質的 MVA 途徑供應倍半萜,兩區之間有 IPP 交換(Pazouki 與 Niinemets 2016,摘要與引言)。單萜與雙萜合成酶在質體、倍半萜合成酶在細胞質;單萜與雙萜合成酶嚴格只用 GPP 或 GGPP,有幾支倍半萜合成酶在試管裡能用 GPP 做出 limonene,但在細胞質遇不到質體做的 GPP(Bohlmann 等 1998)。
- 第 1 章與第 5 章的實例:金魚草的 AmNES/LIS-1 與 AmNES/LIS-2 胺基酸序列 95% 相同,前者在細胞質做 nerolidol、後者在質體做 linalool,次細胞定位加上受質可得性決定產物(Nagegowda 等 2008,摘要)。
- 轉運胜肽:單萜合成酶約 600 到 650 個胺基酸,比倍半萜合成酶長 50 到 70 個,主要就是 N 端那一段;各條序列彼此不像,共同點是絲胺酸與蘇胺酸偏多、酸性殘基偏少;高度保守的連續兩個精胺酸大約界定成熟蛋白的 N 端(Bohlmann 等 1998)。冷杉三支單萜合成酶的 N 端 60 到 70 個胺基酸,絲胺酸占 11 到 22%、Asp 加 Glu 只有 2 到 4 個(Bohlmann 等 1997)。
- 轉運胜肽同源性低、不易預測,有這一段不等於一定進質體,最後要靠免疫標記或螢光融合蛋白確認(Pazouki 與 Niinemets 2016)。AmNES/LIS-2 就是例子:五個預測程式有三個把它判在細胞質。

農桿菌:

- T-DNA 兩端是 25 個鹼基對的不完全重複邊界序列;vir 區至少七個主要基因座;雙元載體把 T-DNA 放在廣宿主範圍的複製子上、vir 基因留在卸掉致病性的 Ti 質體;傷口汁液 pH 5.0 到 5.8;最有效的 vir 誘導物是單環酚類(以乙醯丁香酮為例),經 VirA 與 VirG 雙組分系統調控;暫時表現不需要 T-DNA 嵌入,表現通常持續幾天(Hwang 等 2017)。
- 操作條件(頁面只提到針筒與葉背,細節在 MAINTENANCE.md):菌液 OD600 1.0,MMA 為 10 mM MES pH 5.6、10 mM MgCl₂ 加乙醯丁香酮(測 0 到 600 μM、最佳 500 μM);6 到 8 週大植株最上面三片葉、從葉背用鈍頭針筒注入(Norkunas 等 2018)。

基因沉默與 p19:

- 農桿菌浸潤的表現必然被轉錄後基因沉默壓下來,伴隨轉殖基因來源的 siRNA 累積;沒有 P19 時螢光從第 4 天起下降、第 10 天幾乎看不到;P19 形成二聚體夾鉗,結合 DCL4 與 DCL2 產生的 21 到 22 個核苷酸 siRNA,擋住裝進 AGO1 與 AGO2;一起表現時第 4、7、10 天螢光約高一個數量級、mRNA 最多高約一千倍,整個第 4 到 10 天都維持(Jay 等 2023)。
- p19 結合 21 到 25 個核苷酸、3′ 端突出 2 個核苷酸的雙股 RNA,幾乎不結合單股、長雙股或平整末端的雙股,以隔離這些雙股來抑制沉默(Silhavy 等 2002)。
- **第 3 章的曲線是示意的模型**,公式是 `F(d) = (1 − exp(−d/1.4)) × 10^(−K·a(d))`、`a(d) = 1/(1 + exp(−(d − d½)/w))`,不打 p19 是 K 1.6、d½ 2.6、w 1.0,一起打是 K 0.9、d½ 7.0、w 2.0。這組參數只校準到上面兩個對照點,用 node 驗算出第 4、7、10 天的倍數分別是 13.2、13.5、7.3(約一個數量級),不打 p19 的最高點在第 1.1 天、有 p19 在第 2.9 天。不是任何一次實驗的實測曲線。

暫時表現看產物:

- 只打空 T-DNA 載體的葉片測不到產物;浸潤後 3 天開始累積、第 5 天最高;葉片浸己烷 2 分鐘後 GC-MS;一起打 DXS2 與 GGPPS2 使 cembratrien-ol 增加 3.5 倍(Brückner 與 Tissier 2013,用的是銀杏、蓖麻與菸草的三支合成酶)。
- 歐洲雲杉的 isopimara-7,15-diene 合成酶與西加雲杉的 CYP720B4 在菸草表現,只打 p19 的對照葉片沒有背景;第 4 天採收;isopimaric acid 45 到 55 μg/g 乾重;一起打 DXS 與 GGPPs 各增加 3 倍(Gnanasekaran 等 2015)。
- 在大腸桿菌或酵母裡表現植物酵素常卡在溶解度與功能;植物宿主同時有 MVA 與 MEP 兩條途徑,胞器導向訊號的加工在植物間高度保守(Brückner 與 Tissier 2013)。
- 第 4 章的峰面積基準 100 是示意,乘上 3.5 用的是上面的實測倍數;峰形與滯留時間是示意。

VIGS:

- TRV 是雙分體正股 RNA 病毒;TRV2 經改造帶一段目標基因片段,和 TRV1 一起用農桿菌接種到 3 週大的葉片;沉默出現在新長出來、沒有被接種的葉子,約 2 到 3 週(Senthil-Kumar 與 Mysore 2014,摘要)。插入片段 200 到 1000 bp;光漂白最快在浸潤後 1.5 週出現(Velásquez 等 2009)。一般認為 VIGS 持續約 3 週(Senthil-Kumar 與 Mysore 2011)。
- 沉默 PDS 打斷類胡蘿蔔素生合成,葉綠素被光氧化分解而出現明顯的光漂白,所以 PDS 被廣泛當成 VIGS 的報導基因(Zhang 等 2025)。
- 實測的沉默程度:接 400 個核苷酸的反義片段、對照是帶 GFP 反義片段的載體,第 15 天用即時定量 PCR 量到葉片的轉錄本只剩 23%、12%、9% 與 11%,莖 26% 到 17%、根 31% 到 6%;PDS 沉默的葉片第 7 天開始漂白、第 14 天明顯(Atsumi 等 2018)。
- 第 6 章的 12% 與 15% 是示意值,落在上面量到的 9% 到 31% 之間;**產物與轉錄本成正比也是示意**,實際上酵素量與代謝流的關係常常不是線性的。PDS 那一欄刻意讓萜類合成酶與產物都維持 100%,表達「它只證明這一批 VIGS 有效,不影響萜類」。

樹木:

- 歐洲雲杉的營養生長期 20 到 25 年、赤松 8 到 20 年;多數針葉樹經過 15 到 25 年幼年期才進入生殖期(Uddenberg 等 2013)。柳約 1 年、楊樹約 6 年、橡約 60 年開花(Taylor 2002)。
- 楊樹基因體 450 到 550 Mbp、可用營養繁殖、溫帶樹中生長最快、容易轉殖(Taylor 2002);第一個完成定序的樹是黑楊,基因體 4.8 億個核苷酸(美國能源部聯合基因體研究所 2006 年 9 月 14 日發布;Tuskan 等 2006 的摘要本身沒有自稱「第一個樹木基因體」)。
- 針葉樹的離體營養繁殖困難,體胚發生是轉殖研究的必要工具(Salaj 等 2019);松科的癒傷組織誘導困難、體胚發生頻率低(Wang 等 2025)。沒有來源說體胚發生是「唯一」途徑,頁面寫「主要靠」。
- 馬尾松至今無法基因轉殖,所以把 PmGPPS1 的功能改在本氏菸草裡驗(Liu 等 2022),這正是本教材的主線。
- 替代做法:Ri 質體的 T-DNA 嵌進植物基因體後誘出毛狀根,在無激素培養基上生長,基因型與表現型穩定、能長期生產次級代謝物(Gutierrez-Valdes 等 2020);世代長的作物在功能性基因體研究上卡住,毛狀根可以在做穩定轉殖株那段漫長流程之前先測基因表現與功能(Ron 等 2014);PEG 介導的原生質體轉染最常用,適合做次細胞定位與啟動子活性(Shao 等 2023)。

教學示意:第 5 章的 64 個胺基酸轉運胜肽序列是自己編的,組成(絲胺酸 17%、酸性殘基 2 個、結尾連續兩個精胺酸)是程式從畫面上那條序列數出來的,刻意落在冷杉三支酵素的實測範圍內;全長 620 個胺基酸、共軛焦畫面、葉綠體的位置與數目都是示意。第 2 章 T-DNA 線性圖上五段的長度比例是為了看清楚訂的,不是實際的鹼基對數。農桿菌、質體、針筒、葉片、細胞、胞器、植株與毛狀根的樣子都是示意。本頁不能拿來當實驗條件或判讀依據。

**刻意不引用**:Voinnet 等 2003(Plant J 33:949–956,p19 增強暫時表現的經典論文)已於 2015 年撤稿(Plant J. 2015;84(4):846,doi:10.1111/tpj.13066;先前另有 2015;83(4):752 的更正),撤稿原因是影像重複,公告沒有聲明結論仍然成立。本頁的 p19 機制改引 Silhavy 等 2002、量化增益改引 Jay 等 2023(同一位通訊作者在撤稿之後重做的公開取用再驗證)。頁面「資料來源」最後一條把這件事寫出來,日後維護不要把它加回去。

#### 技術

單一 HTML 檔(gene-function/index.html),2D canvas 動畫,用生化原理分區共用的 `assets/bio-lesson.js`(播放器)、`assets/bio-draw.js`(畫圖工具)與 `assets/bio-lesson.css`(版面),不需要建置,沒有外部依賴,不使用到站人數計數。共用工具沒有的畫法(葉片、環狀質體、農桿菌、葉綠體、針筒、長條、層析訊號)寫成本頁自己的小函式。入口卡片圖 `assets/gene-function.svg`。程式分區、每章的時間點、計算模型與修改方式見 gene-function/MAINTENANCE.md。

#### 來源連結

- Hwang HH, et al. Agrobacterium-mediated plant transformation: biology and applications. Arabidopsis Book. 2017;15:e0186:https://pmc.ncbi.nlm.nih.gov/articles/PMC6501860/
- Norkunas K, et al. Improving agroinfiltration-based transient gene expression in *Nicotiana benthamiana*. Plant Methods. 2018;14:71:https://pmc.ncbi.nlm.nih.gov/articles/PMC6109318/
- Jay F, et al. A contemporary reassessment of the enhanced transient expression system based on the tombusviral silencing suppressor protein P19. Plant J. 2023;113(1):186–204:https://pmc.ncbi.nlm.nih.gov/articles/PMC10107623/
- Silhavy D, et al. A viral protein suppresses RNA silencing and binds silencing-generated, 21- to 25-nucleotide double-stranded RNAs. EMBO J. 2002;21(12):3070–3080:https://pmc.ncbi.nlm.nih.gov/articles/PMC125389/
- Brückner K, Tissier A. High-level diterpene production by transient expression in *Nicotiana benthamiana*. Plant Methods. 2013;9:46:https://pmc.ncbi.nlm.nih.gov/articles/PMC3878842/
- Gnanasekaran T, et al. Heterologous expression of the isopimaric acid pathway in *Nicotiana benthamiana*. J Biol Eng. 2015;9:24:https://pmc.ncbi.nlm.nih.gov/articles/PMC4688937/
- Nagegowda DA, et al. Two nearly identical terpene synthases catalyze the formation of nerolidol and linalool in snapdragon flowers. Plant J. 2008;55(2):224–239:https://doi.org/10.1111/j.1365-313X.2008.03496.x (需訂閱,本頁依摘要與 Europe PMC 書目紀錄)
- Bohlmann J, et al. Plant terpenoid synthases: molecular biology and phylogenetic analysis. Proc Natl Acad Sci USA. 1998;95(8):4126–4133:https://pmc.ncbi.nlm.nih.gov/articles/PMC22453/ ;Bohlmann J, et al. J Biol Chem. 1997;272(35):21784–21792:https://www.jbc.org/article/S0021-9258(19)65623-1/fulltext
- Pazouki L, Niinemets Ü. Multi-substrate terpene synthases. Front Plant Sci. 2016;7:1019:https://pmc.ncbi.nlm.nih.gov/articles/PMC4940680/
- Senthil-Kumar M, Mysore KS. Tobacco rattle virus-based virus-induced gene silencing in *Nicotiana benthamiana*. Nat Protoc. 2014;9(7):1549–1562:https://www.nature.com/articles/nprot.2014.092 (正文需訂閱,本頁只用摘要與 Springer 公開的補充檔);載體出自 Liu Y, et al. Plant J. 2002;30(4):415–429;TRV 當 VIGS 載體首見於 Ratcliff F, et al. Plant J. 2001;25(2):237–245
- Atsumi G, et al. Sci Rep. 2018;8:14804:https://pmc.ncbi.nlm.nih.gov/articles/PMC6172274/
- Zhang T, et al. Plants. 2025;14(2):150:https://pmc.ncbi.nlm.nih.gov/articles/PMC11768517/ ;Velásquez AC, et al. J Vis Exp. 2009;(28):1292:https://pmc.ncbi.nlm.nih.gov/articles/PMC2795700/ ;Kumagai MH, et al. Proc Natl Acad Sci USA. 1995;92(5):1679–1683:https://pmc.ncbi.nlm.nih.gov/articles/PMC42583/
- Uddenberg D, et al. Plant Physiol. 2013;161(2):813–823:https://pmc.ncbi.nlm.nih.gov/articles/PMC3561021/ ;Taylor G. Ann Bot. 2002;90(6):681–689:https://pmc.ncbi.nlm.nih.gov/articles/PMC4240366/ ;美國能源部聯合基因體研究所 2006-09-14:https://archive.jgi.doe.gov/?p=1035
- Liu B, et al. Tree Physiol. 2022;42(2):411–424:https://doi.org/10.1093/treephys/tpab103 ;Salaj T, et al. Front Plant Sci. 2019;10:13:https://www.frontiersin.org/articles/10.3389/fpls.2019.00013/full ;Wang Y, et al. Front Plant Sci. 2025;16:1689705:https://pmc.ncbi.nlm.nih.gov/articles/PMC12661428/
- Gutierrez-Valdes N, et al. Front Plant Sci. 2020;11:33:https://pmc.ncbi.nlm.nih.gov/articles/PMC7064051/ ;Ron M, et al. Plant Physiol. 2014;166(2):455–469:https://pmc.ncbi.nlm.nih.gov/articles/PMC4213079/ ;Shao Y, et al. Int J Mol Sci. 2023;24(4):3633:https://pmc.ncbi.nlm.nih.gov/articles/PMC9962833/

未確認:沒有找到同時報告 qPCR 轉錄量下降百分比與 GC-MS 產物下降百分比的 VIGS 萜類合成酶論文(找到的 VIGS 案例不是萜類合成酶,找到的萜類合成酶案例不是 VIGS),所以第 6 章的「轉錄本降多少產物就降多少」明確標成示意。也沒有找到同一篇裡用純單萜合成酶做「全長 GFP 進質體、去掉轉運胜肽後進細胞質」的實驗,第 5 章用的 Nagegowda 等 2008 是雙功能的 nerolidol/linalool 合成酶。Reed 與 Osbourn 2018(Plant Cell Rep 37:1431–1441,PMC6153650)是綜論,沒有當原始依據引用,但可以當第 4、5 章的補充閱讀。

## 數據畫圖(plot/)

網頁:https://tung-beauregard.github.io/instrument-principles/plot/

不是教材,是工具:把儀器匯出的檔案放進瀏覽器,畫成報告用的黑白圖,可下載 SVG(貼進 PowerPoint 後可轉換成圖案編輯)或 300 dpi 的 PNG。檔案只在瀏覽器裡處理,不上傳。

- 光譜(.spc、.asp、兩欄文字):疊圖,原檔的吸光度只加固定位移,可標峰位、可改成正規化
- DSC(PerkinElmer csv):上排只畫升溫段,下排升溫紅、降溫藍,可選要不要在溫度反轉處接在一起;左側 endo ↑ / exo ↓ 的圖例
- TGA(PerkinElmer csv 或溫度欄配重量欄的 xlsx):重量 % 與 DTG,csv 的降溫段可用藍色接在後面
- 質譜(Thermo LCQ Deca XP .RAW):選掃描種類與範圍後平均成棒狀圖,標主要峰與 NL

### 格式與算法的依據

- Galactic SPC 檔頭與 Y 陣列的編碼依 Galactic 的 SPC 檔案格式說明;只支援新格式(fversn 0x4B)與第一個子檔,以 Agilent MicroLab 匯出的檔驗證。
- Agilent .asp 與 PerkinElmer Pyris 的 csv 欄位,依實際匯出的檔案。
- LCQ Deca XP .RAW(版本 62)的版面(run header、掃描索引、峰值編碼)是從檔案逆向推得的,沒有原廠文件;讀檔後逐張用檔內索引的基峰與 TIC 核對,全部一致才算讀對。
- 質譜平均:把選定掃描的峰疊在一起,中心每 0.1 取 ±0.65 的視窗加總,除以掃描張數,局部極大為一根棒,m/z 取視窗內強度加權平均。這個做法在作者的國科會報告裡與 Xcalibur 的平均圖譜在 50 個峰標示中 49 個一致(差的一個是四捨五入),NL 全部一致。
- DTG:−dW/dT,內插到 1 °C 格點,中央差分後做前後各 8 點的移動平均;重量以第一點為 100%。
- DSC 分段:依程式溫度的升降;樣品溫度在程式溫度剛反轉時還在往原方向走,所以升溫段從樣品溫度最低點起算、降溫段從最高點起算(可關掉)。

圖上的數值都是原檔讀出來的量測值,沒有校正或平滑(DTG 的移動平均除外);工具不做鑑定或判讀。程式分區與檔案格式細節見 plot/MAINTENANCE.md。
