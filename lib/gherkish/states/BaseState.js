module.exports = class BaseState {

  constructor({ machine }) {
    this._machine = machine;
  }

  get name() {
    return this.constructor.name;
  }

  onAnnotation(event) {
    this._handleUnexpectedEvent('Annotation', event);
  }

  onBackground(event) {
    this._handleUnexpectedEvent('Background', event);
  }

  onBlankLine(event) {
    this._handleUnexpectedEvent('Blank Line', event);
  }

  onDocstring(event) {
    this._handleUnexpectedEvent('Docstring', event);
  }

  onEnd(event) {
    throw new Error('Premature end of specification');
  }

  onFeature(event) {
    this._handleUnexpectedEvent('Feature', event);
  }

  onLanguage(event) {
    this._handleUnexpectedEvent('Language', event);
  }

  onMultiLineComment(event) {
    this._handleUnexpectedEvent('Multi line comment', event);
  }

  onScenario(event) {
    this._handleUnexpectedEvent('Scenario', event);
  }

  onSingleLineComment(event) {
    this._handleUnexpectedEvent('Single line comment', event);
  }

  onStep(event) {
    this._handleUnexpectedEvent('Step', event);
  }

  onText(event) {
    this._handleUnexpectedEvent('Text', event);
  }

  _handleUnexpectedEvent(type, event) {
    throw new Error(`${type} was unexpected in state: ${this.name} on line ${event.source.number}: '${event.source.line}'`);

  }
};
