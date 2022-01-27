const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
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
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringIndentStopEvent');
    eq(state.events[0].source.line, '   some text   ');
    eq(session.docString, undefined);
  });

  it('should do nothing when still indented', () => {
    session.docString = { indentation: 6 };

    const event = new DocStringIndentStopEvent();
    eq(event.handle({ line: '   some text   ', indentation: 6 }, session, state), false);
  });

  it('should do nothing when not handling a DocString', () => {
    const event = new DocStringIndentStopEvent();
    eq(event.handle({ line: '   some text   ', indentation: 3 }, session, state), false);
  });

  it('should do nothing when already handling a token DocString', () => {
    session.docString = { token: {} };
    const event = new DocStringIndentStopEvent();
    eq(event.handle({ line: '   some text   ', indentation: 3 }, session, state), false);
  });
});
