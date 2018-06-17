const debug = require('debug')('yadda-ng:steps:PendingStep');
const BaseStep = require('./BaseStep');

module.exports = class PendingStep extends BaseStep {

  isPending() {
    return true;
  }

  pretend() {
    debug(`Pretending to run statement [${this.statement}]`);
    return 'pending';
  }

  run() {
    debug(`Skipping ${this.statement}`);
    return 'pending';
  }
};
