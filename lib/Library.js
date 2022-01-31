const Debug = require('debug');
const Dictionary = require('./Dictionary');
const Macro = require('./Macro');
const Pattern = require('./Pattern');
const Signature = require('./Signature');
const { AsyncFunction, PendingFunction } = require('./functions');
const { PassThroughConverter } = require('./converters');

module.exports = class Library {
  constructor(props = {}) {
    const { name = this._randomise(this.constructor.name), dictionaries = [], debug = Debug('yadda:Library') } = props;

    this._name = name;
    this._dictionary = Dictionary.combine(dictionaries);
    this._macros = [];
  }

  get name() {
    return this._name;
  }

  getCompatibleMacros(step) {
    return this._macros.filter((macro) => macro.supports(step));
  }

  // TODO Rationalise this mess
  // TODO how would have two variable argument, list converters without being able to define the number of arguments or maybe a more complicated dictionary?
  // TODO Try to simplify where converters come from - Terms? Step? Default?
  define(signatures, fn, options = {}) {
    options.arguments = options.arguments || {};
    [].concat(signatures).forEach((signature) => {
      const macro = signature.source ? this._createMacroFromRegExp(signature, fn, options) : this._createMacroFromTemplate(signature, fn, options);
      this._macros.push(macro);
    });
    return this;
  }

  _randomise(name) {
    return `${name}-${`${Math.random().toString(36)}00000000000000000`.slice(2, 7 + 2)}`;
  }

  _createMacroFromRegExp(regexp, fn, options) {
    const pattern = new Pattern(regexp);
    options.arguments.converters = options.arguments.converters || this._getDefaultConverters(pattern.countMatchingGroups());
    return this._createMacro(this, null, pattern, fn, options);
  }

  _createMacroFromTemplate(template, fn, options) {
    const expanded = this._dictionary.expand(template);
    const pattern = new Pattern(expanded.regexp);
    options.arguments.converters = options.arguments.converters || expanded.converters;
    return this._createMacro(this, template, pattern, fn, options);
  }

  _createMacro(library, template, pattern, fn, options) {
    return new Macro({
      signature: this._createSignature(library, template, pattern),
      converters: this._combineConverters(options, pattern),
      fn: this._createFunction(fn),
    });
  }

  _createSignature(library, template, pattern) {
    const signature = new Signature({ library, template, pattern });
    this._reportDuplicate(signature);
    return signature;
  }

  _reportDuplicate(signature) {
    this._macros.forEach((macro) => macro.reportDuplicate(signature));
  }

  _combineConverters(options, pattern) {
    return options.arguments.converters.concat(this._getDocStringConverters(options));
  }

  _getDocStringConverters(options) {
    if (!options.docString) return [];
    if (options.docString.converter) return [options.docString.converter];
    return this._getDefaultConverters(1);
  }

  _getDefaultConverters(size) {
    return PassThroughConverter.arrayOf(size);
  }

  _createFunction(fn) {
    if (!fn) return new PendingFunction();
    if (typeof fn !== 'function') return fn;
    return new AsyncFunction({ fn });
  }
};
