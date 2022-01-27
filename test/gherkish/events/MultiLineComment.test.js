const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { MultiLineCommentEvent } = Events;

describe('MultiLineCommentEvent', () => {
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
    onMultiLineComment(event) {
      this.events.push(event);
    }
  }

  it('should recognise multi line comments', () => {
    const event = new MultiLineCommentEvent();
    eq(event.handle({ line: '### Some comment' }, session, state), true);
    eq(event.handle({ line: ' ### Some comment' }, session, state), true);
    eq(event.handle({ line: '###' }, session, state), true);
    eq(event.handle({ line: '#### Some comment' }, session, state), true);

    eq(event.handle({ line: '## No commment' }, session, state), false);
  });

  it('should handle multi line comments', () => {
    const event = new MultiLineCommentEvent();

    event.handle({ line: '### Some comment ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'MultiLineCommentEvent');
    eq(state.events[0].source.line, '### Some comment ');
    eq(state.events[0].data.text, 'Some comment');
  });
});
