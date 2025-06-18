(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.variableHints = factory();
  }
})(typeof self !== 'undefined' ? self : this, function(){
  function findUndeclaredVars(code){
    const lines = Array.isArray(code) ? code : String(code).split(/\r?\n/);
    const declared = new Set();
    const declRegex = /^\s*(?:變數|let|const|var)\s+([\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*)/;
    const funcRegex = /^\s*定義\s+([\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*)/;
    for(const line of lines){
      const d = line.match(declRegex);
      if(d) declared.add(d[1]);
      const f = line.match(funcRegex);
      if(f) declared.add(f[1]);
    }

    const ignore = new Set(['document','window','alert','console','setTimeout','setInterval','Math','Array','Object','String','Number','Boolean','JSON','Date']);
    const vars = new Set();
    const tokenRegex = /[\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*/g;
    for(const line of lines){
      if(declRegex.test(line) || funcRegex.test(line)) continue;
      let m;
      while((m = tokenRegex.exec(line))){
        const token = m[0];
        const prev = line[m.index - 1];
        if(declared.has(token) || ignore.has(token)) continue;
        if(/\d/.test(token)) continue;
        if(prev === '.' || prev === '#') continue;
        if(line.slice(m.index-1, m.index+token.length+1).match(/['"]/)) continue;
        vars.add(token);
      }
    }
    return Array.from(vars);
  }

  function getHints(code){
    const vars = findUndeclaredVars(code);
    let highlighted = String(code);
    vars.forEach(v => {
      const reg = new RegExp(v, 'g');
      highlighted = highlighted.replace(reg, `<span class="undeclared">${v}</span>`);
    });
    const message = vars.length ? `⚠️ 未宣告變數：${vars.join(', ')}。系統將自動宣告或請手動定義。` : '';
    return { highlighted, message, vars };
  }

  return { getHints };
});
