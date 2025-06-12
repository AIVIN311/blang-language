module.exports = function registerPatterns(definePattern) {
  definePattern('顯示 $內容', (內容) => `alert(${內容});`, {});
  definePattern('設定 $變數 為 $值', (變數, 值) => `let ${變數} = ${值};`, {});
  // 更多擴充語法可加入這裡
};
