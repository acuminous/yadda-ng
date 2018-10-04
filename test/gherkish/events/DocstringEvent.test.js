const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocstringEvent } = Events;

describe('DocstringEvent', () => {

  class StubMachine {
    constructor() {
      this.events = [];
    }
    onDocstring(event) {
      this.events.push(event);
    }
  }

  it('should recognise delimited docstrings', () => {
    const event = new DocstringEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: '---'}, session)).toBe(true);
    expect(event.test({ line: ' --- '}, session)).toBe(true);
    expect(event.test({ line: ' ------ '}, session)).toBe(true);
    expect(event.test({ line: '"""'}, session)).toBe(true);
    expect(event.test({ line: ' """ '}, session)).toBe(true);
    expect(event.test({ line: ' """""" '}, session)).toBe(true);

    expect(event.test({ line: '-'}, session)).toBe(false);
    expect(event.test({ line: '--'}, session)).toBe(false);
    expect(event.test({ line: '--- not a doc string'}, session)).toBe(false);
    expect(event.test({ line: '"'}, session)).toBe(false);
    expect(event.test({ line: '""'}, session)).toBe(false);
    expect(event.test({ line: '""" not a doc string'}, session)).toBe(false);
  });

  it('should handle --- docstrings', () => {
    const event = new DocstringEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: '   ---   '}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('docstring');
    expect(session.machine.events[0].source.line).toBe('   ---   ');
    expect(session.machine.events[0].data.token).toBe('---');
  });

  it('should handle docstrings', () => {
    const event = new DocstringEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: '   """   '}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('docstring');
    expect(session.machine.events[0].source.line).toBe('   """   ');
    expect(session.machine.events[0].data.token).toBe('"""');
  });

});
