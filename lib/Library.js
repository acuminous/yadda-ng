const debug = require('debug')('yadda-ng:Library');
const Dictionary = require('./Dictionary');
const Macro = require('./Macro');
const Pattern = require('./Pattern');

module.exports = class Library {

  constructor(props = {}) {
    const { name = __filename, dictionaries = [] } = props;
    this._name = name;
    this._dictionary = dictionaries.reduce((dictionary, volume) => dictionary.assimulate(volume), new Dictionary());
    this._macros = [];
  }

  get name() {
    return this._name;
  }

  getCandidateMacros(statement) {
    return this._macros.filter((macro) => macro.supports(statement));
  }

  define(...args) {
    return args.length === 1 && args[0].signatures
      ? this._define(args[0])
      : this._define({ signatures: args[0], fn: args[1], converters: args[2] });
  }

  _define({ type, signatures, converters, fn }) {
    [].concat(signatures).forEach((signature) => {
      const macro = signature.source
        ? this._createMacroFromRegExp(type, signature, converters, fn)
        : this._createMacroFromTemplate(type, signature, converters, fn);
      this._macros.push(macro);
    });
    return this;
  }

  _createMacroFromRegExp(type, regexp, converters, fn) {
    return this._createMacro(this, type, null, new Pattern(regexp), converters, fn);
  }

  _createMacroFromTemplate(type, template, converters, fn) {
    const expanded = this._dictionary.expand(template);
    return this._createMacro(this, type, template, expanded.pattern, converters || expanded.converters, fn);
  }

  _createMacro(library, type, template, pattern, converters, fn) {
    const macro = new Macro({ library, type, template, pattern, converters, fn });
    this._reportDuplicate(macro);
    return macro;
  }

  _reportDuplicate(candidate) {
    this._macros.find((macro) => macro.reportDuplicate(candidate));
  }
};
