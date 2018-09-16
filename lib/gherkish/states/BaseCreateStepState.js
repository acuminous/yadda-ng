const BaseState = require('./BaseState');

module.exports = class BaseCreateStepState extends BaseState {

  constructor({ subject, machine, specification, indentation }) {
    super({ subject, machine });
    this._specification = specification;
    this._indentation = indentation;
    this._annotations = [];
  }

  isIndented(source) {
    return source.indentation > this._indentation.step;
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
    return this;
  }

  onBlankLine(event) {
    return this;
  }

  onEnd(event) {
    return this._machine.toFinalState();
  }

  onMultiLineComment(event) {
    return this._machine.toCreateCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateScenarioState();
  }

  onSingleLineComment(event) {
    return this;
  }

  onText(event) {
    return this.onStep(event);
  }
};
