const BaseState = require('./BaseState');

module.exports = class CreateScenarioState extends BaseState {

  constructor({ machine, specification }) {
    super({ subject: 'scenario', machine });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine(event) {
  }

  onMultiLineComment(event) {
    this._machine.toCreateMultiLineCommentState();
  }

  onSingleLineComment(event) {
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioStepState();
  }

  onText(event) {
    this.onStep(event);
  }
};
