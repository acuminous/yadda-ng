const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { DocStringEvent } = Events;

describe('DocStringEvent', () => {
  let session;
  let state;

  beforeEach(() => {
    session = {
      language: Languages.utils.getDefault(),
      docString: {
        indentation: 3,
      },
    };
    state = new StubState();
  });

  class StubState {
    constructor() {
      this.events = [];
    }
    onDocString(event) {
      this.events.push(event);
    }
  }

  it('should recognise DocStrings', () => {
    const event = new DocStringEvent();
    eq(event.handle({ line: 'Some text' }, session, state), true);
    eq(event.handle({ line: ' some text ' }, session, state), true);
  });

  it('should handle DocStrings', () => {
    const event = new DocStringEvent();
    event.handle({ line: '   Some text   ', indentation: 3 }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'DocStringEvent');
    eq(state.events[0].source.line, '   Some text   ');
  });
});
