module.exports = {
  設定文字內容: (selector, text) => {
    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.textContent = ${text})`;
  }
};
