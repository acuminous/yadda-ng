const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States } = Gherkish;
const { CreateScenarioStepState } = States;

describe('Create Scenario Step State', () => {

  let specification;
  let machine;
  let state;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });
    specification.createScenario({ annotations: [], title: 'Meh' });
    specification.createScenarioStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateScenarioStepState();

    state = new CreateScenarioStepState({ specification, machine });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state.onAnnotation(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.onBackground(event)).toThrow('Background was unexpected in state: CreateScenarioStepState on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state.onBlankLine(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      const event = { name: 'end' };
      state.onEnd(event);
      expect(machine.state).toBe('FinalState');
    });
  });

  describe('Feature Events', () => {

    it('should error on feature event', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => state.onFeature(event)).toThrow('Feature was unexpected in state: CreateScenarioStepState on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateMultiLineCommentState', () => {
      state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => state.onLanguage(event)).toThrow('Language was unexpected in state: CreateScenarioStepState on line 1: \'meh\'');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to CreateScenarioState on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      state.onScenario(event);
      expect(machine.state).toBe('CreateScenarioState');
    });

    it('should capture scenarios', () => {
      state.onScenario(makeEvent('scenario', { title: 'First scenario' }));
      state.onStep(makeEvent('step', { text: 'meh' }));
      state.onScenario(makeEvent('scenario', { title: 'Second scenario' }));

      const exported = specification.export();
      expect(exported.scenarios.length).toBe(3);
      expect(exported.scenarios[0].title).toBe('Meh');
      expect(exported.scenarios[1].title).toBe('First scenario');
      expect(exported.scenarios[2].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onScenario(makeEvent('scenario', { title: 'First scenario' }));

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
      state.onSingleLineComment(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });
  });

  describe('Step Events', () => {

    it('should transition to CreateScenarioStepState on step event', () => {
      const event = makeEvent('step');
      state.onStep(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture step', () => {
      state.onStep(makeEvent('step', { text: 'Bah', generalised: 'bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('Meh');
      expect(exported.scenarios[0].steps[1].text).toBe('Bah');
      expect(exported.scenarios[0].steps[1].generalised).toBe('bah');
    });

    it('should capture steps with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onStep(makeEvent('step', { text: 'Bah' }));

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
      state.onText(event);
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture step', () => {
      state.onText(makeEvent('text', { text: 'Bah', generalised: 'bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('Meh');
      expect(exported.scenarios[0].steps[1].text).toBe('Bah');
      expect(exported.scenarios[0].steps[1].generalised).toBe('bah');
    });

    it('should capture steps with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onText(makeEvent('text', { text: 'Bah' }));

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
