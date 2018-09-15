const debug = require('debug')('yadda:steps:BaseStep');
const Annotations = require('../Annotations');

module.exports = class BaseStep {

  constructor({ annotations, text, generalised }) {
    this._annotations = annotations || new Annotations();
    this._text = text;
    this._generalised = generalised;
  }

  get text() {
    return this._text;
  }

  get generalised() {
    return this._generalised;
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
};
