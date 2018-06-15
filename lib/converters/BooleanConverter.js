const debug = require('debug')('yadda-ng:converters:BooleanConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class BooleanConverter extends BaseConverter {
  async convert(state, value) {
    debug(`Converting [${value}]`);
    if (!/^true|false$/i.test(value)) throw new Error(`Cannot convert value [${value}] to a boolean`);
    return /^true$/i.test(value);
  }
};
