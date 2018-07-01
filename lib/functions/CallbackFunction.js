const debug = require('debug')('yadda-ng:functions:CallbackFunction');

module.exports = class CallbackFunction {

  constructor({ fn }) {
      this._fn = fn;
  }

  isPending() {
    return false;
  }

  get demand() {
    return Math.max(this._fn.length - 2, 1);
  }

  async run(state, args) {
    return Promise.new((resolve, reject) => {
      this._fn.call(null, state, ...args, (err, state) => {
        if (err) return reject(err);
        resolve(state);
      });
    });
  }
};
