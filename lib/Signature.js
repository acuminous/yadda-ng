const Debug = require('debug');

module.exports = class Signature {
  constructor(props) {
    const {
      library,
      template,
      pattern,
      debug = Debug('yadda:Signature'),
    } = props;

    this._library = library;
    this._template = template;
    this._pattern = pattern;
    this._debug = debug;
  }

  supports(step) {
    const supported = this._pattern.supports(step.generalised);
    this._debug(`Step: ${step.text} is ${supported ? 'supported' : 'not supported'} by ${this}`);
    return supported;
  }

  setCurrentLibrary(state) {
    state.set('currentLibrary', this._library.name);
  }

  isFromLibrary(name) {
    return this._library.name === name;
  }

  reportDuplicate(other) {
    if (!other._pattern.equals(this._pattern)) return;
    throw new Error(`${other} is a duplicate of ${this}`.replace(/^s/, 'S'));
  }

  toString() {
    return this._template
      ? `signature [${this._pattern}] derived from template [${this._template}] defined in library [${this._library.name}]`
      : `signature [${this._pattern}] defined in library [${this._library.name}]`;
  }

  parseArguments(step) {
    const matches = this._pattern.exec(step.generalised).slice(1);
    if (!matches) throw new Error(`Statement [${step.text}] did not match ${this._pattern}`);
    return matches;
  }
};
