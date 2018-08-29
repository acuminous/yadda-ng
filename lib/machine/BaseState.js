module.exports = class BaseState {

  get name() {
    return this.constructor.name;
  }

  onAnnotation(event) {
    return this.handleUnexpectedEvent(event);
  }

  onBackground(event) {
    return this.handleUnexpectedEvent(event);
  }

  onBlankLine(event) {
    return this.handleUnexpectedEvent(event);
  }

  onEnd(event) {
    throw new Error('Premature end of specification');
  }

  onFeature(event) {
    return this.handleUnexpectedEvent(event);
  }

  onMultiLineComment(event) {
    return this.handleUnexpectedEvent(event);
  }

  onScenario(event) {
    return this.handleUnexpectedEvent(event);
  }

  onSingleLineComment(event) {
    return this.handleUnexpectedEvent(event);
  }

  onStep(event) {
    return this.handleUnexpectedEvent(event);
  }

  onText(event) {
    return this.handleUnexpectedEvent(event);
  }

  handleUnexpectedEvent(event) {
    throw new Error(`Unexpected event: ${event.name} from state: ${this.name} on line ${event.source.number}: '${event.source.line}'`);
  }
};
