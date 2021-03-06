const expect = require('expect');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { CreateScenarioState } = States;

describe('CreateScenarioState', () => {

  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();

    specification.createFeature({ annotations: [], title: 'Meh' });
    specification.createScenario({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateScenarioState();

    state = new CreateScenarioState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo=bar');
      expect(machine.state).toBe('CreateScenarioState');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      expect(() => handle('Background: foo')).toThrow('\'Background: foo\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('CreateScenarioState');
    });
  });

  describe('DocString Indent Start Events', () => {

    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      expect(() => handle('   Some text')).toThrow('\'   Some text\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('DocString Indent Stop Events', () => {

    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      expect(() => handle('Some text')).toThrow('\'Some text\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should error on DocStringTokenStart event', () => {
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('DocString Token Stop Events', () => {

    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: CreateScenarioState on line 1');
    });
  });

  describe('Feature Events', () => {

    it('should error', () => {
      expect(() => handle('Feature: foo')).toThrow('\'Feature: foo\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      expect(() => handle('# Language: English')).toThrow('\'# Language: English\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {

    it('should error on scenario event', () => {
      expect(() => handle('Scenario: First scenario')).toThrow('\'Scenario: First scenario\' was unexpected in state: CreateScenarioState on line 1');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      handle('# Some comment');
      expect(machine.state).toBe('CreateScenarioState');
    });
  });

  describe('Step Events', () => {

    it('should transition to AfterScenarioStepState on step event', () => {
      handle('First step');
      expect(machine.state).toBe('AfterScenarioStepState');
    });

    it('should capture steps', () => {
      handle('First step');

      const exported = specification.serialise();
      expect(exported.scenarios[0].steps.length).toBe(1);
      expect(exported.scenarios[0].steps[0].text).toBe('First step');
      expect(exported.scenarios[0].steps[0].generalised).toBe('First step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('First step');

      const exported = specification.serialise();
      expect(exported.scenarios[0].steps[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[0].annotations[1].value).toBe('2');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line) ) {
    state.handle({ line, number, indentation }, session);
  }
});
