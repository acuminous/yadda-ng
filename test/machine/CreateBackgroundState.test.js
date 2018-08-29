const expect = require('expect');
const { Specification, Machine } = require('../..');
const { CreateBackgroundState } =  Machine;

describe('Create Background State', () => {

  let specification;
  let state;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' })
      .createBackground({ annotations: [], title: 'Meh' });
    state = new CreateBackgroundState({ specification });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.onAnnotation(event);
      expect(state.name).toBe('CreateBackgroundState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.onBackground(event)).toThrow('Unexpected event: background from state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.onBlankLine(event);
      expect(state.name).toBe('CreateBackgroundState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => state.onEnd(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should error', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => state.onFeature(event)).toThrow('Unexpected event: feature from state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateCommentState and back', () => {
      state = state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(state.name).toBe('CreateCommentState');

      state = state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(state.name).toBe('CreateBackgroundState');
    });
  });

  describe('Scenario Events', () => {

    it('should error on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      expect(() => state.onScenario(event)).toThrow('Unexpected event: scenario from state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'Meh' });
      state = state.onSingleLineComment(event);
      expect(state.name).toBe('CreateBackgroundState');
    });
  });

  describe('Step Events', () => {

    it('should transition to CreateStepState on step event', () => {
      const event = makeEvent('step');
      state = state.onStep(event);
      expect(state.name).toBe('CreateStepState');
    });

    it('should capture steps', () => {
      state = state.onStep(makeEvent('step', { statement: 'First step', generalised: 'Generalised first step' }));
      state = state.onStep(makeEvent('step', { statement: 'Second step', generalised: 'Generalised second step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onStep(makeEvent('step', { statement: 'Third step', generalised: 'Generalised third step' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(3);
      expect(exported.scenarios[0].steps[0].statement).toBe('First step');
      expect(exported.scenarios[0].steps[0].generalised).toBe('Generalised first step');
      expect(exported.scenarios[0].steps[1].statement).toBe('Second step');
      expect(exported.scenarios[0].steps[1].generalised).toBe('Generalised second step');
      expect(exported.scenarios[0].steps[2].statement).toBe('Third step');
      expect(exported.scenarios[0].steps[2].generalised).toBe('Generalised third step');
    });

    it('should capture steps with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onStep(makeEvent('step', { statement: 'First step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onStep(makeEvent('step', { statement: 'Second step' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[0].annotations[1].value).toBe('2');
    });

  });

  describe('Text Events', () => {

    it('should not transition on text event', () => {
      const event = makeEvent('text');
      state = state.onText(event);
      expect(state.name).toBe('CreateBackgroundState');
    });

    // Need to make background explicit in the json Specification rather than merging with scenarios
    xit('should capture description', () => {
      state = state.onText(makeEvent('text', { text: 'First line' }));
      state = state.onText(makeEvent('text', { text: 'Second line' }));
      state = state.onStep(makeEvent('step', { statement: 'Some step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'Some scenario' }));

      const exported = specification.export();
      expect(exported.scenarios[0].description).toBe('First step\nSecond line');
    });

  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
