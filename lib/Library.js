const debug = require('debug')('yadda-ng:Library');
const Dictionary = require('./Dictionary');
const Macro = require('./Macro');
const Pattern = require('./Pattern');
const { PassthroughConverter } = require('./Converters');

module.exports = class Library {

  constructor(props = {}) {
    const { name = __filename, dictionaries = [] } = props;
    this._name = name;
    this._dictionary = dictionaries.reduce((dictionary, volume) => dictionary.assimulate(volume), new Dictionary());
    this._macros = [];
  }

  answersTo(name) {
    return this._name === name;
  }

  define(...args) {
    return args.length === 1 && args[0].signatures
      ? this._define(args[0])
      : this._define({ signatures: args[0], fn: args[1], converters: args[2] });
  }

  getCandidateMacros(statement) {
    return this._macros.filter((macro) => macro.supports(statement));
  }

  _define({ type, signatures, converters, fn }) {
    [].concat(signatures).forEach((signature) => {
      const macro = signature.source
        ? this._createMacroFromRegExp(type, new Pattern(signature), converters, fn)
        : this._createMacroFromTemplate(type, signature, converters, fn);
      this._macros.push(macro);
    });
    return this;
  }

  _createMacroFromRegExp(type, pattern, converters, fn) {
    this._reportDuplicateSignature(pattern.source);
    return new Macro({
      type,
      template: pattern.source,
      pattern,
      converters: this._ensureConverters(pattern, converters),
      fn,
    });
  }

  _createMacroFromTemplate(type, template, converters, fn) {
    const expanded = this._dictionary.expand(template);
    this._reportDuplicateSignature(expanded.pattern.source);
    return new Macro({
      type,
      template,
      pattern: expanded.pattern,
      converters: this._ensureConverters(new Pattern(expanded.pattern.source), converters || expanded.converters),
      fn,
    });
  }

  _ensureConverters(pattern, converters) {
    return converters ? [].concat(converters)
      : new Array(pattern.countMatchingGroups()).fill().map(() => new PassthroughConverter());
  }

  _reportDuplicateSignature(template) {
    if (this._macros.find((macro) => macro.answersTo(template))) throw new Error(`Duplicate step definition [${template}] in library [${this._name}]`);
  }
};
