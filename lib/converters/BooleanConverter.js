const Debug = require('debug');
const BaseConverter = require('./BaseConverter');

module.exports = class BooleanConverter extends BaseConverter {
  constructor(props = {}) {
    const { debug = Debug('yadda:converters:BooleanConverter') } = props;

    super({ debug });
  }

  async convert(state, value) {
    this._debug(`Converting [${value}]`);
    if (!/^true|false$/i.test(value)) throw new Error(`Cannot convert value [${value}] to a boolean`);
    return /^true$/i.test(value);
  }
};
