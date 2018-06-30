const debug = require('debug')('yadda-ng:steps:DynamicStep');

const Competition = require('../Competition');
const BaseStep = require('./BaseStep');
const AsyncStep = require('./AsyncStep');
const UndefinedStep = require('./UndefinedStep');
const AmbiguousStep = require('./AmbiguousStep');
const { ERROR } = require('./statuses');

// A DynamicStep runs a dynamically created step
module.exports = class DynamicStep extends BaseStep {

  constructor({ librarian, annotations, statement }) {
    super({ annotations, statement });
    this._librarian = librarian;
  }

  isPending() {
    return false;
  }

  async run(state) {
    debug(`Linking statement [${this.statement}]`);
    const candidates = this._librarian.getCompatibleMacros(this.statement);
    const ranked = new Competition().rank(state, candidates);
    const step = this._createStep(this._annotations, this.statement, ranked);

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

  _createStep(annotations, statement, ranked) {
    if (ranked.winner) return new AsyncStep({ annotations, statement, macro: ranked.winner });
    if (ranked.contenders) return new AmbiguousStep({ statement, contenders: ranked.contenders });
    return new UndefinedStep({ annotations, statement, suggestion: this._librarian.suggest(statement) });
  }
};
