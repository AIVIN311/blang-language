const hide = (selector) => {
  return `document.querySelector(${selector}).style.display = "none"`;
};

module.exports = {
  設定樣式: (selector, styleProp, value) => {
    const propMap = {
      背景色: 'backgroundColor',
      文字顏色: 'color',
      字型大小: 'fontSize',
      邊框: 'border',
      寬度: 'width',
      高度: 'height'
    };

    const cleanProp = propMap[styleProp.replace(/['"]/g, '')] || styleProp.replace(/['"]/g, '');
    const cleanValue = value.replace(/^["']|["']$/g, ''); // 🔥 去掉 value 最外層引號

    return `document.querySelector(${selector}).style["${cleanProp}"] = "${cleanValue}"`;
  },
  隱藏: hide,
  隱藏元素: hide,
  顯示: (selector) => {
    return `document.querySelector(${selector}).style.display = "block"`;
  },
  設定背景色: (selector, color) => {
    const cleanColor = color.replace(/^['"]|['"]$/g, '');
    return `document.querySelector(${selector}).style.backgroundColor = "${cleanColor}"`;
  }
};
