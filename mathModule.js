// mathModule.js
module.exports = {
  隨機一個數: (max) => `Math.floor(Math.random() * ${max})`,
  四捨五入: (value) => `Math.round(${value})`,
  無條件捨去: (value) => `Math.floor(${value})`,
  無條件進位: (value) => `Math.ceil(${value})`,
  平方: (value) => `Math.pow(${value}, 2)`,
  次方: (base, exp) => `Math.pow(${base}, ${exp})`,
  絕對值: (value) => `Math.abs(${value})`
};
