module.exports = {
  播放影片: (target) => {
    const elExpr = `document.querySelector(${target})`;
    return `${elExpr} && ${elExpr}.play()`;
  },
  暫停音效: (target) => {
    const elExpr = `document.querySelector(${target})`;
    return `${elExpr} && ${elExpr}.pause()`;
  }
};
