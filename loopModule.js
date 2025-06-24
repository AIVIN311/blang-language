module.exports = {
  重複次數執行: (times, jsStatement) => {
    const stmt = jsStatement.trim().replace(/;?$/, ';');
    return `for (let i = 0; i < ${times}; i++) { ${stmt} }`;
  }
};
