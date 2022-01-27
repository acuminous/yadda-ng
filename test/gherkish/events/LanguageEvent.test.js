const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { LanguageEvent } = Events;

describe('LanguageEvent', () => {
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
    onLanguage(event) {
      this.events.push(event);
    }
  }

  it('should recognise languages', () => {
    const event = new LanguageEvent();
    eq(event.handle({ line: '#Language:Pirate' }, session, state), true);
    eq(event.handle({ line: '#Language : Pirate' }, session, state), true);
    eq(event.handle({ line: '# Language : Pirate ' }, session, state), true);
    eq(event.handle({ line: '#language:Pirate' }, session, state), true);

    eq(event.handle({ line: 'Language' }, session, state), false);
  });

  it('should handle languages', () => {
    const event = new LanguageEvent();

    event.handle({ line: '#Language : Pirate ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'LanguageEvent');
    eq(state.events[0].source.line, '#Language : Pirate ');
    eq(state.events[0].data.name, 'Pirate');
  });
});
