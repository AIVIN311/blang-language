const fs = require('fs');
const { getRegisteredPatterns, runBlangParser } = require('./blangSyntaxAPI.js');

function fillPattern(pattern) {
  let count = 1;
  // provide multiple sample values for patterns expecting comma separated args
  if (pattern.includes('切換顏色($參數)')) {
    return pattern.replace('$參數', '#id, 紅色, 藍色');
  }
  return pattern.replace(/\$[\w\u4e00-\u9fa5_]+/g, () => `樣本${count++}`);
}

function escapeMd(text) {
  return text.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

const patterns = getRegisteredPatterns();
const groups = {};
for (const p of patterns) {
  const type = p.type || 'general';
  if (!groups[type]) groups[type] = [];
  const filled = fillPattern(p.pattern);
  const js = runBlangParser([filled]).trim();
  groups[type].push({
    pattern: p.pattern,
    js,
    description: p.description || '',
    hints: Array.isArray(p.hints) ? p.hints.join(', ') : ''
  });
}

let md = '';
for (const type of Object.keys(groups)) {
  md += `## ${type}\n\n`;
  md += '| Pattern | JavaScript | Description | Hints |\n';
  md += '| ------- | ---------- | ----------- | ----- |\n';
  for (const item of groups[type]) {
    md += `| ${escapeMd(item.pattern)} | ${escapeMd(item.js)} | ${escapeMd(item.description)} | ${escapeMd(item.hints)} |\n`;
  }
  md += '\n';
}

fs.writeFileSync('grammar_auto.md', md);
