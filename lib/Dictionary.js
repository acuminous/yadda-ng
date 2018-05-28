const debug = require('debug')('yadda-ng:Dictinoary');
const Term = require('./Term');
const { PassthroughConverter } = require('./converters');

module.exports = class Dictionary {

  constructor(props = {}) {
    const { prefix = '$', delimiter = '\\' } = props;
    if (!/^\W$/.test(prefix)) throw new Error(`Prefix [${prefix}] must be a single, non word character`);
    if (!/^\W$/.test(delimiter)) throw new Error(`Delimiter [${delimiter}] must be a single, non word character`);
    if (prefix === delimiter) throw new Error(`Prefix [${prefix}] and delimiter [${delimiter}] must differ`);
    this._terms = [];
    this._prefix = prefix;
    this._delimiter = delimiter;
  }

  assimilate(other) {
    return this._terms.concat(other._terms).reduce((dictionary, term) => {
      return term.definedIn(dictionary);
    }, new Dictionary());
  }

  define(name, definition, converter) {
    if (this._isDefined(name)) throw new Error(`Duplicate term [${name}]`);
    this._terms.push(new Term({ name, definition, converter }));
    return this;
  }

  expand(template) {
    let parsed;
    try {
      parsed = this._parseTemplate(template);
    } catch (err) {
      throw new Error(`Error parsing template [${template}]: ${err.message}`);
    }
    return {
      pattern: parsed.pattern,
      converter: new PassthroughConverter()
    };
  }

  _isDefined(name) {
    return !!this._find(name);
  }

  _find(name) {
    return this._terms.find((term) => term.answersTo(name));
  }

  _parseTemplate(template) {
    const state = [...template, null].reduce((state, letter) => {
      switch (state.mode) {
        case 'text': return this._parseText(state, letter);
        case 'term': return this._parseTerm(state, letter);
        default: throw new Error(`Invalid parsing mode ${state.mode}`);
      }
    }, { template, mode: 'text', delimited: false, name: '', source: '' });
    return { ...state, pattern: new RegExp(`^${state.source}$`) };
  }

  _parseText(state, letter) {
    const { delimited, source } = state;
    if (letter === null) return { ...state, delimited: false };
    if (delimited) return { ...state, delimited: false, source: `${source}${letter}` };
    if (letter === this._delimiter) return { ...state, delimited: true };
    if (letter === this._prefix) return { ...state, mode: 'term' };
    return { ...state, source: `${source}${letter}` };
  }

  _parseTerm(state, letter) {
    const { delimited, name, source } = state;
    if (name === '' && letter === null) return { ...state, delimited: false, name: '', source: `${source}\\${this._prefix}`};
    if (letter === null) return { ...state, delimited: false, name: '', source: `${this._extendSource(name, source)}`};
    if (delimited && /\w/.test(letter)) return { ...state, delimited: false, name: `${name}${letter}` };
    if (delimited && /\W/.test(letter)) return { ...state, mode: 'text', name: '', source: `${source}(+w)${letter}` };
    if (letter === this._delimiter) return { ...state, delimited: true };
    if (letter === this._prefix) return { ...state, name: '', source: `${this._extendSource(name, source)}` };
    if (/\w/.test(letter)) return { ...state, name: `${name}${letter}` };
    if (name === '') return { ...state, mode: 'text', name: '', source: `${source}\\${this._prefix}${letter}` };
    return { ...state, mode: 'text', name: '', source: `${this._extendSource(name, source)}${letter}` };
  }

  _extendSource(name, source, history = []) {
    const term = this._find(name) || new Term({});
    return term.extendSource(source);
  }


};
