const expect = require('expect');
const os = require('os');
const { Gherkish } = require('../../..');
const { SpecificationParser, Specification, StateMachine, States, Languages } = Gherkish;
const { CreateScenarioStepDocStringState } = States;

describe('CreateScenarioStepDocStringState', () => {

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

    session = { language: Languages.utils.getDefault(), indentation: 0 };
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('');
      expect(machine.state).toBe('CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {

    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      expect(() => handle('   Some text')).toThrow('\'   Some text\' was unexpected in state: CreateScenarioStepDocStringState on line 1');
    });
  });

  describe('DocString Indent Stop Events', () => {

    it('should transition to new AfterScenarioStepDocStringState on DocStringIndentEnd event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('Some text');
      expect(machine.state).toBe('AfterScenarioStepState');
    });
  });

  describe('DocString Token Start Events', () => {

    it('should error on DocStringTokenStart event', () => {
      expect(() => handle('---')).toThrow('\'---\' was unexpected in state: CreateScenarioStepDocStringState on line 1');
    });
  });

  describe('DocString Token Stop Events', () => {

    it('should transition to new AfterScenarioStepDocStringState on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
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
      session.docString = { token: '---' };
      handle('Some text');
      expect(machine.state).toBe('CreateScenarioStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.docString = { token: '---' };
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialise();
      expect(exported.scenarios[0].steps[0].docString).toBe([
        'Some text',
        'Some more text',
      ].join(os.EOL));
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line) ) {
    state.handle({ line, number, indentation }, session);
  }
});
