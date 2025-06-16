(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ErrorHelper = factory();
  }
})(typeof self !== 'undefined' ? self : this, function(){
  const errorMap = {
    TS1005: '缺少括號或分號',
    TS2304: '找不到名稱',
    TS2339: '屬性不存在於型別上',
    TS2552: '無法重新宣告',
    ReferenceError: '參考錯誤',
    SyntaxError: '語法錯誤',
    TypeError: '型別錯誤'
  };

  function translateError(err){
    if(!err) return '未知錯誤';
    const msg = err.message || String(err);
    const ts = msg.match(/TS(\d+)/);
    if(ts){
      const code = 'TS'+ts[1];
      if(errorMap[code]) return errorMap[code] + '：' + msg;
    }
    for(const key of ['ReferenceError','SyntaxError','TypeError']){
      if(msg.includes(key)) return (errorMap[key]||key) + '：' + msg;
    }
    return msg;
  }

  function runSafely(fn){
    try { return fn(); }
    catch(e){
      const out = translateError(e);
      if(typeof console!=='undefined') console.error(out);
    }
  }

  return { translateError, runSafely };
});
