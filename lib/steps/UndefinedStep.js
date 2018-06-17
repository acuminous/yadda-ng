const debug = require('debug')('yadda-ng:steps:UndefinedStep');
const BaseStep = require('./BaseStep');

module.exports = class UndefinedStep extends BaseStep {

  constructor(props) {
    super(props);
    this._language = props.language;
  }

  ifUndefined() {
    return true;
  }

  suggest() {
    return this._language.generalise(this._statement);
  }

  pretend() {
    debug(`Pretending to run statement [${this.statement}]`);
    return 'undefined';
  }

  run() {
    throw new Error(`Undefined step: [${this.statement}]`);
  }
};
