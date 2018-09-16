const BaseState = require('./BaseState');
const CreateScenarioStepState = require('./CreateScenarioStepState');
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
    return new CreateScenarioStepState({ specification: this._specification });
  }

  onText(event) {
    return this.onStep(event);
  }
};
