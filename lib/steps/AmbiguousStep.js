const debug = require('debug')('yadda:steps:AmbiguousStep');
const BaseStep = require('./BaseStep');
const { AMBIGUOUS } = require('./statuses');

module.exports = class AmbiguousStep extends BaseStep {

  constructor(props) {
    super(props);
    this._contenders = props.contenders;
  }

  async run(state) {
    delete state.currentLibrary;
    return { status: AMBIGUOUS, contenders: this._contenders };
  }

  abort() {
    return this;
  }
};
