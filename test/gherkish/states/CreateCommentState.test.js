const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine } = Gherkish;

describe('Create Comment State', () => {

  let machine;

  beforeEach(() => {
    const specification = new Specification();
    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
    machine.toCreateCommentState();
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      machine.onAnnotation(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('background');
      machine.onBackground(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      machine.onBlankLine(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => machine.onEnd(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('feature');
      machine.onFeature(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('language');
      machine.onLanguage(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to previous state', () => {
      const event = makeEvent('multi_line_comment');
      machine.onMultiLineComment(event);
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Scenario Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('scenario');
      machine.onScenario(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment');
      machine.onSingleLineComment(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Step Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('step');
      machine.onStep(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text');
      machine.onText(event);
      expect(machine.state).toBe('CreateCommentState');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
