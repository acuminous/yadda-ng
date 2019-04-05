const BaseConverter = require('./BaseConverter');
const Debug = require('debug');

module.exports = class PassThroughConverter extends BaseConverter {

  constructor(props = {}) {
    const {
      demand = 1,
      forceArray = false,
      debug = Debug('yadda:converters:PassThroughConverter'),
    } = props;

    super({ debug });
    this._demand = demand;
    this._forceArray = forceArray;
  }

  static arrayOf(size) {
    return new Array(size).fill().map(() => new PassThroughConverter());
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
