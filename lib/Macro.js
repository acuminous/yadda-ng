const debug = require('debug')('yadda-ng:Macro');
const { MultiConverter } = require('./converters');
const { FixedArity } = require('./arities');

// The job of a macro is to invoke a function using arguments extracted from a statement
module.exports = class Macro {
  constructor({ signature, converters, fn }) {
    this._signature = signature;
    this._converters = new MultiConverter({ converters: converters });
    this._converterArity = new FixedArity({ type: 'converter', signature });
    this._functionArity = new FixedArity({ type: 'step', signature });
    this._fn = fn;
  }

  supports(statement) {
    return this._signature.supports(statement);
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

  async run(state, statement) {
    const args = await this._getArguments(state, statement);
    return this._callFunction(state, statement, args);
  }

  async _getArguments(state, statement) {
    const args = this._signature.parseArguments(statement);
    this._converterArity.validate(statement, args.length, this._converters.demand);
    return this._converters.convert(state, args);
  }

  async _callFunction(state, statement, args) {
    this._functionArity.validate(statement, args.length, this._fn.demand);
    return this._fn.run(state, args);
  }
};
