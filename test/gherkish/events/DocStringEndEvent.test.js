const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringEndEvent } = Events;

describe('DocStringEndEvent', () => {

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
    onDocStringEnd(event) {
      this.events.push(event);
    }
  }

  it('should handle --- DocStrings', () => {
    const event = new DocStringEndEvent();
    session.docString = { token: '---' };
    session.indentation = 6;

    event.handle({ line: '   ---   ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringStart');
    expect(state.events[0].source.line).toBe('   ---   ');
    expect(session.indentation).toBe(0);
    expect(session.docString).toBe(undefined);
  });

  it('should handle DocStrings', () => {
    const event = new DocStringEndEvent();
    session.docString = { token: '"""' };

    event.handle({ line: '   """   ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringStart');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(session.indentation).toBe(0);
    expect(session.docString).toBe(undefined);
  });

});
