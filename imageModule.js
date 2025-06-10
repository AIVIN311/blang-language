module.exports = {
  顯示圖片: (src, selector) => {
    const cleanSrc = src.replace(/^["']|["']$/g, '');
    return `const img = document.createElement('img'); img.src = "${cleanSrc}"; document.querySelector(${selector}).appendChild(img)`;
  }
};
