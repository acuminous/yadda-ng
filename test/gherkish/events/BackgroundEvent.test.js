const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { BackgroundEvent } = Events;

describe('BackgroundEvent', () => {

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
    onBackground(event) {
      this.events.push(event);
    }
  }

  it('should recognise backgrounds', () => {
    const event = new BackgroundEvent();
    expect(event.handle({ line: 'background: Some background' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Background: Some background' }, session, state)).toBe(true);
    expect(event.handle({ line: '  Background  : Some background  ' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Background  :' }, session, state)).toBe(true);

    expect(event.handle({ line: 'Background' }, session, state)).toBe(false);
  });

  it('should recognise localised backgrounds', () => {
    const event = new BackgroundEvent();
    session = { language: Languages.utils.get('Pirate') };

    expect(event.handle({ line: 'aftground: Some background' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Aftground: Some background' }, session, state)).toBe(true);
    expect(event.handle({ line: '  Aftground  : Some background  ' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Aftground  :' }, session, state)).toBe(true);

    expect(event.handle({ line: 'Aftground' }, session, state)).toBe(false);
  });

  it('should handle backgrounds', () => {
    const event = new BackgroundEvent();

    event.handle({ line: 'Background:  Some background ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('BackgroundEvent');
    expect(state.events[0].source.line).toBe('Background:  Some background ');
    expect(state.events[0].data.title).toBe('Some background');
  });

});
