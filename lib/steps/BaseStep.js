const debug = require('debug')('yadda:steps:BaseStep');

module.exports = class BaseStep {
  constructor({ annotations, text }) {
    this._annotations = annotations;
    this._text = text;
  }

  get text() {
    return this._text;
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
