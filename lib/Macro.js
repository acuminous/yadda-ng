const debug = require('debug')('yadda-ng:Macro');
const { MultiConverter } = require('./converters');
const { FixedArity } = require('./arities');

// The job of a macro is to invoke a function using arguments extracted from a step statement
module.exports = class Macro {
  constructor({ signature, converters, fn }) {
    this._signature = signature;
    this._converters = new MultiConverter({ converters: converters });
    this._converterArity = new FixedArity({ type: 'converter', signature });
    this._functionArity = new FixedArity({ type: 'step', signature });
    this._fn = fn;
  }

  supports(step) {
    return this._signature.supports(step);
  }

  isPending() {
    return this._fn.isPending();
  }

  setCurrentLibrary(state) {
    this._signature.setCurrentLibrary(state);
  }

  isFromLibrary(name) {
    return this._signature.isFromLibrary(name);
  }

  reportDuplicate(other) {
    return this._signature.reportDuplicate(other);
  }

  async run(state, step) {
    const args = await this._getArguments(state, step);
    return this._callFunction(state, step, args);
  }

  async _getArguments(state, step) {
    const args = this._signature.parseArguments(step);
    this._converterArity.validate(step.statement, args.length, this._converters.demand);
    return this._converters.convert(state, args);
  }

  async _callFunction(state, step, args) {
    this._functionArity.validate(step.statement, args.length, this._fn.demand);
    return this._fn.run(state, args);
  }
};
