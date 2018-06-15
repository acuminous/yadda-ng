const debug = require('debug')('yadda-ng:EnglishLibrary');
const given = /^(?:given|with|and|but|except)\s/i;
const when = /^(?:when|if|and|and|but)\s/i;
const then = /^(?:then|except|and|but)\s/i;

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

  generalise(statement) {
    if (given.test(statement)) return statement.replace(given, '');
    if (when.test(statement)) return statement.replace(when, '');
    if (then.test(statement)) return statement.replace(then, '');
  }

  __define(type, ...args) {
    return args.length === 1 && args[0].signatures
      ? this._define({ ...args[0], signatures: this._localise(args[0].signatures), type })
      : this._define({ type, signatures: this._localise(args[0]), fn: args[1], converters: args[2] });
  }
};
