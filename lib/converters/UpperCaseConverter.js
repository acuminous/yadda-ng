const Debug = require('debug');
const BaseConverter = require('./BaseConverter');

module.exports = class UpperCaseConverter extends BaseConverter {
  constructor(props = {}) {
    const { debug = Debug('yadda:converters:UpperCaseConverter') } = props;

    super({ debug });
  }

  async convert(state, value) {
    this._debug(`Converting [${value}]`);
    return value.toUpperCase();
  }
};
