const debug = require('debug')('yadda-ng:Pattern');

// A pattern is a smarter RegExp
module.exports = class Pattern extends RegExp {
  countMatchingGroups() {
    return new RegExp(`${this.source}|`).exec().length - 1;
  }
};
