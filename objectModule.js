// objectModule.js

module.exports = {
  建立人物: (名字, 年齡) => `let 人物 = { 名字: ${名字}, 年齡: ${年齡} }`,
  取得屬性: (obj, key) => `${obj}[${key}]`
};
