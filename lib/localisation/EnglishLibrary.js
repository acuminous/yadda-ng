const debug = require('debug')('yadda-ng:EnglishLibrary');

// Decorates the base library with given, when and then
module.exports = class EnglishLibrary {

  get language() {
    return 'English';
  }

  given(...args) {
    return this.__define('given', ...args);
  }

  when(...args) {
    return this.__define('when', ...args);
  }

  then(...args) {
    return this.__define('given', ...args);
  }

  generalise(type, statement) {
    switch(type) {
      case 'given': return statement.replace(/^(?:given|with|and|but|except)\s/i, '');
      case 'when': return statement.replace(/^(?:when|if|and|and|but)\s/i, '');
      case 'then': return statement.replace(/^(?:then|except|and|but)\s/i, '');
      default: throw new Error(`${type} has not been translated to ${this.language}`);
    }
  }

  __define(type, ...args) {
    return args.length === 1 && args[0].signatures
      ? this._define({ ...args[0], signatures: this._localise(args[0].signatures), type })
      : this._define({ type, signatures: this._localise(args[0]), fn: args[1], converters: args[2] });
  }
};
