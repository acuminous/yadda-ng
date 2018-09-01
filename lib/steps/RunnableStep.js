const debug = require('debug')('yadda:steps:RunnableStep');
const BaseStep = require('./BaseStep');
const { PENDING, RUN } = require('./statuses');

module.exports = class RunnableStep extends BaseStep {

  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  isPending() {
    return super.isPending() || this._macro.isPending();
  }

  async run(state) {
    debug(`Running statement [${this.statement}]`);
    this._macro.setCurrentLibrary(state);

    if (this.isPending()) return { status: PENDING };

    await this._macro.run(state, this);
    return { status: RUN };
  }
};
