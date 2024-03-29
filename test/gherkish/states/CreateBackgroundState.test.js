const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { CreateBackgroundState } = States;

describe('CreateBackgroundState', () => {
  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateBackgroundState({ specification });

    state = new CreateBackgroundState({ machine, specification });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: foo'), { message: "'Background: foo' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: CreateBackgroundState on line 1' });
    });
  });

  describe('Feature Events', () => {
    it('should error', () => {
      throws(() => handle('Feature: foo'), { message: "'Feature: foo' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('Language Events', () => {
    it('should error', () => {
      throws(() => handle('# Language: English'), { message: "'# Language: English' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('Multi Line Comment Events', () => {
    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {
    it('should error on scenario event', () => {
      throws(() => handle('Scenario: First scenario'), { message: "'Scenario: First scenario' was unexpected in state: CreateBackgroundState on line 1'" });
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# Some comment');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('Step Events', () => {
    it('should transition to AfterBackgroundStepState on step event', () => {
      handle('First step');
      eq(machine.state, 'AfterBackgroundStepState');
    });

    it('should capture steps', () => {
      handle('First step');

      const exported = specification.serialise();
      eq(exported.background.steps.length, 1);
      eq(exported.background.steps[0].text, 'First step');
      eq(exported.background.steps[0].generalised, 'First step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('First step');

      const exported = specification.serialise();
      eq(exported.background.steps[0].annotations.length, 2);
      eq(exported.background.steps[0].annotations[0].name, 'one');
      eq(exported.background.steps[0].annotations[0].value, '1');
      eq(exported.background.steps[0].annotations[1].name, 'two');
      eq(exported.background.steps[0].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
