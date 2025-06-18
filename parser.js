(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./blangSyntaxAPI.js'), require('./errorHelper.js'));
  } else {
    root.parseBlang = factory(root.blangSyntaxAPI, root.ErrorHelper);
  }
})(typeof self !== 'undefined' ? self : this, function(blangSyntaxAPI, ErrorHelper){
  const { runBlangParser } = blangSyntaxAPI || {};

  function parseBlang(code){
    const lines = Array.isArray(code) ? code : String(code).split(/\r?\n/);
    let result;
    try {
      result = runBlangParser(lines).trim();
    } catch(err){
      const msg = ErrorHelper && ErrorHelper.translateError ?
        ErrorHelper.translateError(err) : (err && err.message) || String(err);
      throw new Error(msg);
    }
    if(result.startsWith('// 無法辨識語句')){
      const msg = ErrorHelper && ErrorHelper.translateError ?
        ErrorHelper.translateError(new Error(result)) : result;
      throw new Error(msg);
    }
    return result;
  }

  return parseBlang;
});
