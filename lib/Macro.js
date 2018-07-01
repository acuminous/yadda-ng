const debug = require('debug')('yadda-ng:Macro');
const { MultiConverter } = require('./converters');
const ArityValidator = require('./ArityValidator');

// The job of a macro is to invoke a function using arguments extracted from a step statement
module.exports = class Macro {
  constructor({ library, signature, converters, fn }) {
    this._library = library;
    this._signature = signature;
    this._converters = new MultiConverter({ converters: converters || signature.getConverters() });
    this._converterArityValidator = new ArityValidator({ type: 'converter', signature });
    this._functionArityValidator = new ArityValidator({ type: 'step', signature });
    this._fn = fn;
  }

  supports(statement) {
    return this._signature.supports(statement);
  }

  isPending() {
    return !this._fn;
  }

  setCurrentLibrary(state) {
    state.currentLibrary = this._library.name;
  }

  isFromLibrary(name) {
    return this._library.name === name;
  }

  reportDuplicate(other) {
    return this._signature.reportDuplicate(other);
  }

  async run(state, statement) {
    const generalised = this._library.generalise(statement);
    const args = await this._extractArguments(state, generalised);
    this._functionArityValidator.validate(statement, args.length, Math.max(this._fn.length - 1, 0));
    return this._fn.call(null, state, ...args);
  }

  async _extractArguments(state, statement) {
    const args = this._signature.parseArguments(statement);
    this._converterArityValidator.validate(statement, args.length, this._converters.demand);
    return this._converters.convert(state, args);
  }
};
