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
  /* 更多擴充語法可加入這裡
  definePattern(
    '重複執行($參數1)',
    (參數1) => {},
    { type: 'control' }
  );
  definePattern(
    '設定樣式($參數1, $參數2, $參數3)',
    (參數1, 參數2, 參數3) => {},
    { type: 'ui' }
  );
  definePattern(
    '切換顏色($參數1, $參數2, $參數3)',
    (參數1, 參數2, 參數3) => {},
    { type: 'control' }
  );
  definePattern(
    '轉跳網頁($參數1)',
    (參數1) => {},
    { type: 'control' }
  );
  definePattern(
    '顯示圖片($參數1)',
    (參數1) => {},
    { type: 'media' }
  );
  definePattern(
    '說一句話($參數1)',
    (參數1) => {},
    { type: 'control' }
  );
  definePattern(
    '播放音效($參數1)',
    (參數1) => { new Audio(參數1).play(); },
    { type: 'media' }
  );
  definePattern(
    '隱藏($參數1)',
    (參數1) => { document.querySelector(參數1).style.display = "none"; },
    { type: 'ui' }
  );
  definePattern(
    '設定背景色($參數1, $參數2)',
    (參數1, 參數2) => { document.querySelector(參數1).style.backgroundColor = 參數2; },
    { type: 'ui' }
  );
  */
definePattern(
  '重複執行($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '設定樣式($參數1, $參數2, $參數3)',
  (參數1, 參數2, 參數3) => { return /* TODO */; },
  { type: 'ui' }
);
definePattern(
  '切換顏色($參數1, $參數2, $參數3)',
  (參數1, 參數2, 參數3) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '轉跳網頁($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '顯示圖片($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'media' }
);
definePattern(
  '說一句話($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '播放音效($參數1)',
  (參數1) => { return new Audio(參數1).play(); },
  { type: 'media' }
);
definePattern(
  '隱藏($參數1)',
  (參數1) => { return document.querySelector(參數1).style.display = "none"; },
  { type: 'ui' }
);
  definePattern(
    '設定背景色($參數1, $參數2)',
    (參數1, 參數2) => { return document.querySelector(參數1).style.backgroundColor = 參數2; },
    { type: 'ui' }
  );

  definePattern(
    '顯示今天日期',
    () => 'alert(new Date().toLocaleDateString());',
    { type: 'time', description: 'show current date' }
  );
  definePattern(
    '替換所有 $舊字 為 $新字 在 $字串',
    (舊字, 新字, 字串) => `alert(${字串}.replaceAll(${舊字}, ${新字}));`,
    { type: 'string', description: 'replace text and display' }
  );
  definePattern(
    '切換顯示隱藏 $選擇器',
    (選擇器) =>
      `const el = document.querySelector(${選擇器}); el.style.display = el.style.display === 'none' ? 'block' : 'none';`,
    { type: 'ui', description: 'toggle element display' }
  );
  definePattern(
    '增加透明度動畫到 $選擇器',
    (選擇器) => `document.querySelector(${選擇器}).style.transition = 'opacity 0.5s';`,
    { type: 'ui', description: 'fade animation' }
  );
  definePattern(
    '顯示 $數字 的絕對值',
    (數字) => `alert(Math.abs(${數字}));`,
    { type: 'math', description: 'show absolute value' }
  );
  definePattern(
    '遍歷 $清單 並顯示每項',
    (清單) => `${清單}.forEach(item => alert(item));`,
    { type: 'data', description: 'iterate list items' }
  );
  definePattern(
    '停止所有音效',
    () => "document.querySelectorAll('audio').forEach(a => a.pause());",
    { type: 'media', description: 'pause all audio' }
  );
  definePattern(
    '顯示目前瀏覽器語系',
    () => 'alert(navigator.language);',
    { type: 'data', description: 'show browser language' }
  );
  definePattern(
    '顯示 JSON 格式化 $物件',
    (物件) => `alert(JSON.stringify(${物件}, null, 2));`,
    { type: 'data', description: 'display object as JSON' }
  );
  definePattern(
    '新增元素 $標籤 到 $選擇器',
    (標籤, 選擇器) =>
      `document.querySelector(${選擇器}).appendChild(document.createElement(${標籤}));`,
    { type: 'ui', description: 'append new element' }
  );
  definePattern(
    '清空 $選擇器 的內容',
    (選擇器) => `document.querySelector(${選擇器}).innerHTML = '';`,
    { type: 'ui', description: 'clear element content' }
  );
  definePattern(
    '設定文字於 $選擇器 為 $文字',
    (選擇器, 文字) => `document.querySelector(${選擇器}).textContent = ${文字};`,
    { type: 'ui', description: 'set text content' }
  );
  definePattern(
    '在控制台輸出 $內容',
    (內容) => `console.log(${內容});`,
    { type: 'log', description: 'console output' }
  );
  definePattern(
    '設定 cookie $名稱 為 $值',
    (名稱, 值) => `document.cookie = ${名稱} + '=' + ${值};`,
    { type: 'data', description: 'set browser cookie' }
  );
  definePattern(
    '顯示 cookie $名稱 的值',
    (名稱) =>
      `alert(document.cookie.split('; ').find(c => c.startsWith(${名稱} + '='))?.split('=')[1]);`,
    { type: 'data', description: 'get cookie value' }
  );
  definePattern(
    '顯示隨機整數至 $最大值',
    (最大值) => `alert(Math.floor(Math.random() * ${最大值}));`,
    { type: 'math', description: 'random integer' }
  );
  definePattern(
    '反轉 $清單',
    (清單) => `${清單}.reverse();`,
    { type: 'data', description: 'reverse list' }
  );
  definePattern(
    '顯示網址參數 $鍵',
    (鍵) => `alert(new URLSearchParams(location.search).get(${鍵}));`,
    { type: 'data', description: 'show query parameter' }
  );
  definePattern(
    '循環播放音樂 $檔名',
    (檔名) => `const a = new Audio(${檔名}); a.loop = true; a.play();`,
    { type: 'media', description: 'loop audio' }
  );
  definePattern(
    '開新視窗到 $網址',
    (網址) => `window.open(${網址}, '_blank');`,
    { type: 'control', description: 'open new window' }
  );
definePattern(
  '重複執行($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '設定樣式($參數1, $參數2, $參數3)',
  (參數1, 參數2, 參數3) => { return /* TODO */; },
  { type: 'ui' }
);
definePattern(
  '切換顏色($參數1, $參數2, $參數3)',
  (參數1, 參數2, 參數3) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '轉跳網頁($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '顯示圖片($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'media' }
);
definePattern(
  '說一句話($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
definePattern(
  '播放音效($參數1)',
  (參數1) => { return new Audio(參數1).play(); },
  { type: 'media' }
);
definePattern(
  '隱藏($參數1)',
  (參數1) => { return document.querySelector(參數1).style.display = "none"; },
  { type: 'ui' }
);
definePattern(
  '設定背景色($參數1, $參數2)',
  (參數1, 參數2) => { return document.querySelector(參數1).style.backgroundColor = 參數2; },
  { type: 'ui' }
);
definePattern(
  '切換顯示隱藏($參數1)',
  (參數1) => { return document.querySelector(參數1).style.display = "none"; },
  { type: 'ui' }
);
definePattern(
  '循環播放音樂($參數1)',
  (參數1) => { return /* TODO */; },
  { type: 'control' }
);
};