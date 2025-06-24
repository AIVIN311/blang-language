function 呼叫AI回覆(msg) {
  const text = typeof msg === 'undefined' ? '' : String(msg);
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`AI 回覆尚未實作: ${text}`);
  } else {
    console.log('AI 回覆尚未實作:', text);
  }
}

function 問AI(msg) {
  return 呼叫AI回覆(msg);
}

function 讓AI解釋(msg) {
  return 呼叫AI回覆(msg);
}

function callAI(input) {
  alert("AI 回應尚未實作：" + input);
}

if (typeof window !== 'undefined') {
  window.呼叫AI回覆 = 呼叫AI回覆;
  window.問AI = 問AI;
  window.讓AI解釋 = 讓AI解釋;
  window.callAI = callAI;
} else if (typeof global !== 'undefined') {
  global.呼叫AI回覆 = 呼叫AI回覆;
  global.問AI = 問AI;
  global.讓AI解釋 = 讓AI解釋;
  global.callAI = callAI;
}

module.exports = { 呼叫AI回覆, 問AI, 讓AI解釋, callAI };
