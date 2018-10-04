const BaseState = require('./BaseState');

module.exports = class CreateBackgroundState extends BaseState {

  constructor({ machine, specification }) {
    super({ subject: 'background', machine });
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
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundStepState();
  }

  onText(event) {
    this.onStep(event);
  }
};
