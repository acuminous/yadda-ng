const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States } = Gherkish;
const { CreateFeatureState } = States;

describe('Create Feature State', () => {

  let specification;
  let machine;
  let state;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();

    state = new CreateFeatureState({ specification, machine });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state.onAnnotation(event);
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Background Events', () => {

    it('should transition to CreateBackgroundState on background event', () => {
      const event = makeEvent('background', { title: 'Meh' });
      state.onBackground(event);
      expect(machine.state).toBe('CreateBackgroundState');
    });

    it('should capture backgrounds with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onBackground(makeEvent('background', { title: 'First background' }));

      const exported = specification.export();
      expect(exported.background.annotations.length).toBe(2);
      expect(exported.background.annotations[0].name).toBe('one');
      expect(exported.background.annotations[0].value).toBe('1');
      expect(exported.background.annotations[1].name).toBe('two');
      expect(exported.background.annotations[1].value).toBe('2');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state.onBlankLine(event);
      expect(machine.state).toBe('CreateFeatureState');
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
      expect(() => state.onFeature(event)).toThrow('Feature was unexpected in state: CreateFeatureState on line 1: \'meh\'');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => state.onLanguage(event)).toThrow('Language was unexpected in state: CreateFeatureState on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateMultiLineCommentState', () => {
      state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(machine.state).toBe('CreateMultiLineCommentState');
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
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[0].title).toBe('First scenario');
      expect(exported.scenarios[1].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state.onScenario(makeEvent('scenario', { title: 'First scenario' }));

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
      const event = makeEvent('single_line_comment', { text: 'Meh' });
      state.onSingleLineComment(event);
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Step Events', () => {

    // Features don't support steps, but feature descriptions might match the step regex

    it('should not cause transition', () => {
      const event = makeEvent('step', { text: 'Meh' });
      state.onStep(event);
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture description', () => {
      state.onStep(makeEvent('step', { text: 'meh' }));
      state.onStep(makeEvent('step', { text: 'bah' }));

      const exported = specification.export();
      expect(exported.description).toBe('meh\nbah');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text', { text: 'Meh' });
      state.onText(event);
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture description', () => {
      state.onText(makeEvent('text', { text: 'meh' }));
      state.onText(makeEvent('text', { text: 'bah' }));

      const exported = specification.export();
      expect(exported.description).toBe('meh\nbah');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
