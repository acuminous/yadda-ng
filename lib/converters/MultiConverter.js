const debug = require('debug')('yadda-ng:converters:MultiConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class MultiConverter extends BaseConverter {
  constructor({ converters = [] }) {
    super();
    this._converters = [].concat(converters);
    this._demand = this._converters.reduce((total, converter) => total + converter.demand, 0);
  }

  get demand() {
    return this._demand;
  }

  async convert(state, values) {
    debug(`Converting [${values}]`);
    return this._converters.reduce((promise, converter) => promise.then(async (args) => {
      const chunk = values.splice(0, converter.demand);
      const converted = await converter.convert(state, ...chunk);
      return args.concat(converted);
    }), Promise.resolve([]));
  }
};
