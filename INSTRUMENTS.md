# 儀器原理

用互動 3D 動畫說明實驗室儀器的原理。

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
