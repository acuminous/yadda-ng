const debug = require('debug')('yadda:steps:UndefinedStep');
const BaseStep = require('./BaseStep');

module.exports = class UndefinedStep extends BaseStep {
  async run(state) {
    if (this.isPending()) return { status: BaseStep.PENDING };
    state.remove('currentLibrary');
    return { status: BaseStep.UNDEFINED, suggestion: this.suggest() };
  }

  suggest() {
    return `.define('${this.generalised}', (state) => { // your code here })`;
  }

  abort() {
    return this;
  }
};
