const debug = require('debug')('yadda-ng:steps:DynamicStep');

const Competition = require('../Competition');
const BaseStep = require('./BaseStep');
const RunnableStep = require('./RunnableStep');
const UndefinedStep = require('./UndefinedStep');
const AmbiguousStep = require('./AmbiguousStep');
const { ERROR } = require('./statuses');

// A DynamicStep runs a dynamically created step
module.exports = class DynamicStep extends BaseStep {

  constructor({ librarian, annotations, statement, generalised }) {
    super({ annotations, statement, generalised });
    this._librarian = librarian;
  }

  isPending() {
    return false;
  }

  async run(state) {
    debug(`Linking statement [${this.statement}]`);
    const candidates = this._librarian.getCompatibleMacros(this);
    const ranked = new Competition().rank(state, candidates);
    const step = this._createStep(this._annotations, this.statement, this.generalised, ranked);

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

  _createStep(annotations, statement, generalised, ranked) {
    if (ranked.winner) return new RunnableStep({ annotations, statement, generalised, macro: ranked.winner });
    if (ranked.contenders) return new AmbiguousStep({ statement, generalised, contenders: ranked.contenders });
    return new UndefinedStep({ annotations, statement, generalised });
  }
};
