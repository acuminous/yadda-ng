const expect = require('expect');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { AfterScenarioStepState } = States;

describe('AfterScenarioStepState', () => {

  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Some feature' });
    specification.createScenario({ annotations: [], title: 'First scenario' });
    specification.createScenarioStep({ annotations: [], text: 'First step' });

    machine = new StateMachine({ specification });
    machine.toAfterScenarioStepState();

    state = new AfterScenarioStepState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo=bar');
      expect(machine.state).toBe('AfterScenarioStepState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      expect(() => handle('Background: Meh')).toThrow('\'Background: Meh\' was unexpected in state: AfterScenarioStepState on line 1');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('AfterScenarioStepState');
    });
  });

  describe('DocString Indent Start Events', () => {

    it('should transition to new CreateScenarioStepDocStringState on DocStringIndentStart event', () => {
      session.indentation = 0;
      handle('   Some text');
      expect(machine.state).toBe('CreateScenarioStepDocStringState');
    });

    it('should capture DocStrings', () => {
      session.indentation = 0;
      handle('   Some text');

      const exported = specification.serialize();
      expect(exported.scenarios[0].steps[0].docString.length).toBe(1);
      expect(exported.scenarios[0].steps[0].docString[0]).toBe('Some text');
    });
  });

  describe('DocString Indent Stop Events', () => {

    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      expect(() => handle('Some text')).toThrow('\'Some text\' was unexpected in state: AfterScenarioStepState on line 1');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should transition to new CreateScenarioStepDocStringState on DocStringTokenStart event', () => {
      handle('---');
      expect(machine.state).toBe('CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Token Stop Events', () => {

    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: AfterScenarioStepState on line 1');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      handle('\u0000');
      expect(machine.state).toBe('FinalState');
    });
  });

  describe('Feature Events', () => {

    it('should error', () => {
      expect(() => handle('Feature: Meh')).toThrow('\'Feature: Meh\' was unexpected in state: AfterScenarioStepState on line 1');
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
      expect(() => handle('# Language: English')).toThrow('\'# Language: English\' was unexpected in state: AfterScenarioStepState on line 1');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to CreateScenarioState on scenario event', () => {
      handle('Scenario: foo');
      expect(machine.state).toBe('CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: Second scenario');

      const exported = specification.serialize();
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[0].title).toBe('First scenario');
      expect(exported.scenarios[1].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Scenario: Second scenario');

      const exported = specification.serialize();
      expect(exported.scenarios.length).toBe(2);
      expect(exported.scenarios[1].annotations.length).toBe(2);
      expect(exported.scenarios[1].annotations[0].name).toBe('one');
      expect(exported.scenarios[1].annotations[0].value).toBe('1');
      expect(exported.scenarios[1].annotations[1].name).toBe('two');
      expect(exported.scenarios[1].annotations[1].value).toBe('2');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      handle('#');
      expect(machine.state).toBe('AfterScenarioStepState');
    });
  });

  describe('Step Events', () => {

    it('should transition to AfterScenarioStepState on step event', () => {
      handle('Second step');
      expect(machine.state).toBe('AfterScenarioStepState');
    });

    it('should capture step', () => {
      handle('Second step');

      const exported = specification.serialize();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].text).toBe('First step');
      expect(exported.scenarios[0].steps[1].text).toBe('Second step');
      expect(exported.scenarios[0].steps[1].generalised).toBe('Second step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Bah');

      const exported = specification.serialize();
      expect(exported.scenarios[0].steps[1].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[1].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[1].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[1].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[1].annotations[1].value).toBe('2');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line) ) {
    state.handle({ line, number, indentation }, session);
  }

});
