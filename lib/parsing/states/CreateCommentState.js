module.exports = class CreateCommentState {

  constructor({ previousState }) {
    this._previousState = previousState;
  }

  get name() {
    return 'create_comment';
  }

  handle(event) {
    switch(event.name) {
      case 'annotation': {
        return this;
      }
      case 'blank_line': {
        return this;
      }
      case 'end': {
        throw new Error('Premature end of specification');
      }
      case 'feature': {
        return this;
      }
      case 'multi_line_comment': {
        return this._previousState;
      }
      case 'scenario': {
        return this;
      }
      case 'single_line_comment': {
        return this;
      }
      case 'text': {
        return this;
      }
      default: {
        throw new Error(`Unexpected event: ${event.name} on line: ${event.source.number}, '${event.source.line}'`);
      }
    }
  }
};
