# 儀器原理

用互動 3D 動畫說明實驗室儀器的原理。

## LCQ Deca XP 離子阱質譜儀

網頁:https://tung-beauregard.github.io/instrument-principles/

沿著離子走的路徑看一遍 Thermo Finnigan LCQ Deca XP 的硬體:電灑游離、加熱毛細管、截取錐、四極桿與八極桿、離子阱、偵測器。後半段說明離子阱怎麼依質荷比把離子分開,最後示範 MS/MS。

- 打開就自動播放,附中文字幕,共 13 章,約 5 分鐘
- 暫停後可以拖曳旋轉視角;空白鍵播放或暫停,左右方向鍵切換章節
- 「自己操作」可以自己調射頻振幅、做掃描
- 說明視窗裡可以把整段動畫錄成 1080p 的 MP4

### 數值與示意

主要數值取自 Finnigan LCQ Series Hardware Manual、LCQ Deca Hardware Manual、LCQ Deca XP Plus 規格表、March (1997) 與 Wong & Cooks (1997)。約 280 kHz 的端帽交流頻率與每 m/z 約 4.25 V 是依這些數值計算的,手冊沒有直接寫。

毛細管長度、桿子尺寸與偵測器幾何是示意;液滴、離子雲與振盪幅度已放大,時間也放慢了很多倍。

### 技術

單一 HTML 檔,用 three.js 繪圖,不需要建置。底部的到站人數由免費的 Abacus 計數服務記錄,同一台裝置只算一次。
