(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.blangSyntaxAPI = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  加入項目: (list, item) => `ArrayModule.加入項目(${list}, ${item})`
};

},{}],2:[function(require,module,exports){
// blangSyntaxAPI.js

const registerPatterns = require('./patterns');
const patternRegistry = [];
const patternGroups = {};

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
      // 嘗試使用舊版條件判斷處理語句
      const legacy = legacyParse(line);
      output.push(legacy);
      if (legacy.trim().startsWith('}') && controlStack.length > 0) {
        controlStack.pop();
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
  return '// 無法辨識語句：' + line;
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
    hints,
  }));
}

function getPatternsByType(type) {
  return patternGroups[type] || [];
}

module.exports = {
  definePattern,
  runBlangParser,
  buildRegexFromPattern,
  getRegisteredPatterns,
  getPatternsByType
};

if (typeof window !== 'undefined') {
  window.runBlangParser = runBlangParser;
}

},{"./patterns":13}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = {
  顯示訊息框: (msg) => `alert(${msg})`
};

},{}],5:[function(require,module,exports){
module.exports = {
  顯示圖片: (src, selector) => {
    const cleanSrc = src.replace(/^["']|["']$/g, '');
    return `const img = document.createElement('img'); img.src = "${cleanSrc}"; document.querySelector(${selector}).appendChild(img)`;
  }
};

},{}],6:[function(require,module,exports){
// inputModule.js
module.exports = {
  使用者輸入: (問題) => `prompt(${問題})`
};

},{}],7:[function(require,module,exports){
module.exports = {
  說一句話: (text) => {
    const clean = /^['"].*['"]$/.test(text.trim()) ? text : `"${text}"`;
    return `console.log(${clean})`;
  }
};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
module.exports = {
  播放影片: (target) => `document.querySelector(${target}).play()`,
  暫停音效: (target) => `document.querySelector(${target}).pause()`
};

},{}],10:[function(require,module,exports){
// objectModule.js

module.exports = {
  建立人物: (名字, 年齡) => `let 人物 = { 名字: ${名字}, 年齡: ${年齡} }`,
  取得屬性: (obj, key) => `${obj}[${key}]`
};

},{}],11:[function(require,module,exports){
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
    '把 $項目 加進 $清單',
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
      const item = processDisplayArgument(項目);
      return `ArrayModule.加入項目(${清單}, ${item});`;
    },
    { type: 'data', description: 'append item to list (function form)' }
  );
  definePattern(
    '反轉 $清單',
    (清單) => `${清單}.reverse();`,
    { type: 'data', description: 'reverse list' }
  );
};

},{"../semanticHandler-v0.9.4.js":15}],12:[function(require,module,exports){
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
  definePattern('顯示 $內容', (內容) => `alert(${內容});`, {
    description: '彈出警示框顯示指定內容',
    hints: ['內容']
  });
};

},{"../semanticHandler-v0.9.4.js":15}],13:[function(require,module,exports){
const arrayPatterns = require('./array');
const displayPatterns = require('./display');
const logicPatterns = require('./logic');

module.exports = function registerPatterns(definePattern) {
  logicPatterns(definePattern);
  arrayPatterns(definePattern);
  displayPatterns(definePattern);
};

},{"./array":11,"./display":12,"./logic":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
  'AI 回覆': 'DialogModule.AI回覆',
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
        if (/^[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*$/.test(raw) || declaredVars.has(raw))
          return raw;
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


  if (funcName === 'AI 回覆' || funcName === '呼叫 AI 回覆') {
    return `${space}呼叫AI回覆(${processDisplayArgument(params, declaredVars)}); // 🔮 AI`;
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

      // 合法變數
      if (/^[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*$/.test(raw) || declaredVars.has(raw)) {
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

},{"./arrayModule.js":1,"./colorMap.js":3,"./dialogModule.js":4,"./imageModule.js":5,"./inputModule.js":6,"./logModule.js":7,"./mathModule.js":8,"./mediaModule.js":9,"./objectModule.js":10,"./soundModule.js":16,"./stringModule.js":17,"./styleModule.js":18,"./textModule.js":19,"./timeModule.js":20,"./vocabulary_map.json":21}],16:[function(require,module,exports){
module.exports = {
  播放音效: (src) => `new Audio(${src}).play()`
};

},{}],17:[function(require,module,exports){
// stringModule.js
module.exports = {
  轉大寫: (input) => `${input}.toUpperCase()`,
  包含: (str, substr) => `${str}.includes(${substr})`,
  長度: (input) => `${input}.length`
};

},{}],18:[function(require,module,exports){
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

    return `document.querySelector(${selector}).style["${cleanProp}"] = "${cleanValue}"`;
  },
  隱藏元素: (selector) => {
    return `document.querySelector(${selector}).style.display = "none"`;
  },
  隱藏: (selector) => {
    return `document.querySelector(${selector}).style.display = "none"`;
  },
  顯示: (selector) => {
    return `document.querySelector(${selector}).style.display = "block"`;
  },
  設定背景色: (selector, color) => {
    const cleanColor = color.replace(/^['"]|['"]$/g, '');
    return `document.querySelector(${selector}).style.backgroundColor = "${cleanColor}"`;
  }
};

},{}],19:[function(require,module,exports){
module.exports = {
  設定文字內容: (selector, text) => {
    return `document.querySelector(${selector}).textContent = ${text}`;
  }
};

},{}],20:[function(require,module,exports){
module.exports = {
  獲取現在時間: () => 'new Date().toLocaleTimeString()',
  顯示現在時間: () => 'alert(new Date().toLocaleString())',
  顯示今天是星期幾: () =>
    'alert("今天是星期" + "日一二三四五六"[new Date().getDay()])',
  顯示現在是幾點幾分: () =>
    'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分")'
};

},{}],21:[function(require,module,exports){
module.exports={
    "轉大寫": {
        "module": "stringModule",
        "js": "$1.toUpperCase()"
    },
    "包含": {
        "module": "stringModule",
        "js": "$1.includes($2)"
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
    "切換顏色": {
        "module": "styleModule",
        "js": "$1.style.backgroundColor = ($1.style.backgroundColor === '$2' ? '$3' : '$2')"
    },
    "隱藏元素": {
        "module": "styleModule",
        "js": "styleModule.隱藏元素($1)"
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
    "設定文字內容": {
        "module": "textModule",
        "js": "textModule.設定文字內容($1, $2)"
    },
    "說一句話": {
        "module": "logModule",
        "js": "logModule.說一句話($1)"
    }
}

},{}]},{},[2])(2)
});
