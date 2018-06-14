const debug = require('debug')('yadda-ng:macros:Macro');
const { PassthroughConverter } = require('./converters');

module.exports = class Macro {
  constructor({ library, type, template, pattern, converters, fn }) {
    this._library = library;
    this._type = type;
    this._template = template;
    this._pattern = pattern;
    this._converters = converters ? [].concat(converters) : this._getDefaultConverters();
    this._fn = fn;
  }

  supports(statement) {
    return !!this._pattern.supports(statement);
  }

  isPending() {
    return !!this._fn;
  }

  reportDuplicate(other) {
    if (other._pattern.source === this._pattern.source) {
      throw new Error(`Macro ${other} is a duplicate of ${this}`);
    }
  }

  toString() {
    return this._template
      ? `pattern [${this._pattern}] derived from template [${this._template}] defined in library [${this._library.name}]`
      : `pattern [${this._pattern}] defined in library [${this._library.name}]`;
  }

  async run(state, statement) {
    const args = await this._extractArguments(state, statement);
    const demand = Math.max(this._fn.length - 1, 0);
    const supply = args.length;

    if (supply !== demand) {
      throw new Error(`Step [${statement}] ${supply < demand ? 'yielded only' : 'yielded'} ${supply} ${supply === 1 ? 'value' : 'values'} using pattern [${this._pattern.source}] from template [${this._template}], ${supply > demand ? 'but only' : 'but'} ${demand} step ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
    }
    await this._fn.call(null, state, ...args);
  }

  _getDefaultConverters() {
    return new Array(this._pattern.countMatchingGroups()).fill().map(() => new PassthroughConverter());
  }

  async _extractArguments(state, statement) {
    const matches = this._pattern.execute(statement).slice(1);
    if (!matches) throw new Error(`Step [${statement}] did not match ${this._pattern.source}`);
    const supply = matches.length;
    const demand = this._converters.reduce((total, converter) => total + converter.demand, 0);

    if (supply !== demand) {
      throw new Error(`Step [${statement}] ${supply < demand ? 'matched only' : 'matched'} ${supply} ${supply === 1 ? 'value' : 'values'} using pattern [${this._pattern.source}] from template [${this._template}], ${supply > demand ? 'but only' : 'but'} a total of ${demand} converter ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
    }

    return this._convertArguments(state, matches);
  }

  async _convertArguments(state, matches) {
    return this._converters.reduce((promise, converter) => promise.then(async (args) => {
      const chunk = matches.splice(0, converter.demand);
      const converted = await converter.convert(state, ...chunk);
      return args.concat(converted);
    }), Promise.resolve([]));
  }
};
