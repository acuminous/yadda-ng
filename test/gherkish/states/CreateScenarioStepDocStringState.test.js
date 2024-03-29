const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');
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
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: CreateScenarioStepDocStringState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should transition to new AfterScenarioStepDocStringState on DocStringIndentEnd event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('Some text');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateScenarioStepDocStringState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should transition to new AfterScenarioStepDocStringState on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      handle('---');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: CreateScenarioStepDocStringState on line 1' });
    });
  });

  describe('DocString Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('Some text');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.docString = { token: '---' };
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialise();
      eq(exported.scenarios[0].steps[0].docString, ['Some text', 'Some more text'].join(os.EOL));
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
