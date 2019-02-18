const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States, Languages } = Gherkish;
const { ConsumeMultiLineCommentState } = States;

describe('ConsumeMultiLineCommentState', () => {

  let machine;
  let state;
  let session;

  beforeEach(() => {
    const specification = new Specification();

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
    machine.toConsumeMultiLineCommentState();

    state = new ConsumeMultiLineCommentState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo = bar');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      handle('Background: foo');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should not cause transition', () => {
      handle('---');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: ConsumeMultiLineCommentState on line 1');
    });
  });

  describe('Feature Events', () => {

    it('should not cause transition', () => {
      handle('Feature: foo');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      handle('# Language: English');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to previous state', () => {
      handle('###');
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Scenario Events', () => {

    it('should not cause transition', () => {
      handle('Scenario: foo');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      handle('# Single comment');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Step Events', () => {

    it('should not cause transition', () => {
      handle('Given some text');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      handle('Some text');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
