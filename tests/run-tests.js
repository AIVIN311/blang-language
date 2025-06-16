const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');
const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');
const { testPatternSyntax } = require('./pattern-syntax.test');

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

function testHideParsing() {
  const sample = '隱藏(#foo)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#foo").style.display = "none";'),
    '隱藏(#id) should convert to querySelector with display none'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testHideShortFormParsing() {
  const sample = '隱藏 #bar';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#bar").style.display = "none";'),
    '隱藏 #id should convert to querySelector with display none'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testShowElementParsing() {
  const sample = '顯示(#showEl)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#showEl").style.display = "block";'),
    '顯示 should convert to display block on selector'
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

function testShowImageParsing() {
  const sample = '顯示圖片("pic.png" 在 #foo)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes("document.querySelector(\"#foo\").appendChild(img);"),
    '顯示圖片 should append img element to selector'
  );

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

function testLogStatement() {
  const sample = '說一句話（"這是測試"）';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(output.includes('console.log("這是測試")'), '應該能轉譯為 console.log');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testPlayVideoParsing() {
  const sample = '播放影片(#player)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#player").play();'),
    '播放影片 should translate to play() on selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testPauseAudioParsing() {
  const sample = '暫停音效(#audio)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#audio").pause();'),
    '暫停音效 should translate to pause() on selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testPlaySoundParsing() {
  const sample = '播放音效("ding.mp3")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('new Audio("ding.mp3").play();'),
    '播放音效 should translate to new Audio().play()'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testWaitSecondsDisplay() {
  const sample = '等待 3 秒後 顯示("嗨")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('setTimeout(() => {') && output.includes('}, 3000);'),
    '等待 3 秒後 顯示 should translate to setTimeout with delay'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testDisplayWeekday() {
  const sample = '顯示今天是星期幾';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('今天是星期'),
    '顯示今天是星期幾 should produce alert with weekday'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testDisplayHourMinute() {
  const sample = '顯示現在是幾點幾分';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('現在是'),
    '顯示現在是幾點幾分 should produce alert with hour and minute'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testIfElsePattern() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['若 (1 > 0) 則 顯示 ("yes") 否則 顯示 ("no")'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(
    result,
    'if (1 > 0) { alert("yes"); } else { alert("no"); }',
    'custom pattern should translate to if...else structure'
  );
}

function testIfElsePatternChinese() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['若 (1 > 0) 則 顯示 ("大") 否則 顯示 ("小")'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(
    result,
    'if (1 > 0) { alert("大"); } else { alert("小"); }',
    'custom pattern should translate to if...else structure with Chinese text'
  );
}

function testGetRegisteredPatterns() {
  const { getRegisteredPatterns } = require('../blangSyntaxAPI.js');
  const patterns = getRegisteredPatterns();
  const patternStrings = patterns.map(p => p.pattern);
  const expected = [
    '顯示 $內容',
    '設定 $變數 為 $值',
    '若 $條件 則 顯示 $當真 否則 顯示 $當假',
    '若（$條件）則 顯示（$語句1） 否則 顯示（$語句2）',
    '若($條件)則 顯示($語句1) 否則 顯示($語句2)'
  ];
  expected.forEach(pat => {
    assert(patternStrings.includes(pat), `registered patterns should include "${pat}"`);
  });
  const ctrl = patterns.find(p => p.pattern === '若 $條件 則 顯示 $當真 否則 顯示 $當假');
  assert(ctrl && ctrl.type === 'control', 'pattern should expose type property');
  const show = patterns.find(p => p.pattern === '顯示 $內容');
  assert(show && typeof show.description === 'string', 'pattern should have description');
  const wait = patterns.find(p => p.pattern === '等待 $秒數 秒後 顯示 $訊息');
  assert(Array.isArray(wait.hints), 'pattern should expose parameter hints');
}

try {
  testPatternSyntax();
  testProcessDisplayArgument();
  testParser();
  testConditionProcessing();
  testHideElementParsing();
  testHideParsing();
  testHideShortFormParsing();
  testShowElementParsing();
  testToggleColorParsing();
  testMultipleToggleColor();
  testShowImageParsing();
  testLogStatement();
  testPlayVideoParsing();
  testPauseAudioParsing();
  testPlaySoundParsing();
  testWaitSecondsDisplay();
  testDisplayWeekday();
  testDisplayHourMinute();
  testIfElsePattern();
  testIfElsePatternChinese();
  testGetRegisteredPatterns();
  console.log('All tests passed');
} catch (err) {
  console.error('Test failed:\n', err.message);
  process.exit(1);
}
