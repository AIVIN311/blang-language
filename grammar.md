# Blang 語言專案

# 🌐 Blang v0.9.4 語法說明書：《語場模組語義版》

Blang 是一種中文語場編程方式，用中文邏輯實現智慧語意互動，支援事件觸發、邏輯條件、清單處理、語音顯示與 AI 對話。自 v0.9.4 起，支援自動變數補宣告、條件語意轉譯優化、語音播報等進階模組。

---

## 📚 語法總覽表格 v0.9.4

| 分類     | 腦語語句（中文語法）                    | 對應 JavaScript                                 |
| -------- | --------------------------------------- | ----------------------------------------------- |
| 事件處理 | 當（使用者.進入頁面）時：               | `window.addEventListener("load", ...)`          |
|          | 當（使用者.按下送出按鈕）時：           | `document.getElementById("submit")...`          |
|          | 當（#按鈕.被點擊）時：                  | `document.querySelector("#按鈕").addEventListener("click", () => {` |
| 條件控制 | 如果（輸入框.內容 為 空）：             | `if (輸入框.value === "") {`                    |
|          | 如果（x > y）：顯示（"訊息"）           | `if (x > y) alert("訊息")`                      |
|          | 若（x > y）則 顯示（"訊息"）            | `if (x > y) alert("訊息")`                      |
|          | 否則：                                  | `} else {`                                      |
| 顯示輸出 | 顯示（"訊息"）                          | `alert("訊息")`                                 |
|          | 顯示（"訊息" + 變數）                   | `alert("訊息" + 變數)`                          |
|          | 顯示（"訊息" + 顯示第幾項（清單, 數）） | `alert("訊息" + ArrayModule.顯示第幾項(...))`   |
|          | 顯示（"訊息" 在輸入框上）               | `輸入框.value = "訊息"`                         |
|          | 顯示（"訊息" 在 #id）                   | `document.getElementById("id").innerText = ...` |
|          | 顯示圖片（"圖.jpg" 在 #區塊）          | `const img = document.createElement('img'); img.src = "圖.jpg"; document.querySelector("#區塊").appendChild(img);` |
| 延遲執行 | 等待（3000 毫秒）後 顯示（...）         | `setTimeout(() => alert(...), 3000)`            |
|          | 等待 3 秒後：顯示（...）                | `setTimeout(() => alert(...), 3000)`            |
| 迴圈控制 | 重複 3 次 顯示（"嗨"） | `for (let i = 0; i < 3; i++) { alert("嗨"); }` |
| 清單操作 | 變數 A = 建立清單（）                   | `let A = ArrayModule.建立清單();`               |
|          | 加入項目（A, "蘋果"）                   | `ArrayModule.加入項目(A, "蘋果");`              |
|          | 顯示全部（A）                           | `alert(ArrayModule.顯示全部(A));`               |
|          | 取得項目（A, 位置）                     | `A[位置 - 1]`                                   |
|          | 移除最後（A）                           | `ArrayModule.移除最後(A);`                      |
|          | 顯示清單長度（A）                       | `A.length`                                       |
|          | 清空清單（A）                           | `A.length = 0`                                   |
|          | 判斷是否為空（A）                       | `A.length === 0`                                 |
|          | 清單包含（A, 值）                       | `A.includes(值)`                                |
| 函數定義 | 定義 打招呼（名字）：                   | `function 打招呼(名字) {`                       |
| 函數呼叫 | 呼叫 打招呼（"小明"）                   | `打招呼("小明");`                               |
| 語音功能 | 播放音效（"ding.mp3"）                  | `new Audio("ding.mp3").play();`                 |
|          | 說出（"內容"）                          | `console.log("內容");`                          |
|          | 朗讀（"內容"）                          | `speak("內容");`                                |
| 文字處理 | 轉大寫（文字）                          | `文字.toUpperCase()`                            |
|          | 替換文字（句子, "舊", "新"）            | `句子.replace("舊", "新")`                     |
|          | 包含（句子, "關鍵"）                    | `句子.includes("關鍵")`                         |
|          | 去除空白（文字）                          | `文字.trim()`                             |
| 數學運算 | 隨機一個數（10）                        | `Math.floor(Math.random() * 10)`                 |
|          | 四捨五入（數值）                        | `Math.round(數值)`                               |
|          | 平方（數值）                            | `Math.pow(數值, 2)`                              |
| 物件操作 | 建立人物（"小傑", 25）                  | `let 人物 = { 名字: "小傑", 年齡: 25 }`          |
|          | 取得屬性（人物, 名字）                  | `人物[名字]`                                    |
| 輸入輸出 | 顯示訊息框（"內容"）                    | `alert("內容")`                                |
|          | 確認（"內容"）                          | `confirm("內容")`                    |
|          | 使用者輸入（"問題？"）                  | `prompt("問題？")`                              |
|          | 設定文字內容（#id, "文字"）              | `document.querySelector("#id").textContent = "文字"` |
| 樣式控制 | 設定樣式（#id, 背景色, 紅色）           | `document.querySelector("#id").style["backgroundColor"] = "red"` |
|          | 切換顏色（#id, 紅色, 藍色）             | `document.querySelector("#id").style.backgroundColor = (document.querySelector("#id").style.backgroundColor === 'red' ? 'blue' : 'red')` |
|          | 隱藏（#id）                             | `document.querySelector("#id").style.display = 'none'` |
| 媒體時間 | 播放影片（播放器）                      | `document.querySelector(播放器).play()`                                 |
|          | 暫停影片（）                      | `document.querySelector("#影片播放器")?.pause();` |
|          | 暫停音效（播放器）                      | `document.querySelector(播放器).pause()`                                |
|          | 循環播放音樂（檔名）                    | `const a = new Audio(檔名); a.loop = true; a.play();` |
|          | 獲取現在時間（）                        | `new Date().toLocaleTimeString()`                |
|          | 顯示現在時間                           | `alert(new Date().toLocaleString())` |
|          | 顯示今天是星期幾                       | `alert("今天是星期" + "日一二三四五六"[new Date().getDay()])` |
|          | 顯示現在是幾點幾分                     | `alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分")` |
| 其他     | 轉跳網頁（"https://example.com"）        | `window.location.href = "https://example.com"`   |
| 其他     | 顯示內容（"內容"）                     | `console.log("內容")` |
| AI 互動 | 問AI("今天幾號？") | `呼叫AI回覆("今天幾號？"); // 🔮 AI` |
| AI 互動 | 讓AI解釋("什麼是電腦") | `呼叫AI回覆("什麼是電腦"); // 🔮 AI` |
| AI 互動 | 呼叫AI回覆("嗨") | `呼叫AI回覆("嗨"); // 🔮 AI` |
## 🎞️ 媒體語法
- 暫停影片() ➝ 暫停播放影片播放器
- 播放音效("路徑.mp3") ➝ 播放指定音效

