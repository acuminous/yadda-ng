const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringTokenStopEvent } = Events;

describe('DocStringTokenStopEvent', () => {

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
    onDocStringTokenEnd(event) {
      this.events.push(event);
    }
  }

  it('should handle --- DocStrings', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = { token: '---' };
    session.indentation = 6;

    event.handle({ line: '   ---   ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringTokenStopEvent');
    expect(state.events[0].source.line).toBe('   ---   ');
    expect(session.indentation).toBe(0);
    expect(session.docString).toBe(undefined);
  });

  it('should handle DocStrings', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = { token: '"""' };

    event.handle({ line: '   """   ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringTokenStopEvent');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(session.indentation).toBe(0);
    expect(session.docString).toBe(undefined);
  });

});
