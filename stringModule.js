// stringModule.js
module.exports = {
  轉大寫: (input) => `${input}.toUpperCase()`,
  包含: (str, substr) => `${str}.includes(${substr})`,
  長度: (input) => `${input}.length`,

  去除空白: (input) => `${input}.trim()`
};
