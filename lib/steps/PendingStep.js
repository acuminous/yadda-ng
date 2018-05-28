const debug = require('debug')('yadda-ng:steps:PendingStep');
const BaseStep = require('./BaseStep');

module.exports = class PendingStep extends BaseStep {

  isSkipped() {
    return true;
  }

  run(state) {
    debug(`skipping ${this._text}`);
  }
};
