const debug = require('debug')('yadda-ng:steps:AsyncStep');
const BaseStep = require('./BaseStep');
const { PENDING, RUN } = require('./statuses');

module.exports = class AsyncStep extends BaseStep {

  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  isPending() {
    return this._macro.isPending() || this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }

  async run(state) {
    debug(`Running statement [${this.statement}]`);
    if (this.isPending()) return { status: PENDING };

    await this._macro.run(state, this.statement);
    return { status: RUN };
  }
};
