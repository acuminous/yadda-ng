const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States } = Gherkish;
const { CreateBackgroundState } = States;

describe('Create Background State', () => {

  let specification;
  let machine;
  let state;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateBackgroundState({ specification });

    state = new CreateBackgroundState({ machine, specification });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state.onAnnotation(event);
      expect(machine.state).toBe('CreateBackgroundState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.onBackground(event)).toThrow('Background was unexpected in state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state.onBlankLine(event);
      expect(machine.state).toBe('CreateBackgroundState');
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
      expect(() => state.onFeature(event)).toThrow('Feature was unexpected in state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => state.onLanguage(event)).toThrow('Language was unexpected in state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateMultiLineCommentState', () => {
      state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {

    it('should error on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      expect(() => state.onScenario(event)).toThrow('Scenario was unexpected in state: CreateBackgroundState on line 1: \'meh\'');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'Meh' });
      state.onSingleLineComment(event);
      expect(machine.state).toBe('CreateBackgroundState');
    });
  });

  describe('Step Events', () => {

    it('should transition to CreateBackgroundStepState on step event', () => {
      const event = makeEvent('step');
      state.onStep(event);
      expect(machine.state).toBe('CreateBackgroundStepState');
    });

    it('should capture steps', () => {
      state.onStep(makeEvent('step', { text: 'First step', generalised: 'Generalised first step' }));
      state.onStep(makeEvent('step', { text: 'Second step', generalised: 'Generalised second step' }));

      const exported = specification.export();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[0].text).toBe('First step');
      expect(exported.background.steps[0].generalised).toBe('Generalised first step');
      expect(exported.background.steps[1].text).toBe('Second step');
      expect(exported.background.steps[1].generalised).toBe('Generalised second step');
    });

    it('should capture steps with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onStep(makeEvent('step', { text: 'First step' }));
      state.onStep(makeEvent('step', { text: 'Second step' }));

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
      state.onText(event);
      expect(machine.state).toBe('CreateBackgroundStepState');
    });

    it('should capture steps', () => {
      state.onText(makeEvent('text', { text: 'First step' }));
      state.onText(makeEvent('text', { text: 'Second step' }));

      const exported = specification.export();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[0].text).toBe('First step');
      expect(exported.background.steps[0].generalised).toBe('First step');
      expect(exported.background.steps[1].text).toBe('Second step');
      expect(exported.background.steps[1].generalised).toBe('Second step');
    });

    it('should capture steps with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onText(makeEvent('text', { text: 'First step' }));

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
