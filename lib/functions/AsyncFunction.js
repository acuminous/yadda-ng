// TODO Rename demand to Arity or number of argumentse

module.exports = class AsyncFunction {
  constructor({ fn }) {
    this._fn = fn;
  }

  get demand() {
    return Math.max(this._fn.length - 1, 0);
  }

  isPending() {
    return false;
  }

  async run(state, args) {
    return this._fn.call(null, state, ...args);
  }
};
