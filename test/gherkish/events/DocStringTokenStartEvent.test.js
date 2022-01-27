const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringTokenStartEvent } = Events;

describe('DocStringTokenStartEvent', () => {
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
    onDocStringTokenStart(event) {
      this.events.push(event);
    }
  }

  it('should recognise token DocStrings', () => {
    const event = new DocStringTokenStartEvent();
    eq(event.handle({ line: '---' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' --- ' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' ------ ' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: '"""' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' """ ' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' """""" ' }, session, state), true);
    delete session.docString;

    eq(event.handle({ line: '-' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '--' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '--- not a doc string' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '"' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '""' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '""" not a doc string' }, session, state), false);
    delete session.docString;
  });

  it('should not recognise token DocStrings when already handling a DocString', () => {
    session.docString = {};
    const event = new DocStringTokenStartEvent();
    eq(event.handle({ line: '---' }, session, state), false);
    eq(event.handle({ line: '"""' }, session, state), false);
  });

  it('should handle --- DocStrings', () => {
    const event = new DocStringTokenStartEvent();

    event.handle({ line: '   """   ', indentation: 3 }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringTokenStartEvent');
    eq(state.events[0].source.line, '   """   ');
    eq(session.docString.token, '"""');
  });

  it('should handle """ DocStrings', () => {
    const event = new DocStringTokenStartEvent();

    event.handle({ line: '   """   ', indentation: 3 }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringTokenStartEvent');
    eq(state.events[0].source.line, '   """   ');
    eq(session.docString.token, '"""');
  });
});
