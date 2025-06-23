const { processDisplayArgument } = require('../semanticHandler-v0.9.4.js');

module.exports = function registerMediaPatterns(definePattern) {
  // 播放音效與暫停影片相關語法
  definePattern(
    '暫停影片()',
    () => 'document.querySelector("#影片播放器")?.pause();',
    { type: 'media', description: 'pause default video player' }
  );

  definePattern(
    '播放音效($路徑)',
    (路徑) => `new Audio(${processDisplayArgument(路徑)}).play();`,
    { type: 'media', description: 'play audio file' }
  );
};
