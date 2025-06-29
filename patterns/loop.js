const loopModule = require('../loopModule.js');

module.exports = function registerLoopPatterns(definePattern) {
  definePattern(
    '重複 $次數 次 $語句',
    (次數, 語句) => {
      const { runBlangParser } = require('../blangSyntaxAPI.js');
      let stmt = 語句;
      const open = (stmt.match(/\(/g) || []).length;
      const close = (stmt.match(/\)/g) || []).length;
      if (open > close) stmt += ')';
      return loopModule.重複次數執行(次數, runBlangParser([stmt]).trim());
    },
    { type: 'control', description: 'repeat an action N times' }
  );

  definePattern(
    '對每個 $項 在 $清單 做：',
    (項, 清單) => `for (let ${項} of ${清單}) {`,
    { type: 'control', description: 'iterate over items in a list' }
  );
};
