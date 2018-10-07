const BaseState = require('./BaseState');
const Languages = require('./../languages');

module.exports = class InitialState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine });
    this._specification = specification;
    this._annotations = [];
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

  onLanguage(event, session) {
    session.language = Languages.utils.get(event.data.name);
  }

  onMultiLineComment(event) {
    this._machine.toCreateMultiLineCommentState();
  }

  onSingleLineComment(event) {
  }
};
