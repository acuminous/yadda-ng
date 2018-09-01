const debug = require('debug')('yadda:converters:LowerCaseConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class LowerCaseConverter extends BaseConverter {
  async convert(state, value) {
    debug(`Converting [${value}]`);
    return value.toLowerCase();
  }
};
