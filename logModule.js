const log = (text) => {
  const clean = /^['"].*['"]$/.test(text.trim()) ? text : `"${text}"`;
  return `console.log(${clean})`;
};

module.exports = {
  顯示內容: log,
  說一句話: log
};
