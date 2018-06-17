const debug = require('debug')('yadda-ng:playbooks:FeaturePlaybook');

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

  async pretend() {
    return this._run((step, state) => step.pretend(state));
  }

  async run() {
    return this._run((step, state) => step.run(state));
  }

  async _run(onStep) {
    return this.reduce((p, feature) => p.then((report) => {
      return feature.reduce((p, scenario) => p.then((report) => {
        return scenario.reduce((p, step) => p.then((report) => {
          return scenario.run((state) => onStep(step, state)).then((status) => {
            return report.concat({ feature, scenario, step, status });
          });
        }), p);
      }), p);
    }), Promise.resolve([]));
  }
};
