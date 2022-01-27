const expect = require('expect');
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
    expect(event.handle({ line: '# Some comment' }, session, state)).toBe(true);
    expect(event.handle({ line: ' # Some comment' }, session, state)).toBe(true);
    expect(event.handle({ line: '#' }, session, state)).toBe(true);
    expect(event.handle({ line: '## Some comment' }, session, state)).toBe(true);

    expect(event.handle({ line: 'No commment' }, session, state)).toBe(false);
  });

  it('should handle single line comments', () => {
    const event = new SingleLineCommentEvent();

    event.handle({ line: '# Some comment ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('SingleLineCommentEvent');
    expect(state.events[0].source.line).toBe('# Some comment ');
    expect(state.events[0].data.text).toBe('Some comment');
  });
});
