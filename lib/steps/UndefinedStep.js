const debug = require('debug')('yadda-ng:steps:UndefinedStep');
const BaseStep = require('./BaseStep');

module.exports = class UndefinedStep extends BaseStep {

  suggest() {
  }

  run() {
    throw new Error(`Undefined step: [${this._text}]`);
  }
};
