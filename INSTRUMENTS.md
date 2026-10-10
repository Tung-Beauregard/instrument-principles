# 儀器原理

用互動 3D 動畫說明實驗室儀器的原理。

## 離子阱質譜原理(以 LCQ Deca XP 為例)

網頁:https://tung-beauregard.github.io/instrument-principles/lcq/

沿著離子走的路徑看一遍離子阱質譜儀的硬體:電灑游離、加熱毛細管、截取錐、四極桿與八極桿、離子阱、偵測器。後半段說明離子阱怎麼依質荷比把離子分開,最後示範 MS/MS。範例儀器是 Thermo Finnigan LCQ Deca XP。

- 打開就自動播放,附中文字幕,共 13 章,約 5 分鐘
- 暫停後可以拖曳旋轉視角;空白鍵播放或暫停,左右方向鍵切換章節
- 「自己操作」可以自己調射頻振幅、做掃描
- 說明視窗裡可以把整段動畫錄成 1080p 的 MP4

### 數值與示意

主要數值取自 Finnigan LCQ Series Hardware Manual、LCQ Deca Hardware Manual、LCQ Deca XP Plus 規格表、March (1997) 與 Wong & Cooks (1997)。約 280 kHz 的端帽交流頻率與每 m/z 約 4.25 V 是依這些數值計算的,手冊沒有直接寫。

毛細管長度、桿子尺寸與偵測器幾何是示意;液滴、離子雲與振盪幅度已放大,時間也放慢了很多倍。

### 技術

單一 HTML 檔(lcq/index.html),用 three.js 繪圖,不需要建置。底部的到站人數由免費的 Abacus 計數服務記錄,同一台裝置只算一次。

## GC-MS 氣相層析質譜

網頁:https://tung-beauregard.github.io/instrument-principles/gc-ms/

把 ALS 自動進樣器、氣相層析儀與四極桿質譜儀拆開來看,跟著一針精油樣品走一趟:進樣、在 30 m 管柱裡依滯留因子 k 分開,再進質譜帶電、碎裂、按質荷比篩選。

- 「導覽」讓鏡頭跟著一個成分的分子走完 8 站:進樣、進樣口、管柱、傳輸線、離子源、四極桿、偵測器、完成
- 放大鏡:在管柱內部看分子在液膜與載氣之間進出;暫停在峰上會切到離子源,示範 M⁺• 怎麼形成、怎麼斷成碎片
- 質譜面板的「四極桿」檢視畫出 Mathieu 穩定圖,可以把四極桿固定在某個 m/z
- 動畫說明(控制列的「動畫」、說明視窗、牆上的四張說明圖):走走停停、保留指數 KI、電子撞擊游離、四極桿(翻轉的馬鞍)
- 可切換升溫速率(3、5、10 °C/min)、拆開儀器,播放速度有 0.1× 與 0.5× 慢動作
- 層析圖可拖曳捲動、點峰追蹤、點質譜線抽出 EIC;峰表附用正烷烴換算的 KI

### 數值與示意

動畫說明的數字:走走停停的 k = 1 與 3 是為了說明挑的整數,每次停留取平均值上下 30%(真的分子每秒進出液膜非常多次,峰才窄;畫面放慢後若照完全隨機的停留時間,一團分子會散得太開);保留指數的時間與 KI 直接取本頁的滯留模型(每分鐘 3 °C:C9 4.68、C10 7.48、α-Pinene 5.64 分,KI 934;每分鐘 10 °C:C9 3.52、C10 4.78、α-Pinene 3.98 分,KI 937);電子撞擊游離的斷法與質譜取本頁 α-Pinene 的資料(136、121、93,主要離子相對強度 6% 以上);四極桿那段的物理見下方「質譜儀-不同分析器比較」的電場形狀,三顆球用 α-Pinene 的碎片 77、93、136,「每秒掃 3、4 次」取本頁的掃描間隔 0.0048 分。

管柱 HP-5MS 30 m × 0.25 mm × 0.25 μm、He 1.0 mL/min、柱溫 60 °C 起以 3、5 或 10 °C/min 升到 220 °C 後保持 3 min。各成分的滯留由非極性管柱的 KI 值換算(簡化的熱力學模型),峰寬以約 7 萬理論板數估算。樣品是虛構的示範組成;質譜只取主要離子,強度為概略值,只供說明,不可拿來鑑定。儀器外觀與尺寸是示意。

