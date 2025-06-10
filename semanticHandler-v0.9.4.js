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
  soundModule
};
/***** 中文函式 → FQN 對應 *****/
const FUNC_MAP = {
  加入項目: 'ArrayModule.加入項目',
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
  handleFunctionCall
};
// 這個模組的功能是將中文語句轉換為 JavaScript 語句，
// 並且支援物件屬性和中文樣式屬性轉換。
