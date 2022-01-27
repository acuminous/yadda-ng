const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { StepEvent } = Events;

describe('StepEvent', () => {
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
    onStep(event) {
      this.events.push(event);
    }
  }

  it('should recognise steps', () => {
    const event = new StepEvent();
    eq(event.handle({ line: 'Some step' }, session, state), true);
    eq(event.handle({ line: ' Some step ' }, session, state), true);
  });

  it('should recognise localised steps', () => {
    const event = new StepEvent();
    const session = { language: Languages.utils.get('English') };

    eq(event.handle({ line: 'Given some step' }, session, state), true);
    eq(event.handle({ line: 'When some step' }, session, state), true);
    eq(event.handle({ line: 'Then some step' }, session, state), true);
    eq(event.handle({ line: 'And some step' }, session, state), true);
    eq(event.handle({ line: '  Given some step  ' }, session, state), true);
  });

  it('should recognise unlocalised steps', () => {
    const event = new StepEvent();

    eq(event.handle({ line: 'Some text' }, session, state), true);
    eq(event.handle({ line: ' Some text ' }, session, state), true);
  });

  it('should handle localised steps', () => {
    const event = new StepEvent();
    const session = { language: Languages.utils.get('English') };

    event.handle({ line: ' Given some step  ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'StepEvent');
    eq(state.events[0].source.line, ' Given some step  ');
    eq(state.events[0].data.text, 'Given some step');
    eq(state.events[0].data.generalised, 'some step');
  });

  it('should handle unlocalised steps', () => {
    const event = new StepEvent();

    event.handle({ line: '  Some step  ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'StepEvent');
    eq(state.events[0].source.line, '  Some step  ');
    eq(state.events[0].data.text, 'Some step');
  });
});
