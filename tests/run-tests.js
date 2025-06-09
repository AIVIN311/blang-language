const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');
const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

function testProcessDisplayArgument() {
  const declaredVars = new Set(['key']);
  assert.strictEqual(processDisplayArgument('紅色'), '"red"');
  assert.strictEqual(processDisplayArgument('obj[key]', declaredVars), 'obj[key]');
  assert.strictEqual(processDisplayArgument('obj[key]'), 'obj["key"]');
}

function testParser() {
  const hasOutput = fs.existsSync('output.js');
  const original = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;
  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('alert("請先輸入內容");'),
    'alert line should be parsed'
  );
  assert(
    output.includes('document.querySelector("#結果區").style["backgroundColor"] = "red";'),
    'style line should be parsed with color keyword'
  );
  if (hasOutput) {
    fs.writeFileSync('output.js', original);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testConditionProcessing() {
  const sample = '如果（判斷是否為空（水果們））：\n    顯示（"空"）';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('if (水果們.length === 0) {'),
    'condition should translate 判斷是否為空 correctly'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testHideElementParsing() {
  const sample = '隱藏元素(#test)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#test").style.display = "none";'),
    '隱藏元素 should convert to querySelector with quoted selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testToggleColorParsing() {
  const sample = '切換顏色(#foo, 紅色, 藍色)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  const match = output.match(/let (__toggleEl\d+) = document.querySelector\("#foo"\);\s*\1.style.color = \1.style.color === "red" \? "blue" : "red";/);
  assert(match, '切換顏色 should toggle colors with a unique identifier');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testMultipleToggleColor() {
  const sample = '切換顏色(#foo, 紅色, 藍色)\n切換顏色(#bar, 綠色, 黃色)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  const varPattern = /let (__toggleEl\d+) = document.querySelector/g;
  const vars = [];
  let m;
  while ((m = varPattern.exec(output)) !== null) vars.push(m[1]);
  assert.strictEqual(vars.length, 2, 'should create two toggle variables');
  assert.notStrictEqual(vars[0], vars[1], 'toggle identifiers must be unique');
  const re1 = new RegExp(`${vars[0]}\\.style.color = ${vars[0]}\\.style.color === "red" \\? "blue" : "red";`);
  const re2 = new RegExp(`${vars[1]}\\.style.color = ${vars[1]}\\.style.color === "green" \\? "yellow" : "green";`);
  assert(re1.test(output), 'first toggle statement should be correct');
  assert(re2.test(output), 'second toggle statement should be correct');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testContentLengthCondition() {
  const sample = '如果（字串.內容長度 > 3）：';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('if (字串.value.length > 3) {'),
    '內容長度 should convert to value.length in conditions'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

try {
  testProcessDisplayArgument();
  testParser();
  testConditionProcessing();
  testHideElementParsing();
  testToggleColorParsing();
  testMultipleToggleColor();
  console.log('All tests passed');
} catch (err) {
  console.error('Test failed:\n', err.message);
  process.exit(1);
}
