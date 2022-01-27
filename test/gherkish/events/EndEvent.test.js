const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { EndEvent } = Events;

describe('EndEvent', () => {
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
    onEnd(event) {
      this.events.push(event);
    }
  }

  it('should recognise end of specification', () => {
    const event = new EndEvent();
    eq(event.handle({ line: '\u0000' }, session, state), true);

    eq(event.handle({ line: ' \u0000' }, session, state), false);
    eq(event.handle({ line: '\u0000 ' }, session, state), false);
  });

  it('should handle end of specification', () => {
    const event = new EndEvent();

    event.handle({ line: '\u0000' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'EndEvent');
    eq(state.events[0].source.line, '\u0000');
    deq(state.events[0].data, {});
  });
});
