const expect = require('expect');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { InitialState } = States;

describe('Initial State', () => {

  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    const parser = new SpecificationParser();
    specification = new Specification();

    machine = new StateMachine({ parser, specification });

    state = new InitialState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo=bar');
      expect(machine.state).toBe('InitialState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      expect(() => handle('Background: foo')).toThrow('Event: background was unexpected in state: InitialState on line 1: \'Background: foo\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('InitialState');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('Event: end was unexpected in state: InitialState on line 1: \'\u0000\'');
    });
  });

  describe('Feature Events', () => {

    it('should transition to CreateFeatureState', () => {
      handle('Feature: foo');
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture feature title', () => {
      handle('Feature: Some feature');

      const exported = specification.export();
      expect(exported.title).toBe('Some feature');
    });

    it('should capture feature annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Feature: First scenario');

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
      handle('# Language: English');
      expect(machine.state).toBe('InitialState');
    });

    it('should set language', () => {
      handle('# Language: English');
      expect(session.language.name).toBe('English');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to CreateMultiLineCommentState', () => {
      handle('###');
      expect(machine.state).toBe('CreateMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {

    it('should error', () => {
      expect(() => handle('Scenario: foo')).toThrow('Event: scenario was unexpected in state: InitialState on line 1: \'Scenario: foo\'');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      handle('# foo');
      expect(machine.state).toBe('InitialState');
    });
  });

  describe('Text Events', () => {

    it('should error', () => {
      expect(() => handle('Some text')).toThrow('Event: text was unexpected in state: InitialState on line 1: \'Some text\'');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
