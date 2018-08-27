const BaseState = require('./BaseState');
const CreateStepState = require('./CreateStepState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateScenarioState extends BaseState {

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

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onSingleLineComment(event) {
    return this;
  }

  onText(event) {
    this._specification.createStep({ annotations: this._annotations, statement: event.data.text });
    return new CreateStepState({ specification: this._specification });
  }
};
