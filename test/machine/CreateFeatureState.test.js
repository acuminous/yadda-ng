const expect = require('expect');
const { Specification, Machine } = require('../..');
const { CreateFeatureState } = Machine;

describe('Create Feature State', () => {
  let specification;
  let state;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' });
    state = new CreateFeatureState({ specification });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.onAnnotation(event);
      expect(state.name).toBe('CreateFeatureState');
    });
  });

  describe('Background Events', () => {

    it('should transition to CreateBackgroundState on background event', () => {
      const event = makeEvent('background', { title: 'Meh' });
      state = state.onBackground(event);
      expect(state.name).toBe('CreateBackgroundState');
    });

    it('should capture scenarios with annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onBackground(makeEvent('background', { title: 'First background' }));
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

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.onBlankLine(event);
      expect(state.name).toBe('CreateFeatureState');
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
      expect(() => state.onFeature(event)).toThrow('Unexpected event: feature on line: 1, \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateCommentState and back', () => {
      state = state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(state.name).toBe('CreateCommentState');

      state = state.onMultiLineComment(makeEvent('multi_line_comment'));
      expect(state.name).toBe('CreateFeatureState');
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
      state = state.onText(makeEvent('text', { text: 'meh' }));
      state = state.onScenario(makeEvent('scenario', { title: 'Second scenario' }));

      const exported = specification.export();
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[0].title).toBe('First scenario');
      expect(exported.scenarios[1].title).toBe('Second scenario');
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
      const event = makeEvent('single_line_comment', { text: 'Meh' });
      state = state.onSingleLineComment(event);
      expect(state.name).toBe('CreateFeatureState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text', { text: 'Meh' });
      state = state.onText(event);
      expect(state.name).toBe('CreateFeatureState');
    });

    it('should capture description', () => {
      state = state.onText(makeEvent('text', { text: 'meh' }));
      state = state.onText(makeEvent('text', { text: 'bah' }));

      const exported = specification.export();
      expect(exported.description).toBe('meh\nbah');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
