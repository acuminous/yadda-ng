const debug = require('debug')('yadda-ng:Term');

const Pattern = require('./Pattern');
const { PassthroughConverter, MultiConverter } = require('./converters');

// The job of a Term is to define an expression
module.exports = class Term {

  constructor(props) {
    const { expression, definition = /(.+)/, converters } = props || {};
    this._expression = expression;
    this._definition = definition.source ? definition.source : String(definition);
    this._converters = converters ? converters : this._getDefaultConverters();
    this._checkConverterArguments();
  }

  get definition() {
    return this._definition;
  }

  get converters() {
    return this._converters;
  }

  resolves(expression) {
    return this._expression === expression;
  }

  defineIn(dictionary) {
    return dictionary.define(this._expression, this._definition, this._converters);
  }

  _checkConverterArguments() {
    const supply = new Pattern(this._definition).countMatchingGroups();
    const converters = new MultiConverter({ converters: this._converters });
    const demand = converters.demand;

    if (supply !== demand) {
      throw new Error(`Pattern [${this._definition}] for term [${this._expression}] ${supply < demand ? 'has only' : 'has'} ${supply} matching ${supply === 1 ? 'group' : 'groups'}, ${supply < demand ? 'but' : 'but only'} a total of ${demand} converter ${demand === 1 ? 'argument was' : 'arguments were'} specified`);
    }
  }

  _getDefaultConverters() {
    const size = new Pattern(this._definition).countMatchingGroups();
    return PassthroughConverter.arrayOf(size);
  }

};
