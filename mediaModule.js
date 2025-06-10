module.exports = {
  播放影片: (target) => `document.querySelector(${target}).play()`,
  暫停音效: (target) => `document.querySelector(${target}).pause()`
};
