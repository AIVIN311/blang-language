#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const api = require('../blangSyntaxAPI.js');

const registered = api.getRegisteredPatterns();
const types = Array.from(new Set(registered.map(p => p.type).filter(Boolean)));

const map = {};
for (const type of types) {
  const patterns = api.getPatternsByType(type).map(p => p.pattern);
  map[type] = patterns;
}

const outputPath = path.resolve(__dirname, '../syntaxMap.json');
fs.writeFileSync(outputPath, JSON.stringify(map, null, 2));
console.log(`syntaxMap.json written to ${outputPath}`);

