const debug = require('debug')('yadda:parser:JsonSpecification');

module.exports = class JsonSpecification {

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
    return this;

  }

  createBackground({ annotations, title }) {
    this._feature.background = { annotations, title, steps: [] };
    return this;
  }

  createBackgroundStep({ annotations, text, generalised = text }) {
    this._feature.background.steps.push({ annotations, text, generalised });
    return this;
  }

  createScenario({ annotations, title }) {
    const scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(scenario);
    return this;
  }

  createScenarioStep({ annotations, text, generalised = text }) {
    const scenario = this._currentScenario();
    scenario.steps.push({ annotations, text, generalised });
    return this;
  }

  _currentScenario() {
    return this._feature.scenarios[this._feature.scenarios.length - 1];
  }

  export() {
    return this._feature;
  }
};
