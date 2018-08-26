const debug = require('debug')('yadda-ng:parsing:SpecificationBuilder');

module.exports = class SpecificationBuilder {

  createFeature({ annotations, title }) {
    this._feature = { annotations, title, scenarios: [] };
    return this;
  }

  createScenario({ annotations, title }) {
    this._scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(this._scenario);
    return this;
  }

  createStep({ annotations, text }) {
    this._scenario.steps.push({ annotations, text });
    return this;
  }

  export() {
    return {
      annotations: this._feature.annotations,
      title: this._feature.title,
      scenarios: this._feature.scenarios.map((scenario) => ({
        annotations: scenario.annotations,
        title: scenario.title,
        steps: scenario.steps.map((step) => ({
          annotations: step.annotations,
          text: step.text
        }))
      }))
    };
  }
};
