const fs = require('fs');

const blang = fs.readFileSync('demo.blang', 'utf8');
const lines = blang.split('\n');

const output = [];
const stack = [];

output.push('const 輸入框 = document.getElementById("input");');

function getIndentLevel(line) {
  return line.match(/^(\s*)/)[0].length;
}

function closeBlocks(currentIndent, nextIndent) {
  while (stack.length > 0 && nextIndent <= stack[stack.length - 1].indent) {
    const block = stack.pop();
    const closing = block.type === 'event' ? '});' : '}';
    output.push(' '.repeat(block.indent) + closing);
  }
}

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const line = raw.trim();
  const indent = getIndentLevel(raw);
  const nextIndent = i + 1 < lines.length ? getIndentLevel(lines[i + 1]) : 0;

  if (!line) continue;

  // 事件處理
  if (line.startsWith('當（使用者.進入頁面）時：')) {
    closeBlocks(indent, nextIndent);
    output.push(' '.repeat(indent) + 'window.addEventListener("load", () => {');
    stack.push({ indent, type: 'event' });
    continue;
  }

  if (line.startsWith('當（使用者.按下送出按鈕）時：')) {
    closeBlocks(indent, nextIndent);
    output.push(' '.repeat(indent) + 'document.getElementById("submit").addEventListener("click", () => {');
    stack.push({ indent, type: 'event' });
    continue;
  }

  // 條件處理
  if (line.startsWith('如果（') && line.includes('為 空')) {
    const match = line.match(/如果（(.*?)\.內容 為 空）：?/);
    if (match) {
      closeBlocks(indent, nextIndent);
      output.push(' '.repeat(indent) + `if (${match[1]}.value === "") {`);
      stack.push({ indent, type: 'if' });
      continue;
    }
  }

  if (line.startsWith('否則：')) {
    const currentBlock = stack[stack.length - 1];
    if (currentBlock && currentBlock.type === 'if') {
      stack.pop(); // Remove the if block
      output.push(' '.repeat(indent) + '} else {');
      stack.push({ indent, type: 'else' });
    }
    continue;
  }

  // 語句處理 - 不需要壓入 stack
  if (line.startsWith('顯示（') && line.includes('在輸入框上')) {
    const match = line.match(/顯示（"(.*?)" 在輸入框上）/);
    if (match) {
      output.push(' '.repeat(indent) + `輸入框.value = "${match[1]}";`);
      continue;
    }
  }
// 變數 foo = "bar"
if (line.startsWith('變數 ') && line.includes('=')) {
  // 支援：變數 數量 = 3
const match = line.match(/變數 (.*?) = "(.*?)"/) || line.match(/變數 (.*?) = (\d+)/);
  if (match) {
    const varName = match[1];
    const value = match[2];
    output.push(' '.repeat(indent) + `let ${varName} = ${value};`);
    continue;
  }
}
// 等待（3000毫秒）後 顯示（"內容"）
if (line.startsWith('等待（') && line.includes('毫秒）後 顯示（')) {
  const match = line.match(/等待（(\d+)毫秒）後 顯示（"(.*?)"(?: \+ (.*?))?）/);
  if (match) {
    const delay = match[1];
    let out = `"${match[2]}"`;
    if (match[3]) {
      if (match[3].endsWith('.內容')) {
        const varName = match[3].replace('.內容', '');
        out += ` + ${varName}.value`;
      } else {
        out += ` + ${match[3]}`;
      }
    }
    output.push(' '.repeat(indent) + `setTimeout(() => {`);
    output.push(' '.repeat(indent + 2) + `alert(${out});`);
    output.push(' '.repeat(indent) + `}, ${delay});`);
    continue;
  }
}

  if (line.startsWith('顯示（')) {
    const match = line.match(/顯示（"(.*?)"(?: \+ (.*?))?）/);
    if (match) {
      let out = `"${match[1]}"`;
      if (match[2]) {
        if (match[2].endsWith('.內容')) {
          const varName = match[2].replace('.內容', '');
          out += ` + ${varName}.value`;
        } else {
          out += ` + ${match[2]}`;
        }
      }
      output.push(' '.repeat(indent) + `alert(${out});`);
      continue;
    }
  }

  output.push(' '.repeat(indent) + `// 未翻譯：${line}`);
}

// 正確收尾所有開啟的區塊
closeBlocks(0, 0);

fs.writeFileSync('output.js', output.join('\n'));
console.log('✅ 腦語 parser v0.5.2 已成功轉譯，請查看 output.js');
