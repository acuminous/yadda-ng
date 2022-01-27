const Debug = require('debug');
const Annotation = require('./Annotation');

module.exports = class Annotations {
  constructor(props = {}) {
    const { annotations = [], debug = Debug('yadda:Annotations') } = props;

    this._annotations = annotations;
    this._debug = debug;
  }

  has(name) {
    return !!this.get(name);
  }

  get(name) {
    this._debug(`Getting annotation: ${name}`);
    return this._annotations.find((annotation) => annotation.answersTo(name));
  }

  add(name, value) {
    this.has(name) ? this._extend(name, value) : this._create(name, value);
    return this;
  }

  _extend(name, value) {
    this.get(name).add(value);
  }

  _create(name, value) {
    this._annotations.push(new Annotation({ name, value }));
  }
};
