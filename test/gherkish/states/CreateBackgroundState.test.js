const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Background State', () => {

  let state;
  let specification;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' })
      .createBackground({ annotations: [], title: 'Meh' });
    const machine = new StateMachine({ specification });
    state = machine.toCreateBackgroundState({ specification, machine });
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
      expect(() => state.onBackground(event)).toThrow('Background was unexpected while parsing background on line 1: \'meh\'');
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
      expect(() => state.onFeature(event)).toThrow('Feature was unexpected while parsing background on line 1: \'meh\'');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => state.onLanguage(event)).toThrow('Language was unexpected while parsing background on line 1: \'meh\'');
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
      expect(() => state.onScenario(event)).toThrow('Scenario was unexpected while parsing background on line 1: \'meh\'');
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

    it('should transition to CreateBackgroundStepState on step event', () => {
      const event = makeEvent('step');
      state = state.onStep(event);
      expect(state.name).toBe('CreateBackgroundStepState');
    });

    it('should capture steps', () => {
      state = state.onStep(makeEvent('step', { text: 'First step', generalised: 'Generalised first step' }));
      state = state.onStep(makeEvent('step', { text: 'Second step', generalised: 'Generalised second step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onStep(makeEvent('step', { text: 'Third step', generalised: 'Generalised third step' }));

      const exported = specification.export();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[0].text).toBe('First step');
      expect(exported.background.steps[0].generalised).toBe('Generalised first step');
      expect(exported.background.steps[1].text).toBe('Second step');
      expect(exported.background.steps[1].generalised).toBe('Generalised second step');
    });

    it('should capture steps with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onStep(makeEvent('step', { text: 'First step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onStep(makeEvent('step', { text: 'Second step' }));

      const exported = specification.export();
      expect(exported.background.steps[0].annotations.length).toBe(2);
      expect(exported.background.steps[0].annotations[0].name).toBe('one');
      expect(exported.background.steps[0].annotations[0].value).toBe('1');
      expect(exported.background.steps[0].annotations[1].name).toBe('two');
      expect(exported.background.steps[0].annotations[1].value).toBe('2');
    });
  });

  describe('Text Events', () => {

    it('should transition to CreateBackgroundStepState on text event', () => {
      const event = makeEvent('text');
      state = state.onText(event);
      expect(state.name).toBe('CreateBackgroundStepState');
    });

    it('should capture steps', () => {
      state = state.onText(makeEvent('text', { text: 'First step' }));
      state = state.onText(makeEvent('text', { text: 'Second step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onText(makeEvent('text', { text: 'Third step' }));

      const exported = specification.export();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[0].text).toBe('First step');
      expect(exported.background.steps[0].generalised).toBe('First step');
      expect(exported.background.steps[1].text).toBe('Second step');
      expect(exported.background.steps[1].generalised).toBe('Second step');
    });

    it('should capture steps with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onText(makeEvent('text', { text: 'First step' }));
      state = state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state = state.onText(makeEvent('text', { text: 'Second step' }));

      const exported = specification.export();
      expect(exported.background.steps[0].annotations.length).toBe(2);
      expect(exported.background.steps[0].annotations[0].name).toBe('one');
      expect(exported.background.steps[0].annotations[0].value).toBe('1');
      expect(exported.background.steps[0].annotations[1].name).toBe('two');
      expect(exported.background.steps[0].annotations[1].value).toBe('2');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
