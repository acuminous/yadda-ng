const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Scenario Step State', () => {

  let specification;
  let machine;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' })
      .createScenario({ annotations: [], title: 'Meh' })
      .createScenarioStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateScenarioStepState({ indentation: 0 });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      machine.onAnnotation(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => machine.onBackground(event)).toThrow('Background was unexpected while parsing step on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      machine.onBlankLine(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      const event = { name: 'end' };
      machine.onEnd(event);
      expect(machine.state).toBe('FinalState');
    });
  });

  describe('Feature Events', () => {

    it('should error on feature event', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => machine.onFeature(event)).toThrow('Feature was unexpected while parsing step on line 1: \'meh\'');
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
      expect(() => machine.onLanguage(event)).toThrow('Language was unexpected while parsing step on line 1: \'meh\'');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to CreateScenarioState on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      machine.onScenario(event);
      expect(machine.state).toBe('CreateScenarioState');
    });

    it('should capture scenarios', () => {
      machine.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      machine.onStep(makeEvent('step', { text: 'meh' }));
      machine.onScenario(makeEvent('scenario', { title: 'Second scenario' }));

      const exported = specification.export();
      expect(exported.scenarios.length).toBe(3);
      expect(exported.scenarios[0].title).toBe('Meh');
      expect(exported.scenarios[1].title).toBe('First scenario');
      expect(exported.scenarios[2].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onScenario(makeEvent('scenario', { title: 'First scenario' }));

      const exported = specification.export();
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[1].annotations.length).toBe(2);
      expect(exported.scenarios[1].annotations[0].name).toBe('one');
      expect(exported.scenarios[1].annotations[0].value).toBe('1');
      expect(exported.scenarios[1].annotations[1].name).toBe('two');
      expect(exported.scenarios[1].annotations[1].value).toBe('2');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'Meh' });
      machine.onSingleLineComment(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });
  });

  describe('Step Events', () => {

    it('should transition to CreateScenarioStepState on step event', () => {
      const event = makeEvent('step');
      machine.onStep(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture step', () => {
      machine.onStep(makeEvent('step', { text: 'Bah', generalised: 'bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('Meh');
      expect(exported.scenarios[0].steps[1].text).toBe('Bah');
      expect(exported.scenarios[0].steps[1].generalised).toBe('bah');
    });

    it('should capture steps with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onStep(makeEvent('step', { text: 'Bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps[1].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[1].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[1].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[1].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[1].annotations[1].value).toBe('2');
    });
  });

  describe('Text Events', () => {

    it('should transition to CreateScenarioStepState on text event', () => {
      const event = makeEvent('text');
      machine.onText(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture step', () => {
      machine.onText(makeEvent('text', { text: 'Bah', generalised: 'bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('Meh');
      expect(exported.scenarios[0].steps[1].text).toBe('Bah');
      expect(exported.scenarios[0].steps[1].generalised).toBe('bah');
    });

    it('should capture steps with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onText(makeEvent('text', { text: 'Bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps[1].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[1].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[1].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[1].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[1].annotations[1].value).toBe('2');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
