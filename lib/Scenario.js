const debug = require('debug')('yadda-ng:Scenario');

module.exports = class Scenario {
  constructor({ annotations, title, steps }) {
    this._annotations = annotations;
    this._title = title;
    this._steps = steps;
    this._state = {};
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

  async execute(cb) {
    const newState = await cb({ ...this._state });
    if (newState) this._state = { ...newState };
  }
};