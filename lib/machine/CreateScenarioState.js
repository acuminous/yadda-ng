const CreateStepState = require('./CreateStepState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateScenarioState {

  constructor({ specification }) {
    this._specification = specification;
    this._annotations = [];
  }

  get name() {
    return 'create_scenario';
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