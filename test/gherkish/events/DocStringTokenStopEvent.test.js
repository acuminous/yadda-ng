const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
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
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringTokenStopEvent');
    eq(state.events[0].source.line, '   ---   ');
    eq(session.docString, undefined);
  });

  it('should handle """ DocStrings', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = { token: '"""', indentation: 6 };

    event.handle({ line: '   """   ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringTokenStopEvent');
    eq(state.events[0].source.line, '   """   ');
    eq(session.docString, undefined);
  });

  it('should do nothing when not handling a DocString', () => {
    const event = new DocStringTokenStopEvent();
    eq(event.handle({ line: '   """   ' }, session, state), false);
  });

  it('should do nothing when already handling an indented DocString', () => {
    const event = new DocStringTokenStopEvent();
    session.docString = {};

    eq(event.handle({ line: '   """   ' }, session, state), false);
  });
});
