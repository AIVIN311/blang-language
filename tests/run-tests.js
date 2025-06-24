const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');
const { processDisplayArgument, handleFunctionCall } = require('../semanticHandler-v0.9.4.js');
const styleModule = require('../styleModule.js');
const { testPatternSyntax } = require('./pattern-syntax.test');
const { testSyntaxExamples } = require('./syntaxExamples.test');

function testProcessDisplayArgument() {
  const declaredVars = new Set(['key']);
  assert.strictEqual(processDisplayArgument('紅色'), '"red"');
  assert.strictEqual(processDisplayArgument('obj[key]', declaredVars), 'obj[key]');
  assert.strictEqual(processDisplayArgument('obj[key]'), 'obj["key"]');
}

function testHandleFunctionCallQuoting() {
  assert.strictEqual(
    handleFunctionCall('顯示內容', '請輸入姓名'),
    'console.log("請輸入姓名");'
  );
  assert.strictEqual(
    handleFunctionCall('顯示', '完成'),
    'document.querySelector("完成") && (document.querySelector("完成").style.display = "block");'
  );
}

function testPromptAutoQuoting() {
  assert.strictEqual(
    processDisplayArgument('使用者輸入(請輸入姓名)'),
    'prompt("請輸入姓名")'
  );
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
    output.includes('document.querySelector("#結果區") && (document.querySelector("#結果區").style["backgroundColor"] = "red");'),
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

function testConfirmCondition() {
  const sample = '如果(確認("確定刪除？"))：\n  顯示("已刪除")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('if (confirm('),
    'if statement should use confirm()'
  );
  assert(output.includes('確定刪除'), 'message text should be preserved');
  assert(output.includes('alert("已刪除");'), 'alert line should be present');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testHideElementParsing() {
  const sample = '隱藏(#test)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#test") && (document.querySelector("#test").style.display = "none");'),
    '隱藏 should convert to querySelector with quoted selector'
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
    output.includes('document.querySelector("#foo") && (document.querySelector("#foo").style.display = "none");'),
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
    output.includes('document.querySelector("#bar") && (document.querySelector("#bar").style.display = "none");'),
    '隱藏 #id should convert to querySelector with display none'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testToggleDisplayParsing() {
  const sample = '切換顯示隱藏(#詳細)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes(
      "const el = document.querySelector(\"#詳細\"); el.style.display = el.style.display === 'none' ? 'block' : 'none';"
    ),
    '切換顯示隱藏(#id) 應切換 display 屬性'
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
    output.includes('document.querySelector("#showEl") && (document.querySelector("#showEl").style.display = "block");'),
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
  const match = output.match(/let (__toggleEl\d+) = document.querySelector\("#foo"\);\s*if \(\1\) \1.style.color = \1.style.color === "red" \? "blue" : "red";/);
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
  const re1 = new RegExp(`if \\(${vars[0]}\\) ${vars[0]}\\.style.color = ${vars[0]}\\.style.color === "red" \\? "blue" : "red";`);
  const re2 = new RegExp(`if \\(${vars[1]}\\) ${vars[1]}\\.style.color = ${vars[1]}\\.style.color === "green" \\? "yellow" : "green";`);
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
    output.includes("document.querySelector(\"#foo\") && document.querySelector(\"#foo\").appendChild(img);"),
    '顯示圖片 should append img element to selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testAddElementParsing() {
  const sample = '新增元素 div 到 #容器';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#容器").appendChild(document.createElement("div"));'),
    '新增元素 should append element to quoted selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testFadeAnimationParsing() {
  const sample = '增加透明度動畫到 #方塊';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#方塊").style.transition = \'opacity 0.5s\';'),
    '增加透明度動畫 should apply transition with quoted selector'
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

function testSetSelectorContent() {
  const sample = '設定（#foo）為 "嗨呀!"';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#foo") && (document.querySelector("#foo").textContent = "嗨呀!");'),
    '設定（#foo）為 內容 should set text using helper'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testSelectorGuard() {
  const vm = require('vm');
  const code = styleModule.隱藏('"#missing"');
  assert.doesNotThrow(
    () => vm.runInNewContext(code + ';', { document: { querySelector: () => null } }),
    'styleModule functions should guard against missing elements'
  );
}

function testCookieSetting() {
  const sample = '設定 cookie token 為 "123"';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes("document.cookie = token + '=' + \"123\";"),
    '設定 cookie 應產生正確的 cookie 指令'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testDisplayAbsoluteValue() {
  const sample = '顯示 數量 的絕對值';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('alert(Math.abs(數量));'),
    '顯示 數量 的絕對值 應轉譯為 Math.abs'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testDisplayCookieValue() {
  const sample = '顯示 cookie token 的值';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes("alert(document.cookie.split('; ').find(c => c.startsWith(token + '='))?.split('=')[1]);"),
    '顯示 cookie token 的值 應取得 cookie 並 alert'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testLogStatement() {
  const sample = '顯示內容("這是測試")';
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

function testShowContentLog() {
  const sample = '顯示內容("abc")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(output.includes('console.log("abc")'), '顯示內容 應轉為 console.log');

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
    output.includes('document.querySelector("#player") && document.querySelector("#player").play();'),
    '播放影片 should translate to play() on selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testAutoDeclarePlayerSelector() {
  const sample = '播放影片(影片播放器)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('const 影片播放器 = "#影片播放器"'),
    '未宣告的 影片播放器 應自動補成 DOM 選擇器字串'
  );
  assert(
    output.includes('document.querySelector(影片播放器) && document.querySelector(影片播放器).play();'),
    '播放影片 應使用自動補的選擇器變數'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testRemoveUnusedDeclarations() {
  const sample = '顯示("嗨")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(!output.includes('let 人物'), '未使用的自動補上變數應被移除');
  assert(!output.includes('let 空'), '未使用的自動補上變數應被移除');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testSubstringVariablePruning() {
  const sample = '設定 人物角色 為 2';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(!output.includes('let 人物 ='), 'substring usage should not keep base declaration');
  assert(output.includes('let 人物角色 = 2;'), 'actual variable declaration should remain');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testKeepUsedDeclaration() {
  const sample = '如果(count > 3)：\n  顯示(count)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(output.includes('let count = 0'), 'used variable declaration should remain');

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
    output.includes('document.querySelector("#audio") && document.querySelector("#audio").pause();'),
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
  const sample = '播放音效(ding.mp3)';
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

function testPauseVideoParsing() {
  const sample = '暫停影片()';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('document.querySelector("#影片播放器")?.pause();'),
    '暫停影片 should translate to pause() on default selector'
  );

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testLoopAudioParsing() {
  const sample = '循環播放音樂(bg.mp3)';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('const a = new Audio("bg.mp3"); a.loop = true; a.play();'),
    '循環播放音樂 should translate to looped Audio playback'
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

function testRepeatTimes() {
  const sample = '重複 5 次 顯示("你好")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('for (let i = 0; i < 5; i++) {') &&
      output.includes('alert("你好");'),
    '重複 N 次 should translate to for loop with action'
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

function testDisplayDate() {
  const sample = '顯示今天日期';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(
    output.includes('toLocaleDateString'),
    '顯示今天日期 should produce alert with local date string'
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

function testElseIfBlock() {
  const sample = '如果(數值 > 5)：\n  顯示(">5")\n否則如果(數值 > 3)：\n  顯示(">3")\n否則：\n  顯示("其他")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(output.includes('} else if (數值 > 3) {'), 'should translate else-if block');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testAddItemDirectPattern() {
  const sample = '加入項目(A, "蘋果")';
  const originalDemo = fs.readFileSync('demo.blang', 'utf8');
  fs.writeFileSync('demo.blang', sample);

  const hasOutput = fs.existsSync('output.js');
  const originalOut = hasOutput ? fs.readFileSync('output.js', 'utf8') : null;

  execSync('node parser_v0.9.4.js');
  const output = fs.readFileSync('output.js', 'utf8');
  assert(output.includes('ArrayModule.加入項目(A, "蘋果");'), 'direct add item pattern should translate correctly');

  fs.writeFileSync('demo.blang', originalDemo);
  if (hasOutput) {
    fs.writeFileSync('output.js', originalOut);
  } else {
    fs.unlinkSync('output.js');
  }
}

function testGetItemPattern() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['取得項目(A, 2)'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(result, 'A[2 - 1]', '取得項目 should translate to array indexing');
}

function testClearListPattern() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['清空清單(A)'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(result, 'A.length = 0;', '清空清單 should translate to length reset');
}

function testListIncludesPattern() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['清單包含(A, "蘋果")'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(result, '"A".includes("蘋果");', '清單包含 should translate to includes call');
}

function testTrimFunction() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['去除空白(名字)'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(result, '"名字".trim();', '去除空白 should translate to trim call');
}

function testArrayModuleHelpers() {
  const arrayModule = require('../arrayModule.js');
  assert.strictEqual(
    arrayModule.顯示第幾項('list', '2'),
    'list[2 - 1]',
    '顯示第幾項 should return index lookup string'
  );
  assert.strictEqual(
    arrayModule.取得項目('list', '3'),
    'list[3 - 1]',
    '取得項目 should return index lookup string'
  );
  assert.strictEqual(
    arrayModule.清空清單('list'),
    'list.length = 0',
    '清空清單 should return length reset string'
  );
}

function testVocabularyMapParsing() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['顯示內容("嗨")'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(result, 'console.log("嗨");', 'vocabulary map lines should be parsed');
}

function testFunctionDefinitionPattern() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['定義 打招呼(名字)：'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(
    result,
    'function 打招呼(名字) {',
    'function definition pattern should translate correctly'
  );
}

function testFunctionCallPattern() {
  const { runBlangParser } = require('../blangSyntaxAPI.js');
  const lines = ['呼叫 打招呼("小明")'];
  const result = runBlangParser(lines).trim();
  assert.strictEqual(
    result,
    '打招呼("小明");',
    'function call pattern should translate correctly'
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


function testUnifiedHideSynonyms() {
  const parseBlang = require('../parser.js');
  const js1 = parseBlang('隱藏元素(#u)').trim();
  const js2 = parseBlang('隱藏(#u)').trim();
  assert.strictEqual(js1, js2, '隱藏元素 與 隱藏 應輸出相同 JavaScript');
}

function testFuzzySuggestions() {
  const { getFuzzySuggestions } = require('../blangSyntaxAPI.js');
  const sugg = getFuzzySuggestions('隱藏元');
  assert(sugg && sugg[0], '應該回傳建議');
  assert(sugg.includes('隱藏'), '建議應包含 隱藏');
}

function testGenerateDatalist() {
  const { generateDatalist, getRegisteredPatterns } = require('../blangSyntaxAPI.js');
  const html = generateDatalist();
  const count = (html.match(/<option/g) || []).length;
  assert.strictEqual(count, getRegisteredPatterns().length, 'datalist option 數量應與 pattern 數相同');
  assert(html.includes('<option'), '產生的 HTML 應包含 option 標籤');
}
try {
  testPatternSyntax();
  testProcessDisplayArgument();
  testHandleFunctionCallQuoting();
  testPromptAutoQuoting();
  testParser();
  testConditionProcessing();
  testConfirmCondition();
  testHideElementParsing();
  testHideParsing();
  testHideShortFormParsing();
  testToggleDisplayParsing();
  testShowElementParsing();
  testToggleColorParsing();
  testMultipleToggleColor();
  testShowImageParsing();
  testAddElementParsing();
  testFadeAnimationParsing();
  testSetSelectorContent();
  testSelectorGuard();
  testCookieSetting();
  testDisplayAbsoluteValue();
  testDisplayCookieValue();
  testLogStatement();
  testShowContentLog();
  testPlayVideoParsing();
  testAutoDeclarePlayerSelector();
  testRemoveUnusedDeclarations();
  testSubstringVariablePruning();
  testKeepUsedDeclaration();
  testPauseAudioParsing();
  testPauseVideoParsing();
  testPlaySoundParsing();
  testLoopAudioParsing();
  testWaitSecondsDisplay();
  testRepeatTimes();
  testDisplayWeekday();
  testDisplayHourMinute();
  testDisplayDate();
  testIfElsePattern();
  testIfElsePatternChinese();
  testElseIfBlock();
  testAddItemDirectPattern();
  testGetItemPattern();
  testClearListPattern();
  testListIncludesPattern();
  testTrimFunction();
  testArrayModuleHelpers();
  testVocabularyMapParsing();
  testGetRegisteredPatterns();
  testUnifiedHideSynonyms();
  testFuzzySuggestions();
  testGenerateDatalist();
  testSyntaxExamples();
  console.log('All tests passed');
} catch (err) {
  console.error('Test failed:\n', err.message);
  process.exit(1);
}