### 技術

單一 HTML 檔(gc-ms/index.html),用 three.js 繪圖,不需要建置。

## UV-Vis 分光光度計

網頁:https://tung-beauregard.github.io/instrument-principles/uv-vis/

把雙光束、雙單色器的紫外可見光分光光度計拆開來看,跟著光從燈走到偵測器:氘燈與鹵素燈、換燈鏡、前置光柵與中間狹縫、主光柵與出口狹縫、分光鏡、參考槽與樣品槽,最後是兩個 Peltier 致冷的光二極體。

- 「導覽」自動播一遍,附中文字幕,共 8 章,約 1 分半
- 拖曳主光柵或波長滑桿改變波長(190 到 1100 nm),光路顏色、光柵角度與換燈鏡跟著變
- 樣品可選 DPPH、福林酚呈色液、葉綠素萃取液與氧化鈥標準溶液;頻寬可選 0.2、0.5、1、2、4 nm
- 「掃描」量出整條吸收光譜;換頻寬再掃一次,上一條會留著比較,頻寬越寬峰越矮也越寬
- 可切換組裝與展開兩種外觀

### 數值與示意

規格取自原廠技術資料(2020 年 4 月版):190 到 1100 nm、頻寬 0.2 到 4 nm、220 nm 的雜散光 ≤0.005 %T、換燈點可設在 300 到 450 nm 之間(這裡用 320 nm)、兩個 Peltier 致冷的光二極體偵測器。機內元件的位置、角度與數量是示意;光柵轉角用每毫米 1200 條、夾角 20° 的光柵方程估算。光譜是依文獻吸收峰位置組合的模擬曲線,雜訊依通過的光量估算,不是實測數據。

### 技術

單一 HTML 檔(uv-vis/index.html),用 three.js 繪圖,不需要建置。

## LCQ 離子之旅(LCQ Deca XP 拆解式導覽)

網頁:https://tung-beauregard.github.io/instrument-principles/lcq-3d/

