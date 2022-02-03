const debug = require('debug')('yadda:steps:RunnableStep');
const BaseStep = require('./BaseStep');

// TODO make macro explicit in props
// TODO Why is debug static?
module.exports = class RunnableStep extends BaseStep {
  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  isPending() {
    return super.isPending() || this._macro.isPending();
  }

  async run(state) {
    debug(`Running step [${this.text}]`);
    this._macro.setCurrentLibrary(state);

    if (this.isPending()) return { status: BaseStep.PENDING };
    if (this.isAborted()) return { status: BaseStep.ABORTED };

    const result = await this._macro.run(state, this);
    return { status: BaseStep.RUN, ...result };
  }
};
