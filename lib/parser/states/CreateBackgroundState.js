const BaseState = require('./BaseState');
const CreateBackgroundStepState = require('./CreateBackgroundStepState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateBackgroundState extends BaseState {

  constructor({ specification }) {
    super({ subject: 'background' });
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
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    return new CreateBackgroundStepState({ specification: this._specification });
  }

  onText(event) {
    return this.onStep(event);
  }
};
