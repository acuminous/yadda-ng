const debug = require('debug')('yadda:steps:BaseStep');
const Annotations = require('../Annotations');

module.exports = class BaseStep {

  constructor({ annotations, statement, generalised }) {
    this._annotations = annotations || new Annotations();
    this._statement = statement;
    this._generalised = generalised;
  }

  get statement() {
    return this._statement;
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
