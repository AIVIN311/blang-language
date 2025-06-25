const { 處理送出流程 } = require('./logicModule.js');

function 註冊事件處理器() {
  document.getElementById('submit').addEventListener('click', 處理送出流程);
}

module.exports = { 註冊事件處理器 };
