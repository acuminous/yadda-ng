const CreateScenarioState = require('./CreateScenarioState');
const CreateStepState = require('./CreateStepState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateBackgroundState {

  constructor({ specification }) {
    this._specification = specification;
    this._annotations = [];
  }

  get name() {
    return 'create_background';
  }

  handle(event) {
    switch(event.name) {
      case 'annotation': {
        this._annotations.push({ name: event.data.name, value: event.data.value });
        return this;
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
        this._specification.createScenario({ annotations: this._annotations, title: event.data.title });
        return new CreateScenarioState({ specification: this._specification });
      }
      case 'single_line_comment': {
        return this;
      }
      case 'text': {
        this._specification.createStep({ annotations: this._annotations, statement: event.data.text });
        return new CreateStepState({ specification: this._specification });
      }
      default: {
        throw new Error(`Unexpected event: ${event.name} on line: ${event.source.number}, '${event.source.line}'`);
      }
    }
  }
};
