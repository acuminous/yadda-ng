const Debug = require('debug');
const Annotations = require('./Annotations');

module.exports = class Feature {

  constructor(props) {
    const {
      annotations = new Annotations(),
      title,
      scenarios,
      debug = Debug('yadda:Feature'),
    } = props;

    this._annotations = annotations;
    this._title = title;
    this._scenarios = scenarios;
    this._debug = debug;
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
