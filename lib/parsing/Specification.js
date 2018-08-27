const debug = require('debug')('yadda-ng:parsing:Specification');
const Languages = require('../languages');
const InitialState = require('./states/InitialState');

module.exports = class Specification {

  constructor(props = {}) {
    this._language = props.language || Languages.default;
    this._state = props.state || new InitialState({ specification: this });
  }

  parse(text) {
    text.split(/\n|\r\n/).forEach((line, index) => this._parseLine(line, index + 1));
    this._state = this._state.handle({ name: 'end' });
    return this;
  }

  _parseLine(line, number) {
    [
      this._createEmitter('annotation', /^\s*@([^=]*)$/, (match) => ({ name: match[1].trim(), value: true })),
      this._createEmitter('annotation', /^\s*@([^=]*)=(.*)$/, (match) => ({ name: match[1].trim(), value: match[2].trim() })),
      this._createEmitter('feature', this._language.regexp('feature'), (match) => ({ title: match[1].trim() })),
      this._createEmitter('background', this._language.regexp('background'), (match) => ({ title: match[1].trim() })),
      this._createEmitter('scenario', this._language.regexp('scenario'), (match) => ({ title: match[1].trim() })),
      this._createEmitter('blank_line', /^\s*$/),
      this._createEmitter('multi_line_comment', /^\s*#{3,}\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createEmitter('single_line_comment', /^\s*#\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createEmitter('text', /^(.*)$/, (match) => ({ text: match[1].trim() })),
    ].find((fn) => fn(line, number));
  }

  _createEmitter(eventName, regexp, parser) {
    return (line, number) => {
      debug(`Checking for event: ${eventName} by testing line: [${line}] with regexp: ${regexp}`);
      const match = regexp.exec(line);
      if (!match) return false;
      const data = parser ? parser(match) : {};
      this._state = this._state.handle({ name: eventName, source: { line, number }, data });
      return true;
    };
  }

  createFeature({ annotations, title }) {
    this._feature = {
      annotations,
      title,
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

  export() {
    const feature = this._feature;
    return {
      annotations: feature.annotations,
      title: feature.title,
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
