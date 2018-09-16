const BaseState = require('./BaseState');
const CreateCommentState = require('./CreateCommentState');
const FinalState = require('./FinalState');

module.exports = class BaseCreateStepState extends BaseState {

  constructor({ specification, subject }) {
    super({ subject });
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

  onEnd(event) {
    return new FinalState({ specification: this._specification });
  }

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onScenario(event) {
    // Require inline to avoid cyclic dependency
    const CreateScenarioState = require('./CreateScenarioState');
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    return new CreateScenarioState({ specification: this._specification });
  }

  onSingleLineComment(event) {
    return this;
  }

  onText(event) {
    return this.onStep(event);
  }
};
