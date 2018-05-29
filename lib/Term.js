const debug = require('debug')('yadda-ng:Term');

module.exports = class Term {

  constructor(props) {
    const { name, definition = /(.+)/, converter} = props || {};
    this._name = name;
    this._definition = definition.source ? definition.source : String(definition);
    this._converter = converter;
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
    dictionary.define(this._term, this._definition, this._converter);
  }
};
