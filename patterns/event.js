const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerEventPatterns(definePattern) {
  const handler = (選擇器) => {
    const sel = processDisplayArgument(選擇器);
    return `document.querySelector(${sel}).addEventListener("click", () => {`;
  };

  definePattern('當（$選擇器.被點擊）時：', handler, {
    type: 'control',
    description: 'add click event listener'
  });
  definePattern('當($選擇器.被點擊)時：', handler, {
    type: 'control',
    description: 'add click event listener'
  });
};
