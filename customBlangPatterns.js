module.exports = function registerPatterns(definePattern) {
  // 💬 基本輸出語法
  definePattern('顯示 $內容', (內容) => `alert(${內容});`, {
    description: '彈出警示框顯示指定內容',
    hints: ['內容']
  });

  // 💬 變數設定
  definePattern('設定 $變數 為 $值', (變數, 值) => `let ${變數} = ${值};`, {
    description: '宣告或重新賦值變數',
    hints: ['變數', '值']
  });

  // ✅ 若～則～否則（無括號版本）
  definePattern(
    '若 $條件 則 顯示 $當真 否則 顯示 $當假',
    (條件, 當真, 當假) => `if (${條件}) { alert(${當真}); } else { alert(${當假}); }`,
    {
      type: 'control',
      description: '根據條件顯示不同內容',
      hints: ['條件', '當真', '當假']
    }
  );

  // ✅ 若（條件）則 顯示（語句1） 否則 顯示（語句2）
  definePattern(
    '若（$條件）則 顯示（$語句1） 否則 顯示（$語句2）',
    (條件, 語句1, 語句2) => `if (${條件}) {\n  alert(${語句1});\n} else {\n  alert(${語句2});\n}`,
    {
      type: 'control',
      description: '含括號的條件語句',
      hints: ['條件', '語句1', '語句2']
    }
  );
  definePattern(
    '若($條件)則 顯示($語句1) 否則 顯示($語句2)',
    (條件, 語句1, 語句2) => `if (${條件}) {\n  alert(${語句1});\n} else {\n  alert(${語句2});\n}`,
    {
      type: 'control',
      description: '括號英文版的條件語句',
      hints: ['條件', '語句1', '語句2']
    }
  );
  definePattern(
    '等待 $秒數 秒後 顯示 $訊息',
    (秒數, 訊息) =>
      `setTimeout(() => alert(${訊息}), ${秒數} * 1000);`,
    {
      type: 'control',
      description: '延遲數秒後顯示訊息',
      hints: ['秒數', '訊息（可選）']
    }
  );
  definePattern(
    '隱藏 $元素',
    (元素) => `document.querySelector(${元素}).style.display = "none";`,
    {
      type: 'ui',
      description: '隱藏指定元素',
      hints: ['元素']
    }
  );
  // 更多擴充語法可加入這裡
};
