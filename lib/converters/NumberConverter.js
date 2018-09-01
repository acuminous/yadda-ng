const debug = require('debug')('yadda:converters:NumberConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class NumberConverter extends BaseConverter {
  async convert(state, value) {
    debug(`Converting [${value}]`);
    return Number(value);
  }
};
