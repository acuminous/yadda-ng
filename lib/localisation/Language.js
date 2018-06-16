const debug = require('debug')('yadda-ng:localisation:Language');

module.exports = class Language {
  constructor(props = {}) {
    this._name = props.name || this.constructor.name;
    this._vocabulary = props.vocabulary || [];
    this._regexp = new RegExp(`^(?:${this._vocabulary.join('|')})\\s`, 'i');
  }

  get name() {
    return this._name;
  }

  generalise(statement) {
    debug(`generalising statement [${statement}] using language [${this._name}]}`);
    return statement.replace(this._regexp, '');
  }
};
