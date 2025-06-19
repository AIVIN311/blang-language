#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const variableHints = require('../variableHints');

const targetFile = process.argv[2];
if (!targetFile) {
  console.error('Usage: node scripts/check-vars.js <file>');
  process.exit(1);
}

const code = fs.readFileSync(path.resolve(process.cwd(), targetFile), 'utf8');
const { message } = variableHints.getHints(code);
console.log(message || 'No undeclared variables.');

