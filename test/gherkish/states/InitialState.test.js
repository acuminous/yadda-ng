const expect = require('expect');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { InitialState } = States;

describe('InitialState', () => {

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
      expect(() => handle('Background: foo')).toThrow('\'Background: foo\' was unexpected in state: InitialState on line 1');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('InitialState');
    });
  });


  describe('DocString Indent Start Events', () => {

    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      expect(() => handle('   Some text')).toThrow('\'   Some text\' was unexpected in state: InitialState on line 1');
    });
  });

  describe('DocString Indent Stop Events', () => {

    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      expect(() => handle('Some text')).toThrow('\'Some text\' was unexpected in state: InitialState on line 1');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should error on DocStringTokenStart event', () => {
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: InitialState on line 1');
    });
  });

  describe('DocString Token Stop Events', () => {

    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: InitialState on line 1');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: InitialState on line 1');
    });
  });

  describe('Feature Events', () => {

    it('should transition to CreateFeatureState', () => {
      handle('Feature: foo');
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture feature title', () => {
      handle('Feature: Some feature');

      const exported = specification.serialize();
      expect(exported.title).toBe('Some feature');
    });

    it('should capture feature annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Feature: First scenario');

      const exported = specification.serialize();
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

    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {

    it('should error', () => {
      expect(() => handle('Scenario: foo')).toThrow('\'Scenario: foo\' was unexpected in state: InitialState on line 1');
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
      expect(() => handle('Some text')).toThrow('\'Some text\' was unexpected in state: InitialState on line 1');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line) ) {
    state.handle({ line, number, indentation }, session);
  }
});
