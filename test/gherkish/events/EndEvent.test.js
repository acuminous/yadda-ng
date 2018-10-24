const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { EndEvent } = Events;

describe('EndEvent', () => {

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
    onEnd(event) {
      this.events.push(event);
    }
  }

  it('should recognise end of specification', () => {
    const event = new EndEvent();
    expect(event.handle({ line: '\u0000' }, session, state)).toBe(true);

    expect(event.handle({ line: ' \u0000' }, session, state)).toBe(false);
    expect(event.handle({ line: '\u0000 ' }, session, state)).toBe(false);
  });

  it('should handle end of specification', () => {
    const event = new EndEvent();

    event.handle({ line: '\u0000' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('EndEvent');
    expect(state.events[0].source.line).toBe('\u0000');
    expect(state.events[0].data).toEqual({});
  });

});
