const Debug = require('debug');
const BaseConverter = require('./BaseConverter');

module.exports = class DateConverter extends BaseConverter {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:converters:DateConverter'),
    } = props;

    super({ debug });
  }

  async convert(state, value) {
    this._debug(`Converting [${value}]`);
    if (isNaN(Date.parse(value))) throw new Error(`Cannot convert value [${value}] to a date`);
    return new Date(value);
  }
};
