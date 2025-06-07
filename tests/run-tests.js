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
    output.includes('alert("請先輸入內容")'),
    'alert line should be parsed'
  );
  assert(
    output.includes(
      'document.querySelector("#結果區").style["backgroundColor"] = "red";'
    ),
    'style line should be parsed with color keyword'
  );

  if (hasOutput) {
    fs.writeFileSync('output.js', original);
  } else {
    fs.unlinkSync('output.js');
  }
}


try {
  testProcessDisplayArgument();
  testParser();
  console.log('All tests passed');
} catch (err) {
  console.error('Test failed:\n', err.message);
  process.exit(1);
}
