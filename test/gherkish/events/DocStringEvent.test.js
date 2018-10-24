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

  it('should recogniseDocStrings', () => {
    const event = new DocStringEvent();
    expect(event.handle({ line: 'Some text' }, session, state)).toBe(true);
    expect(event.handle({ line: ' some text ' }, session, state)).toBe(true);
  });

  it('should handle DocStrings', () => {
    const event = new DocStringEvent();
    event.handle({ line: '   Some text   ', indentation: 3 }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('DocStringEvent');
    expect(state.events[0].source.line).toBe('   Some text   ');
  });
});
