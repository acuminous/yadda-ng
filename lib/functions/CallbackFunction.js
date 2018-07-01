const debug = require('debug')('yadda-ng:functions:CallbackFunction');

module.exports = class CallbackFunction {

  constructor({ fn }) {
      this._fn = fn;
  }

  get demand() {
    return Math.max(this._fn.length - 2, 0);
  }

  isPending() {
    return false;
  }

  async run(state, args) {
    return new Promise((resolve, reject) => {
      this._fn.call(null, state, ...args, (err, state) => {
        if (err) return reject(err);
        resolve(state);
      });
    });
  }
};
