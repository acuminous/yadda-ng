const debug = require('debug')('yadda:steps:AsyncStep');
const BaseStep = require('./BaseStep');

module.exports = class AsyncStep extends BaseStep {
  constructor(props) {
    super(props);
    this._macro = props.macro;
  }

  async run(state) {
    debug(`run ${this._text}`);
    return this._macro.run(state, this._text);
  }
};
