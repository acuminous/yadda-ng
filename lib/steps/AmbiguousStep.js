const debug = require('debug')('yadda:steps:AmbiguousStep');
const BaseStep = require('./BaseStep');

module.exports = class AmbiguousStep extends BaseStep {

  constructor(props) {
    super(props);
    this._contenders = props.contenders;
  }

  async run(state) {
    state.remove('currentLibrary');
    return { status: BaseStep.AMBIGUOUS, contenders: this._contenders };
  }

  abort() {
    return this;
  }
};
