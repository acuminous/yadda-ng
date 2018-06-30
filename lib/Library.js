const debug = require('debug')('yadda-ng:Library');
const Dictionary = require('./Dictionary');
const Macro = require('./Macro');
const Pattern = require('./Pattern');
const Languages = require('./languages');

// The job of a Library is to find all Macros that support a step statement
module.exports = class Library {

  constructor(props = {}) {
    this._name = props.name || this.constructor.name;
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
    const macro = new Macro({ library, template, pattern, converters, fn });
    this._reportDuplicate(macro);
    return macro;
  }

  _reportDuplicate(candidate) {
    this._macros.forEach((macro) => macro.reportDuplicate(candidate));
  }
};
