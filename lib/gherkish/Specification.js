const debug = require('debug')('yadda:gherkish:Specification');

module.exports = class Specification {

  constructor() {
    this._feature = undefined;
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

  describeFeature({ text }) {
    this._feature.description = this._feature.description
      ? `${this._feature.description}\n${text}`
      : text;
  }

  createBackground({ annotations, title }) {
    this._feature.background = { annotations, title, steps: [] };
  }

  createBackgroundStep({ annotations, text, generalised = text }) {
    this._feature.background.steps.push({ annotations, text, generalised, docstring: [] });
  }

  createBackgroundStepDocstring({ text }) {
    this._currentBackgroundStep().docstring.push(text);
  }

  createScenario({ annotations, title }) {
    const scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(scenario);
  }

  createScenarioStep({ annotations, text, generalised = text }) {
    const scenario = this._currentScenario();
    scenario.steps.push({ annotations, text, generalised, docstring: [] });
  }

  createScenarioStepDocstring({ text }) {
    this._currentScenarioStep().docstring.push(text);
  }

  _currentBackgroundStep() {
    const background = this._feature.background;
    return background.steps[background.steps.length - 1];
  }

  _currentScenario() {
    return this._feature.scenarios[this._feature.scenarios.length - 1];
  }

  _currentScenarioStep() {
    const scenario = this._currentScenario();
    return scenario.steps[scenario.steps.length - 1];
  }

  export() {
    return this._feature;
  }
};