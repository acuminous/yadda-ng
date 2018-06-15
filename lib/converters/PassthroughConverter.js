const debug = require('debug')('yadda-ng:converters:PassthroughConverter');

module.exports = class PassthroughConverter  {
  constructor(props = {}) {
    this._demand = props.demand || 1;
    this._forceArray = props.forceArray || false;
  }

  static arrayOf(size) {
    return new Array(size).fill().map(() => new PassthroughConverter());
  }

  async convert(...args) {
    return (!this._forceArray && args.length === 2)
      ? args[1]
      : args.slice(1, this._demand + 1);
  }

  get demand() {
    return this._demand;
  }
};
