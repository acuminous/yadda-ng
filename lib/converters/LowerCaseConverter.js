const Debug = require('debug');
const BaseConverter = require('./BaseConverter');

module.exports = class LowerCaseConverter extends BaseConverter {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:converters:LowerCaseConverter'),
    } = props;

    super({ debug });
  }

  async convert(state, value) {
    this._debug(`Converting [${value}]`);
    return value.toLowerCase();
  }
};
