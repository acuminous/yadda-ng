const expect = require('expect');
const { Parsing } = require('../../..');
const { SpecificationBuilder, States } =  Parsing;
const { CreateBackgroundState } =  States;

describe('Create Background State', () => {

  let specificationBuilder;
  let state;

  beforeEach(() => {
    specificationBuilder = new SpecificationBuilder()
      .createFeature({ annotations: [], title: 'Meh' })
      .createBackground({ annotations: [], title: 'Meh' });
    state = new CreateBackgroundState({ specificationBuilder });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.handle(event);
      expect(state.name).toBe('create_background');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.handle(event)).toThrow('Unexpected event: background on line: 1, \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.handle(event);
      expect(state.name).toBe('create_background');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => state.handle(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should error', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => state.handle(event)).toThrow('Unexpected event: feature on line: 1, \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to create_comment and back', () => {
      state = state.handle(makeEvent('multi_line_comment'));
      expect(state.name).toBe('create_comment');

      state = state.handle(makeEvent('multi_line_comment'));
      expect(state.name).toBe('create_background');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to create_scenario on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      state = state.handle(event);
      expect(state.name).toBe('create_scenario');
    });

    it('should capture scenarios', () => {
      state = state.handle(makeEvent('scenario', { title: 'First scenario' }));
      state = state.handle(makeEvent('text', { text: 'meh' }));
      state = state.handle(makeEvent('scenario', { title: 'Second scenario' }));

      const exported = specificationBuilder.export();
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[0].title).toBe('First scenario');
      expect(exported.scenarios[1].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      state = state.handle(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.handle(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.handle(makeEvent('scenario', { title: 'First scenario' }));

      const exported = specificationBuilder.export();
      expect(exported.scenarios.length).toBe(1);
      expect(exported.scenarios[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].annotations[1].value).toBe('2');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'Meh' });
      state = state.handle(event);
      expect(state.name).toBe('create_background');
    });
  });

  describe('Text Events', () => {

    it('should transition to create_step on text event', () => {
      const event = makeEvent('text');
      state = state.handle(event);
      expect(state.name).toBe('create_step');
    });

    it('should capture steps', () => {
      state = state.handle(makeEvent('text', { text: 'First step' }));
      state = state.handle(makeEvent('text', { text: 'Second step' }));
      state = state.handle(makeEvent('scenario', { title: 'First scenario' }));
      state = state.handle(makeEvent('text', { text: 'Third step' }));

      const exported = specificationBuilder.export();
      expect(exported.scenarios[0].steps.length).toBe(3);
      expect(exported.scenarios[0].steps[0].text).toBe('First step');
      expect(exported.scenarios[0].steps[1].text).toBe('Second step');
      expect(exported.scenarios[0].steps[2].text).toBe('Third step');
    });

    it('should capture steps with annotations', () => {
      state = state.handle(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.handle(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.handle(makeEvent('text', { text: 'First step' }));
      state = state.handle(makeEvent('scenario', { title: 'First scenario' }));
      state = state.handle(makeEvent('text', { text: 'Second step' }));

      const exported = specificationBuilder.export();
      expect(exported.scenarios[0].steps[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[0].annotations[1].value).toBe('2');
    });

  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}