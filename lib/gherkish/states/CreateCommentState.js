const BaseState = require('./BaseState');

module.exports = class CreateCommentState extends BaseState {

  constructor({ machine }) {
    super({ subject: 'comment', machine });
  }

  onAnnotation(event) {
    return this;
  }

  onBackground(event) {
    return this;
  }

  onBlankLine(event) {
    return this;
  }

  onFeature(event) {
    return this;
  }

  onLanguage(event) {
    return this;
  }

  onMultiLineComment(event) {
    return this._machine.toPreviousState();
  }

  onScenario(event) {
    return this;
  }

  onSingleLineComment(event) {
    return this;
  }

  onStep(event) {
    return this;
  }

  onText(event) {
    return this;
  }


};
