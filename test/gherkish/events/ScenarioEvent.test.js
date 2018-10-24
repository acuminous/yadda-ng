const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { ScenarioEvent } = Events;

describe('ScenarioEvent', () => {

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
    onScenario(event) {
      this.events.push(event);
    }
  }

  it('should recognise scenarios', () => {
    const event = new ScenarioEvent();
    expect(event.handle({ line: 'scenario: Some scenario' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Scenario: Some scenario' }, session, state)).toBe(true);
    expect(event.handle({ line: '  Scenario  : Some scenario  ' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Scenario  :' }, session, state)).toBe(true);

    expect(event.handle({ line: 'Scenario' }, session, state)).toBe(false);
  });


  it('should recognise localised scenarios', () => {
    const event = new ScenarioEvent();
    const session = { language: Languages.utils.get('Pirate') };

    expect(event.handle({ line: 'sortie: Some scenario' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Sortie: Some scenario' }, session, state)).toBe(true);
    expect(event.handle({ line: '  Sortie  : Some scenario  ' }, session, state)).toBe(true);
    expect(event.handle({ line: 'Sortie  :' }, session, state)).toBe(true);

    expect(event.handle({ line: 'Scenario' }, session, state)).toBe(false);
  });

  it('should handle scenarios', () => {
    const event = new ScenarioEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: 'Scenario:  Some scenario ' }, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('ScenarioEvent');
    expect(state.events[0].source.line).toBe('Scenario:  Some scenario ');
    expect(state.events[0].data.title).toBe('Some scenario');
  });

});
