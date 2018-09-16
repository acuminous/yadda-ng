const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Background Step State', () => {

  let specification;
  let state;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' })
      .createBackground({ annotations: [], title: 'Meh' })
      .createBackgroundStep({ annotations: [], text: 'Meh' });

    const machine = new StateMachine({ specification });
    state = machine.toCreateBackgroundStepState();
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.onAnnotation(event);
      expect(state.name).toBe('CreateBackgroundStepState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.onBackground(event)).toThrow('Background was unexpected while parsing background step on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.onBlankLine(event);
      expect(state.name).toBe('CreateBackgroundStepState');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      const event = { name: 'end' };
      state = state.onEnd(event);
      expect(state.name).toBe('FinalState');
    });
  });

  describe('Feature Events', () => {

    it('should error on feature event', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => state.onFeature(event)).toThrow('Feature was unexpected while parsing background step on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateCommentState and back', () => {
      state = state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(state.name).toBe('CreateCommentState');

      state = state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(state.name).toBe('CreateBackgroundStepState');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => state.onLanguage(event)).toThrow('Language was unexpected while parsing background step on line 1: \'meh\'');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to CreateScenarioState on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      state = state.onScenario(event);
      expect(state.name).toBe('CreateScenarioState');
    });

    it('should capture scenarios', () => {
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onStep(makeEvent('step', { text: 'meh' }));

      const exported = specification.export();
      expect(exported.scenarios.length).toBe(1);
      expect(exported.scenarios[0].title).toBe('First scenario');
    });

    it('should capture scenarios with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));

      const exported = specification.export();
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
      state = state.onSingleLineComment(event);
      expect(state.name).toBe('CreateBackgroundStepState');
    });
  });

  describe('Step Events', () => {

    it('should transition to new CreateBackgroundStepState on step event', () => {
      const event = makeEvent('step');
      const newState = state.onStep(event);
      expect(newState).not.toBe(state);
      expect(state.name).toBe('CreateBackgroundStepState');
    });

    it('should capture step', () => {
      state = state.onStep(makeEvent('step', { text: 'Bah', generalised: 'bah' }));

      const exported = specification.export();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[0].text).toBe('Meh');
      expect(exported.background.steps[1].text).toBe('Bah');
      expect(exported.background.steps[1].generalised).toBe('bah');
    });

    it('should capture steps with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onStep(makeEvent('step', { text: 'Bah' }));

      const exported = specification.export();
      expect(exported.background.steps[1].annotations.length).toBe(2);
      expect(exported.background.steps[1].annotations[0].name).toBe('one');
      expect(exported.background.steps[1].annotations[0].value).toBe('1');
      expect(exported.background.steps[1].annotations[1].name).toBe('two');
      expect(exported.background.steps[1].annotations[1].value).toBe('2');
    });
  });

  describe('Text Events', () => {

    it('should transition to new CreateBackgroundStepState on text event', () => {
      const event = makeEvent('text');
      const newState = state.onText(event);
      expect(newState).not.toBe(state);
      expect(state.name).toBe('CreateBackgroundStepState');
    });

    it('should capture step', () => {
      state = state.onText(makeEvent('text', { text: 'Bah', generalised: 'bah' }));

      const exported = specification.export();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[0].text).toBe('Meh');
      expect(exported.background.steps[1].text).toBe('Bah');
      expect(exported.background.steps[1].generalised).toBe('bah');
    });

    it('should capture steps with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onText(makeEvent('text', { text: 'Bah' }));

      const exported = specification.export();
      expect(exported.background.steps[1].annotations.length).toBe(2);
      expect(exported.background.steps[1].annotations[0].name).toBe('one');
      expect(exported.background.steps[1].annotations[0].value).toBe('1');
      expect(exported.background.steps[1].annotations[1].name).toBe('two');
      expect(exported.background.steps[1].annotations[1].value).toBe('2');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
