module.exports = function registerConfirmPattern(definePattern) {
  definePattern('確認($訊息)', (訊息) => `confirm(${訊息})`);
};
