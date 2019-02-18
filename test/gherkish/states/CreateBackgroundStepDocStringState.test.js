const expect = require('expect');
const { Gherkish } = require('../../..');
const { Specification, StateMachine, States, Languages } = Gherkish;
const { CreateBackgroundStepDocStringState } = States;

describe('Create Background Step DocString State', () => {

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
    machine.toCreateBackgroundStepDocStringState();

    state = new CreateBackgroundStepDocStringState({ specification, machine });

    session = { language: Languages.utils.getDefault(), docString: { token: '---' } };
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      handle('');
      expect(machine.state).toBe('CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Token End Events', () => {

    it('should transition to new AfterBackgroundStepDocStringState on DocStringTokenEnd event', () => {
      handle('---');
      expect(machine.state).toBe('AfterBackgroundStepDocStringState');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      expect(() => handle('\u0000')).toThrow('Premature end of specification in state: CreateBackgroundStepDocStringState on line 1');
    });
  });

  describe('DocString Events', () => {

    it('should not cause transition', () => {
      handle('Some text');
      expect(machine.state).toBe('CreateBackgroundStepDocStringState');
    });

    it('should capture docstrings', () => {
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialize();
      expect(exported.background.steps[0].docString.length).toBe(2);
      expect(exported.background.steps[0].docString[0]).toBe('Some text');
      expect(exported.background.steps[0].docString[1]).toBe('Some more text');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
