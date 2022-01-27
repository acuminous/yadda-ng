const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BackgroundEvent } = Events;

describe('BackgroundEvent', () => {
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
    onBackground(event) {
      this.events.push(event);
    }
  }

  it('should recognise backgrounds', () => {
    const event = new BackgroundEvent();
    eq(event.handle({ line: 'background: Some background' }, session, state), true);
    eq(event.handle({ line: 'Background: Some background' }, session, state), true);
    eq(event.handle({ line: '  Background  : Some background  ' }, session, state), true);
    eq(event.handle({ line: 'Background  :' }, session, state), true);

    eq(event.handle({ line: 'Background' }, session, state), false);
  });

  it('should recognise localised backgrounds', () => {
    const event = new BackgroundEvent();
    session = { language: Languages.utils.get('Pirate') };

    eq(event.handle({ line: 'Lore: Some background' }, session, state), true);
    eq(event.handle({ line: 'Lore: Some background' }, session, state), true);
    eq(event.handle({ line: '  Lore  : Some background  ' }, session, state), true);
    eq(event.handle({ line: 'Lore  :' }, session, state), true);

    eq(event.handle({ line: 'Lore' }, session, state), false);
  });

  it('should handle backgrounds', () => {
    const event = new BackgroundEvent();

    event.handle({ line: 'Background:  Some background ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'BackgroundEvent');
    eq(state.events[0].source.line, 'Background:  Some background ');
    eq(state.events[0].data.title, 'Some background');
  });
});
