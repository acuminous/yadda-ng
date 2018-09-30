const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { LanguageEvent } = Events;

describe('LanguageEvent', () => {

  class StubMachine {
    constructor() {
      this.events = [];
    }
    onLanguage(event) {
      this.events.push(event);
    }
  }

  it('should recognise languages', () => {
    const event = new LanguageEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: '#Language:Pirate'}, session)).toBe(true);
    expect(event.test({ line: '#Language : Pirate'}, session)).toBe(true);
    expect(event.test({ line: '# Language : Pirate '}, session)).toBe(true);
    expect(event.test({ line: '#language:Pirate'}, session)).toBe(true);

    expect(event.test({ line: 'Language'}, session)).toBe(false);
  });

  it('should handle languages', () => {
    const event = new LanguageEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: '#Language : Pirate '}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('language');
    expect(session.machine.events[0].source.line).toBe('#Language : Pirate ');
    expect(session.machine.events[0].data.name).toBe('Pirate');
  });

});
