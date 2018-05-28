const debug = require('debug')('yadda-ng:Playbook');

module.exports = class Playbook {
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
    return this.reduce((promise, feature) => promise.then(() => {
      return feature.reduce((promise, scenario) => promise.then(() => {
        return scenario.reduce((promise, step) => promise.then(() => {
          return scenario.execute((state) => step.run(state));
        }), promise);
      }), promise);
    }), Promise.resolve());
  }
};
