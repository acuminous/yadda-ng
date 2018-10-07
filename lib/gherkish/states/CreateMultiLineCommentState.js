const BaseState = require('./BaseState');

module.exports = class CreateMultiLineCommentState extends BaseState {

  constructor({ machine }) {
    super({ machine });
  }

  onAnnotation(event) {
  }

  onBackground(event) {
  }

  onBlankLine(event) {
  }

  onDocstring(event) {
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
