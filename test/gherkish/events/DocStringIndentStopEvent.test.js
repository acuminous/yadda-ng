const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringIndentStopEvent } = Events;

describe('DocStringIndentStopEvent', () => {
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
    onDocStringIndentStop(event) {
      this.events.push(event);
    }
  }

  it('should handle indented DocStrings', () => {
    session.docString = { indentation: 6 };

    const event = new DocStringIndentStopEvent();
    event.handle({ line: '   some text   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringIndentStopEvent');
    expect(state.events[0].source.line).toBe('   some text   ');
    expect(session.docString).toBe(undefined);
  });

  it('should do nothing when still indented', () => {
    session.docString = { indentation: 6 };

    const event = new DocStringIndentStopEvent();
    expect(event.handle({ line: '   some text   ', indentation: 6 }, session, state)).toBe(false);
  });

  it('should do nothing when not handling a DocString', () => {
    const event = new DocStringIndentStopEvent();
    expect(event.handle({ line: '   some text   ', indentation: 3 }, session, state)).toBe(false);
  });

  it('should do nothing when already handling a token DocString', () => {
    session.docString = { token: {} };
    const event = new DocStringIndentStopEvent();
    expect(event.handle({ line: '   some text   ', indentation: 3 }, session, state)).toBe(false);
  });
});
