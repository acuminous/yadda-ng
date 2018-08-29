const debug = require('debug')('yadda-ng:steps:UndefinedStep');
const BaseStep = require('./BaseStep');
const { PENDING, UNDEFINED } = require('./statuses');

module.exports = class UndefinedStep extends BaseStep {

  async run(state) {
    if (this.isPending()) return { status: PENDING };
    delete state.currentLibrary;
    return { status: UNDEFINED, suggestion: this.suggest() };
  }

  suggest() {
    return `.define('${this.generalised}', (state) => { // your code here })`;
  }
};
