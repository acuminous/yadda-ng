const { UnexpectedEvent } = require('../events');

module.exports = class BaseState {

  constructor({ machine, events = [] }) {
    this._machine = machine;
    this._events = events.concat(UnexpectedEvent).map((Clazz) => new Clazz());
  }

  get name() {
    return this.constructor.name;
  }

  handle(source, session) {
    this._events.find((event) => event.handle(source, session, this));
  }

  onAnnotation(event) {
    this._handleUnexpectedEvent(event);
  }

  onBackground(event) {
    this._handleUnexpectedEvent(event);
  }

  onBlankLine(event) {
  }

  onDocstring(event) {
    this._handleUnexpectedEvent(event);
  }

  onEnd(event) {
    this._handleUnexpectedEvent(event);
  }

  onFeature(event) {
    this._handleUnexpectedEvent(event);
  }

  onLanguage(event) {
    this._handleUnexpectedEvent(event);
  }

  onMultiLineComment(event) {
    this._handleUnexpectedEvent(event);
  }

  onScenario(event) {
    this._handleUnexpectedEvent(event);
  }

  onSingleLineComment(event) {
  }

  onStep(event) {
    this._handleUnexpectedEvent(event);
  }

  onText(event) {
    this._handleUnexpectedEvent(event);
  }

  onUnexpectedEvent(event) {
    this._handleUnexpectedEvent(event);
  }

  _handleUnexpectedEvent(event) {
    throw new Error(`'${event.source.line}' was unexpected in state: ${this.name} on line ${event.source.number}'`);
  }
};
