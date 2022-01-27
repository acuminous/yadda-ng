const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { UnexpectedEvent } = Events;

describe('UnexpectedEvent', () => {
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
    onUnexpectedEvent(event) {
      this.events.push(event);
    }
  }

  it('should recognise anything', () => {
    const event = new UnexpectedEvent();
    expect(event.handle({ line: 'anything' }, session, state)).toBe(true);
  });

  it('should handle anything', () => {
    const event = new UnexpectedEvent();

    event.handle({ line: 'anything' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('UnexpectedEvent');
    expect(state.events[0].source.line).toBe('anything');
    expect(state.events[0].data).toEqual({});
  });
});
