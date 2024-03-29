const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');
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
      eq(machine.state, 'InitialState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: foo'), { message: "'Background: foo' was unexpected in state: InitialState on line 1'" });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'InitialState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: InitialState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: InitialState on line 1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: InitialState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: InitialState on line 1'" });
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: InitialState on line 1' });
    });
  });

  describe('Feature Events', () => {
    it('should transition to CreateFeatureState', () => {
      handle('Feature: foo');
      eq(machine.state, 'CreateFeatureState');
    });

    it('should capture feature title', () => {
      handle('Feature: Some feature');

      const exported = specification.serialise();
      eq(exported.title, 'Some feature');
    });

    it('should capture feature annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Feature: First scenario');

      const exported = specification.serialise();
      eq(exported.annotations.length, 2);
      eq(exported.annotations[0].name, 'one');
      eq(exported.annotations[0].value, '1');
      eq(exported.annotations[1].name, 'two');
      eq(exported.annotations[1].value, '2');
    });
  });

  describe('Language Events', () => {
    it('should not cause transition', () => {
      handle('# Language: English');
      eq(machine.state, 'InitialState');
    });

    it('should set language', () => {
      handle('# Language: English');
      eq(session.language.name, 'English');
    });
  });

  describe('Multi Line Comment Events', () => {
    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {
    it('should error', () => {
      throws(() => handle('Scenario: foo'), { message: "'Scenario: foo' was unexpected in state: InitialState on line 1'" });
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# foo');
      eq(machine.state, 'InitialState');
    });
  });

  describe('Text Events', () => {
    it('should error', () => {
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: InitialState on line 1'" });
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
