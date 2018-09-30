const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { StepEvent } = Events;

describe('StepEvent', () => {

  class StubMachine {
    constructor() {
      this.events = [];
    }
    onStep(event) {
      this.events.push(event);
    }
  }

  it('should recognise steps', () => {
    const event = new StepEvent();
    const session = { language: Languages.utils.get('None') };
    expect(event.test({ line: 'Some step'}, session)).toBe(true);
    expect(event.test({ line: ' Some step '}, session)).toBe(true);
  });

  it('should recognise localised steps', () => {
    const event = new StepEvent();
    const session = { language: Languages.utils.get('English') };
    expect(event.test({ line: 'Given some step'}, session)).toBe(true);
    expect(event.test({ line: 'When some step'}, session)).toBe(true);
    expect(event.test({ line: 'Then some step'}, session)).toBe(true);
    expect(event.test({ line: 'And some step'}, session)).toBe(true);
    expect(event.test({ line: '  Given some step  '}, session)).toBe(true);

    expect(event.test({ line: 'Some step'}, session)).toBe(false);
  });

  it('should handle steps', () => {
    const event = new StepEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: '  Some step  '}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('step');
    expect(session.machine.events[0].source.line).toBe('  Some step  ');
    expect(session.machine.events[0].data.text).toBe('Some step');
  });

});
