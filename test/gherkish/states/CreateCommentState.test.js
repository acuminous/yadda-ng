const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Comment State', () => {

  let machine;
  let state;

  beforeEach(() => {
    const specification = new Specification();
    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
    state = machine.toCreateCommentState();
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state.onAnnotation(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('background');
      state.onBackground(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state.onBlankLine(event);
      expect(machine.state).toBe('CreateCommentState');
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
      state.onFeature(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('language');
      state.onLanguage(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to previous state', () => {
      const event = makeEvent('multi_line_comment');
      state.onMultiLineComment(event);
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Scenario Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('scenario');
      state.onScenario(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment');
      state.onSingleLineComment(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Step Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('step');
      state.onStep(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text');
      state.onText(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
