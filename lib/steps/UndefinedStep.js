const debug = require('debug')('yadda-ng:steps:UndefinedStep');
const BaseStep = require('./BaseStep');

module.exports = class UndefinedStep extends BaseStep {

  constructor(props) {
    super(props);
    this._language = props.language;
  }

  suggest() {
    return this._language.generalise(this._statement);
  }

  run() {
    throw new Error(`Undefined step: [${this.statement}]`);
  }
};
