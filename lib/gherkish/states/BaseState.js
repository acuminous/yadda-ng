module.exports = class BaseState {

  constructor({ subject, machine }) {
    this._subject = subject;
    this._machine = machine;
  }

  get name() {
    return this.constructor.name;
  }

  onAnnotation(event) {
    throw new Error(`Annotation was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onBackground(event) {
    throw new Error(`Background was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onBlankLine(event) {
    throw new Error(`Blank line was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onDocstring(event) {
    throw new Error(`Docstring was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onEnd(event) {
    throw new Error(`Premature end of specification`);
  }

  onFeature(event) {
    throw new Error(`Feature was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onLanguage(event) {
    throw new Error(`Language was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onMultiLineComment(event) {
    throw new Error(`Comment was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onScenario(event) {
    throw new Error(`Scenario was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onSingleLineComment(event) {
    throw new Error(`Comment was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onStep(event) {
    throw new Error(`Step was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  onText(event) {
    throw new Error(`Text was unexpected while parsing ${this._subject} on line ${event.source.number}: '${event.source.line}'`);
  }

  handleUnexpectedEvent(event) {
    throw new Error(`${event.name} was unexpected on line ${event.source.number}: '${event.source.line}'`);
  }
};
