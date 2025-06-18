function 呼叫AI回覆(msg) {
  const text = typeof msg === 'undefined' ? '' : String(msg);
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`AI 回覆尚未實作: ${text}`);
  } else {
    console.log('AI 回覆尚未實作:', text);
  }
}
if (typeof window !== 'undefined') {
  window.呼叫AI回覆 = 呼叫AI回覆;
} else if (typeof global !== 'undefined') {
  global.呼叫AI回覆 = 呼叫AI回覆;
}
module.exports = { 呼叫AI回覆 };
