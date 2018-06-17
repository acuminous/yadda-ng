const debug = require('debug')('yadda:steps:BaseStep');
const Annotations = require('../Annotations');

module.exports = class BaseStep {
  constructor({ annotations, statement }) {
    this._annotations = annotations || new Annotations();
    this._statement = statement;
  }

  get statement() {
    return this._statement;
  }

  hasAnnotation(name) {
    return this._annotations.has(name);
  }

  getAnnotation(name) {
    return this._annotations.get(name);
  }

  isPending() {
    return false;
  }

  isUndefined() {
    return false;
  }

  async pretend() {}
};
