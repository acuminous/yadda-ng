const debug = require('debug')('yadda-ng:Term');
const { PassthroughConverter } = require('./converters');

module.exports = class Term {

  constructor(props) {
    const { name, definition = /(.+)/, converters } = props || {};
    this._name = name;
    this._definition = definition.source ? definition.source : String(definition);
    this._converters = converters ? converters : this._createConverters();
    this._checkConverterArguments();
  }

  _checkConverterArguments() {
    const numMatchingGroups = this._countMatchingGroups(this._definition);
    const numConverters = this._converters.length;
    const numConverterArguments = this._converters.reduce((total, converter) => total + converter.demand, 0);

    if (numMatchingGroups > 0 && numConverters === 0) {
      throw new Error(`Pattern [${this._definition}] for term [${this._name}] has ${numMatchingGroups} matching ${numMatchingGroups === 1 ? 'group' : 'groups'}, but no converters were specified`);
    }
    if (numMatchingGroups !== numConverterArguments) {
      throw new Error(`Pattern [${this._definition}] for term [${this._name}] ${numMatchingGroups < numConverterArguments ? 'has only' : 'has'} ${numMatchingGroups} matching ${numMatchingGroups === 1 ? 'group' : 'groups'}, ${numMatchingGroups < numConverterArguments ? 'but' : 'but only'} ${numConverters} ${numConverters === 1 ? 'converter' : 'converters'} with a total of ${numConverterArguments} ${numConverterArguments === 1 ? 'argument was' : 'arguments were'} specified`);
    }
  }

  _createConverters() {
    const numMatchingGroups = this._countMatchingGroups(this._definition);
    return new Array(numMatchingGroups).fill().map(() => new PassthroughConverter());
  }

  _countMatchingGroups(definition) {
    return new RegExp(`${definition}|`).exec().length - 1;
  }

  get definition() {
    return this._definition;
  }

  answersTo(name) {
    return this._name === name;
  }

  convert(state, match) {
  }

  defineIn(dictionary) {
    dictionary.define(this._term, this._definition, this._converters);
  }
};
