const Debug = require('debug');
const Pattern = require('./Pattern');
const { PassThroughConverter, MultiConverter } = require('./converters');

module.exports = class Term {

  constructor(props) {
    const {
      expression,
      definition = /(.+)/,
      converters,
      debug = Debug('yadda:Term'),
    } = props;

    this._expression = expression;
    this._definition = definition.source ? definition.source : String(definition);
    this._converters = converters ? converters : this._getDefaultConverters();
    this._checkConverterArguments();
    this._debug = debug;
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

  _getDefaultConverters(definition) {
    const size = new Pattern(this._definition).countMatchingGroups();
    return PassThroughConverter.arrayOf(size);
  }

};
