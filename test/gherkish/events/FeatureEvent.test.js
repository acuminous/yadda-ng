const expect = require('expect');
const { Gherkish } = require('../../..');
const { Events, Languages } = Gherkish;
const { FeatureEvent } = Events;

describe('FeatureEvent', () => {

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
    const session = { language: Languages.utils.getDefault() };
    expect(event.test({ line: 'feature: Some feature'}, session)).toBe(true);
    expect(event.test({ line: 'Feature: Some feature'}, session)).toBe(true);
    expect(event.test({ line: '  Feature  : Some feature  '}, session)).toBe(true);
    expect(event.test({ line: 'Feature  :'}, session)).toBe(true);

    expect(event.test({ line: 'Feature'}, session)).toBe(false);
  });

  it('should recognise localised features', () => {
    const event = new FeatureEvent();
    const session = { language: Languages.utils.get('Pirate') };
    expect(event.test({ line: 'yarn: Some feature'}, session)).toBe(true);
    expect(event.test({ line: 'Yarn: Some feature'}, session)).toBe(true);
    expect(event.test({ line: '  Yarn  : Some feature  '}, session)).toBe(true);
    expect(event.test({ line: 'Yarn  :'}, session)).toBe(true);

    expect(event.test({ line: 'Yarn'}, session)).toBe(false);
  });

  it('should handle features', () => {
    const event = new FeatureEvent();
    const session = { language: Languages.utils.getDefault() };
    const state = new StubState();

    event.handle({ line: 'Feature:  Some feature '}, session, state);
    expect(state.events.length).toBe(1);

    expect(state.events[0].name).toBe('feature');
    expect(state.events[0].source.line).toBe('Feature:  Some feature ');
    expect(state.events[0].data.title).toBe('Some feature');
  });

});
