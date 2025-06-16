module.exports = function registerPatterns(definePattern) {
  // 💬 基本輸出語法
  definePattern('顯示 $內容', (內容) => `alert(${內容});`);

  // 💬 變數設定
  definePattern('設定 $變數 為 $值', (變數, 值) => `let ${變數} = ${值};`);

  // ✅ 若～則～否則（無括號版本）
  definePattern(
    '若 $條件 則 顯示 $當真 否則 顯示 $當假',
    (條件, 當真, 當假) => `if (${條件}) { alert(${當真}); } else { alert(${當假}); }`,
    { type: 'control' }
  );

  // ✅ 若（條件）則 顯示（語句1） 否則 顯示（語句2）
  definePattern(
    '若（$條件）則 顯示（$語句1） 否則 顯示（$語句2）',
    (條件, 語句1, 語句2) => `if (${條件}) {\n  alert(${語句1});\n} else {\n  alert(${語句2});\n}`,
    { type: 'control' }
  );
  definePattern(
    '若($條件)則 顯示($語句1) 否則 顯示($語句2)',
    (條件, 語句1, 語句2) => `if (${條件}) {\n  alert(${語句1});\n} else {\n  alert(${語句2});\n}`,
    { type: 'control' }
  );
  definePattern(
    '等待 $秒數 秒後 顯示 $訊息',
    (秒數, 訊息) =>
      `setTimeout(() => alert(${訊息}), ${秒數} * 1000);`,
    { type: 'control' }
  );
  definePattern(
    '隱藏 $元素',
    (元素) => `document.querySelector(${元素}).style.display = "none";`,
    { type: 'ui' }
  );
  // 更多擴充語法可加入這裡
};
