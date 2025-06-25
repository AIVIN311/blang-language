module.exports = {
  getCurrentTime: () => 'new Date().toLocaleTimeString()',
  showCurrentTime: () => 'alert(new Date().toLocaleString())',
  showDayOfWeek: () =>
    'alert("今天是星期" + "日一二三四五六"[new Date().getDay()])',
  showHourMinute: () =>
    'alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分")'
};
