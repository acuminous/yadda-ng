const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringStartEvent } = Events;

describe('DocStringStartEvent', () => {

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
    onDocStringStart(event) {
      this.events.push(event);
    }
  }

  it('should recognise delimited DocStrings', () => {
    const event = new DocStringStartEvent();
    expect(event.handle({ line: '---' }, session, state)).toBe(true);
    expect(event.handle({ line: ' --- ' }, session, state)).toBe(true);
    expect(event.handle({ line: ' ------ ' }, session, state)).toBe(true);
    expect(event.handle({ line: '"""' }, session, state)).toBe(true);
    expect(event.handle({ line: ' """ ' }, session, state)).toBe(true);
    expect(event.handle({ line: ' """""" ' }, session, state)).toBe(true);

    expect(event.handle({ line: '-' }, session, state)).toBe(false);
    expect(event.handle({ line: '--' }, session, state)).toBe(false);
    expect(event.handle({ line: '--- not a doc string' }, session, state)).toBe(false);
    expect(event.handle({ line: '"' }, session, state)).toBe(false);
    expect(event.handle({ line: '""' }, session, state)).toBe(false);
    expect(event.handle({ line: '""" not a doc string' }, session, state)).toBe(false);
  });

  it('should handle --- DocStrings', () => {
    const event = new DocStringStartEvent();
    event.handle({ line: '   ---   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringStart');
    expect(state.events[0].source.line).toBe('   ---   ');
    expect(session.indentation).toBe(3);
    expect(session.docString.token).toBe('---');
  });

  it('should handle DocStrings', () => {
    const event = new DocStringStartEvent();

    event.handle({ line: '   """   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringStart');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(session.indentation).toBe(3);
    expect(session.docString.token).toBe('"""');
  });

});
