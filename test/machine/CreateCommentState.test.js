const expect = require('expect');
const { Specification, Machine } = require('../..');
const { InitialState, CreateCommentState } = Machine;

describe('Create Comment State', () => {

  let state;

  beforeEach(() => {
    const specification = new Specification();
    const previousState = new InitialState({ specification });
    state = new CreateCommentState({ previousState });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.onAnnotation(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('background');
      state = state.onBackground(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.onBlankLine(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => state.onEnd(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('feature');
      state = state.onFeature(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('language');
      state = state.onLanguage(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to previous state', () => {
      const event = makeEvent('multi_line_comment');
      state = state.onMultiLineComment(event);
      expect(state.name).toBe('InitialState');
    });
  });

  describe('Scenario Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('scenario');
      state = state.onScenario(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment');
      state = state.onSingleLineComment(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Step Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('step');
      state = state.onStep(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text');
      state = state.onText(event);
      expect(state.name).toBe('CreateCommentState');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
