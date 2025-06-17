(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./errorHelper.js'));
  } else {
    root.handleSyntax = factory(root.ErrorHelper);
  }
})(typeof self !== 'undefined' ? self : this, function(ErrorHelper){
  return function handleSyntax(jsCode){
    try {
      if (typeof window === 'undefined') {
        const vm = require('vm');
        return vm.runInNewContext(jsCode, {}, { timeout: 1000 });
      }
      return Function('"use strict";\n' + jsCode)();
    } catch (err) {
      const translator = ErrorHelper && ErrorHelper.translateError;
      const msg = translator ? translator(err) : err.message;
      throw new Error(msg);
    }
  };
});