仿照 [The Plane of Focus](https://sael.net/plane-of-focus/) 的拆解式 3D 呈現,把 LCQ Deca XP 的離子路徑排在一條導軌上,可以在外觀、組裝、展開之間切換,跟著離子從電灑噴針走到偵測器。和「離子阱質譜」教材是同一台儀器的另一種呈現,著重零件剖面、壓力分區與穩定圖。

- 「播放導覽」(或按 C)自動運鏡,附中文字幕,共 12 段,約 2 分 21 秒
- 機身切換外觀、組裝、展開;點零件會在左側顯示說明,鏡頭也會靠過去
- 掃描模式切換 Full MS 與 MS/MS;下方兩個示波窗即時顯示 Mathieu 穩定圖與質譜
- 拖曳「RF 振幅」滑桿手動掃描,拉回最左邊會重新注入離子
- 標題說明、控制面板、穩定圖、質譜與導覽字幕都可以拖動、從右下角縮放,位置記在瀏覽器裡;「重設版面」還原
- 「錄成影片」把整段導覽逐格算圖存成 1080p MP4(需要支援 WebCodecs 的 Chrome 或 Edge)

### 數值與示意

規格取自 LCQ Deca Hardware Manual (1999)、LCQ Series Hardware Manual、LCQ Deca XP Plus 規格表與 Wong & Cooks, Current Separations 16:3:

- 離子光學順序:加熱毛細管、管透鏡、截取錐、方柱四極柱、多極柱間透鏡、八極柱、入口透鏡、離子阱;多極柱 RF 2.45 MHz、400 Vp-p
- 壓力:毛細管到截取錐約 1 Torr,四極柱區約 10⁻³ Torr,分析區約 2×10⁻⁵ Torr;阱內氦氣約 1 mL/min,約 1 mTorr
- 離子阱:r₀ = 0.707 cm、z₀ = 0.785 cm(March 1997 寫 0.783 cm),RF 0.76 MHz、最高約 8500 V (0-p),共振射出點 q_z = 0.83,掃描約每秒 5500 u
- MS/MS:隔離用 5 至 380 kHz 的寬頻波形;Activation Q 0.25、30 ms(預設值出自 LCQ Fleet 手冊,XP Plus 文獻採用相同設定)
- 偵測:轉換打拿極 ±15 kV,連續式電子倍增管 −0.8 至 −2.5 kV、增益約 3×10⁵

計算推估:穩定圖由 Mathieu 方程數值積分(RK4,以單值矩陣的跡 |tr| < 2 判斷穩定)畫出;MS/MS 活化時的低質量截止是 0.25 / 0.908 ≈ 前驅離子 m/z 的 27%。

教學示意:離子源畫成正交噴灑(XP Plus 的設計;原始 Deca XP 與 XP MAX 的噴灑角度不同,這裡未區分機型);示範樣品是 LCQ 正離子校正液(咖啡因 m/z 195、MRFA m/z 524、Ultramark 1621),質譜峰高為示意;零件尺寸、離子振盪頻率與時間尺度都經過調整;主控台上的調諧參數是文獻中的正離子示例值;阱內 8 字形軌跡用低 q 近似 ω_z = 2ω_r 繪製。模擬結果不可用於實樣鑑定。

### 技術

單一 HTML 檔(lcq-3d/index.html),用 three.js 0.183.2 繪圖,不需要建置,不使用到站人數計數。程式分區與修改方式見 lcq-3d/MAINTENANCE.md。

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
- 示意:動畫的共振射出點畫在 q_z = 0.83,接近穩定邊界,是教學設定;環電極與端蓋的比例取文獻常引用的 LCQ 尺寸 r₀ 0.707 cm、z₀ 0.785 cm(原廠文件未確認;以 0.76 MHz、8500 V 推算,q_z 0.83 對應 m/z 約 2,000,和 m/z 50 到 2,000 的範圍一致)。冷卻後的 8 字形刻意畫大。

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

不是某一台儀器,而是把常見的光譜放在一起比:每一種光一份帶的能量不同,只有剛好對上分子某一種動作的「台階」才會被吸收。無線電波讓原子核翻面(放在強磁鐵裡,核磁共振 NMR)、微波讓整個分子轉動(用一氧化碳氣體)、紅外線讓化學鍵伸縮彎曲(紅外光譜 FTIR)、可見光與紫外光讓電子跳到高一層(UV-Vis,用 β-胡蘿蔔素當有顏色的對照)、X 光把最內層的電子打出去;另外兩種用法:螢光(通寧水裡的奎寧)與拉曼(532 nm 雷射)。核磁共振、紅外、紫外與拉曼都用同一個分子香草醛。版型和 UV-Vis、NMR 頁相同。

- 選一種光,鏡頭移過去;拖滑桿調頻率、波數、波長或能量,分子照能量對不對得上回應(自旋翻面、轉快一階、某一根鍵振動、電子雲變形、內層電子飛出)
- 「掃描」從一端掃到另一端,下方螢幕畫出那一種光譜;左欄的能量階梯畫出這一份光的能量和分子的台階
- 「光的其他用法」切換吸收、螢光、拉曼
- 「導覽」自動播放約 187 秒,23 段字幕,內容與影片相同
- 文字以台灣高中畢業看得懂為準

### 數值與示意

能量換算(計算):E = hc/λ,hc = 1239.84198 eV·nm;1 cm⁻¹ = 1.2398×10⁻⁴ eV。500 MHz 的無線電波約 2.07×10⁻⁶ eV;一氧化碳第一條轉動譜線 115.27 GHz 約 4.8×10⁻⁴ eV;中紅外 4000 到 400 cm⁻¹ 是 0.50 到 0.050 eV;可見光 400 到 700 nm 是 3.10 到 1.77 eV;紫外 200 到 400 nm 是 6.20 到 3.10 eV。片尾比較表的能量範圍取這幾個數量級。

- 各區與分子動作的對應:微波(約 10⁻⁵ 到 10⁻³ eV)對應分子轉動、紅外對應振動、可見光把電子提到高一層、X 光把電子打出去(HyperPhysics);無線電波讓原子核的自旋翻面(Reusch)。
- 核磁共振:香草醛在 CDCl₃ 的化學位移和 `nmr/` 相同(醛基 9.83、H-6 7.43、H-2 7.42、H-5 7.04、羥基約 6.2、甲氧基 3.96;來源見 NMR 一節)。BMRB bmse010006(250 MHz)為 9.81、7.44、7.41、7.04、3.92;羥基的位置和濃度有關,其他資料在 6.2 到 6.4 之間。磁場 11.74 T、500.13 MHz 同 NMR 一節。
- 微波:一氧化碳 J = 1←0 為 115,271.2018 MHz(CDMS);其他譜線用剛性轉子 ν = 2B(J+1)、B = 57.636 GHz 算出 230.5、345.8、461.1 GHz(計算,沒有考慮離心畸變)。微波爐的 2.45 GHz 加熱主要是介電加熱、不是共振吸收(HyperPhysics),所以頁面沒有拿微波爐當例子。
- 紅外:香草醛的吸收帶取自 NIST WebBook 的 Coblentz 光譜(礦物油糊 2529、KBr 錠 2530),由作者讀圖:O–H 寬帶,最深處 3140 到 3370;醛基 C–H 弱帶約 2814;C=O 1665 到 1671;苯環 1587 到 1592 與 1511 到 1515;C–O 1261 到 1266 與 1292 到 1296;1150 到 1164、1123、1029 到 1030。這是從紙本數位化的舊色散式光譜,約 ±5 cm⁻¹。頁面取 3180、2820、1666、1590、1510、1265、1155、1030;苯環 C–H 3020、甲基 C–H 2940 與 860 的彎曲依一般官能基範圍(Reusch、CU Boulder)。強度與寬度是示意。
- 紫外:香草醛 231、279、308 nm(Cayman Chemical,溶劑未註明;NIST WebBook 的 Robinson & Kiang 1955 為 230、281 與 312 到 315 nm 的寬峰)。β-胡蘿蔔素在己烷 425、450、478 nm(LipidBank)。
- 螢光:奎寧在 0.1 mol/L 過氯酸裡的吸收峰 250 與 347.5 nm,用 347.5 nm 激發時放光最強在 451.5 nm(Velapoldi & Mielenz 1980;SRM 936 證書)。頁面寫「吸收 350 nm、放出 450 nm 左右的藍光」。通寧水裡的奎寧在紫外燈下發藍光(UCAR)。
- 拉曼:散射光中只有約一千萬分之一是拉曼散射(Renishaw;Bruker 與 HORIBA 寫的比例更小,所以頁面寫「大約一千萬份裡才有一份」);紅外看振動時偶極矩有沒有變、拉曼看極化率有沒有變(Reusch、Renishaw)。香草醛的拉曼位移依紅外的同一組振動放置,沒有找到可引用的實測拉曼譜,強度是示意,螢幕上只標苯環與 C=O 兩支。雷射 532 nm 是常見的選擇(Bruker)。
- X 光:碳 1s 284.2 eV(X-Ray Data Booklet 表 1-1);氧 1s 543.1 eV 是同一張表的通用值,這次沒能從 PDF 抽出那一列核對。吸收邊之後的下降用冪次示意。

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
- CDMS, CO:https://cdms.astro.uni-koeln.de/classic/entries/c028503.cat
- NIST WebBook 香草醛,紅外與紫外:https://webbook.nist.gov/cgi/cbook.cgi?ID=C121335&Type=IR-SPEC&Index=1 、https://webbook.nist.gov/cgi/cbook.cgi?ID=C121335&Mask=400
- Cayman Chemical, Vanillin:https://www.caymanchem.com/product/36422/vanillin
- LipidBank, β-carotene:https://lipidbank.jp/VCA.html
- Velapoldi & Mielenz 1980, NBS Special Publication 260-64:https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nbsspecialpublication260-64.pdf ;SRM 936 證書:https://tsapps.nist.gov/srmext/certificates/689.pdf
- UCAR, Ultraviolet light and tonic water:https://scied.ucar.edu/activity/learn/ultraviolet-light-tonic-water
- Renishaw, What Raman spectroscopy is:https://www.renishaw.com/en/what-raman-spectroscopy-is--25805
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
