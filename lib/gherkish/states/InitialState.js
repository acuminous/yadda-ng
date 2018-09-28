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
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine(event) {
  }

  onFeature(event) {
    this._specification.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toCreateFeatureState();
  }

  onMultiLineComment(event) {
    this._machine.toCreateCommentState();
  }

  onSingleLineComment(event) {
  }
};
