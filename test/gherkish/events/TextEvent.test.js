const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { TextEvent } = Events;

describe('TextEvent', () => {

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
    onText(event) {
      this.events.push(event);
    }
  }

  it('should recognise text', () => {
    const event = new TextEvent();
    expect(event.handle({ line: 'Some text'}, session, state)).toBe(true);
    expect(event.handle({ line: ' Some text '}, session, state)).toBe(true);
  });

  it('should recognise localised text', () => {
    const event = new TextEvent();
    const session = { language: Languages.utils.get('English') };
    expect(event.handle({ line: 'Given some text'}, session, state)).toBe(true);
    expect(event.handle({ line: 'When some text'}, session, state)).toBe(true);
    expect(event.handle({ line: 'Then some text'}, session, state)).toBe(true);
    expect(event.handle({ line: 'And some text'}, session, state)).toBe(true);
    expect(event.handle({ line: '  Given some text  '}, session, state)).toBe(true);
    expect(event.handle({ line: 'Some text'}, session, state)).toBe(true);
  });

  it('should handle text', () => {
    const event = new TextEvent();

    event.handle({ line: '  Some text  '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('text');
    expect(state.events[0].source.line).toBe('  Some text  ');
    expect(state.events[0].data.text).toBe('Some text');
  });

});
