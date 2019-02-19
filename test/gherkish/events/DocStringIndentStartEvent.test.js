const expect = require('expect');
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
    expect(event.handle({ line: ' some text', indentation: 1 }, session, state)).toBe(true);
  });

  it('should not recognise text that is not indented', () => {
    const event = new DocStringIndentStartEvent();
    expect(event.handle({ line: 'some text', indentation: 0 }, session, state)).toBe(false);
  });

  it('should not recognise indented DocStrings when already handling a DocString', () => {
    session.docString = {};
    const event = new DocStringIndentStartEvent();
    expect(event.handle({ line: ' some text', indentation: 1 }, session, state)).toBe(false);
  });

  it('should handle indented DocStrings', () => {
    const event = new DocStringIndentStartEvent();

    event.handle({ line: '   some text   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringIndentStartEvent');
    expect(state.events[0].source.line).toBe('   some text   ');
    expect(session.docString.indentation).toBe(3);
  });

});
