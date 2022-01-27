const Debug = require('debug');
const BaseConverter = require('./BaseConverter');

module.exports = class NumberConverter extends BaseConverter {
  constructor(props = {}) {
    const { debug = Debug('yadda:converters:NumberConverter') } = props;

    super({ debug });
  }

  async convert(state, value) {
    this._debug(`Converting [${value}]`);
    return Number(value);
  }
};
