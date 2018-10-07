const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { AnnotationEvent } = Events;

describe('AnnotationEvent', () => {

  class StubState {
    constructor() {
      this.events = [];
    }
    onAnnotation(event) {
      this.events.push(event);
    }
  }

  it('should recognise annotations', () => {
    const event = new AnnotationEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: '@skip'}, session)).toBe(true);
    expect(event.test({ line: '@name=value '}, session)).toBe(true);
    expect(event.test({ line: ' @skip '}, session)).toBe(true);
    expect(event.test({ line: ' @name = value '}, session)).toBe(true);

    expect(event.test({ line: 'skip'}, session)).toBe(false);
    expect(event.test({ line: 'name=value'}, session)).toBe(false);
    expect(event.test({ line: 'email@example.com'}, session)).toBe(false);
  });

  it('should handle simple annotations', () => {
    const event = new AnnotationEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();
    event.handle({ line: '@skip'}, session, state);

    expect(state.events.length).toBe(1);
    expect(state.events[0].name).toBe('annotation');
    expect(state.events[0].source.line).toBe('@skip');
    expect(state.events[0].data.name).toBe('skip');
    expect(state.events[0].data.value).toBe(true);
  });

  it('should handle name/value annotations', () => {
    const event = new AnnotationEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();
    event.handle({ line: '@foo=bar'}, session, state);

    expect(state.events.length).toBe(1);
    expect(state.events[0].name).toBe('annotation');
    expect(state.events[0].source.line).toBe('@foo=bar');
    expect(state.events[0].data.name).toBe('foo');
    expect(state.events[0].data.value).toBe('bar');
  });
});
