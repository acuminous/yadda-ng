const debug = require('debug')('yadda-ng:converters:PassthroughConverter');

module.exports = class PassthroughConverter  {
  constructor(props = {}) {
    this._demand = props.demand || 1;
  }

  async convert(...args) {
    return args.slice(1, this._demand + 1);
  }

  get demand() {
    return this._demand;
  }
};
