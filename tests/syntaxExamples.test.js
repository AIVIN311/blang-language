const assert = require('assert');
const parseBlang = require('../parser.js');
const { runBlangParser } = require('../blangSyntaxAPI.js');

function testSyntaxExamples() {
  const cases = [
    {
      phrase: '顯示("你好")',
      expected: 'alert("你好");'
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
      phrase: '清單包含(水果們, "蘋果")',
      expected: '"水果們".includes("蘋果");'
    },
    {
      phrase: '去除空白(名字)',
      expected: '"名字".trim();'
    },
    {
      phrase: '顯示(輸入框.內容)',
      expected: 'alert(輸入框.內容);'
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
