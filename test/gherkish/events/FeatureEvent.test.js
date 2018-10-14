const expect = require('expect');
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
    expect(event.handle({ line: 'feature: Some feature'}, session, state)).toBe(true);
    expect(event.handle({ line: 'Feature: Some feature'}, session, state)).toBe(true);
    expect(event.handle({ line: '  Feature  : Some feature  '}, session, state)).toBe(true);
    expect(event.handle({ line: 'Feature  :'}, session, state)).toBe(true);

    expect(event.handle({ line: 'Feature'}, session, state)).toBe(false);
  });

  it('should recognise localised features', () => {
    const event = new FeatureEvent();
    session = { language: Languages.utils.get('Pirate') };

    expect(event.handle({ line: 'yarn: Some feature'}, session, state)).toBe(true);
    expect(event.handle({ line: 'Yarn: Some feature'}, session, state)).toBe(true);
    expect(event.handle({ line: '  Yarn  : Some feature  '}, session, state)).toBe(true);
    expect(event.handle({ line: 'Yarn  :'}, session, state)).toBe(true);

    expect(event.handle({ line: 'Yarn'}, session, state)).toBe(false);
  });

  it('should handle features', () => {
    const event = new FeatureEvent();

    event.handle({ line: 'Feature:  Some feature '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('feature');
    expect(state.events[0].source.line).toBe('Feature:  Some feature ');
    expect(state.events[0].data.title).toBe('Some feature');
  });

});
