const Debug = require('debug');
const Annotations = require('./Annotations');

module.exports = class Section {
  constructor(props) {
    const { annotations = new Annotations(), title, iterables, debug = Debug('yadda:Section') } = props;

    this._annotations = annotations;
    this._title = title;
    this._iterables = iterables;
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

  forEach(iterator) {
    this._iterables.forEach(iterator);
  }

  reduce(iterator, accumulator) {
    return this._iterables.reduce(iterator, accumulator);
  }
};
