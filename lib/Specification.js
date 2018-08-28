const debug = require('debug')('yadda-ng:Specification');
const Languages = require('./languages');
const InitialState = require('./machine/InitialState');
const handlerNames = {
  annotation: 'onAnnotation',
  background: 'onBackground',
  blank_line: 'onBlankLine',
  end: 'end',
  multi_line_comment: 'onMultiLineComment',
  feature: 'onFeature',
  scenario: 'onScenario',
  single_line_comment: 'onSingleLineComment',
  text: 'onText',
};

// The job of a specification is to parse text based features into json
module.exports = class Specification {

  constructor(props = {}) {
    this._language = props.language || Languages.default;
    this._state = props.state || new InitialState({ specification: this });
  }

  parse(text) {
    text.split(/\n|\r\n/).forEach((line, index) => this._parseLine(line, index + 1));
    this._state = this._state.onEnd({ name: 'end' });
    return this;
  }

  _parseLine(line, number) {
    [
      this._createHandler('annotation', /^\s*@([^=]*)$/, (match) => ({ name: match[1].trim(), value: true })),
      this._createHandler('annotation', /^\s*@([^=]*)=(.*)$/, (match) => ({ name: match[1].trim(), value: match[2].trim() })),
      this._createHandler('feature', this._language.regexp('feature'), (match) => ({ title: match[1].trim() })),
      this._createHandler('background', this._language.regexp('background'), (match) => ({ title: match[1].trim() })),
      this._createHandler('scenario', this._language.regexp('scenario'), (match) => ({ title: match[1].trim() })),
      this._createHandler('blank_line', /^\s*$/, () => ({})),
      this._createHandler('multi_line_comment', /^\s*#{3,}\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createHandler('single_line_comment', /^\s*#\s*(.*)/, (match) => ({ text: match[1].trim() })),
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
    const handlerName = handlerNames[eventName] || 'reportUnexpectedEvent';
    debug(`Getting handler for event: ${eventName} from state: ${this._state.name}`);
    return (event) => this._state[handlerName](event);
  }

  createFeature({ annotations, title }) {
    this._feature = {
      annotations,
      title,
      description: [],
      background: {
        annotations: [],
        steps: []
      },
      scenarios: []
    };
    return this;
  }

  createBackground({ annotations, title }) {
    this._feature.background = { annotations, title, steps: [] };
    this._stepTarget = this._feature.background;
    return this;
  }

  createScenario({ annotations, title }) {
    this._scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(this._scenario);
    this._stepTarget = this._scenario;
    return this;
  }

  createStep({ annotations, statement }) {
    this._stepTarget.steps.push({ annotations, statement });
    return this;
  }

  describeFeature({ text }) {
    this._feature.description.push(text);
    return this;
  }

  export() {
    const feature = this._feature;
    return {
      annotations: feature.annotations,
      title: feature.title,
      description: feature.description.join('\n'),
      scenarios: feature.scenarios.map((scenario) => ({
        annotations: feature.background.annotations.concat(scenario.annotations),
        title: scenario.title,
        steps: feature.background.steps.concat(scenario.steps).map((step) => ({
          annotations: step.annotations,
          statement: step.statement
        }))
      }))
    };
  }
};
