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
    const output = [];
    const stack = [];
    const multiLine = lines.length > 1;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const indent = raw.match(/^\s*/)[0].length;
      const trimmed = raw.trim();
      if (!trimmed) continue;

      while (stack.length && indent < stack[stack.length - 1]) {
        const last = stack.pop();
        output.push(' '.repeat(last) + '}');
      }

      const eachMatch = trimmed.match(/^對每個\s+(.+?)\s+在\s+(.+?)\s*做：$/);
      if (eachMatch) {
        output.push(' '.repeat(indent) + `for (let ${eachMatch[1]} of ${eachMatch[2]}) {`);
        stack.push(indent);
        continue;
      }

      let result;
      try {
        result = runBlangParser([trimmed]).trim();
      } catch(err){
        const msg = ErrorHelper && ErrorHelper.translateError ?
          ErrorHelper.translateError(err) : (err && err.message) || String(err);
        throw new Error(msg);
      }
      if(result.startsWith('// 無法辨識語句')){
        const msg = ErrorHelper && ErrorHelper.translateError ?
          ErrorHelper.translateError(new Error(result)) : result;
        const err = new Error(msg);
        const m = result.match(/是否想輸入：(.+?)\?/);
        if(m) err.suggestion = m[1];
        throw err;
      }
      output.push(' '.repeat(indent) + result);
    }

    while (stack.length) {
      const last = stack.pop();
      if (multiLine) {
        output.push(' '.repeat(last) + '}');
      }
    }

    return output.join('\n');
  }

  return parseBlang;
});
