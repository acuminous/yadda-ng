const debug = require('debug')('yadda:Scenario');
const Annotations = require('./Annotations');

// The job of a Scenario is to house steps
module.exports = class Scenario {
  constructor({ annotations = new Annotations(), title, steps }) {
    this._annotations = annotations;
    this._title = title;
    this._steps = steps;
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

  isPending() {
    return this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }

  isExclusive() {
    return this.hasAnnotation('only');
  }

  find(cb) {
    return this._steps.find(cb);
  }

  filter(cb) {
    return this._steps.filter(cb);
  }

  forEach(cb) {
    this._steps.forEach(cb);
  }

  map(cb) {
    return this._steps.map(cb);
  }

  reduce(cb, acc) {
    return this._steps.reduce(cb, acc);
  }

  async run(cb) {
    return cb({});
  }
};
