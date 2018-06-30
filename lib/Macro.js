const debug = require('debug')('yadda-ng:Macro');
const { MultiConverter } = require('./converters');

// The job of a macro is to invoke a function using arguments extracted from a step statement
module.exports = class Macro {
  constructor({ library, signature, converters, fn }) {
    this._library = library;
    this._signature = signature;
    this._converters = new MultiConverter({ converters: converters || signature.getConverters() });
    this._fn = fn;
  }

  // TODO Remove when signature is created in library
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

  // TODO Remove when signature is created in library
  reportDuplicate(other) {
    return this._signature.reportDuplicate(other);
  }

  // TODO Remove when signature is created in library
  toString() {
    return this._signature.toString();
  }

  async run(state, statement) {
    state.currentLibrary = this._library.name;
    const generalised = this._library.generalise(statement);
    const args = await this._extractArguments(state, generalised);
    this._reportArgumentMismatch('step', args.length, Math.max(this._fn.length - 1, 0), statement);
    await this._fn.call(null, state, ...args);
  }

  async _extractArguments(state, statement) {
    const args = this._signature.parseArguments(statement);
    this._reportArgumentMismatch('converter', args.length, this._converters.demand, statement);
    return this._converters.convert(state, args);
  }

  _reportArgumentMismatch(type, supply, demand, statement) {
    if (supply === demand) return;
    throw new Error(`Step [${statement}] yielded ${this._formatSupply(supply, demand)} using ${this._signature}, but ${this._formatDemand(type, supply, demand)} specified`);
  }

  _formatSupply(supply, demand) {
    const items = this._pluralise('value', 'values', supply);
    if (supply === 0) return `no ${items}`;
    if (supply < demand) return `only ${supply} ${items}`;
    return `${supply} ${items}`;
  }

  _formatDemand(type, supply, demand) {
    const items = this._pluralise('argument was', 'arguments were', demand);
    if (demand === 0) return `no ${type} ${items}`;
    if (supply > demand) return `only ${demand} ${type} ${items}`;
    return `${demand} ${type} ${items}`;
  }

  _pluralise(singular, plural, count) {
    return count === 1 ? singular : plural;
  }
};
