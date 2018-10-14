const expect = require('expect');
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
    expect(event.handle({ line: '#Language:Pirate'}, session, state)).toBe(true);
    expect(event.handle({ line: '#Language : Pirate'}, session, state)).toBe(true);
    expect(event.handle({ line: '# Language : Pirate '}, session, state)).toBe(true);
    expect(event.handle({ line: '#language:Pirate'}, session, state)).toBe(true);

    expect(event.handle({ line: 'Language'}, session, state)).toBe(false);
  });

  it('should handle languages', () => {
    const event = new LanguageEvent();

    event.handle({ line: '#Language : Pirate '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('language');
    expect(state.events[0].source.line).toBe('#Language : Pirate ');
    expect(state.events[0].data.name).toBe('Pirate');
  });

});
