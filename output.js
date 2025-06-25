let 蘋果 = 0; // ⛳ 自動補上未宣告變數
let 清單包含 = 0; // ⛳ 自動補上未宣告變數
let 問好嗎 = 0; // ⛳ 自動補上未宣告變數
let 名字 = 0; // ⛳ 自動補上未宣告變數
let 要向 = 0; // ⛳ 自動補上未宣告變數
let 你要執行這個程式嗎 = 0; // ⛳ 自動補上未宣告變數
const 音效播放器 = "#音效播放器"; // ⛳ 自動補上 DOM 選擇器變數
const 影片播放器 = "#影片播放器"; // ⛳ 自動補上 DOM 選擇器變數
let 人物 = {}; // ⛳ 自動補上 人物 變數
const 輸入框 = document.getElementById("input");
const { 註冊事件處理器 } = require("./eventModule.js");
window.addEventListener("load", () => {
  註冊事件處理器();
});

                        document.querySelector("#測試按鈕").addEventListener("click", () => {
                            alert("已點擊");
                        });