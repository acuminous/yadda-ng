const CreateBackgroundState = require('./CreateBackgroundState');
const CreateScenarioState = require('./CreateScenarioState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateFeatureState {

  constructor({ specificationBuilder }) {
    this._specificationBuilder = specificationBuilder;
    this._annotations = [];
  }

  get name() {
    return 'create_feature';
  }

  handle(event) {
    switch(event.name) {
      case 'annotation': {
        this._annotations.push({ name: event.data.name, value: event.data.value });
        return this;
      }
      case 'background': {
        this._specificationBuilder.createBackground({ annotations: this._annotations, title: event.data.title });
        return new CreateBackgroundState({ specificationBuilder: this._specificationBuilder });
      }
      case 'blank_line': {
        return this;
      }
      case 'end': {
        throw new Error('Premature end of specification');
      }
      case 'multi_line_comment': {
        return new CreateCommentState({ previousState: this });
      }
      case 'scenario': {
        this._specificationBuilder.createScenario({ annotations: this._annotations, title: event.data.title });
        return new CreateScenarioState({ specificationBuilder: this._specificationBuilder });
      }
      case 'single_line_comment': {
        return this;
      }
      default: {
        throw new Error(`Unexpected event: ${event.name} on line: ${event.source.number}, '${event.source.line}'`);
      }
    }
  }
};