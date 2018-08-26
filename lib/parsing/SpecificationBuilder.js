const debug = require('debug')('yadda-ng:parsing:SpecificationBuilder');

module.exports = class SpecificationBuilder {

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

  createStep({ annotations, text }) {
    this._stepTarget.steps.push({ annotations, text });
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
          text: step.text
        }))
      }))
    };
  }
};
