// blangSyntaxAPI.js

const patternRegistry = [];

function definePattern(pattern, generator) {
  patternRegistry.push({ pattern, generator });
}

function runBlangParser(lines) {
  const output = [];

  for (let line of lines) {
    let matched = false;

    for (let { pattern, generator } of patternRegistry) {
      const regex = buildRegexFromPattern(pattern);
      const match = line.match(regex);

      if (match) {
        const args = match.slice(1); // 因為 match[0] 是整串
        output.push(generator(...args));
        matched = true;
        break;
      }
    }

    if (!matched) {
      output.push('// 無法辨識語句：' + line);
    }
  }

  return output.join('\n');
}

function buildRegexFromPattern(pattern) {
  // 將「設定 $變數 為 $值」轉為正則：設定 (.+) 為 (.+)
  return new RegExp(
    '^' + pattern.replace(/\$/g, '').replace(/變數|數值|內容|條件|數字|時間|角色/g, '(.+)') + '$'
  );
}

module.exports = {
  definePattern,
  runBlangParser
};
