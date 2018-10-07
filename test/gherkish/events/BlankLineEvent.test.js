const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {

  class StubState {
    constructor() {
      this.events = [];
    }
    onBlankLine(event) {
      this.events.push(event);
    }
  }

  it('should recognise blank lines', () => {
    const event = new BlankLineEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: ''}, session)).toBe(true);
    expect(event.test({ line: '   '}, session)).toBe(true);

    expect(event.test({ line: 'Not Blank'}, session)).toBe(false);
  });

  it('should handle blank lines', () => {
    const event = new BlankLineEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: ''}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('blank_line');
    expect(state.events[0].source.line).toBe('');
    expect(state.events[0].data).toEqual({});
  });

});
