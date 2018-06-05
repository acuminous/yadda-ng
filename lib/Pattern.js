const debug = require('debug')('yadda-ng:Pattern');

module.exports = class Pattern extends RegExp {
  countMatchingGroups() {
    return new RegExp(`${this.source}|`).exec().length - 1;
  }
};
