const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { FeatureEvent } = Events;

describe('FeatureEvent', () => {
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
    onFeature(event) {
      this.events.push(event);
    }
  }

  it('should recognise features', () => {
    const event = new FeatureEvent();
    eq(event.handle({ line: 'feature: Some feature' }, session, state), true);
    eq(event.handle({ line: 'Feature: Some feature' }, session, state), true);
    eq(event.handle({ line: '  Feature  : Some feature  ' }, session, state), true);
    eq(event.handle({ line: 'Feature  :' }, session, state), true);

    eq(event.handle({ line: 'Feature' }, session, state), false);
  });

  it('should recognise localised features', () => {
    const event = new FeatureEvent();
    session = { language: Languages.utils.get('Pirate') };

    eq(event.handle({ line: 'yarn: Some feature' }, session, state), true);
    eq(event.handle({ line: 'Yarn: Some feature' }, session, state), true);
    eq(event.handle({ line: '  Yarn  : Some feature  ' }, session, state), true);
    eq(event.handle({ line: 'Yarn  :' }, session, state), true);

    eq(event.handle({ line: 'Yarn' }, session, state), false);
  });

  it('should handle features', () => {
    const event = new FeatureEvent();

    event.handle({ line: 'Feature:  Some feature ' }, session, state);
    eq(state.events.length, 1);

    eq(state.events[0].name, 'FeatureEvent');
    eq(state.events[0].source.line, 'Feature:  Some feature ');
    eq(state.events[0].data.title, 'Some feature');
  });
});
