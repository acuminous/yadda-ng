const debug = require('debug')('yadda-ng:macros:Macro');
const { MultiConverter, PassthroughConverter } = require('./converters');

// The job of a macro is to invoke a function using arguments extracted from a step statement
module.exports = class Macro {
  constructor({ library, type, template, pattern, converters, fn }) {
    this._library = library;
    this._type = type;
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
    return !!this._fn;
  }

  reportDuplicate(other) {
    if (!other._pattern.equals(this._pattern)) return;
    throw new Error(`Macro ${other} is a duplicate of ${this}`);
  }

  toString() {
    return this._template
      ? `pattern [${this._pattern}] derived from template [${this._template}] defined in library [${this._library.name}]`
      : `pattern [${this._pattern}] defined in library [${this._library.name}]`;
  }

  async run(state, statement) {
    const generalised = this._library.generalise(statement);
    const args = await this._extractArguments(state, generalised);
    this._reportStatementArgumentsMismatch(args.length, generalised);
    await this._fn.call(null, state, ...args);
  }

  _reportStatementArgumentsMismatch(supply, statement) {
    const demand = Math.max(this._fn.length - 1, 0);
    if (supply === demand) return;
    throw new Error(`Step [${statement}] ${supply < demand ? 'yielded only' : 'yielded'} ${supply} ${supply === 1 ? 'value' : 'values'} using pattern [${this._pattern}] from template [${this._template}], ${supply > demand ? 'but only' : 'but'} ${demand} step ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
  }

  _getDefaultConverters() {
    const size = this._pattern.countMatchingGroups();
    return PassthroughConverter.arrayOf(size);
  }

  async _extractArguments(state, statement) {
    const matches = this._pattern.exec(statement).slice(1);
    if (!matches) throw new Error(`Step [${statement}] did not match ${this._pattern}`);

    const supply = matches.length;
    const demand = this._converters.demand;

    if (supply !== demand) {
      throw new Error(`Step [${statement}] ${supply < demand ? 'matched only' : 'matched'} ${supply} ${supply === 1 ? 'value' : 'values'} using pattern [${this._pattern}] from template [${this._template}], ${supply > demand ? 'but only' : 'but'} a total of ${demand} converter ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
    }

    return this._converters.convert(state, matches);
  }
};
