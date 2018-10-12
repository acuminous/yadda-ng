const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { UnexpectedEvent } = Events;

describe('UnexpectedEvent', () => {

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
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: 'anything'}, session)).toBe(true);
  });

  it('should handle anything', () => {
    const event = new UnexpectedEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: 'anything'}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('unexpected');
    expect(state.events[0].source.line).toBe('anything');
    expect(state.events[0].data).toEqual({});
  });

});
