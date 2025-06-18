const { handleFunctionCall, processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerDisplayPatterns(definePattern) {
  let toggleId = 0;
  definePattern(
    '顯示 JSON 格式化 $物件',
    (物件) => `alert(JSON.stringify(${物件}, null, 2));`,
    { type: 'data', description: 'display object as JSON' }
  );
  definePattern(
    '隱藏 $元素',
    (元素) => `document.querySelector('${元素}').style.display = "none";`,
    { type: 'ui', description: '隱藏指定元素', hints: ['元素'] }
  );
  definePattern(
    '顯示 $訊息 在 $選擇器',
    (訊息, 選擇器) =>
      `document.querySelector('${選擇器}').textContent = ${訊息};`,
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
      `const img = document.createElement('img'); img.src = ${來源}; document.querySelector('${選擇器}').appendChild(img);`,
    { type: 'ui', description: 'insert image element' }
  );
  definePattern(
    '設定背景色($選擇器, $顏色)',
    (選擇器, 顏色) =>
      `document.querySelector('${選擇器}').style.backgroundColor = ${顏色};`,
    { type: 'ui', description: 'change background color' }
  );
  definePattern(
    '切換顏色($選擇器, $顏色1, $顏色2)',
    (選擇器, 顏色1, 顏色2) => {
      const elVar = `__toggleEl${toggleId++}`;
      return `let ${elVar} = document.querySelector('${選擇器}'); ${elVar}.style.color = ${elVar}.style.color === ${顏色1} ? ${顏色2} : ${顏色1};`;
    },
    { type: 'ui', description: 'toggle text color' }
  );
  definePattern(
    '播放影片($選擇器)',
    (選擇器) => `document.querySelector('${選擇器}').play();`,
    { type: 'media', description: 'play video element' }
  );
  definePattern(
    '暫停音效($選擇器)',
    (選擇器) => `document.querySelector('${選擇器}').pause();`,
    { type: 'media', description: 'pause audio element' }
  );
  definePattern(
    '切換顯示隱藏 $選擇器',
    (選擇器) =>
      `const el = document.querySelector('${選擇器}'); el.style.display = el.style.display === 'none' ? 'block' : 'none';`,
    { type: 'ui', description: 'toggle element display' }
  );
  definePattern(
    '增加透明度動畫到 $選擇器',
    (選擇器) => {
      const sel = processDisplayArgument(選擇器);
      return `document.querySelector(${sel}).style.transition = 'opacity 0.5s';`;
    },
    { type: 'ui', description: 'fade animation' }
  );
  definePattern(
    '停止所有音效',
    () => "document.querySelectorAll('audio').forEach(a => a.pause());",
    { type: 'media', description: 'pause all audio' }
  );
  definePattern(
    '新增元素 $標籤 到 $選擇器',
    (標籤, 選擇器) => {
      const tag = processDisplayArgument(標籤);
      const sel = processDisplayArgument(選擇器);
      return `document.querySelector(${sel}).appendChild(document.createElement(${tag}));`;
    },
    { type: 'ui', description: 'append new element' }
  );
  definePattern(
    '清空 $選擇器 的內容',
    (選擇器) => `document.querySelector('${選擇器}').innerHTML = '';`,
    { type: 'ui', description: 'clear element content' }
  );
  definePattern(
    '設定文字於 $選擇器 為 $文字',
    (選擇器, 文字) => `document.querySelector('${選擇器}').textContent = ${文字};`,
    { type: 'ui', description: 'set text content' }
  );
  definePattern(
    '設定（$選擇器）為 $內容',
    (選擇器, 內容) => handleFunctionCall('設定文字內容', `${選擇器}, ${內容}`),
    { type: 'ui' }
  );
  definePattern(
    '循環播放音樂 $檔名',
    (檔名) => `const a = new Audio(${檔名}); a.loop = true; a.play();`,
    { type: 'media', description: 'loop audio' }
  );
  definePattern(
    '顯示內容($內容)',
    (內容) => `console.log(${內容})`,
    { type: 'log', description: 'console output' }
  );
  definePattern('顯示 $內容', (內容) => `alert(${內容});`, {
    description: '彈出警示框顯示指定內容',
    hints: ['內容']
  });
};
