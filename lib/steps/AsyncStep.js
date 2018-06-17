const debug = require('debug')('yadda:steps:AsyncStep');
const BaseStep = require('./BaseStep');

module.exports = class AsyncStep extends BaseStep {

  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  isPending() {
    return this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }

  async run(state) {
    debug(`Running ${this.statement}`);
    this._macro.run(state, this.statement);
  }
};
