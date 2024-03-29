const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { AfterBackgroundStepDocStringState } = States;

describe('AfterBackgroundStepDocStringState', () => {
  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });
    specification.createBackground({ annotations: [], title: 'Meh' });
    specification.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toAfterBackgroundStepDocStringState();

    state = new AfterBackgroundStepDocStringState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: foo'), { message: "'Background: foo' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: AfterBackgroundStepDocStringState on line 1' });
    });
  });

  describe('Feature Events', () => {
    it('should error on feature event', () => {
      throws(() => handle('Feature: foo'), { message: "'Feature: foo' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('Multi Line Comment Events', () => {
    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Language Events', () => {
    it('should error', () => {
      throws(() => handle('# Language: English'), { message: "'# Language: English' was unexpected in state: AfterBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('Scenario Events', () => {
    it('should transition to CreateScenarioState on scenario event', () => {
      handle('Scenario: foo');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: First scenario');

      const exported = specification.serialise();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Scenario: First scenario');

      const exported = specification.serialise();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].annotations.length, 2);
      eq(exported.scenarios[0].annotations[0].name, 'one');
      eq(exported.scenarios[0].annotations[0].value, '1');
      eq(exported.scenarios[0].annotations[1].name, 'two');
      eq(exported.scenarios[0].annotations[1].value, '2');
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# foo');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });
  });

  describe('Step Events', () => {
    it('should transition to new AfterBackgroundStepState on step event', () => {
      handle('Given some text');
      eq(machine.state, 'AfterBackgroundStepState');
    });

    it('should capture step', () => {
      handle('Given some text');

      const exported = specification.serialise();
      eq(exported.background.steps.length, 2);
      eq(exported.background.steps[1].text, 'Given some text');
    });

    it('should capture steps with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Given some text');

      const exported = specification.serialise();
      eq(exported.background.steps[1].annotations.length, 2);
      eq(exported.background.steps[1].annotations[0].name, 'one');
      eq(exported.background.steps[1].annotations[0].value, '1');
      eq(exported.background.steps[1].annotations[1].name, 'two');
      eq(exported.background.steps[1].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
