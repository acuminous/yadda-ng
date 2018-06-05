const debug = require('debug')('yadda-ng:converters:NumberConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class NumberConverter extends BaseConverter {
  async convert(state, value) {
    debug(`Converting [${value}]`);
    return Number(value);
  }
};
