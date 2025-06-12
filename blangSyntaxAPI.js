// blangSyntaxAPI.js

const registerPatterns = require('./customBlangPatterns.js');
const patternRegistry = [];

function definePattern(pattern, generator, options = {}) {
  patternRegistry.push({ pattern, generator, options });
}

// 在解析器初始化前註冊自訂語法模式
registerPatterns(definePattern);

function runBlangParser(lines) {
  const output = [];
  const controlStack = [];

  for (let line of lines) {
    let matched = false;

    for (let { pattern, generator, options } of patternRegistry) {
      const regex = buildRegexFromPattern(pattern);
      const match = line.match(regex);

      if (match) {
        const args = match.slice(1); // 因為 match[0] 是整串
        const generated = generator(...args);
        output.push(generated);
        if (
          options &&
          options.type === 'control' &&
          generated.trim().endsWith('{')
        ) {
          controlStack.push('}');
        } else if (generated.trim().startsWith('}') && controlStack.length > 0) {
          controlStack.pop();
        }
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
  return new RegExp(regexStr);
}

function getRegisteredPatterns() {
  return patternRegistry;
}

module.exports = {
  definePattern,
  runBlangParser,
  getRegisteredPatterns
};
