const debug = require('debug')('yadda-ng:Feature');

module.exports = class Feature {
  constructor({ annotations, title, scenarios }) {
    this._annotations = annotations;
    this._title = title;
    this._scenarios = scenarios;
  }

  get title() {
    return this._title;
  }

  hasAnnotation(name) {
    return this._annotations.has(name);
  }

  getAnnotation(name) {
    return this._annotations.get(name);
  }

  isSkipped() {
    return this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }

  find(cb) {
    return this._scenarios.find(cb);
  }

  filter(cb) {
    return this._scenarios.filter(cb);
  }

  forEach(cb) {
    this._scenarios.forEach(cb);
  }

  map(cb) {
    return this._scenarios.map(cb);
  }

  reduce(cb, acc) {
    return this._scenarios.reduce(cb, acc);
  }
};
