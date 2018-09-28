const BaseState = require('./BaseState');

module.exports = class CreateCommentState extends BaseState {

  constructor({ machine }) {
    super({ subject: 'comment', machine });
  }

  onAnnotation(event) {
  }

  onBackground(event) {
  }

  onBlankLine(event) {
  }

  onFeature(event) {
  }

  onLanguage(event) {
  }

  onMultiLineComment(event) {
    this._machine.toPreviousState();
  }

  onScenario(event) {
  }

  onSingleLineComment(event) {
  }

  onStep(event) {
  }

  onText(event) {
  }


};
