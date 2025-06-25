const colorMap = require('./colorMap.js');

const hide = (selector) => {
  const elExpr = `document.querySelector(${selector})`;
  return `${elExpr} && (${elExpr}.style.display = "none")`;
};

module.exports = {
  setStyle: (selector, styleProp, value) => {
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

    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.style["${cleanProp}"] = "${cleanValue}")`;
  },
  hide: hide,
  hideElement: hide,
  show: (selector) => {
    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.style.display = "block")`;
  },
  setBackgroundColor: (selector, color) => {
    const cleanColor = color.replace(/^['"]|['"]$/g, '');
    const elExpr = `document.querySelector(${selector})`;
    return `${elExpr} && (${elExpr}.style.backgroundColor = "${cleanColor}")`;
  },
  toggleColor: (() => {
    let id = 0;
    return (selector, c1, c2) => {
      const varName = `__toggleEl${id++}`;
      const color1 = colorMap[c1.replace(/^["']|["']$/g, '')] ? `"${colorMap[c1.replace(/^["']|["']$/g, '')]}"` : c1;
      const color2 = colorMap[c2.replace(/^["']|["']$/g, '')] ? `"${colorMap[c2.replace(/^["']|["']$/g, '')]}"` : c2;
      return `let ${varName} = document.querySelector(${selector}); if (${varName}) ${varName}.style.color = ${varName}.style.color === ${color1} ? ${color2} : ${color1}`;
    };
  })()
};
