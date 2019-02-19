const expect = require('expect');
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
    expect(event.handle({ line: '---' }, session, state)).toBe(true);
    delete session.docString;
    expect(event.handle({ line: ' --- ' }, session, state)).toBe(true);
    delete session.docString;
    expect(event.handle({ line: ' ------ ' }, session, state)).toBe(true);
    delete session.docString;
    expect(event.handle({ line: '"""' }, session, state)).toBe(true);
    delete session.docString;
    expect(event.handle({ line: ' """ ' }, session, state)).toBe(true);
    delete session.docString;
    expect(event.handle({ line: ' """""" ' }, session, state)).toBe(true);
    delete session.docString;

    expect(event.handle({ line: '-' }, session, state)).toBe(false);
    delete session.docString;
    expect(event.handle({ line: '--' }, session, state)).toBe(false);
    delete session.docString;
    expect(event.handle({ line: '--- not a doc string' }, session, state)).toBe(false);
    delete session.docString;
    expect(event.handle({ line: '"' }, session, state)).toBe(false);
    delete session.docString;
    expect(event.handle({ line: '""' }, session, state)).toBe(false);
    delete session.docString;
    expect(event.handle({ line: '""" not a doc string' }, session, state)).toBe(false);
    delete session.docString;
  });

  it('should not recognise token DocStrings when already handling a DocString', () => {
    session.docString = {};
    const event = new DocStringTokenStartEvent();
    expect(event.handle({ line: '---' }, session, state)).toBe(false);
    expect(event.handle({ line: '"""' }, session, state)).toBe(false);
  });

  it('should handle --- DocStrings', () => {
    const event = new DocStringTokenStartEvent();

    event.handle({ line: '   """   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringTokenStartEvent');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(session.docString.token).toBe('"""');
  });

  it('should handle """ DocStrings', () => {
    const event = new DocStringTokenStartEvent();

    event.handle({ line: '   """   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringTokenStartEvent');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(session.docString.token).toBe('"""');
  });

});
