const BaseState = require('./BaseState');
const CreateFeatureState = require('./CreateFeatureState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class InitialState extends BaseState {

  constructor({ specification }) {
    super();
    this._specification = specification;
    this._annotations = [];
  }

  onLanguage(event) {
    this._specification.setLanguage({ ...event.data });
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
    return new CreateFeatureState({ specification: this._specification });
  }

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onSingleLineComment(event) {
    return this;
  }
};
