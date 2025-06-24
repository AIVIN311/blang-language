const arrayPatterns = require('./array');
const displayPatterns = require('./display');
const mediaPatterns = require('./media');
const eventPatterns = require('./event');
const logicPatterns = require('./logic');
const confirmPattern = require('./confirm');
const conditionPattern = require('./condition');
const loopPatterns = require('./loop');
const generalPatterns = require('./general');

module.exports = function registerPatterns(definePattern) {
  logicPatterns(definePattern);
  arrayPatterns(definePattern);
  displayPatterns(definePattern);
  mediaPatterns(definePattern);
  confirmPattern(definePattern);
  conditionPattern(definePattern);
  eventPatterns(definePattern);
  loopPatterns(definePattern);
  generalPatterns(definePattern);
};
