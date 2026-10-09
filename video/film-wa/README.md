# 電子為什麼不會掉下去？— 和風版（HyperFrames）

依照 `../../分鏡.md` 的鏡頭與字幕，改用日式設計美學（和紙・墨・朱）重新設計的版本，1920×1080、30 fps。
霓虹宇宙風原版在 `../film/`。

- 色彩：生成和紙底 `#f4efe6`、墨 `#1e1b18`、朱 `#c8442f`、藍 `#2b4c7e`、金茶 `#a8742d`、若竹 `#4f8a5b`
- 字型：Noto Serif TC（明朝）、Noto Sans TC（黑體小字）、Cormorant Garamond（拉丁字與數字，用 lining 數字）
- 節奏：每鏡 = max(2.6 秒, 1.3 秒 + 每字 0.17 秒) + 停留 × 1.4，全片約 3 分鐘

## 結構
- `src/storyboard_data.py`：分鏡資料（字幕、時長、進場方式），和產生 `分鏡.md` 的資料相同
- `src/core.css`、`src/core.js`：色彩、字體、HUD、字幕動畫、轉場、共用動畫函式
- `src/act1.*` … `src/act6.*`：六幕的畫面與動畫
- `build.py`：把上面的檔案組成 `index.html`，並下載只含用到字元的字型子集、產生裝飾字的外框路徑
- `index.html`：產生出來的合成檔，請改 `src/`，不要直接改這個檔

## 指令
```bash
python3 build.py                      # 重新組合 index.html
npx hyperframes@0.8.143 check         # 排版、對比、執行期檢查
npx hyperframes@0.8.143 render . -f 30 -q high -o ../renders/hydrogen-full.mp4
```
