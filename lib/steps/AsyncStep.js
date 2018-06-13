const debug = require('debug')('yadda:steps:AsyncStep');
const BaseStep = require('./BaseStep');

module.exports = class AsyncStep extends BaseStep {
  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  async run(state) {
    debug(`Running ${this.statement}`);
    return this._macro.run(state, this.statement);
  }
};
