const expect = require('expect');
const { Specification, Machine } = require('../..');
const { InitialState } = Machine;

describe('Initial State', () => {

  let specification;
  let state;

  beforeEach(() => {
    specification = new Specification();
    state = new InitialState({ specification });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.onAnnotation(event);
      expect(state.name).toBe('InitialState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.onBackground(event)).toThrow('Background was unexpected while parsing specification on line 1: \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.onBlankLine(event);
      expect(state.name).toBe('InitialState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => state.onEnd(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should transition to CreateFeatureState', () => {
      const event = makeEvent('feature', { title: 'Some feature' });
      state = state.onFeature(event);
      expect(state.name).toBe('CreateFeatureState');
    });

    it('should capture feature title', () => {
      const event = makeEvent('feature', { title: 'Some feature' });
      state = state.onFeature(event);

      const exported = specification.export();
      expect(exported.title).toBe('Some feature');
    });

    it('should capture feature annotations', () => {
      state = state.onAnnotation(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.onAnnotation(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.onFeature(makeEvent('feature', { title: 'Meh' }));

      const exported = specification.export();
      expect(exported.annotations.length).toBe(2);
      expect(exported.annotations[0].name).toBe('one');
      expect(exported.annotations[0].value).toBe('1');
      expect(exported.annotations[1].name).toBe('two');
      expect(exported.annotations[1].value).toBe('2');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('language', { name: 'English' });
      state = state.onLanguage(event);
      expect(state.name).toBe('InitialState');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateCommentState', () => {
      const event = makeEvent('multi_line_comment', { comment: 'Meh' });
      state = state.onMultiLineComment(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Scenario Events', () => {

    it('should error', () => {
      const event = makeEvent('scenario');
      expect(() => state.onScenario(event)).toThrow('Scenario was unexpected while parsing specification on line 1: \'meh\'');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'meh' });
      state = state.onSingleLineComment(event);
      expect(state.name).toBe('InitialState');
    });
  });

  describe('Step Events', () => {

    it('should error', () => {
      const event = makeEvent('step');
      expect(() => state.onStep(event)).toThrow('Step was unexpected while parsing specification on line 1: \'meh\'');
    });
  });

  describe('Text Events', () => {

    it('should error', () => {
      const event = makeEvent('text');
      expect(() => state.onText(event)).toThrow('Text was unexpected while parsing specification on line 1: \'meh\'');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
