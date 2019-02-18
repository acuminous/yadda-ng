const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States, Languages } = Gherkish;
const { CreateFeatureState } = States;

describe('CreateFeatureState', () => {

  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();

    state = new CreateFeatureState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      handle('@foo=bar');
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Background Events', () => {

    it('should transition to CreateBackgroundState on background event', () => {
      handle('Background: foo');
      expect(machine.state).toBe('CreateBackgroundState');
    });

    it('should capture backgrounds with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Background: First background');

      const exported = specification.serialize();
      expect(exported.background.annotations.length).toBe(2);
      expect(exported.background.annotations[0].name).toBe('one');
      expect(exported.background.annotations[0].value).toBe('1');
      expect(exported.background.annotations[1].name).toBe('two');
      expect(exported.background.annotations[1].value).toBe('2');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should error', () => {
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: CreateFeatureState on line 1');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: CreateFeatureState on line 1');
    });
  });

  describe('Feature Events', () => {

    it('should error', () => {
      expect(() => handle('Feature: foo')).toThrow('\'Feature: foo\' was unexpected in state: CreateFeatureState on line 1');
    });
  });

  describe('Language Events', () => {

    it('should error', () => {
      expect(() => handle('# Language: English')).toThrow('\'# Language: English\' was unexpected in state: CreateFeatureState on line 1');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      expect(machine.state).toBe('ConsumeMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to CreateScenarioState on scenario event', () => {
      handle('Scenario: First scenario');
      expect(machine.state).toBe('CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: First scenario');

      const exported = specification.serialize();
      expect(exported.scenarios.length).toBe(1);
      expect(exported.scenarios[0].title).toBe('First scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one=1');
      handle('@two=2');
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
      handle('# Some comment');
      expect(machine.state).toBe('CreateFeatureState');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      handle('Some text');
      expect(machine.state).toBe('CreateFeatureState');
    });

    it('should capture description', () => {
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialize();
      expect(exported.description).toBe('Some text\nSome more text');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
