const debug = require('debug')('yadda:parser:TextSpecification');
const Languages = require('./languages');
const JsonSpecification = require('./JsonSpecification');
const InitialState = require('./states/InitialState');

const handlerNames = {
  language: 'onLanguage',
  annotation: 'onAnnotation',
  background: 'onBackground',
  blank_line: 'onBlankLine',
  end: 'end',
  multi_line_comment: 'onMultiLineComment',
  feature: 'onFeature',
  scenario: 'onScenario',
  single_line_comment: 'onSingleLineComment',
  step: 'onStep',
  text: 'onText',
};

// The job of a specification is to parse text based features into json
module.exports = class TextSpecification {

  constructor(props = {}) {
    this._initialState = props.initialState;
    this._language = props.language || Languages.utils.getDefault();
  }

  parse(text) {
    const specification = new JsonSpecification();
    this._state = this._initialState || new InitialState({ parser: this, specification });
    text.split(/\n|\r\n/).forEach((line, index) => this._parseLine(line, index + 1));
    this._state.onEnd({ name: 'end' });
    return specification;
  }

  _parseLine(line, number) {
    [
      this._createHandler('language', /^\s*#\s*language\s*:(.*)$/i, (match) => ({ name: match[1].trim() })),
      this._createHandler('annotation', /^\s*@([^=]*)$/, (match) => ({ name: match[1].trim(), value: true })),
      this._createHandler('annotation', /^\s*@([^=]*)=(.*)$/, (match) => ({ name: match[1].trim(), value: match[2].trim() })),
      this._createHandler('feature', this._language.regexp('feature'), (match) => ({ title: match[1].trim() })),
      this._createHandler('background', this._language.regexp('background'), (match) => ({ title: match[1].trim() })),
      this._createHandler('scenario', this._language.regexp('scenario'), (match) => ({ title: match[1].trim() })),
      this._createHandler('blank_line', /^\s*$/, () => ({})),
      this._createHandler('multi_line_comment', /^\s*#{3,}\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createHandler('single_line_comment', /^\s*#\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createHandler('step', this._language.regexp('step'), (match) => ({ statement: match[0].trim(), generalised: match[1].trim() })),
      this._createHandler('text', /^(.*)$/, (match) => ({ text: match[1].trim() })),
    ].find((fn) => fn(line, number));
  }

  _createHandler(eventName, regexp, extractData) {
    return (line, number) => {
      debug(`Checking for event: ${eventName} by testing line: [${line}] with regexp: ${regexp}`);
      const match = regexp.exec(line);
      if (!match) return false;
      const data = extractData(match);
      return this._handleEvent(eventName, { name: eventName, source: { line, number }, data });
    };
  }

  _handleEvent(eventName, payload) {
    const handler = this._getHandler(eventName);
    this._state = handler(payload)  ;
    return true;
  }

  _getHandler(eventName) {
    const handlerName = handlerNames[eventName] || 'handleUnexpectedEvent';
    debug(`Getting handler for event: ${eventName} from state: ${this._state.name}`);
    return (event) => this._state[handlerName](event);
  }

  setLanguage({ name }) {
    debug(`Setting language: ${name}`);
    this._language = Languages.utils.get(name);
  }
};
