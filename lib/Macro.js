const debug = require('debug')('yadda-ng:Macro');
const { MultiConverter } = require('./converters');
const { AsyncFunction, PendingFunction } = require('./functions');
const ArityValidator = require('./ArityValidator');

// The job of a macro is to invoke a function using arguments extracted from a step statement
module.exports = class Macro {
  constructor({ signature, converters, fn }) {
    this._signature = signature;
    this._converters = new MultiConverter({ converters: converters || signature.getConverters() });
    this._converterArityValidator = new ArityValidator({ type: 'converter', signature });
    this._functionArityValidator = new ArityValidator({ type: 'step', signature });
    this._fn = fn ? new AsyncFunction({ fn }) : new PendingFunction();
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
    this._converterArityValidator.validate(statement, args.length, this._converters.demand);
    return this._converters.convert(state, args);
  }

  async _callFunction(state, statement, args) {
    this._functionArityValidator.validate(statement, args.length, this._fn.demand);
    return this._fn.run(state, args);
  }
};
