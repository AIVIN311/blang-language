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
  },
  切換顏色: (() => {
    let id = 0;
    return (selector, c1, c2) => {
      const varName = `__toggleEl${id++}`;
      const color1 = colorMap[c1.replace(/^["']|["']$/g, '')] ? `"${colorMap[c1.replace(/^["']|["']$/g, '')]}"` : c1;
      const color2 = colorMap[c2.replace(/^["']|["']$/g, '')] ? `"${colorMap[c2.replace(/^["']|["']$/g, '')]}"` : c2;
      return `let ${varName} = document.querySelector(${selector}); ${varName}.style.color = ${varName}.style.color === ${color1} ? ${color2} : ${color1}`;
    };
  })()
};
