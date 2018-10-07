const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { TextEvent } = Events;

describe('TextEvent', () => {

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
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: 'Some text'}, session)).toBe(true);
    expect(event.test({ line: ' Some text '}, session)).toBe(true);
  });

  it('should recognise localised text', () => {
    const event = new TextEvent();
    const session = { language: Languages.utils.get('English') };
    expect(event.test({ line: 'Given some text'}, session)).toBe(true);
    expect(event.test({ line: 'When some text'}, session)).toBe(true);
    expect(event.test({ line: 'Then some text'}, session)).toBe(true);
    expect(event.test({ line: 'And some text'}, session)).toBe(true);
    expect(event.test({ line: '  Given some text  '}, session)).toBe(true);
    expect(event.test({ line: 'Some text'}, session)).toBe(true);
  });

  it('should handle text', () => {
    const event = new TextEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: '  Some text  '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('text');
    expect(state.events[0].source.line).toBe('  Some text  ');
    expect(state.events[0].data.text).toBe('Some text');
  });

});
