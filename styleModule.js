const colorMap = require('./colorMap.js');

function setColor(id, colorName) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.style.color = colorMap[colorName] || colorName;
}

function setFontSize(id, size) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.style.fontSize = size;
}

function 設定初始樣式() {
  setColor('提示文字', '紅色');
  setFontSize('標題', '24px');
}

function applyBackgroundColor(selector, color) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(selector);
  if (el) el.style.backgroundColor = color;
}

function toggleDisplay(selector) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(selector);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function hideElementDom(selector) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(selector);
  if (el) el.style.display = 'none';
}

function showElementDom(selector) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(selector);
  if (el) el.style.display = 'block';
}

function setTransition(selector, value) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(selector);
  if (el) el.style.transition = value;
}

const hide = (selector) => {
  const elExpr = `document.querySelector(${selector})`;
  return `${elExpr} && (${elExpr}.style.display = "none")`;
};

module.exports = {
  setColor,
  setFontSize,
  設定初始樣式,
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
  applyBackgroundColor,
  toggleDisplay,
  hideElementDom,
  showElementDom,
  setTransition,
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

if (typeof window !== 'undefined') {
  window.styleModule = module.exports;
}
