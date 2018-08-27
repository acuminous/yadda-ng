const expect = require('expect');
const { Specification, Machine } = require('../..');
const { InitialState } = Machine;

describe('Initial State', () => {

  let specification;
  let state;

  beforeEach(() => {
    specification = new Specification();
    state = new InitialState({ specification });
  });

  describe('Annotation Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('annotation', { name: 'foo', value: 'bar' });
      state = state.handle(event);
      expect(state.name).toBe('initial');
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
      expect(state.name).toBe('initial');
    });
  });

  describe('End Events', () => {

    it('should error', () => {
      const event = { name: 'end' };
      expect(() => state.handle(event)).toThrow('Premature end of specification');
    });
  });

  describe('Feature Events', () => {

    it('should transition to create_feature', () => {
      const event = makeEvent('feature', { title: 'Some feature' });
      state = state.handle(event);
      expect(state.name).toBe('create_feature');
    });

    it('should capture feature title', () => {
      const event = makeEvent('feature', { title: 'Some feature' });
      state = state.handle(event);

      const exported = specification.export();
      expect(exported.title).toBe('Some feature');
    });

    it('should capture feature annotations', () => {
      state = state.handle(makeEvent('annotation', { name: 'one', value: '1' }));
      state = state.handle(makeEvent('annotation', { name: 'two', value: '2' }));
      state = state.handle(makeEvent('feature', { title: 'Meh' }));

      const exported = specification.export();
      expect(exported.annotations.length).toBe(2);
      expect(exported.annotations[0].name).toBe('one');
      expect(exported.annotations[0].value).toBe('1');
      expect(exported.annotations[1].name).toBe('two');
      expect(exported.annotations[1].value).toBe('2');
    });
  });

  describe('Multi Line Comment Events', () => {

    it('should transition to create_comment', () => {
      const event = makeEvent('multi_line_comment', { comment: 'Meh' });
      state = state.handle(event);
      expect(state.name).toBe('create_comment');
    });
  });

  describe('Scenario Events', () => {

    it('should error', () => {
      const event = makeEvent('scenario');
      expect(() => state.handle(event)).toThrow('Unexpected event: scenario on line: 1, \'meh\'');
    });
  });

  describe('Single Line Comment Events', () => {

    it('should not cause transition', () => {
      const event = makeEvent('single_line_comment', { comment: 'meh' });
      state = state.handle(event);
      expect(state.name).toBe('initial');
    });
  });

  describe('Text Events', () => {

    it('should error', () => {
      const event = makeEvent('text');
      expect(() => state.handle(event)).toThrow('Unexpected event: text on line: 1, \'meh\'');
    });
  });
});

function makeEvent(name, data = {}) {
  return { name, data, source: { number: 1, line: 'meh' } };
}
