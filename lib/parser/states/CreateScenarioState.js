const BaseState = require('./BaseState');
const CreateStepState = require('./CreateStepState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateScenarioState extends BaseState {

  constructor({ specification }) {
    super({ subject: 'scenario' });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
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

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    const createStep = (annotations, data) => this._specification.createScenarioStep({ annotations, ...data });
    return new CreateStepState({ specification: this._specification, createStep });
  }

  onText(event) {
    return this.onStep(event);
  }
};
