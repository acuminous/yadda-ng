const BaseState = require('./BaseState');
const CreateFeatureState = require('./CreateFeatureState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class InitialState extends BaseState {

  constructor({ specification }) {
    super();
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ name: event.data.name, value: event.data.value });
    return this;
  }

  onBlankLine(event) {
    return this;
  }

  onFeature(event) {
    this._specification.createFeature({ annotations: this._annotations, title: event.data.title });
    return new CreateFeatureState({ specification: this._specification });
  }

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onSingleLineComment(event) {
    return this;
  }
};
