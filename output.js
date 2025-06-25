const { 處理送出事件 } = require('./eventModule.js');
const { 啟動程式流程 } = require('./logicModule.js');
const { 設定初始樣式 } = require('./styleModule.js');
function 啟動語法引擎() {
  設定初始樣式();
  處理送出事件();
  啟動程式流程();
}
啟動語法引擎();