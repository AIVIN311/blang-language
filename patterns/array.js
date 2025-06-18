const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerArrayPatterns(definePattern) {
  definePattern(
    '建立清單($名稱)',
    (名稱) => `let ${名稱} = ArrayModule.建立清單();`,
    { type: 'data', description: 'create list variable' }
  );
  definePattern(
    '遍歷 $清單 並顯示每項',
    (清單) => `${清單}.forEach(item => alert(item));`,
    { type: 'data', description: 'iterate list items' }
  );
  definePattern(
    '加入 $項目 到 $清單',
    (項目, 清單) => {
      const item = processDisplayArgument(項目);
      const list = processDisplayArgument(清單);
      return `ArrayModule.加入項目(${list}, ${item});`;
    },
    { type: 'data', description: 'append item to list' }
  );
  definePattern(
    '把 $項目 加進 $清單',
    (項目, 清單) => {
      const item = processDisplayArgument(項目);
      const list = processDisplayArgument(清單);
      return `ArrayModule.加入項目(${list}, ${item});`;
    },
    { type: 'data', description: 'append item to list' }
  );
  definePattern(
    '反轉 $清單',
    (清單) => `${清單}.reverse();`,
    { type: 'data', description: 'reverse list' }
  );
  definePattern(
    '加入項目($清單, $項目)',
    (清單, 項目) => `ArrayModule.加入項目(${清單}, ${項目});`,
    { type: 'data', description: 'direct add item' }
  );
};
