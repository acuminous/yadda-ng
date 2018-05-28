const debug = require('debug')('yadda-ng:Term');

module.exports = class Term {

  constructor({ name, definition = /(.+)/, converter }) {
    this._name = name;
    this._definition = definition;
    this._converter = converter;
  }

  answersTo(name) {
    return this._name === name;
  }

  extendSource(source) {
    return `${source}${this._definition.source}`;
  }

  convert(state, match) {
  }

  defineIn(dictionary) {
    dictionary.define(this._term, this._definition, this._converter);
  }
};
