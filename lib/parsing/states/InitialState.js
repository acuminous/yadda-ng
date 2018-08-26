const CreateFeatureState = require('./CreateFeatureState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class InitialState {

  constructor({ specificationBuilder }) {
    this._specificationBuilder = specificationBuilder;
    this._annotations = [];
  }

  get name() {
    return 'initial';
  }

  handle(event) {
    switch(event.name) {
      case 'annotation': {
        this._annotations.push({ name: event.data.name, value: event.data.value });
        return this;
      }
      case 'single_line_comment':
      case 'blank_line': {
        return this;
      }
      case 'multi_line_comment': {
        return new CreateCommentState({ previousState: this });
      }
      case 'feature': {
        this._specificationBuilder.createFeature({ annotations: this._annotations, title: event.data.title });
        return new CreateFeatureState({ specificationBuilder: this._specificationBuilder });
      }
      case 'end': {
        throw new Error('Premature end of specification');
      }
      default: {
        throw new Error(`Unexpected event: ${event.name} on line: ${event.source.number}, '${event.source.line}'`);
      }
    }
  }
};
