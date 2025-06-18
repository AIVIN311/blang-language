const { handleFunctionCall } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerGeneralPatterns(definePattern) {
  definePattern(
    '$函式名($參數)',
    (函式名, 參數) => {
      if (函式名 === '顯示') return `alert(${參數});`;
      return handleFunctionCall(函式名, 參數);
    },
    { type: 'function', description: 'direct function call' }
  );
};
