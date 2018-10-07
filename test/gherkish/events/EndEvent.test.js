const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { EndEvent } = Events;

describe('EndEvent', () => {

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
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: '\u0000'}, session)).toBe(true);

    expect(event.test({ line: ' \u0000'}, session)).toBe(false);
    expect(event.test({ line: '\u0000 '}, session)).toBe(false);
  });

  it('should handle end of specification', () => {
    const event = new EndEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: '\u0000'}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('end');
    expect(state.events[0].source.line).toBe('\u0000');
    expect(state.events[0].data).toEqual({});
  });

});
