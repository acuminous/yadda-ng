const expect = require('expect');
const { Parsing } = require('../../..');
const { SpecificationBuilder, States } =  Parsing;
const { InitialState, CreateCommentState } =  States;

describe('Create Comment State', () => {

  let state;

  beforeEach(() => {
    const specificationBuilder = new SpecificationBuilder();
    const previousState = new InitialState({ specificationBuilder });
    state = new CreateCommentState({ previousState });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('Background Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('background');
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('Blank Line Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('blank_line');
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => state.handle(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('feature');
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to previous state', () => {
      const event = makeEvent('multi_line_comment');
      state = state.handle(event);
      expect(state.name).toBe('initial');
    });
  });

  describe('Scenario Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('scenario');
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment');
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('Text Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('text');
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
