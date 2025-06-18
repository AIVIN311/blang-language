const assert = require('assert');
const parseBlang = require('../parser.js');
const { runBlangParser } = require('../blangSyntaxAPI.js');

function testSyntaxExamples() {
  const cases = [
    {
      phrase: '顯示("你好")',
      expected: 'style.display = "block"'
    },
    {
      phrase: '建立清單(清單)',
      expected: 'let 清單 = ArrayModule.建立清單();'
    },
    {
      phrase: '加入 "x" 到 清單',
      expected: 'ArrayModule.加入項目("清單", "x");'
    },
    {
      phrase: '顯示(輸入框.內容)',
      expected: 'style.display = "block"'
    }
  ];

  cases.forEach(({ phrase, expected }) => {
    const js1 = parseBlang(phrase).trim();
    const js2 = runBlangParser([phrase]).trim();
    assert.strictEqual(js1, js2, `parseBlang and runBlangParser results differ for ${phrase}`);
    assert(js1.includes(expected), `Result for "${phrase}" should contain "${expected}"`);
  });
}

module.exports = { testSyntaxExamples };
