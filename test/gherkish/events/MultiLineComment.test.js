const expect = require('expect');
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
    expect(event.handle({ line: '### Some comment' }, session, state)).toBe(true);
    expect(event.handle({ line: ' ### Some comment' }, session, state)).toBe(true);
    expect(event.handle({ line: '###' }, session, state)).toBe(true);
    expect(event.handle({ line: '#### Some comment' }, session, state)).toBe(true);

    expect(event.handle({ line: '## No commment' }, session, state)).toBe(false);
  });

  it('should handle multi line comments', () => {
    const event = new MultiLineCommentEvent();

    event.handle({ line: '### Some comment ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('multi_line_comment');
    expect(state.events[0].source.line).toBe('### Some comment ');
    expect(state.events[0].data.text).toBe('Some comment');
  });

});
