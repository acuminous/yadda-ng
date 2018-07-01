const debug = require('debug')('yadda-ng:Signature');
const { PassthroughConverter } = require('./converters');

module.exports = class Signature {
  constructor({ library, template, pattern }) {
    this._library = library;
    this._template = template;
    this._pattern = pattern;
  }

  supports(statement) {
    const generalised = this._library.generalise(statement);
    return this._pattern.supports(generalised);
  }

  reportDuplicate(other) {
    if (!other._pattern.equals(this._pattern)) return;
    throw new Error(`${other} is a duplicate of ${this}`.replace(/^s/, 'S'));
  }

  setCurrentLibrary(state) {
    state.currentLibrary = this._library.name;
  }

  toString() {
    return this._template
      ? `signature [${this._pattern}] derived from template [${this._template}] defined in library [${this._library.name}]`
      : `signature [${this._pattern}] defined in library [${this._library.name}]`;
  }

  getConverters() {
    const size = this._pattern.countMatchingGroups();
    return PassthroughConverter.arrayOf(size);
  }

  parseArguments(statement) {
    const matches = this._pattern.exec(statement).slice(1);
    if (!matches) throw new Error(`Statement [${statement}] did not match ${this._pattern}`);
    return matches;
  }
};
