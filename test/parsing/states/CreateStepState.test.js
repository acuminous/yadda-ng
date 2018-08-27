const expect = require('expect');
const { Parsing } = require('../../..');
const { Specification, States } = Parsing;
const { CreateStepState } =  States;

describe('Create Step State', () => {

  let specification;
  let state;

  beforeEach(() => {
    specification = new Specification()
      .createFeature({ annotations: [], title: 'Meh' })
      .createScenario({ annotations: [], title: 'Meh' })
      .createStep({ annotations: [], statement: 'Meh' });
    state = new CreateStepState({ specification });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.handle(event);
      expect(state.name).toBe('create_step');
    });
  });

  describe('Background Events', () => {

    it('should error', () => {
      const event = makeEvent('background');
      expect(() => state.handle(event)).toThrow('Unexpected event: background on line: 1, \'meh\'');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.handle(event);
      expect(state.name).toBe('create_step');
    });
  });

  describe('End Events', () => {

    it('should transition to final on end event', () => {
      const event = { name: 'end' };
      state = state.handle(event);
      expect(state.name).toBe('final');
    });
  });

  describe('Feature Events', () => {

    it('should error on feature event', () => {
      const event = makeEvent('feature', { title: 'Meh' });
      expect(() => state.handle(event)).toThrow('Unexpected event: feature on line: 1, \'meh\'');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to create_comment and back', () => {
      state = state.handle(makeEvent('multi_line_comment'));
      expect(state.name).toBe('create_comment');

      state = state.handle(makeEvent('multi_line_comment'));
      expect(state.name).toBe('create_step');
    });
  });

  describe('Scenario Events', () => {

    it('should transition to create_scenario on scenario event', () => {
      const event = makeEvent('scenario', { title: 'Meh' });
      state = state.handle(event);
      expect(state.name).toBe('create_scenario');
    });

    it('should capture scenarios', () => {
      state = state.handle(makeEvent('scenario', { title: 'First scenario' }));
      state = state.handle(makeEvent('text', { text: 'meh' }));
      state = state.handle(makeEvent('scenario', { title: 'Second scenario' }));

      const exported = specification.export();
      expect(exported.scenarios.length).toBe(3);
      expect(exported.scenarios[0].title).toBe('Meh');
      expect(exported.scenarios[1].title).toBe('First scenario');
      expect(exported.scenarios[2].title).toBe('Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      state = state.handle(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.handle(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.handle(makeEvent('scenario', { title: 'First scenario' }));

      const exported = specification.export();
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
      const event = makeEvent('single_line_comment', { comment: 'Meh' });
      state = state.handle(event);
      expect(state.name).toBe('create_step');
    });
  });

  describe('Text Events', () => {

    it('should transition to new create_step on text event', () => {
      const event = makeEvent('text');
      const newState = state.handle(event);
      expect(newState).not.toBe(state);
      expect(state.name).toBe('create_step');
    });

    it('should capture step', () => {
      state = state.handle(makeEvent('text', { text: 'Bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps.length).toBe(2);
      expect(exported.scenarios[0].steps[0].statement).toBe('Meh');
      expect(exported.scenarios[0].steps[1].statement).toBe('Bah');
    });

    it('should capture steps with annotations', () => {
      state = state.handle(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.handle(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.handle(makeEvent('text', { text: 'Bah' }));

      const exported = specification.export();
      expect(exported.scenarios[0].steps[1].annotations.length).toBe(2);
      expect(exported.scenarios[0].steps[1].annotations[0].name).toBe('one');
      expect(exported.scenarios[0].steps[1].annotations[0].value).toBe('1');
      expect(exported.scenarios[0].steps[1].annotations[1].name).toBe('two');
      expect(exported.scenarios[0].steps[1].annotations[1].value).toBe('2');
    });

  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
