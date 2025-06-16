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
  definePattern(
    '顯示 $訊息 在 $選擇器',
    (訊息, 選擇器) =>
      `document.querySelector(${選擇器}).textContent = ${訊息};`,
    { type: 'ui', description: 'update DOM text content' }
  );
  definePattern(
    '播放音效($檔名)',
    (檔名) => `new Audio(${檔名}).play();`,
    { type: 'media', description: 'play audio file' }
  );
  definePattern(
    '顯示圖片($來源 在 $選擇器)',
    (來源, 選擇器) =>
      `const img = document.createElement('img'); img.src = ${來源}; document.querySelector(${選擇器}).appendChild(img);`,
    { type: 'ui', description: 'insert image element' }
  );
  definePattern(
    '設定背景色($選擇器, $顏色)',
    (選擇器, 顏色) =>
      `document.querySelector(${選擇器}).style.backgroundColor = ${顏色};`,
    { type: 'ui', description: 'change background color' }
  );
  definePattern(
    '播放影片($選擇器)',
    (選擇器) => `document.querySelector(${選擇器}).play();`,
    { type: 'media', description: 'play video element' }
  );
  definePattern(
    '暫停音效($選擇器)',
    (選擇器) => `document.querySelector(${選擇器}).pause();`,
    { type: 'media', description: 'pause audio element' }
  );
  definePattern(
    '顯示今天是星期幾',
    () =>
      'alert("今天是星期" + "日一二三四五六"[new Date().getDay()]);',
    { type: 'control', description: 'show current weekday' }
  );
  definePattern(
    '顯示現在是幾點幾分',
    () =>
      'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分");',
    { type: 'control', description: 'show current time' }
  );
  definePattern(
    '等待 $毫秒 毫秒後 顯示 $訊息',
    (毫秒, 訊息) => `setTimeout(() => alert(${訊息}), ${毫秒});`,
    { type: 'control', description: 'delay message in ms' }
  );
  // 更多擴充語法可加入這裡
  definePattern(
    '重複執行($參數1)',
    (參數1) => // TODO,
    { type: 'control' }
  );
  definePattern(
    '設定樣式($參數1, $參數2, $參數3)',
    (參數1, 參數2, 參數3) => // TODO,
    { type: 'ui' }
  );
  definePattern(
    '切換顏色($參數1, $參數2, $參數3)',
    (參數1, 參數2, 參數3) => // TODO,
    { type: 'control' }
  );
  definePattern(
    '轉跳網頁($參數1)',
    (參數1) => // TODO,
    { type: 'control' }
  );
  definePattern(
    '顯示圖片($參數1)',
    (參數1) => // TODO,
    { type: 'media' }
  );
  definePattern(
    '說一句話($參數1)',
    (參數1) => // TODO,
    { type: 'control' }
  );
  definePattern(
    '播放音效($參數1)',
    (參數1) => new Audio(參數1).play();,
    { type: 'media' }
  );
  definePattern(
    '隱藏($參數1)',
    (參數1) => document.querySelector(參數1).style.display = "none";,
    { type: 'ui' }
  );
  definePattern(
    '設定背景色($參數1, $參數2)',
    (參數1, 參數2) => document.querySelector(參數1).style.backgroundColor = 參數2;,
    { type: 'ui' }
  );
definePattern(
  '重複執行($參數1)',
  (參數1) => { return // TODO; },
  { type: 'control' }
);
definePattern(
  '設定樣式($參數1, $參數2, $參數3)',
  (參數1, 參數2, 參數3) => { return // TODO; },
  { type: 'ui' }
);
definePattern(
  '切換顏色($參數1, $參數2, $參數3)',
  (參數1, 參數2, 參數3) => { return // TODO; },
  { type: 'control' }
);
definePattern(
  '轉跳網頁($參數1)',
  (參數1) => { return // TODO; },
  { type: 'control' }
);
definePattern(
  '顯示圖片($參數1)',
  (參數1) => { return // TODO; },
  { type: 'media' }
);
definePattern(
  '說一句話($參數1)',
  (參數1) => { return // TODO; },
  { type: 'control' }
);
definePattern(
  '播放音效($參數1)',
  (參數1) => { return new Audio(參數1).play();; },
  { type: 'media' }
);
definePattern(
  '隱藏($參數1)',
  (參數1) => { return document.querySelector(參數1).style.display = "none";; },
  { type: 'ui' }
);
definePattern(
  '設定背景色($參數1, $參數2)',
  (參數1, 參數2) => { return document.querySelector(參數1).style.backgroundColor = 參數2;; },
  { type: 'ui' }
);
};