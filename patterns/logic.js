module.exports = function registerLogicPatterns(definePattern) {
  definePattern(
    '設定 cookie $名稱 為 $值',
    (名稱, 值) => `document.cookie = ${名稱} + '=' + ${值};`,
    { type: 'data', description: 'set browser cookie' }
  );
  definePattern(
    '顯示 cookie $名稱 的值',
    (名稱) => `alert(document.cookie.split('; ').find(c => c.startsWith(${名稱} + '='))?.split('=')[1]);`,
    { type: 'data', description: 'get cookie value' }
  );
  definePattern('設定 $變數 為 $值', (變數, 值) => `let ${變數} = ${值};`, {
    description: '宣告或重新賦值變數',
    hints: ['變數', '值']
  });
  definePattern(
    '若 $條件 則 顯示 $當真 否則 顯示 $當假',
    (條件, 當真, 當假) => `if (${條件}) { alert(${當真}); } else { alert(${當假}); }`,
    { type: 'control', description: '根據條件顯示不同內容', hints: ['條件', '當真', '當假'] }
  );
  definePattern(
    '若（$條件）則 顯示（$語句1） 否則 顯示（$語句2）',
    (條件, 語句1, 語句2) => `if (${條件}) {\n  alert(${語句1});\n} else {\n  alert(${語句2});\n}`,
    { type: 'control', description: '含括號的條件語句', hints: ['條件', '語句1', '語句2'] }
  );
  definePattern(
    '若($條件)則 顯示($語句1) 否則 顯示($語句2)',
    (條件, 語句1, 語句2) => `if (${條件}) {\n  alert(${語句1});\n} else {\n  alert(${語句2});\n}`,
    { type: 'control', description: '括號英文版的條件語句', hints: ['條件', '語句1', '語句2'] }
  );
  definePattern(
    '等待 $秒數 秒後 顯示 $訊息',
    (秒數, 訊息) => `setTimeout(() => alert(${訊息}), ${秒數} * 1000);`,
    { type: 'control', description: '延遲數秒後顯示訊息', hints: ['秒數', '訊息（可選）'] }
  );
  definePattern(
    '顯示今天是星期幾',
    () => 'alert("今天是星期" + "日一二三四五六"[new Date().getDay()]);',
    { type: 'control', description: 'show current weekday' }
  );
  definePattern(
    '顯示現在是幾點幾分',
    () => 'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分");',
    { type: 'control', description: 'show current time' }
  );
  definePattern(
    '顯示現在時間',
    () => 'alert(new Date().toLocaleString());',
    { type: 'time' }
  );
  definePattern(
    '等待 $毫秒 毫秒後 顯示 $訊息',
    (毫秒, 訊息) => `setTimeout(() => alert(${訊息}), ${毫秒});`,
    { type: 'control', description: 'delay message in ms' }
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
    '顯示 $數字 的絕對值',
    (數字) => `alert(Math.abs(${數字}));`,
    { type: 'math', description: 'show absolute value' }
  );
  definePattern(
    '顯示目前瀏覽器語系',
    () => 'alert(navigator.language);',
    { type: 'data', description: 'show browser language' }
  );
  definePattern(
    '在控制台輸出 $內容',
    (內容) => `console.log(${內容});`,
    { type: 'log', description: 'console output' }
  );
  definePattern(
    '顯示內容($內容)',
    (內容) => `console.log(${內容});`,
    { type: 'log', description: 'console output' }
  );
  definePattern(
    '顯示隨機整數至 $最大值',
    (最大值) => `alert(Math.floor(Math.random() * ${最大值}));`,
    { type: 'math', description: 'random integer' }
  );
  definePattern(
    '顯示網址參數 $鍵',
    (鍵) => `alert(new URLSearchParams(location.search).get(${鍵}));`,
    { type: 'data', description: 'show query parameter' }
  );
  definePattern(
    '開新視窗到 $網址',
    (網址) => `window.open(${網址}, '_blank');`,
    { type: 'control', description: 'open new window' }
  );
};
