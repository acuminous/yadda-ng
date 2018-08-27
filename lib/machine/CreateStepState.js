const BaseState = require('./BaseState');
const CreateCommentState = require('./CreateCommentState');
const FinalState = require('./FinalState');

module.exports = class CreateStepState extends BaseState {

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

  onEnd(event) {
    return new FinalState({ specification: this._specification });
  }

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onScenario(event) {
    // Require inline to avoid cyclic dependency
    const CreateScenarioState = require('./CreateScenarioState');
    this._specification.createScenario({ annotations: this._annotations, title: event.data.title });
    return new CreateScenarioState({ specification: this._specification });
  }

  onSingleLineComment(event) {
    return this;
  }

  onText(event) {
    this._specification.createStep({ annotations: this._annotations, statement: event.data.text });
    return new CreateStepState({ specification: this._specification });
  }
};
