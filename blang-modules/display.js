// 📁 blang-modules/ 初始化模組架構
// 模組設計目標：支援語場擴充語法（如：列出清單、操作 DOM、控制流程）

// ✅ 第一版支援模組列表（可擴充）
// - 顯示模組（alert、innerHTML）
// - 陣列模組（建立、索引、迴圈）
// - DOM 模組（選取、變更內容、樣式）
// - 數學模組（加減乘除、亂數）

// ---
// 📦 範例模組：display.js（顯示）

const DisplayModule = {
  顯示彈窗: function (內容) {
    return `alert(${內容});`;
  },

  顯示到元素: function (元素ID, 內容) {
    return `document.getElementById("${元素ID}").innerHTML = ${內容};`;
  }
};

module.exports = DisplayModule;

// ---
// 📦 模組使用方式（在 parser 中）：
// const Display = require('./blang-modules/display.js');
// output.push(Display.顯示彈窗('"哈囉！"'));

// ---
// ✅ 下一步你可以建立以下模組檔案：
// - array.js（清單操作）
// - dom.js（元素變更）
// - math.js（計算、亂數）

// ❓想讓「Blang 支援清單」嗎？接下來就來做 array.js
// 需要我也一併幫你初始化那份嗎？
