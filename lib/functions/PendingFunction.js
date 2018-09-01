const debug = require('debug')('yadda:functions:AsyncFunction');

module.exports = class AsyncFunction {

  isPending() {
    return true;
  }

  async run() {
    throw new Error('Pending functions should not be executed');
  }
};
