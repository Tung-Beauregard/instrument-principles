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
- 可切換升溫速率(3、5、10 °C/min)、拆開儀器,播放速度有 0.1× 與 0.5× 慢動作
- 層析圖可拖曳捲動、點峰追蹤、點質譜線抽出 EIC;峰表附用正烷烴換算的 KI

### 數值與示意

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
