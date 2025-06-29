(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.blangSyntaxAPI = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
function 呼叫AI回覆(msg) {
  const text = typeof msg === 'undefined' ? '' : String(msg);
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`AI 回覆尚未實作: ${text}`);
  } else {
    console.log('AI 回覆尚未實作:', text);
  }
}

function 問AI(msg) {
  return 呼叫AI回覆(msg);
}

function 讓AI解釋(msg) {
  return 呼叫AI回覆(msg);
}

if (typeof window !== 'undefined') {
  window.呼叫AI回覆 = 呼叫AI回覆;
  window.問AI = 問AI;
  window.讓AI解釋 = 讓AI解釋;
} else if (typeof global !== 'undefined') {
  global.呼叫AI回覆 = 呼叫AI回覆;
  global.問AI = 問AI;
  global.讓AI解釋 = 讓AI解釋;
}

module.exports = { 呼叫AI回覆, 問AI, 讓AI解釋 };

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports = {
  加入項目: (list, item) => `ArrayModule.加入項目(${list}, ${item})`,

  顯示第幾項: (list, index) => `${list}[${index} - 1]`,

  取得項目: (list, index) => `${list}[${index} - 1]`,

  清單包含: (list, value) => `${list}.includes(${value})`,

  清空清單: (list) => `${list}.length = 0`
};

},{}],3:[function(require,module,exports){
// blangSyntaxAPI.js

const registerPatterns = require('./patterns');
const patternRegistry = [];
const patternGroups = {};
const { handleFunctionCall } = require('./semanticHandler-v0.9.4.js');
const vocabularyMap = require('./vocabulary_map.json');
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function levenshtein(a = '', b = '') {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function stripPattern(p) {
  return p
    .replace(/\$[\w\u4e00-\u9fa5_]+/g, '')
    .replace(/[（）()]/g, '')
    .trim();
}

function findClosestMatch(input) {
  const candidates = [
    ...patternRegistry.map((p) => stripPattern(p.pattern)),
    ...Object.keys(vocabularyMap)
  ];
  let best = '';
  let bestDist = Infinity;
  for (const c of candidates) {
    const d = levenshtein(input, c);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

function definePattern(pattern, generator, options = {}) {
  const entry = { pattern, generator };
  if (options.description) entry.description = options.description;
  if (Array.isArray(options.hints)) entry.hints = options.hints;
  if (options.type) entry.type = options.type;
  patternRegistry.push(entry);
  if (entry.type) {
    if (!patternGroups[entry.type]) {
      patternGroups[entry.type] = [];
    }
    patternGroups[entry.type].push(entry);
  }
}

// 在解析器初始化前註冊自訂語法模式
registerPatterns(definePattern);

function runBlangParser(lines) {
  const output = [];
  const controlStack = [];

  for (let line of lines) {
    let matched = false;

    for (let { pattern, generator } of patternRegistry) {
      const { regex, vars } = buildRegexFromPattern(pattern);
      const match = line.match(regex);

      if (match) {
        const args = match.slice(1); // 因為 match[0] 是整串
        const named = {};
        vars.forEach((v, i) => {
          named[v] = args[i];
        });
        output.push(generator(...args, named));
        matched = true;
        break;
      }
    }

    if (!matched) {
      const trimmed = line.trim();
      for (const key in vocabularyMap) {
        if (trimmed.startsWith(key)) {
          const callMatch = trimmed.match(new RegExp('^' + escapeRegExp(key) + '[（(](.*)[）)]$'));
          if (callMatch) {
            output.push(handleFunctionCall(key, callMatch[1]));
            matched = true;
            break;
          }
          if (trimmed === key) {
            output.push(handleFunctionCall(key, ''));
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        // 嘗試使用舊版條件判斷處理語句
        const legacy = legacyParse(line);
        output.push(legacy);
        if (legacy.trim().startsWith('}') && controlStack.length > 0) {
          controlStack.pop();
        }
      }
    }
  }

  while (controlStack.length > 0) {
    output.push(controlStack.pop());
  }

  return output.join('\n');
}

// 舊版解析邏輯，作為沒有匹配時的備援
function legacyParse(line) {
  const displayMatch = line.match(/^顯示[（(](.*)[)）]$/);
  if (displayMatch) {
    return `alert(${displayMatch[1]});`;
  }
  const assignMatch = line.match(/^設定\s*(\S+)\s*為\s*(.+)$/);
  if (assignMatch) {
    return `let ${assignMatch[1]} = ${assignMatch[2]};`;
  }
  const suggestion = findClosestMatch(line.trim());
  return `// 無法辨識語句，是否想輸入：${suggestion}?`;
}

function buildRegexFromPattern(pattern) {
  // 將包含 $參數 的樣式自動轉為正則並支援括號
  const parts = pattern.split(/(\$[\w\u4e00-\u9fa5_]+)/);
  const vars = [];
  let regexStr = '^';
  for (let part of parts) {
    if (part.startsWith('$')) {
      vars.push(part.slice(1));
      regexStr += '(?:\\(|（)?(.+?)(?:\\)|）)?';
    } else if (part) {
      regexStr += part.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    }
  }
  regexStr += '$';
  return { regex: new RegExp(regexStr), vars };
}

function getRegisteredPatterns() {
  return patternRegistry.map(({ pattern, type, description, hints }) => ({
    pattern,
    type,
    description,
    hints
  }));
}

function getPatternsByType(type) {
  return patternGroups[type] || [];
}

function fillPattern(pattern) {
  let count = 1;
  return pattern.replace(/\$[\w\u4e00-\u9fa5_]+/g, () => `樣本${count++}`);
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function getFuzzySuggestions(input, limit = 3) {
  const cmds = Array.from(
    new Set([
      ...Object.keys(vocabularyMap),
      ...patternRegistry.map((p) => p.pattern.replace(/\$[\w\u4e00-\u9fa5_]+/g, ''))
    ])
  );
  const ranked = cmds.map((c) => ({ c, d: levenshtein(input, c) })).sort((a, b) => a.d - b.d);
  return ranked.slice(0, limit).map((r) => r.c);
}

function generateDatalist() {
  return getRegisteredPatterns()
    .map((p) => `<option value="${fillPattern(p.pattern)}"></option>`)
    .join('\n');
}

module.exports = {
  definePattern,
  runBlangParser,
  buildRegexFromPattern,
  getRegisteredPatterns,
  getFuzzySuggestions,
  generateDatalist,
  getPatternsByType
};

if (typeof window !== 'undefined') {
  window.runBlangParser = runBlangParser;
}

},{"./patterns":19,"./semanticHandler-v0.9.4.js":23,"./vocabulary_map.json":29}],4:[function(require,module,exports){
module.exports = {
  紅色: 'red',
  藍色: 'blue',
  綠色: 'green',
  黑色: 'black',
  白色: 'white',
  黃色: 'yellow',
  粉紅色: 'pink',
  橘色: 'orange',
  淡藍色: 'lightblue'
};

},{}],5:[function(require,module,exports){
module.exports = {
  顯示訊息框: (msg) => `alert(${msg})`,
  確認: (msg) => `confirm(${msg})`
};

},{}],6:[function(require,module,exports){
module.exports = {
  顯示圖片: (src, selector) => {
    const cleanSrc = src.replace(/^["']|["']$/g, '');
    const elExpr = `document.querySelector(${selector})`;
    return `const img = document.createElement('img'); img.src = "${cleanSrc}"; ${elExpr} && ${elExpr}.appendChild(img)`;
  }
};

},{}],7:[function(require,module,exports){
// inputModule.js
module.exports = {
  使用者輸入: (問題) => `prompt(${問題})`
};

},{}],8:[function(require,module,exports){
const log = (text) => {
  const clean = /^['"].*['"]$/.test(text.trim()) ? text : `"${text}"`;
  return `console.log(${clean})`;
};

module.exports = {
  顯示內容: log,
  說一句話: log
};

},{}],9:[function(require,module,exports){
module.exports = {
  重複次數執行: (times, jsStatement) => {
    const stmt = jsStatement.trim().replace(/;?$/, ';');
    return `for (let i = 0; i < ${times}; i++) { ${stmt} }`;
  }
};

},{}],10:[function(require,module,exports){
// mathModule.js
module.exports = {
  隨機一個數: (max) => `Math.floor(Math.random() * ${max})`,
  四捨五入: (value) => `Math.round(${value})`,
  無條件捨去: (value) => `Math.floor(${value})`,
  無條件進位: (value) => `Math.ceil(${value})`,
  平方: (value) => `Math.pow(${value}, 2)`,
  次方: (base, exp) => `Math.pow(${base}, ${exp})`,
  絕對值: (value) => `Math.abs(${value})`
};

},{}],11:[function(require,module,exports){
module.exports = {
  播放影片: (target) => {
    const elExpr = `document.querySelector(${target})`;
    return `${elExpr} && ${elExpr}.play()`;
  },
  暫停音效: (target) => {
    const elExpr = `document.querySelector(${target})`;
    return `${elExpr} && ${elExpr}.pause()`;
  }
};

},{}],12:[function(require,module,exports){
// objectModule.js

module.exports = {
  建立人物: (名字, 年齡) => `let 人物 = { 名字: ${名字}, 年齡: ${年齡} }`,
  取得屬性: (obj, key) => `${obj}[${key}]`
};

},{}],13:[function(require,module,exports){
const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerArrayPatterns(definePattern) {
  definePattern(
    '建立清單($名稱)',
    (名稱) => `let ${名稱} = ArrayModule.建立清單();`,
    { type: 'data', description: 'create list variable' }
  );
  definePattern(
    '遍歷 $清單 並顯示每項',
    (清單) => `${清單}.forEach(item => alert(item));`,
    { type: 'data', description: 'iterate list items' }
  );
  definePattern(
    '加入 $項目 到 $清單',
    (項目, 清單) => {
      const item = processDisplayArgument(項目);
      const list = processDisplayArgument(清單);
      return `ArrayModule.加入項目(${list}, ${item});`;
    },
    { type: 'data', description: 'append item to list' }
  );
  definePattern(
    '加入項目($清單, $項目)',
    (清單, 項目) => {
      const list = 清單.trim();
      const item = processDisplayArgument(項目);
      return `ArrayModule.加入項目(${list}, ${item});`;
    },
    { type: 'data', description: 'append item to list directly' }
  );
  definePattern(
    '把 $項目 加進 $清單',
    (項目, 清單) => {
      const item = processDisplayArgument(項目);
      const list = processDisplayArgument(清單);
      return `ArrayModule.加入項目(${list}, ${item});`;
    },
    { type: 'data', description: 'append item to list' }
  );
  definePattern(
    '反轉 $清單',
    (清單) => `${清單}.reverse();`,
    { type: 'data', description: 'reverse list' }
  );

  definePattern(
    '顯示第幾項($清單, $位置)',
    (清單, 位置) => `alert(${清單}[${位置} - 1]);`,
    { type: 'array', description: 'display nth item of list' }
  );

  definePattern(
    '取得項目($清單, $位置)',
    (清單, 位置) => `${清單}[${位置} - 1]`,
    { type: 'array', description: 'get item from list' }
  );

  definePattern(
    '清空清單($清單)',
    (清單) => `${清單}.length = 0;`,
    { type: 'array', description: 'empty list' }
  );
};

},{"../semanticHandler-v0.9.4.js":23}],14:[function(require,module,exports){
module.exports = function registerConditionPatterns(definePattern) {
  definePattern(
    '否則如果($條件)：',
    (條件) => `} else if (${條件}) {`,
    { type: 'control', description: 'else if statement' }
  );
};

},{}],15:[function(require,module,exports){
module.exports = function registerConfirmPattern(definePattern) {
  definePattern('確認($訊息)', (訊息) => `confirm(${訊息})`);
};

},{}],16:[function(require,module,exports){
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
    (元素) => handleFunctionCall('隱藏', 元素),
    { type: 'ui', description: '隱藏指定元素', hints: ['元素'] }
  );
  definePattern(
    '顯示 $訊息 在 $選擇器',
    (訊息, 選擇器) =>
      `document.querySelector('${選擇器}').textContent = ${訊息};`,
    { type: 'ui', description: 'update DOM text content' }
  );
  definePattern(
    '顯示圖片($路徑 在 $選擇器)',
    (路徑, 選擇器) => handleFunctionCall('顯示圖片', `${路徑}, ${選擇器}`),
    { type: 'ui', description: 'append image to selector' }
  );
  // vocabulary_map.json handles 設定背景色
  definePattern(
    '切換顏色($參數)',
    (參數) => {
      const [選擇器, 顏色1, 顏色2] = 參數.split(/\s*,\s*/);
      const sel = processDisplayArgument(選擇器);
      const c1 = processDisplayArgument(顏色1);
      const c2 = processDisplayArgument(顏色2);
      const elVar = `__toggleEl${toggleId++}`;
      return `let ${elVar} = document.querySelector(${sel}); ${elVar}.style.color = ${elVar}.style.color === ${c1} ? ${c2} : ${c1};`;
    },
    { type: 'ui', description: 'toggle text color' }
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
  // 循環播放音樂 改由 vocabulary_map.json 提供
  definePattern('顯示 $內容', (內容) => `alert(${內容});`, {
    description: '彈出警示框顯示指定內容',
    hints: ['內容']
  });
};

},{"../semanticHandler-v0.9.4.js":23}],17:[function(require,module,exports){
const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerEventPatterns(definePattern) {
  const handler = (選擇器) => {
    const sel = processDisplayArgument(選擇器);
    return `document.querySelector(${sel}).addEventListener("click", () => {`;
  };

  definePattern('當（$選擇器.被點擊）時：', handler, {
    type: 'control',
    description: 'add click event listener'
  });
  definePattern('當($選擇器.被點擊)時：', handler, {
    type: 'control',
    description: 'add click event listener'
  });
};

},{"../semanticHandler-v0.9.4.js":23}],18:[function(require,module,exports){
const { handleFunctionCall } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerGeneralPatterns(definePattern) {
  definePattern(
    '$函式名($參數)',
    (函式名, 參數) => {
      if (函式名 === '顯示') return `alert(${參數});`;
      return handleFunctionCall(函式名, 參數);
    },
    { type: 'function', description: 'direct function call' }
  );
};

},{"../semanticHandler-v0.9.4.js":23}],19:[function(require,module,exports){
const arrayPatterns = require('./array');
const displayPatterns = require('./display');
const mediaPatterns = require('./media');
const eventPatterns = require('./event');
const logicPatterns = require('./logic');
const confirmPattern = require('./confirm');
const conditionPattern = require('./condition');
const loopPatterns = require('./loop');
const generalPatterns = require('./general');

module.exports = function registerPatterns(definePattern) {
  logicPatterns(definePattern);
  arrayPatterns(definePattern);
  displayPatterns(definePattern);
  mediaPatterns(definePattern);
  confirmPattern(definePattern);
  conditionPattern(definePattern);
  eventPatterns(definePattern);
  loopPatterns(definePattern);
  generalPatterns(definePattern);
};

},{"./array":13,"./condition":14,"./confirm":15,"./display":16,"./event":17,"./general":18,"./logic":20,"./loop":21,"./media":22}],20:[function(require,module,exports){
const { handleFunctionCall } = require('../semanticHandler-v0.9.4.js');

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

  // 新增函式定義與呼叫相關樣式
  definePattern(
    '定義 $函式名($參數)：',
    (函式名, 參數) => `function ${函式名}(${參數}) {`,
    { type: 'function', description: 'define a function' }
  );
  definePattern(
    '呼叫 $函式名($參數)',
    (函式名, 參數) => handleFunctionCall(函式名, 參數),
    { type: 'function', description: 'call a function' }
  );
};

},{"../semanticHandler-v0.9.4.js":23}],21:[function(require,module,exports){
const loopModule = require('../loopModule.js');

module.exports = function registerLoopPatterns(definePattern) {
  definePattern(
    '重複 $次數 次 $語句',
    (次數, 語句) => {
      const { runBlangParser } = require('../blangSyntaxAPI.js');
      let stmt = 語句;
      const open = (stmt.match(/\(/g) || []).length;
      const close = (stmt.match(/\)/g) || []).length;
      if (open > close) stmt += ')';
      return loopModule.重複次數執行(次數, runBlangParser([stmt]).trim());
    },
    { type: 'control', description: 'repeat an action N times' }
  );
};

},{"../blangSyntaxAPI.js":3,"../loopModule.js":9}],22:[function(require,module,exports){
const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerMediaPatterns(definePattern) {
  // 播放音效與暫停影片相關語法
  definePattern(
    '暫停影片()',
    () => 'document.querySelector("#影片播放器")?.pause();',
    { type: 'media', description: 'pause default video player' }
  );

  definePattern(
    '播放音效($路徑)',
    (路徑) => `new Audio(${processDisplayArgument(路徑)}).play();`,
    { type: 'media', description: 'play audio file' }
  );
};

},{"../semanticHandler-v0.9.4.js":23}],23:[function(require,module,exports){
// v0.9.7 - semanticHandler.js（支援物件屬性 + 中文樣式屬性轉換）

const stringModule = require('./stringModule.js');
const mathModule = require('./mathModule.js');
const objectModule = require('./objectModule.js');
const dialogModule = require('./dialogModule.js');
const inputModule = require('./inputModule.js');
const styleModule = require('./styleModule.js');
const imageModule = require('./imageModule.js');
const logModule = require('./logModule.js');
const mediaModule = require('./mediaModule.js');
const soundModule = require('./soundModule.js');
const timeModule = require('./timeModule.js');
const textModule = require('./textModule.js');
const arrayModule = require('./arrayModule.js');
const vocabularyMap = require('./vocabulary_map.json');
const colorMap = require('./colorMap.js');
require('./aiModule.js');

const modules = {
  stringModule,
  mathModule,
  objectModule,
  dialogModule,
  inputModule,
  styleModule,
  imageModule,
  logModule,
  mediaModule,
  soundModule,
  timeModule,
  textModule,
  arrayModule
};
/***** 中文函式 → FQN 對應 *****/
const FUNC_MAP = {
  加入項目: 'ArrayModule.加入項目',
  加入清單項目: 'ArrayModule.加入項目',
  移除最後: 'ArrayModule.移除最後',
  顯示全部: 'ArrayModule.顯示全部',
  顯示第幾項: 'ArrayModule.顯示第幾項',
  取得項目: 'ArrayModule.取得項目',
  清空清單: 'ArrayModule.清空清單',
  'AI 回覆': 'DialogModule.AI回覆',
  問AI: 'DialogModule.AI回覆',
  '問 AI': 'DialogModule.AI回覆',
  讓AI解釋: 'DialogModule.AI回覆',
  '讓 AI 解釋': 'DialogModule.AI回覆',
  顯示訊息框: 'DialogModule.顯示訊息框',
  播放音效: 'soundModule.播放音效',
  設定樣式: 'StyleModule.設定樣式'
};

// ✅ 括號、引號、問號的統一處理（全形→半形）
function normalizeParentheses(text) {
  return text
    .replace(/[（]/g, '(') // 全形左括號
    .replace(/[）]/g, ')') // 全形右括號
    .replace(/[『「]/g, '"') // 中文左引號
    .replace(/[」』]/g, '"') // 中文右引號
    .replace(/[？]/g, '?') // 中文問號
    .replace(/，/g, ','); // 中文逗號，部分情境要支援
}

// ✅ 字串模板套用（$1, $2 ...）自動帶入參數
function applyTemplate(template, args) {
  return args.reduce(
    (acc, val, i) => acc.replace(new RegExp(`\\$${i + 1}`, 'g'), val.trim()),
    template
  );
}

// ✅ 拆解「函式名（參數, 參數2）」的括號內參數
function extractArguments(text, phrase = '') {
  // 先去掉 phrase，以防 phrase 也有括號
  let core = text;
  if (phrase && text.startsWith(phrase)) {
    core = text.slice(phrase.length);
  }
  const argsMatch = core.match(/[（(](.*)[）)]/);
  // split 逗號時兩側容忍空白
  return argsMatch ? argsMatch[1].split(/\s*,\s*/) : [];
}

// ✅ 條件式中文自動轉成 JS 運算子（內含強化）
function processConditionExpression(str) {
  if (!str) return str;
  return str
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/。/g, '.') // 中文句號有時出現在成員存取
    .replace(/內容長度/g, 'value.length')
    .replace(/長度/g, 'length')
    .replace(/內容/g, 'value')
    .replace(/大於等於/g, '>=')
    .replace(/小於等於/g, '<=')
    .replace(/大於/g, '>')
    .replace(/小於/g, '<')
    .replace(/不為/g, '!==')
    .replace(/為/g, '===') // 注意：「為」通常對應嚴格等於
    .replace(/不等於/g, '!=')
    .replace(/＝{2,}/g, '==') // 多個全形等號，統一成 JS
    .replace(/＝/g, '==') // 單個全形等號也統一
    .replace(/且/g, '&&') // 補充：有些條件會寫「且」
    .replace(/或/g, '||'); // 補充：有些條件會寫「或」
}

function processDisplayArgument(arg, declaredVars = new Set()) {
  const trimmed = arg.trim();
  if (/^"[A-Za-z_]+Module\.[^"]+"$/.test(trimmed)) {
    return trimmed.slice(1, -1);
  }

  if (!trimmed) return '""';

  arg = normalizeParentheses(trimmed);

  // ArrayModule特殊處理
  if (/^顯示第幾項[（(](.*?),(.*)[）)]$/.test(arg)) {
    const m = arg.match(/^顯示第幾項[（(](.*?),(.*)[）)]$/);
    return `ArrayModule.顯示第幾項(${m[1].trim()}, ${m[2].trim()})`;
  }
  if (/^顯示全部[（(](.*)[）)]$/.test(arg)) {
    const m = arg.match(/^顯示全部[（(](.*)[）)]$/);
    return `ArrayModule.顯示全部(${m[1].trim()})`;
  }

  // 直接識別 ModuleName.函式名()
  if (/^[A-Za-z_]+Module\.[\u4e00-\u9fa5\w]+\(.*\)$/.test(arg)) {
    return arg;
  }

  // 物件屬性處理
  if (/^[\u4e00-\u9fa5\w]+\[\s*[\u4e00-\u9fa5a-zA-Z_][\w\u4e00-\u9fa5]*\s*\]$/.test(arg)) {
    const match = arg.match(
      /([\u4e00-\u9fa5\w]+)\[\s*([\u4e00-\u9fa5a-zA-Z_][\w\u4e00-\u9fa5]*)\s*\]/
    );
    if (match) {
      const obj = match[1];
      const key = match[2];
      if (declaredVars.has(key)) {
        return `${obj}[${key}]`; // ✅ 是變數，直接留
      } else {
        return `${obj}["${key}"]`; // ⚠️ 不是變數，補上引號
      }
      return declaredVars.has(key) ? `${obj}[${key}]` : `${obj}["${key}"]`;
    }
  }

  // 處理 ["key"]
  if (/^[\u4e00-\u9fa5\w]+\s*\[\s*["“”‘’'][^"'“”‘’]+["“”‘’']\s*\]$/.test(arg)) {
    return arg.replace(/[“”‘’]/g, '"').replace(/[‘’]/g, "'");
  }

  // 數字型key直接返回
  if (/^[\u4e00-\u9fa5\w]+\[\s*\d+\s*\]$/.test(arg)) {
    return arg;
  }

  if (arg.endsWith('.內容')) return arg.replace('.內容', '.value');
  if (declaredVars.has(arg)) return arg;

  // 🔥【正確位置】先判斷顏色轉換（重要！）
  if (colorMap[arg]) {
    return `"${colorMap[arg]}"`;
  }

  // 最後才進行純單詞包引號處理
  if (/^[\u4e00-\u9fa5a-zA-Z_][\w\u4e00-\u9fa5]*$/.test(arg)) {
    return `"${arg}"`;
  }

  for (const phrase in vocabularyMap) {
    if (arg.startsWith(phrase + '（') || arg.startsWith(phrase + '(')) {
      const def = vocabularyMap[phrase];
      const moduleName = def.module;
      const jsTemplate = def.js;
      const args = extractArguments(arg, phrase);
      if (!args) break;
      const cleanArgs = args.map((p) => {
        const trimmed = p.trim();
        const raw = trimmed.replace(/^\s*["“”'']|["“”'']\s*$/g, '');

        if (phrase === '替換文字' && /^['"“”].*['"“”]$/.test(trimmed)) {
          return `"${raw}"`;
        }

        if (colorMap[raw]) {
          return `"${colorMap[raw]}"`;
        }
        if (/^[\d.]+$/.test(raw)) return raw;
        if (declaredVars.has(raw)) return raw;
        if (/^[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*$/.test(raw))
          return `"${raw}"`;
        return `"${raw}"`;
      });
      const mod = modules[moduleName];
      if (mod && typeof mod[phrase] === 'function') {
        try {
          return mod[phrase](...cleanArgs);
        } catch (e) {
          console.warn(`⚠️ 模組錯誤：${moduleName}.${phrase} 呼叫失敗`, e);
        }
      }
      return applyTemplate(jsTemplate, cleanArgs);
    }
  }

  if (/^".*"$/.test(arg)) return arg;
  return `"${arg.replace(/^"+|"+$/g, '')}"`;
}

function handleFunctionCall(funcName, params, indent = 0, declaredVars = new Set()) {
  const space = ' '.repeat(indent);
  const fqName = FUNC_MAP[funcName] || funcName;


  if (
    funcName === 'AI 回覆' ||
    funcName === '呼叫 AI 回覆' ||
    funcName === '問AI' ||
    funcName === '問 AI' ||
    funcName === '讓AI解釋' ||
    funcName === '讓 AI 解釋'
  ) {
    return `${space}callAI(${processDisplayArgument(params, declaredVars)}); // 🔮 AI`;
  }

  if (vocabularyMap[funcName]) {
    const def = vocabularyMap[funcName];
    const moduleName = def.module;
    const jsTemplate = def.js;

    const args = params.split(',').map((p, idx) => {
      const raw = p.trim().replace(/^\s*["“”‘’']|["“”‘’']\s*$/g, '');

      // 🔥 特別處理「設定樣式」的第三個參數（顏色）
      if (funcName === '設定樣式' && idx === 2 && colorMap[raw]) {
        return `"${colorMap[raw]}"`;
      }
      if (funcName === '設定背景色' && idx === 1 && colorMap[raw]) {
        return `"${colorMap[raw]}"`;
      }

      // 支援物件屬性 ["key"]
      if (/^[\u4e00-\u9fa5\w]+\s*\[\s*["“”‘’'][^"'“”‘’]+["“”‘’']\s*\]$/.test(raw)) {
        return raw.replace(/[“”‘’]/g, '"');
      }

      // 建立人物的第一參數補上雙引號
      if (funcName === '建立人物' && idx === 0) {
        return `"${raw}"`;
      }

      // 數字
      if (/^[\d.]+$/.test(raw)) return raw;

      // 合法變數：僅當在宣告集合中出現時才視為變數
      if (declaredVars.has(raw)) {
        return raw;
      }

      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(raw)) return `"${raw}"`;

      // 其他全部包雙引號
      return `"${raw}"`;
    });

    const mod = modules[moduleName];
    if (mod && typeof mod[funcName] === 'function') {
      try {
        return `${space}${mod[funcName](...args)};`;
      } catch (e) {
        console.warn(`⚠️ 模組 ${moduleName}.${funcName} 錯誤`, e);
      }
    }
    return `${space}${applyTemplate(jsTemplate, args)};`;
  }

  return `${space}${fqName}(${params});`;
}

module.exports = {
  normalizeParentheses,
  applyTemplate,
  extractArguments,
  processDisplayArgument,
  processConditionExpression,
  handleFunctionCall,
  styleModule
};

if (typeof window !== 'undefined') {
  window.processDisplayArgument = processDisplayArgument;
  window.handleFunctionCall = handleFunctionCall;
  window.normalizeParentheses = normalizeParentheses;
  window.processConditionExpression = processConditionExpression;
}
// 這個模組的功能是將中文語句轉換為 JavaScript 語句，
// 並且支援物件屬性和中文樣式屬性轉換。

},{"./aiModule.js":1,"./arrayModule.js":2,"./colorMap.js":4,"./dialogModule.js":5,"./imageModule.js":6,"./inputModule.js":7,"./logModule.js":8,"./mathModule.js":10,"./mediaModule.js":11,"./objectModule.js":12,"./soundModule.js":24,"./stringModule.js":25,"./styleModule.js":26,"./textModule.js":27,"./timeModule.js":28,"./vocabulary_map.json":29}],24:[function(require,module,exports){
module.exports = {
  播放音效: (src) => `new Audio(${src}).play()`
};

},{}],25:[function(require,module,exports){
// stringModule.js
module.exports = {
  轉大寫: (input) => `${input}.toUpperCase()`,
  包含: (str, substr) => `${str}.includes(${substr})`,
  長度: (input) => `${input}.length`,

  去除空白: (input) => `${input}.trim()`
};

},{}],26:[function(require,module,exports){
const colorMap = require('./colorMap.js');

const hide = (selector) => {
  const elExpr = `document.querySelector(${selector})`;
  return `${elExpr} && (${elExpr}.style.display = "none")`;
};

module.exports = {
  設定樣式: (selector, styleProp, value) => {
    const propMap = {
      背景色: 'backgroundColor',
      文字顏色: 'color',
      字型大小: 'fontSize',
      邊框: 'border',
      寬度: 'width',
      高度: 'height'
    };

    const cleanProp = propMap[styleProp.replace(/['"]/g, '')] || styleProp.replace(/['"]/g, '');
    const cleanValue = value.replace(/^["']|["']$/g, ''); // 🔥 去掉 value 最外層引號

    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.style["${cleanProp}"] = "${cleanValue}")`;
  },
  隱藏: hide,
  隱藏元素: hide,
  顯示: (selector) => {
    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.style.display = "block")`;
  },
  設定背景色: (selector, color) => {
    const cleanColor = color.replace(/^['"]|['"]$/g, '');
    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.style.backgroundColor = "${cleanColor}")`;
  },
  切換顏色: (() => {
    let id = 0;
    return (selector, c1, c2) => {
      const varName = `__toggleEl${id++}`;
      const color1 = colorMap[c1.replace(/^["']|["']$/g, '')] ? `"${colorMap[c1.replace(/^["']|["']$/g, '')]}"` : c1;
      const color2 = colorMap[c2.replace(/^["']|["']$/g, '')] ? `"${colorMap[c2.replace(/^["']|["']$/g, '')]}"` : c2;
      return `let ${varName} = document.querySelector(${selector}); if (${varName}) ${varName}.style.color = ${varName}.style.color === ${color1} ? ${color2} : ${color1}`;
    };
  })()
};

},{"./colorMap.js":4}],27:[function(require,module,exports){
module.exports = {
  設定文字內容: (selector, text) => {
    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.textContent = ${text})`;
  }
};

},{}],28:[function(require,module,exports){
module.exports = {
  獲取現在時間: () => 'new Date().toLocaleTimeString()',
  顯示現在時間: () => 'alert(new Date().toLocaleString())',
  顯示今天是星期幾: () =>
    'alert("今天是星期" + "日一二三四五六"[new Date().getDay()])',
  顯示現在是幾點幾分: () =>
    'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分")'
};

},{}],29:[function(require,module,exports){
module.exports={
    "轉大寫": {
        "module": "stringModule",
        "js": "$1.toUpperCase()"
    },
    "包含": {
        "module": "stringModule",
        "js": "$1.includes($2)"
    },
    "去除空白": {
        "module": "stringModule",
        "js": "$1.trim()"
    },
    "隨機一個數": {
        "module": "mathModule",
        "js": "Math.floor(Math.random() * $1)"
    },
    "四捨五入": {
        "module": "mathModule",
        "js": "Math.round($1)"
    },
    "平方": {
        "module": "mathModule",
        "js": "Math.pow($1, 2)"
    },
    "建立人物": {
        "module": "objectModule",
        "js": "let 人物 = { 名字: \"$1\", 年齡: $2 }"
    },
    "取得屬性": {
        "module": "objectModule",
        "js": "$1[$2]"
    },
    "顯示訊息框": {
        "module": "dialogModule",
        "js": "alert($1)"
    },
    "確認": {
        "module": "dialogModule",
        "js": "confirm($1)"
    },
    "使用者輸入": {
        "module": "inputModule",
        "js": "prompt($1)"
    },
    "設定樣式": {
        "module": "styleModule",
        "js": "styleModule.設定樣式($1, $2, $3)"
    },
    "設定背景色": {
        "module": "styleModule",
        "js": "styleModule.設定背景色($1, $2)"
    },
    "建立物件": {
        "module": "objectModule",
        "js": "ObjectModule.建立物件($1, $2, $3, $4)"
    },
    "顯示清單長度": {
        "module": "arrayModule",
        "js": "$1.length"
    },
    "清空清單": {
        "module": "arrayModule",
        "js": "$1.length = 0"
    },
    "判斷是否為空": {
        "module": "arrayModule",
        "js": "$1.length === 0"
    },
    "清單包含": {
        "module": "arrayModule",
        "js": "$1.includes($2)"
    },
    "切換顏色": {
        "module": "styleModule",
        "js": ""
    },
    "隱藏元素": {
        "module": "styleModule",
        "js": "styleModule.隱藏($1)"
    },
    "隱藏": {
        "module": "styleModule",
        "js": "styleModule.隱藏($1)"
    },
    "顯示": {
        "module": "styleModule",
        "js": "styleModule.顯示($1)"
    },
    "切換顯示隱藏": {
        "module": "styleModule",
        "js": "const el = document.querySelector($1); el.style.display = el.style.display === 'none' ? 'block' : 'none'"
    },
    "播放影片": {
        "module": "mediaModule",
        "js": "$1.play()"
    },
    "暫停音效": {
        "module": "mediaModule",
        "js": "$1.pause()"
    },
    "暫停影片": {
        "module": "mediaModule",
        "js": "document.querySelector(\"#影片播放器\")?.pause()"
    },
    "獲取現在時間": {
        "module": "timeModule",
        "js": "new Date().toLocaleTimeString()"
    },
    "顯示現在時間": {
        "module": "timeModule",
        "js": "alert(new Date().toLocaleString())"
    },
    "顯示今天是星期幾": {
        "module": "timeModule",
        "js": "alert(\"今天是星期\" + \"日一二三四五六\"[new Date().getDay()])"
    },
    "顯示現在是幾點幾分": {
        "module": "timeModule",
        "js": "alert(\"現在是\" + new Date().getHours() + \"點\" + new Date().getMinutes() + \"分\")"
    },
    "替換文字": {
        "module": "stringModule",
        "js": "$1.replace($2, $3)"
    },
    "轉跳網頁": {
        "module": "core",
        "js": "window.location.href = $1"
    },
    "顯示圖片": {
        "module": "imageModule",
        "js": "imageModule.顯示圖片($1, $2)"
    },
    "播放音效": {
        "module": "soundModule",
        "js": "new Audio($1).play()"
    },
    "循環播放音樂": {
        "module": "soundModule",
        "js": "const a = new Audio($1); a.loop = true; a.play()"
    },
    "設定文字內容": {
        "module": "textModule",
        "js": "textModule.設定文字內容($1, $2)"
    },
    "說一句話": {
        "module": "logModule",
        "js": "logModule.顯示內容($1)"
    },
    "顯示內容": {
        "module": "logModule",
        "js": "logModule.顯示內容($1)"
    }
}

},{}]},{},[3])(3)
});
