const expect = require('expect');
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
    expect(event.handle({ line: 'Some step' }, session, state)).toBe(true);
    expect(event.handle({ line: ' Some step ' }, session, state)).toBe(true);
  });

  it('should recognise localised steps', () => {
    const event = new StepEvent();
    const session = { language: Languages.utils.get('English') };

    expect(event.handle({ line: 'Given some step' }, session, state)).toBe(true);
    expect(event.handle({ line: 'When some step' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Then some step' }, session, state)).toBe(true);
    expect(event.handle({ line: 'And some step' }, session, state)).toBe(true);
    expect(event.handle({ line: '  Given some step  ' }, session, state)).toBe(true);
  });

  it('should recognise unlocalised steps', () => {
    const event = new StepEvent();

    expect(event.handle({ line: 'Some text' }, session, state)).toBe(true);
    expect(event.handle({ line: ' Some text ' }, session, state)).toBe(true);
  });

  it('should handle localised steps', () => {
    const event = new StepEvent();
    const session = { language: Languages.utils.get('English') };

    event.handle({ line: ' Given some step  ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('StepEvent');
    expect(state.events[0].source.line).toBe(' Given some step  ');
    expect(state.events[0].data.text).toBe('Given some step');
    expect(state.events[0].data.generalised).toBe('some step');
  });

  it('should handle unlocalised steps', () => {
    const event = new StepEvent();

    event.handle({ line: '  Some step  ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('StepEvent');
    expect(state.events[0].source.line).toBe('  Some step  ');
    expect(state.events[0].data.text).toBe('Some step');
  });
});
