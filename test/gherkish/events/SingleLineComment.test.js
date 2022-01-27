const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { SingleLineCommentEvent } = Events;

describe('SingleLineCommentEvent', () => {
  let session;
  let state;

  beforeEach(() => {
    session = { language: Languages.utils.getDefault() };
    state = new StubState();
  });

  class StubState {
    constructor() {
      this.events = [];
    }
    onSingleLineComment(event) {
      this.events.push(event);
    }
  }

  it('should recognise single line comments', () => {
    const event = new SingleLineCommentEvent();
    eq(event.handle({ line: '# Some comment' }, session, state), true);
    eq(event.handle({ line: ' # Some comment' }, session, state), true);
    eq(event.handle({ line: '#' }, session, state), true);
    eq(event.handle({ line: '## Some comment' }, session, state), true);

    eq(event.handle({ line: 'No commment' }, session, state), false);
  });

  it('should handle single line comments', () => {
    const event = new SingleLineCommentEvent();

    event.handle({ line: '# Some comment ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'SingleLineCommentEvent');
    eq(state.events[0].source.line, '# Some comment ');
    eq(state.events[0].data.text, 'Some comment');
  });
});
