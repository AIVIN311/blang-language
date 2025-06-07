// 🧼 blang-fmt.js v0.1 - 中文語法自動格式化工具
// 自動調整 demo.blang 的縮排與空行格式

const fs = require('fs');

const INDENT_UNIT = '    '; // 四個空白作為一層縮排

function formatBlangLines(lines) {
  const result = [];
  let indentLevel = 0;

  for (let line of lines) {
    let trimmed = line.trim();
    if (!trimmed) continue; // 忽略空行

    // 自動減少縮排（遇到結尾語句）
    if (/^(否則：|.*）：)$/.test(trimmed)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    result.push(INDENT_UNIT.repeat(indentLevel) + trimmed);

    // 遇到區塊起始語句自動增加縮排層級
    if (/：(\s*)$/.test(trimmed) || /（\d+）次：$/.test(trimmed)) {
      indentLevel++;
    }
  }

  return result.join('\n');
}

function formatBlangFile(inputPath = 'demo.blang', outputPath = 'demo_formatted.blang') {
  const raw = fs.readFileSync(inputPath, 'utf8');
  const lines = raw.split('\n');
  const formatted = formatBlangLines(lines);
  fs.writeFileSync(outputPath, formatted, 'utf8');
  console.log(`✅ 已格式化並輸出至：${outputPath}`);
}

// 若此檔案直接執行，格式化 demo.blang
if (require.main === module) {
  formatBlangFile();
}

module.exports = { formatBlangFile };
