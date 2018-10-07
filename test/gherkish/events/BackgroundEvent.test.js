const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BackgroundEvent } = Events;

describe('BackgroundEvent', () => {

  class StubState {
    constructor() {
      this.events = [];
    }
    onBackground(event) {
      this.events.push(event);
    }
  }

  it('should recognise backgrounds', () => {
    const event = new BackgroundEvent();
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: 'background: Some background'}, session)).toBe(true);
    expect(event.test({ line: 'Background: Some background'}, session)).toBe(true);
    expect(event.test({ line: '  Background  : Some background  '}, session)).toBe(true);
    expect(event.test({ line: 'Background  :'}, session)).toBe(true);

    expect(event.test({ line: 'Background'}, session)).toBe(false);
  });

  it('should recognise localised backgrounds', () => {
    const event = new BackgroundEvent();
    const session = { language: Languages.utils.get('Pirate') };
    expect(event.test({ line: 'aftground: Some background'}, session)).toBe(true);
    expect(event.test({ line: 'Aftground: Some background'}, session)).toBe(true);
    expect(event.test({ line: '  Aftground  : Some background  '}, session)).toBe(true);
    expect(event.test({ line: 'Aftground  :'}, session)).toBe(true);

    expect(event.test({ line: 'Aftground'}, session)).toBe(false);
  });

  it('should handle backgrounds', () => {
    const event = new BackgroundEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: 'Background:  Some background '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('background');
    expect(state.events[0].source.line).toBe('Background:  Some background ');
    expect(state.events[0].data.title).toBe('Some background');
  });

});
