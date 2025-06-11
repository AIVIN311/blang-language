module.exports = {
  獲取現在時間: () => 'new Date().toLocaleTimeString()',
  顯示現在時間: () => 'alert(new Date().toLocaleString())',
  顯示今天是星期幾: () =>
    'alert("今天是星期" + "日一二三四五六"[new Date().getDay()])',
  顯示現在是幾點幾分: () =>
    'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分")'
};
