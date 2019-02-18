const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States, Languages } = Gherkish;
const { CreateScenarioStepDocStringState } = States;

describe('Create Scenario Step DocString State', () => {

  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });
    specification.createScenario({ annotations: [], title: 'Meh' });
    specification.createScenarioStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateScenarioStepDocStringState();

    state = new CreateScenarioStepDocStringState({ specification, machine });

    session = { language: Languages.utils.getDefault(), docString: { token: '---' } };
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Token End Events', () => {

    it('should transition to new AfterScenarioStepDocStringState on DocStringTokenEnd event', () => {
      handle('---');
      expect(machine.state).toBe('AfterScenarioStepDocStringState');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: CreateScenarioStepDocStringState on line 1');
    });
  });

  describe('DocString Events', () => {

    it('should not cause transition', () => {
      handle('Some text');
      expect(machine.state).toBe('CreateScenarioStepDocStringState');
    });

    it('should capture docstrings', () => {
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialize();
      expect(exported.scenarios[0].steps[0].docString.length).toBe(2);
      expect(exported.scenarios[0].steps[0].docString[0]).toBe('Some text');
      expect(exported.scenarios[0].steps[0].docString[1]).toBe('Some more text');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
