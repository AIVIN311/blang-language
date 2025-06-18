const arrayPatterns = require('./array');
const displayPatterns = require('./display');
const mediaPatterns = require('./media');
const logicPatterns = require('./logic');
const generalPatterns = require('./general');

module.exports = function registerPatterns(definePattern) {
  logicPatterns(definePattern);
  arrayPatterns(definePattern);
  displayPatterns(definePattern);
  mediaPatterns(definePattern);
  generalPatterns(definePattern);
};
