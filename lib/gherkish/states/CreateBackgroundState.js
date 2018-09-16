const BaseState = require('./BaseState');

module.exports = class CreateBackgroundState extends BaseState {

  constructor({ machine, specification }) {
    super({ subject: 'background', machine });
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
    return this._machine.toCreateCommentState();
  }

  onSingleLineComment(event) {
    return this;
  }

  onStep(event) {
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateBackgroundStepState();
  }

  onText(event) {
    return this.onStep(event);
  }
};
