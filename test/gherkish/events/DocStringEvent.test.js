const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringEvent } = Events;

describe('DocStringEvent', () => {

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
    onDocString(event) {
      this.events.push(event);
    }
  }

  it('should recognise delimited DocStrings', () => {
    const event = new DocStringEvent();
    expect(event.handle({ line: '---'}, session, state)).toBe(true);
    expect(event.handle({ line: ' --- '}, session, state)).toBe(true);
    expect(event.handle({ line: ' ------ '}, session, state)).toBe(true);
    expect(event.handle({ line: '"""'}, session, state)).toBe(true);
    expect(event.handle({ line: ' """ '}, session, state)).toBe(true);
    expect(event.handle({ line: ' """""" '}, session, state)).toBe(true);

    expect(event.handle({ line: '-'}, session, state)).toBe(false);
    expect(event.handle({ line: '--'}, session, state)).toBe(false);
    expect(event.handle({ line: '--- not a doc string'}, session, state)).toBe(false);
    expect(event.handle({ line: '"'}, session, state)).toBe(false);
    expect(event.handle({ line: '""'}, session, state)).toBe(false);
    expect(event.handle({ line: '""" not a doc string'}, session, state)).toBe(false);
  });

  it('should handle --- DocStrings', () => {
    const event = new DocStringEvent();
    event.handle({ line: '   ---   '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocString');
    expect(state.events[0].source.line).toBe('   ---   ');
    expect(state.events[0].data.token).toBe('---');
  });

  it('should handle DocStrings', () => {
    const event = new DocStringEvent();

    event.handle({ line: '   """   '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocString');
    expect(state.events[0].source.line).toBe('   """   ');
    expect(state.events[0].data.token).toBe('"""');
  });

});
