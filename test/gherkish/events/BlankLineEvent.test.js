const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {

  class StubMachine {
    constructor() {
      this.events = [];
    }
    onBlankLine(event) {
      this.events.push(event);
    }
  }

  it('should recognise blank lines', () => {
    const event = new BlankLineEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: ''}, session)).toBe(true);
    expect(event.test({ line: '   '}, session)).toBe(true);

    expect(event.test({ line: 'Not Blank'}, session)).toBe(false);
  });

  it('should handle blank lines', () => {
    const event = new BlankLineEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: ''}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('blank_line');
    expect(session.machine.events[0].source.line).toBe('');
    expect(session.machine.events[0].data).toEqual({});
  });

});
