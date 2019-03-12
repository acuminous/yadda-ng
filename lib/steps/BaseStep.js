const debug = require('debug')('yadda:steps:BaseStep');
const Annotations = require('../Annotations');

module.exports = class BaseStep {

  constructor({ annotations, text, generalised, docString }) {
    this._annotations = annotations || new Annotations();
    this._text = text;
    this._generalised = generalised;
    this._docString = docString;
    this._aborted = false;
  }

  static get ABORTED() {
    return 'aborted';
  }

  static get PENDING() {
    return 'pending';
  }

  static get RUN() {
    return 'run';
  }

  static get UNDEFINED() {
    return 'undefined';
  }

  static get AMBIGUOUS() {
    return 'ambiguous';
  }

  static get ERROR() {
    return 'error';
  }

  static get statuses() {
    return [BaseStep.ABORTED, BaseStep.PENDING, BaseStep.RUN, BaseStep.UNDEFINED, BaseStep.AMBIGUOUS, BaseStep.ERROR];
  }

  get text() {
    return this._text;
  }

  get generalised() {
    return this._generalised;
  }

  get docString() {
    return this._docString;
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

  isAborted() {
    return this._aborted;
  }

  abort() {
    debug(`Aborting step [${this.text}]`);
    this._aborted = true;
    return this;
  }
};
