const fs = require('fs');
const { getRegisteredPatterns } = require('./blangSyntaxAPI.js');

const patterns = getRegisteredPatterns();
const grouped = {};
for (const p of patterns) {
  const type = p.type || 'general';
  (grouped[type] = grouped[type] || []).push(p);
}

let output = '# Blang Grammar Patterns\n\n';
for (const [type, list] of Object.entries(grouped)) {
  output += `## ${type}\n\n`;
  output += '| Pattern | Description |\n';
  output += '| --- | --- |\n';
  for (const entry of list) {
    const vars = (entry.pattern.match(/\$[\w\u4e00-\u9fa5_]+/g) || []).map(v => v.slice(1));
    const snippet = entry
      .generator(...vars.map(v => `$${v}`))
      .replace(/\|/g, '\\|');
    const pat = entry.pattern.replace(/\|/g, '\\|');
    output += `| ${pat} | \`${snippet}\` |\n`;
  }
  output += '\n';
}

fs.writeFileSync('grammar_auto.md', output);
console.log('grammar_auto.md updated');
