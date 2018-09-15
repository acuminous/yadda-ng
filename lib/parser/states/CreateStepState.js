const BaseState = require('./BaseState');
const CreateCommentState = require('./CreateCommentState');
const FinalState = require('./FinalState');

module.exports = class CreateStepState extends BaseState {

  constructor({ specification, createStep }) {
    super({ subject: 'step' });
    this._specification = specification;
    this._annotations = [];
    this._createStep = createStep;
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

  onStep(event) {
    this._createStep(this._annotations, event.data);
    return new CreateStepState({ specification: this._specification, createStep: this._createStep });
  }

  onText(event) {
    return this.onStep(event);
  }
};
