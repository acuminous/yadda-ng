const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Feature State', () => {

  let specification;
  let machine;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      machine.onAnnotation(event);
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Background Events', () => {

    it('should transition to CreateBackgroundState on background event', () => {
      const event = makeEvent('background', { title: 'Meh' });
      machine.onBackground(event);
      expect(machine.state).toBe('CreateBackgroundState');
    });

    it('should capture backgrounds with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onBackground(makeEvent('background', { title: 'First background' }));

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
      machine.onBlankLine(event);
      expect(machine.state).toBe('CreateFeatureState');
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
      expect(() => machine.onFeature(event)).toThrow('Feature was unexpected while parsing feature on line 1: \'meh\'');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      const event = makeEvent('language');
      expect(() => machine.onLanguage(event)).toThrow('Language was unexpected while parsing feature on line 1: \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateCommentState', () => {
      machine.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(machine.state).toBe('CreateCommentState');
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
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[0].title).toBe('First scenario');
      expect(exported.scenarios[1].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      machine.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      machine.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      machine.onScenario(makeEvent('scenario', { title: 'First scenario' }));

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
      machine.onSingleLineComment(event);
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Step Events', () => {

    // Features don't support steps, but feature descriptions might match the step regex

    it('should not cause transition', () => {
      const event = makeEvent('step', { text: 'Meh' });
      machine.onStep(event);
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture description', () => {
      machine.onStep(makeEvent('step', { text: 'meh' }));
      machine.onStep(makeEvent('step', { text: 'bah' }));

      const exported = specification.export();
      expect(exported.description).toBe('meh\nbah');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text', { text: 'Meh' });
      machine.onText(event);
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture description', () => {
      machine.onText(makeEvent('text', { text: 'meh' }));
      machine.onText(makeEvent('text', { text: 'bah' }));

      const exported = specification.export();
      expect(exported.description).toBe('meh\nbah');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
