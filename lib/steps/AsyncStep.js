const debug = require('debug')('yadda-ng:steps:AsyncStep');
const BaseStep = require('./BaseStep');

module.exports = class AsyncStep extends BaseStep {

  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  isPending() {
    return this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }

  pretend() {
    debug(`Pretending to run statement [${this.statement}]`);
    return this.isPending() ? 'pending' : 'run';
  }

  async run(state) {
    debug(`Running statement [${this.statement}]`);
    if (this.pending) return 'pending';
    this._macro.run(state, this.statement);
    return 'run';
  }
};
