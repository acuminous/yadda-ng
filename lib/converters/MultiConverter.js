const Debug = require('debug');
const BaseConverter = require('./BaseConverter');

module.exports = class MultiConverter extends BaseConverter {

  constructor(props = {}) {
    const {
      converters = [],
      debug = Debug('yadda:converters:MultiConverter'),
    } = props;

    super({ debug });
    this._converters = converters;
    this._demand = this._converters.reduce((total, converter) => total + converter.demand, 0);
  }

  get demand() {
    return this._demand;
  }

  async convert(state, values) {
    this._debug(`Converting [${values}]`);
    return this._converters.reduce((promise, converter) => promise.then(async (args) => {
      const chunk = values.splice(0, converter.demand);
      const converted = await converter.convert(state, ...chunk);
      return args.concat(converted);
    }), Promise.resolve([]));
  }
};
