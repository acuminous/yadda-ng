const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {
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
    onBlankLine(event) {
      this.events.push(event);
    }
  }

  it('should recognise blank lines', () => {
    const event = new BlankLineEvent();
    eq(event.handle({ line: '' }, session, state), true);
    eq(event.handle({ line: '   ' }, session, state), true);

    eq(event.handle({ line: 'Not Blank' }, session, state), false);
  });

  it('should handle blank lines', () => {
    const event = new BlankLineEvent();

    event.handle({ line: '' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'BlankLineEvent');
    eq(state.events[0].source.line, '');
    deq(state.events[0].data, {});
  });
});
