module.exports = function registerPatterns(definePattern) {
  definePattern('顯示 $內容', (內容) => `alert(${內容});`);
  definePattern('設定 $變數 為 $值', (變數, 值) => `let ${變數} = ${值};`);
  definePattern(
    '若 $條件 則 顯示 $當真 否則 顯示 $當假',
    (條件, 當真, 當假) =>
      `if (${條件}) { alert(${當真}); } else { alert(${當假}); }`,
    { type: 'control' }
  );
  // 更多擴充語法可加入這裡
};
