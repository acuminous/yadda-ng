const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
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
    eq(event.handle({ line: 'scenario: Some scenario' }, session, state), true);
    eq(event.handle({ line: 'Scenario: Some scenario' }, session, state), true);
    eq(event.handle({ line: '  Scenario  : Some scenario  ' }, session, state), true);
    eq(event.handle({ line: 'Scenario  :' }, session, state), true);

    eq(event.handle({ line: 'Scenario' }, session, state), false);
  });

  it('should recognise localised scenarios', () => {
    const event = new ScenarioEvent();
    const session = { language: Languages.utils.get('Pirate') };

    eq(event.handle({ line: 'sortie: Some scenario' }, session, state), true);
    eq(event.handle({ line: 'Sortie: Some scenario' }, session, state), true);
    eq(event.handle({ line: '  Sortie  : Some scenario  ' }, session, state), true);
    eq(event.handle({ line: 'Sortie  :' }, session, state), true);

    eq(event.handle({ line: 'Scenario' }, session, state), false);
  });

  it('should handle scenarios', () => {
    const event = new ScenarioEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: 'Scenario:  Some scenario ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'ScenarioEvent');
    eq(state.events[0].source.line, 'Scenario:  Some scenario ');
    eq(state.events[0].data.title, 'Some scenario');
  });
});
