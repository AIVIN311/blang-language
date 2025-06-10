module.exports = {
  設定文字內容: (selector, text) => {
    return `document.querySelector(${selector}).textContent = ${text}`;
  }
};
