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
};
