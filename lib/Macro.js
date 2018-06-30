const debug = require('debug')('yadda-ng:macros:Macro');
const { MultiConverter, PassthroughConverter } = require('./converters');

// The job of a macro is to invoke a function using arguments extracted from a step statement
module.exports = class Macro {
  constructor({ library, template, pattern, converters, fn }) {
    this._library = library;
    this._template = template;
    this._pattern = pattern;
    this._converters = new MultiConverter({ converters: converters || this._getDefaultConverters() });
    this._fn = fn;
  }

  supports(statement) {
    const generalised = this._library.generalise(statement);
    return this._pattern.supports(generalised);
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
    if (!other._pattern.equals(this._pattern)) return;
    throw new Error(`${other} is a duplicate of ${this}`.replace(/^m/, 'M'));
  }

  toString() {
    return this._template
      ? `macro with pattern [${this._pattern}] derived from template [${this._template}] defined in library [${this._library.name}]`
      : `macro with pattern [${this._pattern}] defined in library [${this._library.name}]`;
  }

  async run(state, statement) {
    state.currentLibrary = this._library.name;
    const generalised = this._library.generalise(statement);
    const args = await this._extractArguments(state, generalised);
    this._reportArgumentMismatch('step', args.length, Math.max(this._fn.length - 1, 0), statement);
    await this._fn.call(null, state, ...args);
  }

  _getDefaultConverters() {
    const size = this._pattern.countMatchingGroups();
    return PassthroughConverter.arrayOf(size);
  }

  async _extractArguments(state, statement) {
    const matches = this._pattern.exec(statement).slice(1);
    if (!matches) throw new Error(`Step [${statement}] did not match ${this._pattern}`);
    this._reportArgumentMismatch('converter', matches.length, this._converters.demand, statement);

    return this._converters.convert(state, matches);
  }

  _reportArgumentMismatch(type, supply, demand, statement) {
    if (supply === demand) return;
    throw new Error(`Step [${statement}] yielded ${this._formatSupply(supply, demand)} using ${this._formatPattern()}, but ${this._formatDemand(type, supply, demand)} specified`);
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

  _formatPattern() {
    return this._template ? `pattern [${this._pattern}] from template [${this._template}]` : `pattern [${this._pattern}]`;
  }
};
