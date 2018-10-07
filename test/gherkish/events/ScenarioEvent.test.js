const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { ScenarioEvent } = Events;

describe('ScenarioEvent', () => {

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
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: 'scenario: Some scenario'}, session)).toBe(true);
    expect(event.test({ line: 'Scenario: Some scenario'}, session)).toBe(true);
    expect(event.test({ line: '  Scenario  : Some scenario  '}, session)).toBe(true);
    expect(event.test({ line: 'Scenario  :'}, session)).toBe(true);

    expect(event.test({ line: 'Scenario'}, session)).toBe(false);
  });


  it('should recognise localised scenarios', () => {
    const event = new ScenarioEvent();
    const session = { language: Languages.utils.get('Pirate') };
    expect(event.test({ line: 'sortie: Some scenario'}, session)).toBe(true);
    expect(event.test({ line: 'Sortie: Some scenario'}, session)).toBe(true);
    expect(event.test({ line: '  Sortie  : Some scenario  '}, session)).toBe(true);
    expect(event.test({ line: 'Sortie  :'}, session)).toBe(true);

    expect(event.test({ line: 'Scenario'}, session)).toBe(false);
  });

  it('should handle scenarios', () => {
    const event = new ScenarioEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: 'Scenario:  Some scenario '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('scenario');
    expect(state.events[0].source.line).toBe('Scenario:  Some scenario ');
    expect(state.events[0].data.title).toBe('Some scenario');
  });

});
