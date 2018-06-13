const debug = require('debug')('yadda:steps:BaseStep');

module.exports = class BaseStep {
  constructor({ annotations, statement }) {
    this._annotations = annotations;
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
    return this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }
};
