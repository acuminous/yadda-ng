const debug = require('debug')('yadda:converters:DateConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class DateConverter extends BaseConverter {
  async convert(state, value) {
    debug(`Converting [${value}]`);
    if (isNaN(Date.parse(value))) throw new Error(`Cannot convert value [${value}] to a date`);
    return new Date(value);
  }
};
