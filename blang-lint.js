// 🧠 blang-lint.js v0.1 - Blang 靜態語法檢查器（初版）
const fs = require('fs');
const { getRegisteredPatterns, buildRegexFromPattern } = require('./blangSyntaxAPI.js');

const filepath = process.argv[2] || 'demo.blang';
const lines = fs.readFileSync(filepath, 'utf8').split('\n');

let issues = [];
const patternRegexes = getRegisteredPatterns().map(p => buildRegexFromPattern(p.pattern).regex);

function checkIndentation(line, index) {
  const trimmed = line.trim();
  if (trimmed === '') return;

  const indent = line.match(/^\s*/)[0].length;
  if (indent % 4 !== 0) {
    issues.push({
      line: index + 1,
      type: '縮排錯誤',
      message: `第 ${index + 1} 行縮排不是 4 的倍數，建議統一風格`
    });
  }
}

function checkUnclosedParentheses(line, index) {
  const open = (line.match(/（/g) || []).length;
  const close = (line.match(/）/g) || []).length;
  if (open !== close) {
    issues.push({
      line: index + 1,
      type: '括號不對稱',
      message: `第 ${index + 1} 行有 ${open} 個「（」與 ${close} 個「）」`
    });
  }
}

function checkUnknownStart(line, index) {
  const trimmed = line.trim();
  if (trimmed === '') return;

  const matched = patternRegexes.some((re) => re.test(trimmed));
  if (!matched) {
    issues.push({
      line: index + 1,
      type: '未知語句',
      message: `第 ${index + 1} 行開頭未識別：${trimmed.slice(0, 8)}...`
    });
  }
}

lines.forEach((line, i) => {
  checkIndentation(line, i);
  checkUnclosedParentheses(line, i);
  checkUnknownStart(line, i);
});

if (issues.length === 0) {
  console.log(`✅ ${filepath} 沒有發現語法問題！`);
} else {
  console.log(`🚨 ${filepath} 發現 ${issues.length} 項語法問題：`);
  issues.forEach((issue) => {
    console.log(`  [第 ${issue.line} 行] ${issue.type}：${issue.message}`);
  });
  process.exitCode = 1;
}
