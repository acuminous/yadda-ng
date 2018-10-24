const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { AnnotationEvent } = Events;

describe('AnnotationEvent', () => {

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
    onAnnotation(event) {
      this.events.push(event);
    }
  }

  it('should recognise annotations', () => {
    const event = new AnnotationEvent();
    expect(event.handle({ line: '@skip' }, session, state)).toBe(true);
    expect(event.handle({ line: '@name=value ' }, session, state)).toBe(true);
    expect(event.handle({ line: ' @skip ' }, session, state)).toBe(true);
    expect(event.handle({ line: ' @name = value ' }, session, state)).toBe(true);

    expect(event.handle({ line: 'skip' }, session, state)).toBe(false);
    expect(event.handle({ line: 'name=value' }, session, state)).toBe(false);
    expect(event.handle({ line: 'email@example.com' }, session, state)).toBe(false);
  });

  it('should handle simple annotations', () => {
    const event = new AnnotationEvent();
    event.handle({ line: '@skip' }, session, state);

    expect(state.events.length).toBe(1);
    expect(state.events[0].name).toBe('AnnotationEvent');
    expect(state.events[0].source.line).toBe('@skip');
    expect(state.events[0].data.name).toBe('skip');
    expect(state.events[0].data.value).toBe(true);
  });

  it('should handle name/value annotations', () => {
    const event = new AnnotationEvent();
    event.handle({ line: '@foo=bar' }, session, state);

    expect(state.events.length).toBe(1);
    expect(state.events[0].name).toBe('AnnotationEvent');
    expect(state.events[0].source.line).toBe('@foo=bar');
    expect(state.events[0].data.name).toBe('foo');
    expect(state.events[0].data.value).toBe('bar');
  });
});
