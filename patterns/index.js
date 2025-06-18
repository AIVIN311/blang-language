const arrayPatterns = require('./array');
const displayPatterns = require('./display');
const logicPatterns = require('./logic');
const generalPatterns = require('./general');

module.exports = function registerPatterns(definePattern) {
  logicPatterns(definePattern);
  arrayPatterns(definePattern);
  displayPatterns(definePattern);
  generalPatterns(definePattern);
};
