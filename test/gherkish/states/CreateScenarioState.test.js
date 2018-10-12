const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States, Languages } = Gherkish;
const { CreateScenarioState } = States;

describe('Create Scenario State', () => {

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

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('\'\u0000\' was unexpected in state: CreateScenarioState on line 1');
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

    it('should transition to CreateMultiLineCommentState', () => {
      handle('###');
      expect(machine.state).toBe('CreateMultiLineCommentState');
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

    it('should transition to CreateScenarioStepState on step event', () => {
      handle('First step');
      expect(machine.state).toBe('CreateScenarioStepState');
    });

    it('should capture steps', () => {
      handle('First step');

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(1);
      expect(exported.scenarios[0].steps[0].text).toBe('First step');
      expect(exported.scenarios[0].steps[0].generalised).toBe('First step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('First step');

      const exported = specification.export();
      expect(exported.scenarios[0].steps[0].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[0].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[0].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[0].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[0].annotations[1].value).toBe('2');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});