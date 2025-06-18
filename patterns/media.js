module.exports = function registerMediaPatterns(definePattern) {
  definePattern(
    '播放音效($檔名)',
    (檔名) => `new Audio(${檔名}).play();`,
    { type: 'media', description: 'play audio file' }
  );
};
