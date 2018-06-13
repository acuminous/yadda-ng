const debug = require('debug')('yadda-ng:steps:PendingStep');
const BaseStep = require('./BaseStep');

module.exports = class PendingStep extends BaseStep {

  isPending() {
    return true;
  }

  run(state) {
    debug(`Skipping ${this._text}`);
  }
};
