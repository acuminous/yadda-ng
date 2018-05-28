const debug = require('debug')('yadda-ng:Library');
const Dictionary = require('./Dictionary');
const Macro = require('./Macro');
const { PassthroughConverter } = require('./Converters');


module.exports = class Library {

  constructor({ name = '', dictionaries = [] }) {
    this._name = name;
    this._dictionary = dictionaries.reduce((dictionary, volume) => dictionary.assimulate(volume), new Dictionary());
    this._macros = [];
  }

  answersTo(name) {
    return this._name === name;
  }

  define(templates, fn) {
    return this._defineStep({ templates, fn });
  }

  getCandidateMacros(text) {
    return this._macros.filter((macro) => macro.supports(text));
  }

  _defineStep({ type, templates, fn }) {
    [].concat(templates).forEach((template) => {
      const macro = template.source
        ? this._createMacroFromRegExp(type, template, fn)
        : this._createMacroFromString(type, template, fn);
      this._macros.push(macro);
    });
    return this;
  }

  _createMacroFromRegExp(type, template, fn) {
    this._reportDuplicateSignature(template.source);
    return new Macro({ type, template: template.source, pattern: template, converter: new PassthroughConverter(), fn });
  }

  _createMacroFromString(type, template, fn) {
    this._reportDuplicateSignature(template);
    const { pattern, converter } = this._dictionary.expand(template);
    return new Macro({ type, template, pattern, converter, fn });
  }

  _reportDuplicateSignature(template) {
    if (this._macros.find((macro) => macro.answersTo(template))) throw new Error(`Duplicate step definition: [${template}]`);
  }
};
