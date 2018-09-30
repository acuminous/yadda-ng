const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { EndEvent } = Events;

describe('EndEvent', () => {

  class StubMachine {
    constructor() {
      this.events = [];
    }
    onEnd(event) {
      this.events.push(event);
    }
  }

  it('should recognise end of specification', () => {
    const event = new EndEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: '\u0000'}, session)).toBe(true);

    expect(event.test({ line: ' \u0000'}, session)).toBe(false);
    expect(event.test({ line: '\u0000 '}, session)).toBe(false);
  });

  it('should handle end of specification', () => {
    const event = new EndEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: '\u0000'}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('end');
    expect(session.machine.events[0].source.line).toBe('\u0000');
    expect(session.machine.events[0].data).toEqual({});
  });

});
