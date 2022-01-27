const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { UnexpectedEvent } = Events;

describe('UnexpectedEvent', () => {
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
    onUnexpectedEvent(event) {
      this.events.push(event);
    }
  }

  it('should recognise anything', () => {
    const event = new UnexpectedEvent();
    eq(event.handle({ line: 'anything' }, session, state), true);
  });

  it('should handle anything', () => {
    const event = new UnexpectedEvent();

    event.handle({ line: 'anything' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'UnexpectedEvent');
    eq(state.events[0].source.line, 'anything');
    deq(state.events[0].data, {});
  });
});
