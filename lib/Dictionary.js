const Debug = require('debug');
const Term = require('./Term');
const { PassThroughConverter } = require('./converters');

// The job of a Dictionary is to define Terms
module.exports = class Dictionary {
  constructor(props = {}) {
    const { prefix = '$', delimiter = '\\', debug = Debug('yadda:Dictionary') } = props;

    if (!/^\W$/.test(prefix)) throw new Error(`Prefix [${prefix}] must be a single, non word character`);
    if (!/^\W$/.test(delimiter)) throw new Error(`Delimiter [${delimiter}] must be a single, non word character`);
    if (prefix === delimiter) throw new Error(`Prefix [${prefix}] and delimiter [${delimiter}] must differ`);
    this._terms = [];
    this._prefix = prefix;
    this._delimiter = delimiter;
    this._debug = debug;
  }

  // TODO instead of making a static method, make instance and return a new Dictionary
  static combine(dictionaries) {
    return [].concat(dictionaries).reduce((master, dictionary) => dictionary.copyInto(master), new Dictionary());
  }

  copyInto(other) {
    return this._terms.reduce((dictionary, term) => term.defineIn(other), other);
  }

  // TODO Simplify API
  define(...args) {
    return args.length < 3 ? this._define(args[0], args[1]) : this._define(args[0], args[1], [].concat(args[2]));
  }

  // TODO Should "expression" be "term"?
  // TODO There is some weird loop where a Term defines itself in a dictionary, then the dictionary redefines the term
  _define(expression, definition, converters) {
    this._debug(`Defining term [${expression}] as [${definition}] with [${converters ? converters.length : 0}] converters`);
    if (this.defines(expression)) throw new Error(`Duplicate term [${expression}]`);
    this._terms.push(new Term({ expression, definition, converters }));
    return this;
  }

  defines(expression) {
    return !!this._find(expression);
  }

  expand(template) {
    this._debug(`Expanding template [${template}]`);
    const { source, converters } = this._expand(template);
    const regexp = this._createRegExp(template, source);
    return { regexp, converters };
  }

  _createRegExp(template, source) {
    let regexp;
    try {
      regexp = new RegExp(`^${source}$`);
    } catch (err) {
      throw new Error(`Error expanding template [${template}]: ${err.message}`);
    }
    return regexp;
  }

  _find(expression) {
    return this._terms.find((term) => term.resolves(expression));
  }

  _expand(template, converters = [], history = []) {
    this._debug(`Parsing template [${template}] with history [${history.join(', ')}]`);
    return [...template, null].reduce(
      (state, letter) => {
        switch (state.mode) {
          case 'text':
            return this._parseText(state, letter);
          case 'term':
            return this._parseTerm(state, letter);
          default:
            throw new Error(`Invalid parsing mode ${state.mode}`);
        }
      },
      { template, mode: 'text', delimited: false, expression: '', source: '', converters, history }
    );
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
    const { delimited, expression, source, converters, history } = state;
    if (expression === '' && letter === null) return { ...state, delimited: false, expression: '', source: `${source}${this._prefix}` };
    if (letter === null) {
      const resolved = this._resolve(expression, history);
      return { ...state, delimited: false, expression: '', source: `${source}${resolved.source}`, converters: converters.concat(resolved.converters) };
    }
    if (delimited && /\w/.test(letter)) return { ...state, delimited: false, expression: `${expression}${letter}` };
    if (delimited && /\W/.test(letter)) return { ...state, mode: 'text', expression: '', source: `${source}(+w)${letter}` };
    if (letter === this._delimiter) return { ...state, delimited: true };
    if (letter === this._prefix) {
      const resolved = this._resolve(expression, history);
      return { ...state, expression: '', source: `${source}${resolved.source}`, converters: converters.concat(resolved.converters) };
    }
    if (/\w/.test(letter)) return { ...state, expression: `${expression}${letter}` };
    if (expression === '') return { ...state, mode: 'text', expression: '', source: `${source}${this._prefix}${letter}` };

    const resolved = this._resolve(expression, history);
    return { ...state, mode: 'text', expression: '', source: `${source}${resolved.source}${letter}`, converters: converters.concat(resolved.converters) };
  }

  _resolve(expression, history) {
    this._debug(`Resolving term [${expression}] with history [${history.join(', ')}]`);
    this._reportCyclicDefinitions(expression, history);
    const wildcardTerm = new Term({ expression, pattern: /(.+)/, converters: [new PassThroughConverter()] });
    const term = this._find(expression) || wildcardTerm;
    return this._expand(term.definition, term.converters, history.concat(expression));
  }

  _reportCyclicDefinitions(expression, history) {
    if (expression === history[history.length - 1]) throw new Error(`Cyclic definition for term [${expression}]`);
    if (history.includes(expression)) throw new Error(`Indirect cyclic definition for term [${expression}], with resolution history [${history.join(', ')}]`);
  }
};
