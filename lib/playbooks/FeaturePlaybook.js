const debug = require('debug')('yadda-ng:playbooks:FeaturePlaybook');

const statuses = require('../steps/statuses');

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

  async run() {
    const steps = await this.reduce((p, feature) => p.then(() => {
      return feature.reduce((p, scenario) => p.then(() => {
        return scenario.run((state) => {
          return scenario.reduce((p, step) => p.then((report) => {
            return step.run(state).then((outcome) => {
              return report.concat({
                feature: feature.title,
                scenario: scenario.title,
                step: step.statement,
                ...outcome,
              });
            });
          }), p);
        });
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
