const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
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
    eq(event.handle({ line: 'Some text' }, session, state), true);
    eq(event.handle({ line: ' Some text ' }, session, state), true);
  });

  it('should recognise localised text', () => {
    const event = new TextEvent();
    const session = { language: Languages.utils.get('English') };
    eq(event.handle({ line: 'Given some text' }, session, state), true);
    eq(event.handle({ line: 'When some text' }, session, state), true);
    eq(event.handle({ line: 'Then some text' }, session, state), true);
    eq(event.handle({ line: 'And some text' }, session, state), true);
    eq(event.handle({ line: '  Given some text  ' }, session, state), true);
    eq(event.handle({ line: 'Some text' }, session, state), true);
  });

  it('should handle text', () => {
    const event = new TextEvent();

    event.handle({ line: '  Some text  ' }, { ...session, indentation: 0 }, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'TextEvent');
    eq(state.events[0].source.line, '  Some text  ');
    eq(state.events[0].data.text, '  Some text  ');
  });
});
