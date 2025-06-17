(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.semanticHandler = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  加入項目: (list, item) => `ArrayModule.加入項目(${list}, ${item})`
};

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports = {
  顯示訊息框: (msg) => `alert(${msg})`
};

},{}],4:[function(require,module,exports){
module.exports = {
  顯示圖片: (src, selector) => {
    const cleanSrc = src.replace(/^["']|["']$/g, '');
    return `const img = document.createElement('img'); img.src = "${cleanSrc}"; document.querySelector(${selector}).appendChild(img)`;
  }
};

},{}],5:[function(require,module,exports){
// inputModule.js
module.exports = {
  使用者輸入: (問題) => `prompt(${問題})`
};

},{}],6:[function(require,module,exports){
module.exports = {
  說一句話: (text) => {
    const clean = /^['"].*['"]$/.test(text.trim()) ? text : `"${text}"`;
    return `console.log(${clean})`;
  }
};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = {
  播放影片: (target) => `document.querySelector(${target}).play()`,
  暫停音效: (target) => `document.querySelector(${target}).pause()`
};

},{}],9:[function(require,module,exports){
// objectModule.js

module.exports = {
  建立人物: (名字, 年齡) => `let 人物 = { 名字: ${名字}, 年齡: ${年齡} }`,
  取得屬性: (obj, key) => `${obj}[${key}]`
};

},{}],10:[function(require,module,exports){
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

},{"./arrayModule.js":1,"./colorMap.js":2,"./dialogModule.js":3,"./imageModule.js":4,"./inputModule.js":5,"./logModule.js":6,"./mathModule.js":7,"./mediaModule.js":8,"./objectModule.js":9,"./soundModule.js":11,"./stringModule.js":12,"./styleModule.js":13,"./textModule.js":14,"./timeModule.js":15,"./vocabulary_map.json":16}],11:[function(require,module,exports){
module.exports = {
  播放音效: (src) => `new Audio(${src}).play()`
};

},{}],12:[function(require,module,exports){
// stringModule.js
module.exports = {
  轉大寫: (input) => `${input}.toUpperCase()`,
  包含: (str, substr) => `${str}.includes(${substr})`,
  長度: (input) => `${input}.length`
};

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = {
  設定文字內容: (selector, text) => {
    return `document.querySelector(${selector}).textContent = ${text}`;
  }
};

},{}],15:[function(require,module,exports){
module.exports = {
  獲取現在時間: () => 'new Date().toLocaleTimeString()',
  顯示現在時間: () => 'alert(new Date().toLocaleString())',
  顯示今天是星期幾: () =>
    'alert("今天是星期" + "日一二三四五六"[new Date().getDay()])',
  顯示現在是幾點幾分: () =>
    'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分")'
};

},{}],16:[function(require,module,exports){
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

},{}]},{},[10])(10)
});
