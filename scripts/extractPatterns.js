#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const demoPath = path.resolve(__dirname, '../demo.blang');
const patternsPath = path.resolve(__dirname, '../customBlangPatterns.js');

const demoLines = fs.readFileSync(demoPath, 'utf8').split(/\r?\n/);

const commandRegex = /^\s*([^\s(（]+)\s*[（(]([^)]*)[)）]?/;
const skipWords = ['呼叫', '如果', '若', '當', '變數', '等待'];
const commands = {};

for (const line of demoLines) {
  const m = line.match(commandRegex);
  if (!m) continue;
  const cmd = m[1];
  if (skipWords.includes(cmd)) continue;
  const params = m[2]
    .split(/[，,]/)
    .map(s => s.trim())
    .filter(Boolean);
  if (!commands[cmd]) {
    commands[cmd] = { argsCount: params.length };
  }
}

function guessType(cmd) {
  if (/音效|影片|圖片/.test(cmd)) return 'media';
  if (/隱藏|顯示|背景|設定/.test(cmd)) return 'ui';
  return 'control';
}

function generatorCode(cmd, vars) {
  if (/播放音效/.test(cmd)) return `new Audio(${vars[0]}).play();`;
  if (/隱藏/.test(cmd)) return `document.querySelector(${vars[0]}).style.display = "none";`;
  if (/設定背景色/.test(cmd)) return `document.querySelector(${vars[0]}).style.backgroundColor = ${vars[1]};`;
  return '// TODO';
}

let custom = fs.readFileSync(patternsPath, 'utf8');

function hasPattern(content, cmd) {
  const re = new RegExp("definePattern\\(['\"]" + cmd.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'));
  return re.test(content);
}

Object.entries(commands).forEach(([cmd, { argsCount }]) => {
  if (hasPattern(custom, cmd)) return;
  const vars = Array.from({ length: Math.max(argsCount, 1) }, (_, i) => `參數${i + 1}`);
  const pattern = `${cmd}(${vars.map(v => '$' + v).join(', ')})`;
  const body = generatorCode(cmd, vars);
  const type = guessType(cmd);
  const snippet = [
    '  definePattern(',
    `    '${pattern}',`,
    `    (${vars.join(', ')}) => ${body},`,
    `    { type: '${type}' }`,
    '  );',
  ].join('\n');
  custom = custom.replace(/\n\};\s*$/, `\n${snippet}\n};`);
});

fs.writeFileSync(patternsPath, custom);
console.log('Patterns extracted and appended.');
