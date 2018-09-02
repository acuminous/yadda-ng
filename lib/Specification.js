const debug = require('debug')('yadda:Specification');

module.exports = class Specification {

  constructor() {
    this._feature = undefined;
    this._stepTarget = undefined;
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
    this._stepTarget = this._feature.background;
    return this;
  }

  describeBackground({ text }) {
    this._feature.background.description = this._feature.background.description
      ? `${this._feature.background.description}\n${text}`
      : text;
    return this;
  }

  createScenario({ annotations, title }) {
    const scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(scenario);
    this._stepTarget = scenario;
    return this;
  }

  describeScenario({ text }) {
    this._stepTarget.description = this._stepTarget.description
      ? `${this._stepTarget.description}\n${text}`
      : text;
    return this;
  }

  createStep({ annotations, statement, generalised }) {
    this._stepTarget.steps.push({ annotations, statement, generalised });
    return this;
  }

  export() {
    return this._feature;
  }
};
