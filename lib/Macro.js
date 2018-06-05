const debug = require('debug')('yadda-ng:macros:Macro');
const { PendingStep, AsyncStep } = require('./steps');

module.exports = class Macro {
  constructor({ type, template, pattern, converters, fn }) {
    this._type = type;
    this._template = template;
    this._pattern = pattern;
    this._converters = converters;
    this._fn = fn;
  }

  answersTo(template) {
    return this._template === template;
  }

  supports(text) {
    return !!this._match(text);
  }

  toStep(annotations, text) {
    return this._getFactory()(annotations, text, this._type, this);
  }

  async run(state, text) {
    const args = await this._parseArguments(state, text);
    const demand = Math.max(this._fn.length - 1, 0);
    const supply = args.length;

    if (supply !== demand) {
      throw new Error(`Step [${text}] ${supply < demand ? 'yielded only' : 'yielded'} ${supply} ${supply === 1 ? 'value' : 'values'} using pattern [${this._pattern.source}] from template [${this._template}], ${supply > demand ? 'but only' : 'but'} ${demand} step ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
    }
    await this._fn.call(null, state, ...args);
  }

  _match(text) {
    this._pattern.lastIndex = 0;
    return this._pattern.exec(text);
  }

  _getFactory() {
    if (!this._fn) return (annotations, text, type) => new PendingStep({ annotations, text, type });
    return (annotations, text, type, macro) => new AsyncStep({ annotations, text, type, macro });
  }

  async _parseArguments(state, text) {
    const matches = this._match(text).slice(1);
    const supply = matches.length;
    const demand = this._converters.reduce((total, converter) => total + converter.demand, 0);

    if (supply !== demand) {
      throw new Error(`Step [${text}] ${supply < demand ? 'matched only' : 'matched'} ${supply} ${supply === 1 ? 'value' : 'values'} using pattern [${this._pattern.source}] from template [${this._template}], ${supply > demand ? 'but only' : 'but'} a total of ${demand} converter ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
    }

    return this._converters.reduce((promise, converter) => promise.then(async (args) => {
      const chunk = matches.splice(0, converter.demand);
      const converted = await converter.convert(state, ...chunk);
      return args.concat(converted);
    }), Promise.resolve([]));
  }
};
