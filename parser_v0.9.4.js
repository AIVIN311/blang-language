// 🧠 Blang parser v0.9.4 - 自動補宣告 + 條件語句語意優化整合版
const fs = require('fs');
const {
  processDisplayArgument,
  handleFunctionCall,
  normalizeParentheses, // 仍需
  processConditionExpression // 仍需
} = require('./semanticHandler-v0.9.4.js'); // ← 指向新版檔

// 讀取 demo.blang 檔案
const blang = fs.readFileSync('demo.blang', 'utf8');
const lines = blang.split('\n');

const output = [];
const stack = [];
const registeredEvents = new Set();
const declaredVars = new Set();
declaredVars.add('輸入框');
let toggleColorCounter = 0;

output.push('const 輸入框 = document.getElementById("input");');

function getIndentLevel(line) {
  return line.match(/^\s*/)[0].length;
}

function closeBlocks(currentIndent, nextIndent, upcomingLine = '') {
  const isTopLevel =
    upcomingLine.startsWith('當(') ||
    upcomingLine.startsWith('變數 ') ||
    upcomingLine.startsWith('定義 ') ||
    upcomingLine.startsWith('重複執行(') ||
    upcomingLine === '';

  if (isTopLevel) {
    while (stack.length > 0) {
      const block = stack.pop();
      const closing = block.type === 'event' ? '});' : '}';
      output.push(' '.repeat(block.indent) + closing);
    }
    return;
  }

  while (stack.length > 0 && nextIndent <= stack[stack.length - 1].indent) {
    const block = stack.pop();
    const closing = block.type === 'event' ? '});' : '}';
    output.push(' '.repeat(block.indent) + closing + ` // 👈 自動關閉 ${block.type} 區塊`);
  }
}
function processCondition(condition) {
  let result = condition.replace(
    /判斷是否為空[（(](.*?)?[)）]/g,
    (_, arg) => `${arg.trim()}.length === 0`
  );

  // 先處理內容長度，以免在後續轉換時遺漏
  result = result.replace(/內容長度/g, 'value.length');

  result = processConditionExpression(result);

  return result;
}

const ignoreList = new Set([
  'document',
  'window',
  'alert',
  'console',
  'setTimeout',
  'setInterval',
  'Math',
  'Array',
  'Object',
  'String',
  'Number',
  'Boolean',
  'JSON',
  'Date',
  'new',
  'if',
  'else',
  'for',
  'while',
  'function',
  'return',
  'const',
  'let',
  'var',
  'input',
  'getElementById',
  'addEventListener',
  'querySelector',
  'innerText',
  'length',
  'value',
  'key',
  'style',
  '空'
]);

function autoDeclareVariablesFromCondition(condition) {
  const vars = condition.match(/[\u4e00-\u9fa5A-Za-z_][\w\u4e00-\u9fa5]*/g);

  if (vars) {
    for (const v of vars) {
      if (!declaredVars.has(v) && isNaN(v) && !ignoreList.has(v)) {
        declaredVars.add(v);
        output.unshift(`let ${v} = 0; // ⛳ 自動補上未宣告變數`);
      }
    }
  }
}

