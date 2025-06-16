// blangSyntaxAPI.js

const registerPatterns = require('./customBlangPatterns.js');
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
  getRegisteredPatterns,
  getPatternsByType
};
