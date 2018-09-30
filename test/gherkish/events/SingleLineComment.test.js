const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { SingleLineCommentEvent } = Events;

describe('SingleLineCommentEvent', () => {

  class StubMachine {
    constructor() {
      this.events = [];
    }
    onSingleLineComment(event) {
      this.events.push(event);
    }
  }

  it('should recognise single line comments', () => {
    const event = new SingleLineCommentEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: '# Some comment'}, session)).toBe(true);
    expect(event.test({ line: ' # Some comment'}, session)).toBe(true);
    expect(event.test({ line: '#'}, session)).toBe(true);
    expect(event.test({ line: '## Some comment'}, session)).toBe(true);

    expect(event.test({ line: 'No commment'}, session)).toBe(false);
  });

  it('should handle single line comments', () => {
    const event = new SingleLineCommentEvent();
    const session = {
      language: Languages.utils.getDefault(),
      machine: new StubMachine(),
    };
    event.handle({ line: '# Some comment '}, session);
    expect(session.machine.events.length).toBe(1);

    expect(session.machine.events[0].name).toBe('single_line_comment');
    expect(session.machine.events[0].source.line).toBe('# Some comment ');
    expect(session.machine.events[0].data.text).toBe('Some comment');
  });

});