模組：mediaModule


## 📖 模組化語法規則

Blang 提供三大語法類型：**顯示**、**設定** 與 **控制結構**。自訂規則時，可在 `customBlangPatterns.js` 中使用 `$變數`、`$條件`、`$值` 佔位符，系統會自動補齊 if/else 區塊與大括號。

```js
// customBlangPatterns.js 範例
definePattern("顯示 $內容", (內容) => `alert(${內容});`);
definePattern(
  "若 $條件 則 顯示 $當真 否則 顯示 $當假",
  (條件, 當真, 當假) => `if (${條件}) { alert(${當真}); } else { alert(${當假}); }`
);
```

> **注意**：包含 CSS 選擇器或其他字面字串的參數，在語句中需加上引號，除非對應的 pattern 已自動處理字串包裝。
> 例如：
>
> ```blang
> 新增元素 "div" 到 "#容器"
> ```
>
> 若 pattern 會自動加入引號，可寫成 `新增元素 div 到 #容器`。

若想列出目前載入的語法模式，可調用 `getRegisteredPatterns()`：

```js
const { getRegisteredPatterns } = require('./blangSyntaxAPI.js');
console.log(getRegisteredPatterns());
// 會顯示 pattern 字串以及對應的 {type, description}

```

---

## 🧠 語義模組與自動宣告機制（v0.9.4）

| 功能           | 描述                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| 自動補宣告     | 如果出現變數但未宣告，將自動補上 `let xxx = 0;`                          |
| 條件式語意優化 | `為` → `===`，`不為` → `!==`，支援 `大於`、`小於`、`長度` 等中文語句轉譯 |
| 語法容錯       | 支援全形/半形括號（（）/()），可忽略空格與語彙轉續差異                   |
| 模組擴充設計   | `semanticHandler-v0.9.4.js` 可自定義 AI、語音、UI 模組呼叫邏輯                  |

---

## 📂 專案結構 v0.9.4

```bash
blang/
├── demo.blang              # 中文語法輸入檔案
├── parser_v0.9.4.js        # 語法轉譯核心（支援語意優化、區塊關閉、自動補宣告）
├── semanticHandler-v0.9.4.js # 語意處理模組（顯示、語音、語義補齊）
├── dist/
│   └── semanticHandler.browser.js # 瀏覽器版語義處理器
├── blang-modules/
│   ├── array.js            # 清單操作模組
│   └── display.js          # DOM 顯示處理
├── arrayModule.js          # 陣列處理
├── stringModule.js         # 字串處理工具
├── mathModule.js           # 數學計算工具
├── objectModule.js         # 物件處理工具
├── dialogModule.js         # 對話框顯示
├── imageModule.js          # 圖片處理
├── inputModule.js          # 使用者輸入輔助
├── logModule.js            # 日誌輸出
├── mediaModule.js          # 媒體控制
├── soundModule.js          # 音效播放
├── styleModule.js          # 樣式設定工具
├── textModule.js           # 文字處理
├── timeModule.js           # 時間工具
├── blangSyntaxAPI.js       # 自訂語法 API
├── customBlangPatterns.js  # 擴充語法規則
├── colorMap.js             # 中文顏色對照表
├── vocabulary_map.json     # 指令對應表
├── output.js               # 產出結果 JavaScript 執行檔
├── index.html              # 執行畫面測試用網頁
├── assets/                 # 範例圖片
├── tests/                  # 單元測試腳本
└── grammar.md              # 語法與對照說明（本檔）
```

---

## 🔮 v1.0 展望（Roadmap）

| 模組         | 描述                            | 狀態      |
| ------------ | ------------------------------- | --------- |
| 組件語法     | 使用 組件「留言板」、「清單框」 | ⏳ 進行中 |
| 語音對話     | 語音指令 + AI 回覆              | ⏳ 草擬中 |
| 自學教學環境 | 初學者學習模式與可視化語法引導  | 🧲 構想中 |
| 雙語對照模式 | 中文 ⇉ JS 即時切換，教學用      | 📌 可規劃 |

---

### ❤️ 作者：陳信瑋（大傑斯）

此語言系統誕生於對「中文智慧」、「語場結構」與「人機語意共鳴」的熱愛與實驗。
歡迎你也加入語場建構，一起讓智慧語法成為日常語言的延伸！
