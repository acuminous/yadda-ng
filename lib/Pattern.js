const debug = require('debug')('yadda:Pattern');

// The job of a Pattern is to be a smarter RegExp
module.exports = class Pattern extends RegExp {

  supports(text) {
    return this.test(text);
  }

  equals(other) {
    return other.source === this.source;
  }

  countMatchingGroups() {
    return new RegExp(`${this.source}|`).exec().length - 1;
  }
};
