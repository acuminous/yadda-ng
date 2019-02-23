const debug = require('debug')('yadda:playbooks:FeaturePlaybook');

const statuses = require('../steps/statuses');
const State = require('../State');

module.exports = class FeaturePlaybook {
  constructor({ features }) {
    this._features = features;
  }

  find(cb) {
    return this._features.find(cb);
  }

  filter(cb) {
    return this._features.filter(cb);
  }

  forEach(cb) {
    this._features.forEach(cb);
  }

  map(cb) {
    return this._features.map(cb);
  }

  reduce(cb, acc) {
    return this._features.reduce(cb, acc);
  }

  async run(state = new State()) {
    const steps = await this.reduce((p, feature) => p.then(() => {
      state.clear(State.FEATURE_SCOPE);
      return feature.reduce((p, scenario) => p.then(() => {
        state.clear(State.SCENARIO_SCOPE);
        return scenario.reduce((p, step) => p.then((report) => {
          return step.run(state).then((outcome) => {
            return report.concat({
              feature: feature.title,
              scenario: scenario.title,
              step: step.text,
              ...outcome,
            });
          });
        }), p);
      }), p);
    }), Promise.resolve([]));
    return { steps, summary: this._summarise(steps) };
  }

  _initialiseSummary() {
    return Object.values(statuses).reduce((summary, status) => ({ ...summary, [status]: 0 }), {});
  }

  _summarise(steps) {
    const summary = this._initialiseSummary();
    return Object(steps).reduce((summary, step) => ({ ...summary, [step.status]: summary[step.status] + 1 }), summary);
  }
};
