module.exports = {
  顯示圖片: (src, selector) => {
    const cleanSrc = src.replace(/^["']|["']$/g, '');
    const elExpr = `document.querySelector(${selector})`;
    return `const img = document.createElement('img'); img.src = "${cleanSrc}"; ${elExpr} && ${elExpr}.appendChild(img)`;
  }
};
