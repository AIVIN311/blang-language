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
  return p.replace(/\$[\w\u4e00-\u9fa5_]+/g, '').replace(/[（）()]/g, '').trim();
}

function findClosestMatch(input) {
  const candidates = [
    ...patternRegistry.map((p) => stripPattern(p.pattern)),
    ...Object.keys(vocabularyMap),
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
  getPatternsByType,
  findClosestMatch
};

if (typeof window !== 'undefined') {
  window.runBlangParser = runBlangParser;
}
