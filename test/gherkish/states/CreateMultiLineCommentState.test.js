const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States, Languages } = Gherkish;
const { CreateMultiLineCommentState } = States;

describe('Create Multi Line Comment State', () => {

  let machine;
  let state;
  let session;

  beforeEach(() => {
    const specification = new Specification();

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
    machine.toCreateMultiLineCommentState();

    state = new CreateMultiLineCommentState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo = bar');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      handle('Background: foo');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('\'\u0000\' was unexpected in state: CreateMultiLineCommentState on line 1');
    });
  });

  describe('Feature Events', () => {

    it('should not cause transition', () => {
      handle('Feature: foo');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Language Events', () => {

    it('should not cause transition', () => {
      handle('# Language: English');
      expect(machine.state).toBe('CreateMultiLineCommentState');
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
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      handle('# Single comment');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Step Events', () => {

    it('should not cause transition', () => {
      handle('Given some text');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      handle('Some text');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
