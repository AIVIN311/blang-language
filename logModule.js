module.exports = {
  說一句話: (text) => {
    const clean = /^['"].*['"]$/.test(text.trim()) ? text : `"${text}"`;
    return `console.log(${clean})`;
  }
};
