const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {
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
    onBlankLine(event) {
      this.events.push(event);
    }
  }

  it('should recognise blank lines', () => {
    const event = new BlankLineEvent();
    expect(event.handle({ line: '' }, session, state)).toBe(true);
    expect(event.handle({ line: '   ' }, session, state)).toBe(true);

    expect(event.handle({ line: 'Not Blank' }, session, state)).toBe(false);
  });

  it('should handle blank lines', () => {
    const event = new BlankLineEvent();

    event.handle({ line: '' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('BlankLineEvent');
    expect(state.events[0].source.line).toBe('');
    expect(state.events[0].data).toEqual({});
  });
});