function processCondition(condition) {
  // 先處理「判斷是否為空」以避免被其他替換拆解
  let result = condition.replace(
    /判斷是否為空\s*\(\s*(.*?)\s*\)/g,
    (_, arg) => `${arg.trim()}.length === 0`
  );


  // 先處理內容長度，避免在 processConditionExpression 之後被拆解
  result = result.replace(/內容長度/g, 'value.length');

  result = processConditionExpression(result)
    // 補強未在 processConditionExpression 中處理的片段
    .replace(/(===|!==|==|!=)\s*空/g, '$1 ""');
  return result;
}

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const line = normalizeParentheses(raw.trim()); // 🔑 全形 → 半形轉換
  const indent = getIndentLevel(raw);
  const nextIndent = i + 1 < lines.length ? getIndentLevel(lines[i + 1]) : 0;
  const upcomingLine = i + 1 < lines.length ? normalizeParentheses(lines[i + 1].trim()) : '';

  if (!line) continue;

  // 🔊 支援播放音效 / 說出 / 朗讀
  const speakLine = handlePlayOrSpeak(line, indent, declaredVars);
  if (speakLine) {
    output.push(speakLine);
    continue;
  }

  if (line.startsWith('顯示(') && line.includes('在 #')) {
    const match = line.match(/顯示\((.*?) 在 #(.*?)\)/); // ex: 顯示("你是：" + 名字 在 #name)
    if (match) {
      const rawExpr = match[1].trim();
      const targetId = match[2].trim();

      // 處理內容中的每個片段（可能是變數或字串）
      const parts = rawExpr.split(/\s*\+\s*/).map((part) => {
        const trimmed = part.trim();
        if (/^[A-Za-z_]+Module\.\w+/.test(trimmed)) {
          return trimmed; // 直接保留
        }
        return processDisplayArgument(trimmed, declaredVars);
      });
      output.push(
        ' '.repeat(indent) +
          `document.getElementById('${targetId}').innerText = ${parts.join(' + ')};`
      );
      continue;
    }
  }

  if (
    line.startsWith('定義 ') &&
    (line.includes('（') || line.includes('(')) &&
    (line.includes('）：') || line.includes('):'))
  ) {
    const match = line.match(/定義 (.*?)（(.*?)）：/) || line.match(/定義 (.*?)\((.*?)\)：/);
    if (match) {
      const funcName = match[1].trim();
      const params = match[2].trim();
      closeBlocks(indent, nextIndent, line);
      output.push('');
      output.push(' '.repeat(indent) + `function ${funcName}(${params}) {`);
      stack.push({ indent, type: 'function' });
      continue;
    }
  }

  if (
    line.startsWith('呼叫 ') &&
    (line.includes('（') || line.includes('(')) &&
    (line.includes('）') || line.includes(')'))
  ) {
    const match = line.match(/呼叫\s*(.*?)\s*（(.*?)）/) || line.match(/呼叫\s*(.*?)\s*\((.*?)\)/);
    if (match) {
      const funcName = match[1].trim();
      const params = match[2].trim();
      output.push(' '.repeat(indent) + handleFunctionCall(funcName, params, indent, declaredVars));
      continue;
    }
  }
  // ✨ 自動識別「建立人物」後補上人物變數
  // 🧠 自動識別「建立人物」語句後補上變數宣告（防止未宣告錯誤）
  if (line.match(/建立人物[（(]/)) {
    const match = line.match(/建立人物[（(]"?([^"，, ]+)"?,?\s*(\d+)[）)]/); // 偵測建立人物("小傑", 25)
    if (match) {
      const varName = '人物'; // ✅ 目前固定為「人物」，可日後擴充為參數化
      if (!declaredVars.has(varName)) {
        declaredVars.add(varName);
        output.unshift(`let ${varName} = {}; // ⛳ 自動補上 ${varName} 變數`);
      }
    }
  }

  if (line.startsWith('變數 ') && line.includes('= 建立清單')) {
    // 統一括號處理：支援全形/半形
    const match = line.match(/變數 (.*?) = 建立清單[（(].*?[）)]/);
    if (match) {
      const varName = match[1].trim();
      if (!declaredVars.has(varName)) {
        declaredVars.add(varName);
        output.push(' '.repeat(indent) + `let ${varName} = ArrayModule.建立清單();`);
      }
      continue;
    }
  }

  if ((line.startsWith('重複執行（') || line.startsWith('重複執行(')) && line.endsWith('次：')) {
    closeBlocks(indent, nextIndent, line);
    const match = line.match(/重複執行[（(](\d+)[）)]次：/);
    if (match) {
      const times = match[1];
      output.push(' '.repeat(indent) + `for (let i = 0; i < ${times}; i++) {`);
      stack.push({ indent, type: 'loop' });
      continue;
    }
  }

  function handleEvent(line, eventType, domTarget, jsEvent) {
    if (line === `當(${domTarget})時：`) {
      if (registeredEvents.has(eventType)) return true;
      registeredEvents.add(eventType);
      closeBlocks(indent, nextIndent, line);
      output.push('');
      output.push(
        ' '.repeat(indent) +
          `document.querySelector(${jsEvent}).addEventListener("${eventType}", () => {`
      );
      stack.push({ indent, type: 'event' });
      return true;
    }
    return false;
  }

  if (line.match(/^當[（(]使用者\.按下送出按鈕[）)]時：$/)) {
    if (registeredEvents.has('click')) continue;
    registeredEvents.add('click');
    closeBlocks(indent, nextIndent, line);
    output.push('');
    output.push(
      ' '.repeat(indent) + 'document.getElementById("submit").addEventListener("click", () => {'
    );
    stack.push({ indent, type: 'event' });
    continue;
  }

  if (line.match(/^如果[（(](.*?)\.內容 為 空[）)]：?/)) {
    const match = line.match(/^如果[（(](.*?)\.內容 為 空[）)]：?/);
    if (match) {
      closeBlocks(indent, nextIndent, upcomingLine);
      const condition = processCondition(match[1] + '.內容 為 空');
      autoDeclareVariablesFromCondition(condition);
      output.push(' '.repeat(indent) + `if (${condition}) {`);
      stack.push({ indent, type: 'if' });
      continue;
    }
  }

  if (line.match(/^如果[（(](.*?)[）)]：$/)) {
    const match = line.match(/^如果[（(](.*?)[）)]：$/);
    if (match) {
      closeBlocks(indent, nextIndent, line);
      const condition = processCondition(match[1]);
      autoDeclareVariablesFromCondition(condition);
      output.push(' '.repeat(indent) + `if (${condition}) {`);
      stack.push({ indent, type: 'if' });
      continue;
    }
  }

  if (line.match(/^如果[（(](.*?)[）)]：顯示[（(](.*?)[）)]$/)) {
    const match = line.match(/^如果[（(](.*?)[）)]：顯示[（(](.*?)[）)]$/);
    if (match) {
      const condition = processCondition(match[1]);
      const content = match[2].trim();
      autoDeclareVariablesFromCondition(condition);
      output.push(
        ' '.repeat(indent) +
          `if (${condition}) alert(${processDisplayArgument(content, declaredVars)});`
      );
      continue;
    }
  }

  if (line.trim() === '否則：') {
    const currentBlock = stack[stack.length - 1];

    if (currentBlock && currentBlock.type === 'if') {
      output.push(' '.repeat(currentBlock.indent) + '} else {');
      stack.pop(); // 結束 if 區塊
      stack.push({ indent: currentBlock.indent, type: 'else' }); // 開啟 else 區塊
    } else {
      output.push(' '.repeat(indent) + `// ⚠️ 未翻譯：${line}（無對應的 '如果' 區塊）`);
    }

    continue;
  }

  if (line.match(/^若[（(](.*?)[）)]則 顯示[（(](.*?)[）)]$/)) {
    const match = line.match(/^若[（(](.*?)[）)]則 顯示[（(](.*?)[）)]$/);
    if (match) {
      const condition = processCondition(match[1]);
      const content = match[2].trim();
      autoDeclareVariablesFromCondition(condition);
      output.push(
        ' '.repeat(indent) +
          `if (${condition}) alert(${processDisplayArgument(content, declaredVars)});`
      );
      continue;
    }
  }

  if (line.match(/^顯示[（(]"(.*?)" 在輸入框上[）)]$/)) {
    const match = line.match(/^顯示[（(]"(.*?)" 在輸入框上[）)]$/);
    if (match) {
      output.push(' '.repeat(indent) + `輸入框.value = '${match[1]}';`);
      continue;
    }
  }

  if (line.startsWith('變數 ') && line.includes('=')) {
    const match = line.match(/^變數 (.*?) = (.+)$/);
    if (match) {
      const varName = match[1].trim();
      let value = match[2].trim();
      value = value.replace(/^["「『]/, '').replace(/["」』]$/, '');
      value = value.replace(/\.內容/g, '.value');
      value = value.replace(/\.內容長度/g, '.length');
      value = value.replace(/\.長度/g, '.length');

      if (/^\d+$/.test(value)) {
        output.push(' '.repeat(indent) + `let ${varName} = ${value};`);
      } else if (declaredVars.has(value)) {
        output.push(' '.repeat(indent) + `let ${varName} = ${value};`);
      } else {
        output.push(' '.repeat(indent) + `let ${varName} = '${value}';`);
      }

      declaredVars.add(varName);
      continue;
    }
  }

  if (line.startsWith('等待(') && line.includes('毫秒)後 顯示(')) {
    const match = line.match(/等待[(（](\d+)毫秒[)）]後 顯示[(（](.*?)[)）]/);
    if (match) {
      const delay = match[1];
      const parts = match[2].split(/\s*\+\s*/).map((p) => processDisplayArgument(p, declaredVars));
      output.push(' '.repeat(indent) + `setTimeout(() => {`);
      output.push(' '.repeat(indent + 4) + `alert(${parts.join(' + ')});`);
      output.push(' '.repeat(indent) + `}, ${delay});`);
      continue;
    }
  }

  if (line.includes('顯示第幾項(') || line.includes('顯示第幾項（')) {
    const match = line.match(/顯示第幾項[（(](.*?),\s*(\d+)[)）]/);
    if (match) {
      const arg = `顯示第幾項(${match[1].trim()}, ${match[2].trim()})`;
      const js = processDisplayArgument(arg, declaredVars);
      output.push(' '.repeat(indent) + `alert('我最愛吃的水果是：' + ${js});`);
      continue;
    }
  }

  if (line.startsWith('顯示清單長度') && line.match(/顯示清單長度[（(].*[)）]/)) {
    const m = line.match(/顯示清單長度[（(](.*)[)）]/);
    if (m) {
      const listVar = m[1].trim();
      output.push(' '.repeat(indent) + `alert(${listVar}.length);`);
      continue;
    }
  }

  if (line.startsWith('清空清單') && line.match(/清空清單[（(].*[)）]/)) {
    const m = line.match(/清空清單[（(](.*)[)）]/);
    if (m) {
      const listVar = m[1].trim();
      output.push(' '.repeat(indent) + `${listVar}.length = 0;`);
      continue;
    }
  }

  if (line.match(/^切換顏色[（(].*[)）]$/)) {
    const m = line.match(/切換顏色[（(](.*?),\s*(.*?),\s*(.*)[)）]/);
    if (m) {
      const sel = processDisplayArgument(m[1].trim(), declaredVars);
      const c1 = processDisplayArgument(m[2].trim(), declaredVars);
      const c2 = processDisplayArgument(m[3].trim(), declaredVars);
      const elVar = `__toggleEl${toggleColorCounter++}`;
      output.push(' '.repeat(indent) + `let ${elVar} = document.querySelector(${sel});`);
      output.push(
        ' '.repeat(indent) +
          `${elVar}.style.color = ${elVar}.style.color === ${c1} ? ${c2} : ${c1};`
      );
      continue;
    }
  }

  if (line.match(/^隱藏元素[（(].*[)）]$/)) {
    const m = line.match(/隱藏元素[（(](.*)[)）]/);
    if (m) {
      const sel = processDisplayArgument(m[1].trim(), declaredVars);
      output.push(' '.repeat(indent) + `document.querySelector(${sel}).style.display = "none";`);
      continue;
    }
  }

  if (line.match(/^播放影片[（(].*[)）]$/)) {
    const m = line.match(/播放影片[（(](.*)[)）]/);
    if (m) {
      const target = processDisplayArgument(m[1].trim(), declaredVars);
      output.push(' '.repeat(indent) + `document.querySelector(${target}).play();`);
      continue;
    }
  }

  if (line.match(/^暫停音效[（(].*[)）]$/)) {
    const m = line.match(/暫停音效[（(](.*)[)）]/);
    if (m) {
      const target = processDisplayArgument(m[1].trim(), declaredVars);
      output.push(' '.repeat(indent) + `document.querySelector(${target}).pause();`);
      continue;
    }
  }

  if (line.match(/^獲取現在時間[（(].*[)）]$/) || line.trim() === '獲取現在時間()') {
    output.push(' '.repeat(indent) + 'Date.now();');
    continue;
  }

  if (line.match(/^替換文字[（(].*[)）]$/)) {
    const m = line.match(/替換文字[（(](.*?),\s*(.*?),\s*(.*)[)）]/);
    if (m) {
      const str = processDisplayArgument(m[1].trim(), declaredVars);
      const from = processDisplayArgument(m[2].trim(), declaredVars);
      const to = processDisplayArgument(m[3].trim(), declaredVars);
      output.push(' '.repeat(indent) + `${str}.replace(${from}, ${to});`);
      continue;
    }
  }

  if (line.match(/^轉跳網頁[（(].*[)）]$/)) {
    const m = line.match(/轉跳網頁[（(](.*)[)）]/);
    if (m) {
      const url = processDisplayArgument(m[1].trim(), declaredVars);
      output.push(' '.repeat(indent) + `window.location.href = ${url};`);
      continue;
    }
  }

  function handlePlayOrSpeak(line, indent, declaredVars) {
    // 統一格式化括號與引號
    const match = line.match(/^(播放音效|說出|朗讀)[（(](.*?)[）)]$/);
    if (!match) return null;

    const action = match[1];
    const rawArg = match[2].trim();
    const arg = processDisplayArgument(rawArg, declaredVars);

    if (action === '播放音效') {
      return ' '.repeat(indent) + `new Audio(${arg}).play();`;
    }

    if (action === '說出') {
      return ' '.repeat(indent) + `console.log(${arg});`;
    }

    if (action === '朗讀') {
      return ' '.repeat(indent) + `speak(${arg}); // 🔊 TTS 語音播放`;
    }

    return null;
  }

  if (line.startsWith('顯示(') || line.startsWith('顯示（')) {
    const match = line.match(/^顯示[（(](.*?)[）)]$/);
    if (match) {
      let expr = normalizeParentheses(match[1].trim());

      expr = expr
        .replace(/顯示全部[（(](.*?)[）)]/g, (_, arg) => `ArrayModule.顯示全部(${arg.trim()})`)
        .replace(
          /顯示第幾項[（(](.*?),(.*?)[）)]/g,
          (_, arr, idx) => `ArrayModule.顯示第幾項(${arr.trim()}, ${idx.trim()})`
        );

      const parts = expr.split(/\s*\+\s*/g).map((part) => {
        const trimmed = part.trim();
        if (/^[A-Za-z_]+Module\.\w+/.test(trimmed)) {
          return trimmed;
        }
        return processDisplayArgument(trimmed, declaredVars);
      });

      output.push(' '.repeat(indent) + `alert(${parts.join(' + ')});`);
      continue;
    }
  }

  // ✅ 一般函式語句處理：如 設定樣式(...)、轉大寫(...)、使用者輸入(...)
  if (
    (line.match(/^[\u4e00-\u9fa5\w]+[（(].*[）)]$/) || line.match(/^[\u4e00-\u9fa5\w]+\(.*\)$/)) &&
    !line.startsWith('顯示') &&
    !line.startsWith('呼叫')
  ) {
    const match = line.match(/^([\u4e00-\u9fa5\w]+)[（(](.*)[）)]$/);
    if (match) {
      const funcName = match[1].trim();
      const params = match[2].trim();
      const rawCall = `${funcName}(${params})`;
      output.push(' '.repeat(indent) + handleFunctionCall(funcName, params, indent, declaredVars));
      continue;
    }
  }

  output.push(' '.repeat(indent) + `// 未翻譯：${line}（無匹配的語法規則）`);
}

closeBlocks(0, 0);
fs.writeFileSync('output.js', output.join('\n'));
console.log('✅ 腦語 parser v0.9.4（全檔案變數掃描補宣告）已成功轉譯');
