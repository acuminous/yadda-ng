const debug = require('debug')('yadda-ng:Pattern');

// A pattern is a smarter RegExp
module.exports = class Pattern extends RegExp {

  supports(text) {
    return this.test(text);
  }

  execute(text) {
    this.lastIndex = 0;
    return this.exec(text);
  }

  countMatchingGroups() {
    return new RegExp(`${this.source}|`).exec().length - 1;
  }
};
