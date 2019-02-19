const expect = require('expect');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { AfterBackgroundStepState } = States;

describe('AfterBackgroundStepState', () => {

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
    machine.toAfterBackgroundStepState();

    state = new AfterBackgroundStepState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo=bar');
      expect(machine.state).toBe('AfterBackgroundStepState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      expect(() => handle('Background: foo')).toThrow('\'Background: foo\' was unexpected in state: AfterBackgroundStepState on line 1');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('AfterBackgroundStepState');
    });
  });

  describe('DocString Indent Start Events', () => {

    it('should transition to new CreateBackgroundStepDocStringState on DocStringIndentStart event', () => {
      session.indentation = 0;
      handle('   Some text');
      expect(machine.state).toBe('CreateBackgroundStepDocStringState');
    });

    it('should capture DocStrings', () => {
      session.indentation = 0;
      handle('   Some text');

      const exported = specification.serialize();
      expect(exported.background.steps[0].docString.length).toBe(1);
      expect(exported.background.steps[0].docString[0]).toBe('Some text');
    });
  });

  describe('DocString Indent Stop Events', () => {

    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      expect(() => handle('Some text')).toThrow('\'Some text\' was unexpected in state: AfterBackgroundStepState on line 1');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should transition to new CreateBackgroundStepDocStringState on DocStringTokenStart event', () => {
      handle('---');
      expect(machine.state).toBe('CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Token Stop Events', () => {

    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: AfterBackgroundStepState on line 1');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: AfterBackgroundStepState on line 1');
    });
  });

  describe('Feature Events', () => {

    it('should error on feature event', () => {
      expect(() => handle('Feature: foo')).toThrow('\'Feature: foo\' was unexpected in state: AfterBackgroundStepState on line 1');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      expect(() => handle('# Language: English')).toThrow('\'# Language: English\' was unexpected in state: AfterBackgroundStepState on line 1');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to CreateScenarioState on scenario event', () => {
      handle('Scenario: foo');
      expect(machine.state).toBe('CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: First scenario');

      const exported = specification.serialize();
      expect(exported.scenarios.length).toBe(1);
      expect(exported.scenarios[0].title).toBe('First scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Scenario: First scenario');

      const exported = specification.serialize();
      expect(exported.scenarios.length).toBe(1);
      expect(exported.scenarios[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].annotations[1].value).toBe('2');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      handle('# foo');
      expect(machine.state).toBe('AfterBackgroundStepState');
    });
  });

  describe('Step Events', () => {

    it('should transition to new AfterBackgroundStepState on step event', () => {
      handle('Given some text');
      expect(machine.state).toBe('AfterBackgroundStepState');
    });

    it('should capture step', () => {
      handle('Given some text');

      const exported = specification.serialize();
      expect(exported.background.steps.length).toBe(2);
      expect(exported.background.steps[1].text).toBe('Given some text');
    });

    it('should capture steps with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Given some text');

      const exported = specification.serialize();
      expect(exported.background.steps[1].annotations.length).toBe(2);
      expect(exported.background.steps[1].annotations[0].name).toBe('one');
      expect(exported.background.steps[1].annotations[0].value).toBe('1');
      expect(exported.background.steps[1].annotations[1].name).toBe('two');
      expect(exported.background.steps[1].annotations[1].value).toBe('2');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line) ) {
    state.handle({ line, number, indentation }, session);
  }
});
