const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringIndentStartEvent } = Events;

describe('DocStringIndentStartEvent', () => {
  let session;
  let state;

  beforeEach(() => {
    session = {
      language: Languages.utils.getDefault(),
      indentation: 0,
    };
    state = new StubState();
  });

  class StubState {
    constructor() {
      this.events = [];
    }
    onDocStringIndentStart(event) {
      this.events.push(event);
    }
  }

  it('should recognise indented DocStrings', () => {
    const event = new DocStringIndentStartEvent();
    eq(event.handle({ line: ' some text', indentation: 1 }, session, state), true);
  });

  it('should not recognise text that is not indented', () => {
    const event = new DocStringIndentStartEvent();
    eq(event.handle({ line: 'some text', indentation: 0 }, session, state), false);
  });

  it('should not recognise indented DocStrings when already handling a DocString', () => {
    session.docString = {};
    const event = new DocStringIndentStartEvent();
    eq(event.handle({ line: ' some text', indentation: 1 }, session, state), false);
  });

  it('should handle indented DocStrings', () => {
    const event = new DocStringIndentStartEvent();

    event.handle({ line: '   some text   ', indentation: 3 }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringIndentStartEvent');
    eq(state.events[0].source.line, '   some text   ');
    eq(session.docString.indentation, 3);
  });
});
