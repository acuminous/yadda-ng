const debug = require('debug')('yadda:steps:BaseStep');

module.exports = class BaseStep {
  constructor({ annotations, text, type }) {
    this._annotations = annotations;
    this._text = text;
    this._type = type;
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

  isSkipped() {
    return this.hasAnnotation('skip') || this.hasAnnotation('pending');
  }
};
