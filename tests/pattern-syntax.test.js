const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');

function testPatternSyntax() {
  const filePath = path.join(__dirname, '..', 'customBlangPatterns.js');
  const code = fs.readFileSync(filePath, 'utf8');
  assert.doesNotThrow(() => {
    new vm.Script(code);
  }, 'customBlangPatterns.js should be valid JavaScript');
}

module.exports = { testPatternSyntax };
