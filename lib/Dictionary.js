const debug = require('debug')('yadda-ng:Dictionary');
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
    debug(`Defining term [${name}] as [${definition}]`);
    if (this._isDefined(name)) throw new Error(`Duplicate term [${name}]`);
    this._terms.push(new Term({ name, definition, converter }));
    return this;
  }

  expand(template) {
    debug(`Expanding template [${template}]`);
    const source = this._parseTemplate(template).source;
    const pattern = this._createRegExp(`^${source}$`, template);
    return { pattern: pattern, converter: new PassthroughConverter() };
  }

  _createRegExp(source, template) {
    debug(`Creating pattern from source [${source}]`);
    let pattern;
    try {
      pattern = new RegExp(source);
    } catch (err) {
      throw new Error(`Error parsing template [${template}]: ${err.message}`);
    }
    return pattern;
  }

  _isDefined(name) {
    return !!this._find(name);
  }

  _find(name) {
    return this._terms.find((term) => term.answersTo(name));
  }

  _parseTemplate(template, history = []) {
    debug(`Parsing template [${template}] with history [${history.join(', ')}]`);
    return [...template, null].reduce((state, letter) => {
      switch (state.mode) {
        case 'text': return this._parseText(state, letter);
        case 'term': return this._parseTerm(state, letter);
        default: throw new Error(`Invalid parsing mode ${state.mode}`);
      }
    }, { template, mode: 'text', delimited: false, name: '', source: '', history });
  }

  _parseText(state, letter) {
    const { delimited, source } = state;
    if (delimited && letter === null) return { ...state, delimited: false, source: `${source}${this._delimiter}` };
    if (letter === null) return { ...state, delimited: false };
    if (delimited && letter === this._delimiter) return { ...state, delimited: false, source: `${source}${letter}` };
    if (delimited && letter === this._prefix) return { ...state, delimited: false, source: `${source}${letter}` };
    if (delimited) return { ...state, delimited: false, source: `${source}${this._delimiter}${letter}` };
    if (letter === this._delimiter) return { ...state, delimited: true };
    if (letter === this._prefix) return { ...state, mode: 'term' };
    return { ...state, source: `${source}${letter}` };
  }

  _parseTerm(state, letter) {
    const { delimited, name, source, history } = state;
    if (name === '' && letter === null) return { ...state, delimited: false, name: '', source: `${source}${this._prefix}`};
    if (letter === null) return { ...state, delimited: false, name: '', source: `${source}${this._resolve(name, history)}`};
    if (delimited && /\w/.test(letter)) return { ...state, delimited: false, name: `${name}${letter}` };
    if (delimited && /\W/.test(letter)) return { ...state, mode: 'text', name: '', source: `${source}(+w)${letter}` };
    if (letter === this._delimiter) return { ...state, delimited: true };
    if (letter === this._prefix) return { ...state, name: '', source: `${source}${this._resolve(name, history)}` };
    if (/\w/.test(letter)) return { ...state, name: `${name}${letter}` };
    if (name === '') return { ...state, mode: 'text', name: '', source: `${source}${this._prefix}${letter}` };
    return { ...state, mode: 'text', name: '', source: `${source}${this._resolve(name, history)}${letter}` };
  }

  _resolve(name, history) {
    debug(`Resolving term [${name}] with history [${history.join(', ')}]`);
    this._reportCyclicDefinitions(name, history);
    const term = this._find(name) || new Term({});
    return this._parseTemplate(term.definition, history.concat(name)).source;
  }

  _reportCyclicDefinitions(name, history) {
    if (name === history[history.length - 1]) throw new Error(`Cyclic definition for term [${name}]`);
    if (history.includes(name)) throw new Error(`Indirect cyclic definition for term [${name}], with resolution history [${history.join(', ')}]`);
  }

};