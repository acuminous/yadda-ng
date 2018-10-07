const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States } = Gherkish;
const { CreateMultiLineCommentState } = States;

describe('Create Multi Line Comment State', () => {

  let machine;
  let state;

  beforeEach(() => {
    const specification = new Specification();

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
    machine.toCreateMultiLineCommentState();

    state = new CreateMultiLineCommentState({ specification, machine });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state.onAnnotation(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('background');
      state.onBackground(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state.onBlankLine(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
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
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('language');
      state.onLanguage(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
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
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment');
      state.onSingleLineComment(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Step Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('step');
      state.onStep(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text');
      state.onText(event);
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
