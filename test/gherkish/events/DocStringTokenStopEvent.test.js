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
    onDocStringTokenStop(event) {
      this.events.push(event);
    }
  }

  it('should handle --- DocStrings', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = { token: '---', indentation: 6 };

    event.handle({ line: '   ---   ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringTokenStopEvent');
    expect(state.events[0].source.line).toBe('   ---   ');
    expect(session.docString).toBe(undefined);
  });

  it('should handle """ DocStrings', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = { token: '"""', indentation: 6 };

    event.handle({ line: '   """   ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringTokenStopEvent');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(session.docString).toBe(undefined);
  });

  it('should do nothing when not handling a DocString', () => {
    const event = new DocStringTokenStopEvent();
    expect(event.handle({ line: '   """   ' }, session, state)).toBe(false);
  });

  it('should do nothing when already handling an indented DocString', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = {};

    expect(event.handle({ line: '   """   ' }, session, state)).toBe(false);
  });

});
