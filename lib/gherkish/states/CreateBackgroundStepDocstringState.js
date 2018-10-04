const BaseState = require('./BaseState');

module.exports = class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, specification, token, indentation }) {
    super({ subject: 'background step docstring', machine });
    this._specification = specification;
    this._token = token;
    this._indentation = indentation;
  }

  onAnnotation(event) {
    this._addDocstring(event.source.line);
  }

  onBackground(event) {
    this._addDocstring(event.source.line);
  }

  onBlankLine(event) {
    this._addDocstring(event.source.line);
  }

  onDocstring(event) {
    event.data.token === this._token ? this._machine.toPreviousState() : this._addDocstring(event.source.line);
  }

  onFeature(event) {
    this._addDocstring(event.source.line);
  }

  onLanguage(event) {
    this._addDocstring(event.source.line);
  }

  onEnd(event) {
    this._machine.toFinalState();
  }

  onMultiLineComment(event) {
    this._addDocstring(event.source.line);
  }

  onScenario(event) {
    this._addDocstring(event.source.line);
  }

  onSingleLineComment(event) {
    this._addDocstring(event.source.line);
  }

  onStep(event) {
    this._addDocstring(event.source.line);
  }

  onText(event) {
    this._addDocstring(event.source.line);
  }

  _addDocstring(text) {
    this._specification.createBackgroundStepDocstring({ text: text.substr(this._indentation) });
  }

};
