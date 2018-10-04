const BaseState = require('./BaseState');

module.exports = class BaseCreateStepState extends BaseState {

  constructor({ subject, machine, specification }) {
    super({ subject, machine });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine(event) {
  }

  onEnd(event) {
    this._machine.toFinalState();
  }

  onMultiLineComment(event) {
    this._machine.toCreateMultiLineCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onSingleLineComment(event) {
  }

  onText(event) {
    this.onStep(event);
  }
};
