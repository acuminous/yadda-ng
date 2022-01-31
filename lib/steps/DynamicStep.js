const debug = require('debug')('yadda:steps:DynamicStep');

const Competition = require('../Competition');
const BaseStep = require('./BaseStep');
const RunnableStep = require('./RunnableStep');
const UndefinedStep = require('./UndefinedStep');
const AmbiguousStep = require('./AmbiguousStep');

// TODO Why is debug static?
// TODO Inject competition from the playbook

// A DynamicStep runs a dynamically created step.
module.exports = class DynamicStep extends BaseStep {
  constructor({ libraries, annotations, text, generalised, docString }) {
    super({ annotations, text, generalised, docString });
    this._libraries = libraries;
  }

  isPending() {
    return false;
  }

  async run(state) {
    debug(`Linking step [${this.text}]`);
    const candidates = this._libraries.getCompatibleMacros(this);
    const ranked = new Competition().rank(state, candidates);
    const step = this._createStep(this._annotations, this.text, this.generalised, this.docString, ranked);

    if (this.isAborted()) step.abort();

    const outcome = { started: Date.now() };
    try {
      const result = await step.run(state);
      Object.assign(outcome, result);
    } catch (error) {
      Object.assign(outcome, { status: BaseStep.ERROR, error });
    } finally {
      Object.assign(outcome, { duration: Date.now() - outcome.started });
    }
    return outcome;
  }

  _createStep(annotations, text, generalised, docString, ranked) {
    if (ranked.winner) return new RunnableStep({ annotations, text, generalised, docString, macro: ranked.winner });
    if (ranked.contenders) return new AmbiguousStep({ text, generalised, docString, contenders: ranked.contenders });
    return new UndefinedStep({ annotations, text, generalised, docString });
  }
};
