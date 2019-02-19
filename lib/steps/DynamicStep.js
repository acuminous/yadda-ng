const debug = require('debug')('yadda:steps:DynamicStep');

const Competition = require('../Competition');
const BaseStep = require('./BaseStep');
const RunnableStep = require('./RunnableStep');
const UndefinedStep = require('./UndefinedStep');
const AmbiguousStep = require('./AmbiguousStep');
const { ERROR } = require('./statuses');

// A DynamicStep runs a dynamically created step
module.exports = class DynamicStep extends BaseStep {

  constructor({ librarian, annotations, text, generalised, docString }) {
    super({ annotations, text, generalised, docString });
    this._librarian = librarian;
  }

  isPending() {
    return false;
  }

  async run(state) {
    debug(`Linking step [${this.text}]`);
    const candidates = this._librarian.getCompatibleMacros(this);
    const ranked = new Competition().rank(state, candidates);
    const step = this._createStep(this._annotations, this.text, this.generalised, this.docString, ranked);

    if (this.isAborted()) step.abort();

    let outcome = {};
    const started = Date.now();
    try {
      outcome = await step.run(state);
    } catch (error) {
      Object.assign(outcome, { status: ERROR, error });
    } finally {
      Object.assign(outcome, { duration: Date.now() - started });
    }
    return outcome;
  }

  _createStep(annotations, text, generalised, docString, ranked) {
    if (ranked.winner) return new RunnableStep({ annotations, text, generalised, docString, macro: ranked.winner });
    if (ranked.contenders) return new AmbiguousStep({ text, generalised, docString, contenders: ranked.contenders });
    return new UndefinedStep({ annotations, text, generalised, docString });
  }
};
