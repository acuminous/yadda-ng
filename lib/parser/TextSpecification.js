const debug = require('debug')('yadda:parser:TextSpecification');
const Languages = require('./languages');
const Event = require('./Event');
const JsonSpecification = require('./JsonSpecification');
const InitialState = require('./states/InitialState');

// The job of a specification is to parse text based features into json
module.exports = class TextSpecification {

  constructor(props = {}) {
    this._initialState = props.initialState;
    this._language = props.language || Languages.utils.getDefault();
  }

  parse(text) {
    const specification = new JsonSpecification();
    const initialState = this._initialState || new InitialState({ parser: this, specification });
    text.split(/\n|\r\n/)
        .reduce((state, line, index) => this._parseLine(state, line, index + 1), initialState)
        .onEnd({ name: 'end' });
    return specification;
  }

  _parseLine(state, line, number) {
    return this._getEvents().find((event) => event.test(line)).handle(state, line, { line, number });
  }

  setLanguage({ name }) {
    debug(`Setting language: ${name}`);
    this._language = Languages.utils.get(name);
  }

  _getEvents() {
    return [{
      name: 'language',
      handler: 'onLanguage',
      regexp: /^\s*#\s*language\s*:(.*)$/i,
      extract: (match) => ({ name: match[1].trim() }),
    },
    {
      name: 'annotation',
      handler: 'onAnnotation',
      regexp: /^\s*@([^=]*)$/,
      extract: (match) => ({ name: match[1].trim(), value: true }),
    },
    {
      name: 'annotation',
      handler: 'onAnnotation',
      regexp: /^\s*@([^=]*)=(.*)$/,
      extract: (match) => ({ name: match[1].trim(), value: match[2].trim() }),
    },
    {
      name: 'feature',
      handler: 'onFeature',
      regexp: this._language.regexp('feature'),
      extract: (match) => ({ title: match[1].trim() }),
    },
    {
      name: 'background',
      handler: 'onBackground',
      regexp: this._language.regexp('background'),
      extract: (match) => ({ title: match[1].trim() }),
    },
    {
      name: 'scenario',
      handler: 'onScenario',
      regexp: this._language.regexp('scenario'),
      extract: (match) => ({ title: match[1].trim() }),
    },
    {
      name: 'blank_line',
      handler: 'onBlankLine',
      regexp: /^\s*$/,
      extract: () => ({}),
    },
    {
      name: 'multi_line_comment',
      handler: 'onMultiLineComment',
      regexp: /^\s*#{3,}\s*(.*)/,
      extract: (match) => ({ text: match[1].trim() }),
    },
    {
      name: 'single_line_comment',
      handler: 'onSingleLineComment',
      regexp: /^\s*#\s*(.*)/,
      extract: (match) => ({ text: match[1].trim() }),
    },
    {
      name: 'step',
      handler: 'onStep',
      regexp: this._language.regexp('step'),
      extract: (match) => ({ statement: match[0].trim(), generalised: match[1].trim() }),
    },
    {
      name: 'text',
      handler: 'onText',
      regexp: /^(.*)$/,
      extract: (match) => ({ text: match[1].trim() }),
    }].map((props) => new Event(props));
  }
};
