const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Scenario State', () => {

  let specification;
  let machine;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' })
      .createScenario({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateScenarioState();
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      machine.onAnnotation(event);
      expect(machine.state).toBe('CreateScenarioState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => machine.onBackground(event)).toThrow('Background was unexpected while parsing scenario on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      machine.onBlankLine(event);
      expect(machine.state).toBe('CreateScenarioState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => machine.onEnd(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should error', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => machine.onFeature(event)).toThrow('Feature was unexpected while parsing scenario on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateCommentState', () => {
      machine.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => machine.onLanguage(event)).toThrow('Language was unexpected while parsing scenario on line 1: \'meh\'');
    });
  });

  describe('Scenario Events', () => {

    it('should error on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      expect(() => machine.onScenario(event)).toThrow('Scenario was unexpected while parsing scenario on line 1: \'meh\'');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'Meh' });
      machine.onSingleLineComment(event);
      expect(machine.state).toBe('CreateScenarioState');
    });
  });

  describe('Step Events', () => {

    it('should transition to CreateScenarioStepState on step event', () => {
      const event = makeEvent('step');
      machine.onStep(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture steps', () => {
      machine.onStep(makeEvent('step', { text: 'First step', generalised: 'Generalised first step' }));
      machine.onStep(makeEvent('step', { text: 'Second step', generalised: 'Generalised second step' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('First step');
      expect(exported.scenarios[0].steps[0].generalised).toBe('Generalised first step');
      expect(exported.scenarios[0].steps[1].text).toBe('Second step');
      expect(exported.scenarios[0].steps[1].generalised).toBe('Generalised second step');
    });

    it('should capture steps with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onStep(makeEvent('step', { text: 'First step' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[0].annotations[1].value).toBe('2');
    });
  });

  describe('Text Events', () => {

    it('should transition to CreateScenarioStepState on text event', () => {
      const event = makeEvent('text');
      machine.onText(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture steps', () => {
      machine.onText(makeEvent('text', { text: 'First step' }));
      machine.onText(makeEvent('text', { text: 'Second step' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('First step');
      expect(exported.scenarios[0].steps[0].generalised).toBe('First step');
      expect(exported.scenarios[0].steps[1].text).toBe('Second step');
      expect(exported.scenarios[0].steps[1].generalised).toBe('Second step');
    });

    it('should capture steps with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onText(makeEvent('text', { text: 'First step' }));

      const exported = specification.export();
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
