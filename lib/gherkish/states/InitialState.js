const BaseState = require('./BaseState');
const Languages = require('./../languages');

module.exports = class InitialState extends BaseState {

  constructor({ machine, specification }) {
    super({ subject: 'specification', machine });
    this._specification = specification;
    this._annotations = [];
  }

  onLanguage(event, session) {
    session.language = Languages.utils.get(event.data.name);
    return this;
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
    return this;
  }

  onBlankLine(event) {
    return this;
  }

  onFeature(event) {
    this._specification.createFeature({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateFeatureState();
  }

  onMultiLineComment(event) {
    return this._machine.toCreateCommentState();
  }

  onSingleLineComment(event) {
    return this;
  }
};
