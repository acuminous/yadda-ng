const debug = require('debug')('yadda-ng:steps:UndefinedStep');
const BaseStep = require('./BaseStep');

module.exports = class UndefinedStep extends BaseStep {

  constructor(props) {
    super(props);
    this._suggestion = props.suggestion;
  }

  get suggestion() {
    return this._suggestion;
  }

  ifUndefined() {
    return true;
  }

  pretend() {
    debug(`Pretending to run statement [${this.statement}]`);
    return 'undefined';
  }

  run() {
    throw new Error(`Undefined step: [${this.statement}]`);
  }
};
