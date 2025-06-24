module.exports = function registerConditionPatterns(definePattern) {
  definePattern(
    '否則如果($條件)：',
    (條件) => `} else if (${條件}) {`,
    { type: 'control', description: 'else if statement' }
  );
};
