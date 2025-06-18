(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.variableHints = factory();
  }
})(typeof self !== 'undefined' ? self : this, function(){
  // 支援多行與縮排區塊的變數檢測，會追蹤作用域階層
  function findUndeclaredVars(code){
    const lines = Array.isArray(code) ? code : String(code).split(/\r?\n/);
    const declRegex = /^\s*(?:變數|let|const|var)\s+([\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*)/;
    const funcRegex = /^\s*定義\s+([\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*)/;

    // --- 第一遍：建立巢狀作用域並收集宣告 ---
    const rootScope = { declared: new Set(), parent: null, indent: 0 };
    let current = rootScope;
    let prevIndent = 0;
    const scopeByLine = [];

    function indentOf(line){
      const m = line.match(/^\s*/);
      return m ? m[0].length : 0;
    }

    for(let i = 0; i < lines.length; i++){
      const line = lines[i];
      const indent = indentOf(line);

      // 處理縮排變化以建立區塊
      if(indent > prevIndent){
        current = { declared: new Set(), parent: current, indent };
      } else if(indent < prevIndent){
        while(current.parent && indent < current.indent){
          current = current.parent;
        }
        if(indent > current.indent){
          current = { declared: new Set(), parent: current, indent };
        }
      }
      prevIndent = indent;
      scopeByLine[i] = current;

      const d = line.match(declRegex);
      if(d) current.declared.add(d[1]);
      const f = line.match(funcRegex);
      if(f) current.declared.add(f[1]);
    }

    // --- 第二遍：找出在任何作用域都未宣告的變數 ---
    const ignore = new Set([
      'document','window','alert','console','setTimeout','setInterval',
      'Math','Array','Object','String','Number','Boolean','JSON','Date',
      '顯示','設定','若','否則','變數','呼叫','輸入框'
    ]);
    const undeclared = new Map(); // varName -> [lineNumbers]
    const tokenRegex = /[\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*/g;

    for(let i = 0; i < lines.length; i++){
      const line = lines[i];
      const scope = scopeByLine[i];
      const declLine = line.match(declRegex);
      const funcLine = line.match(funcRegex);

      let m;
      tokenRegex.lastIndex = 0;
      while((m = tokenRegex.exec(line))){
        const token = m[0];
        const prev = line[m.index - 1];
        if(ignore.has(token)) continue;
        if(/\d/.test(token)) continue;
        if(prev === '.' || prev === '#') continue;
        if(line.slice(m.index-1, m.index+token.length+1).match(/['"]/)) continue;
        if(declLine && m.index >= declLine.index && m.index < declLine.index + declLine[0].length) continue;
        if(funcLine && m.index >= funcLine.index && m.index < funcLine.index + funcLine[0].length) continue;

        // 從當前 scope 往外找宣告
        let s = scope;
        let found = false;
        while(s){
          if(s.declared.has(token)){ found = true; break; }
          s = s.parent;
        }
        if(!found){
          if(!undeclared.has(token)) undeclared.set(token, []);
          undeclared.get(token).push(i + 1); // 1-based line number
        }
      }
    }

    return undeclared;
  }

  function getHints(code){
    const map = findUndeclaredVars(code);
    const vars = Array.from(map.keys());
    let highlighted = String(code);
    vars.forEach(v => {
      const reg = new RegExp(v, 'g');
      highlighted = highlighted.replace(reg, `<span class="undeclared">${v}</span>`);
    });
    const detail = vars.map(v => `${v}(第${map.get(v).join(',')}行)`).join(', ');
    const message = vars.length
      ? `⚠️ 未宣告或作用域外變數：${detail}。請確認是否已在適當範圍內定義。`
      : '';
    return { highlighted, message, vars };
  }

  return { getHints };
});
