const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
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
    eq(event.handle({ line: '@skip' }, session, state), true);
    eq(event.handle({ line: '@name=value ' }, session, state), true);
    eq(event.handle({ line: ' @skip ' }, session, state), true);
    eq(event.handle({ line: ' @name = value ' }, session, state), true);

    eq(event.handle({ line: 'skip' }, session, state), false);
    eq(event.handle({ line: 'name=value' }, session, state), false);
    eq(event.handle({ line: 'email@example.com' }, session, state), false);
  });

  it('should handle simple annotations', () => {
    const event = new AnnotationEvent();
    event.handle({ line: '@skip' }, session, state);

    eq(state.events.length, 1);
    eq(state.events[0].name, 'AnnotationEvent');
    eq(state.events[0].source.line, '@skip');
    eq(state.events[0].data.name, 'skip');
    eq(state.events[0].data.value, true);
  });

  it('should handle name/value annotations', () => {
    const event = new AnnotationEvent();
    event.handle({ line: '@foo=bar' }, session, state);

    eq(state.events.length, 1);
    eq(state.events[0].name, 'AnnotationEvent');
    eq(state.events[0].source.line, '@foo=bar');
    eq(state.events[0].data.name, 'foo');
    eq(state.events[0].data.value, 'bar');
  });
});
