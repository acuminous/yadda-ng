const debug = require('debug')('yadda-ng:Library');
const Dictionary = require('./Dictionary');
const Macro = require('./Macro');
const Pattern = require('./Pattern');
const Languages = require('./languages');
const Signature = require('./Signature');
const { AsyncFunction, PendingFunction } = require('./functions');
const { PassthroughConverter } = require('./converters');

module.exports = class Library {

  constructor(props = {}) {
    this._name = props.name || this._randomise(this.constructor.name);
    this._language = props.language || Languages.default;
    this._dictionary = (props.dictionaries || []).reduce((dictionary, volume) => dictionary.assimulate(volume), new Dictionary());
    this._macros = [];
  }

  get name() {
    return this._name;
  }

  getCompatibleMacros(statement) {
    return this._macros.filter((macro) => macro.supports(statement));
  }

  define(...args) {
    return args.length === 1 && args[0].signatures
      ? this._define(args[0])
      : this._define({ signatures: args[0], fn: args[1], converters: args[2] });
  }

  generalise(statement) {
    return this._language.generalise(statement);
  }

  _randomise(name) {
    return `${name}-${(`${Math.random().toString(36)}00000000000000000`).slice(2, 7+2)}`;
  }

  _define({ signatures, converters, fn }) {
    [].concat(signatures).forEach((signature) => {
      const macro = signature.source
        ? this._createMacroFromRegExp(signature, converters, fn)
        : this._createMacroFromTemplate(signature, converters, fn);
      this._macros.push(macro);
    });
    return this;
  }

  _createMacroFromRegExp(regexp, converters, fn) {
    const pattern = new Pattern(regexp);
    return this._createMacro(this, null, pattern, converters, fn);
  }

  _createMacroFromTemplate(template, converters, fn) {
    const expanded = this._dictionary.expand(template);
    const pattern = new Pattern(expanded.regexp);
    return this._createMacro(this, template, pattern, converters || expanded.converters, fn);
  }

  _createMacro(library, template, pattern, converters, fn) {
    return new Macro({
      signature: this._createSignature(library, template, pattern),
      converters: converters || this._getDefaultConverters(pattern),
      fn: this._createFunction(fn),
    });
  }

  _createSignature(library, template, pattern) {
    const signature = new Signature({ library, template, pattern });
    this._reportDuplicate(signature);
    return signature;
  }

  _getDefaultConverters(pattern) {
    const size = pattern.countMatchingGroups();
    return PassthroughConverter.arrayOf(size);
  }

  _createFunction(fn) {
    if (!fn) return new PendingFunction();
    if (typeof fn !== 'function') return fn;
    return new AsyncFunction({ fn });
  }

  _reportDuplicate(candidate) {
    this._macros.forEach((macro) => macro.reportDuplicate(candidate));
  }
};
