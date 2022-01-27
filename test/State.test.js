const expect = require('expect');

const { State } = require('..');

describe('State', () => {
  describe('Get', () => {
    it('should return undefined when getting something that does not exist in the default scope', () => {
      expect(new State().get('foo')).toBe(undefined);
    });

    it('should return undefined when getting something that does not exist in the specified scope', () => {
      expect(new State().get('foo', State.FEATURE_SCOPE)).toBe(undefined);
    });

    it('should error when the specified scope does not exist', () => {
      expect(() => new State().get('foo', 'missing')).toThrow('Invalid scope: missing');
    });

    it('should return the specified item from the default scope', () => {
      const state = new State();
      state.set('foo', 1);
      expect(state.get('foo')).toBe(1);
      expect(state.get('foo', State.SCENARIO_SCOPE)).toBe(1);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(undefined);
    });

    it('should return the specified item from the specified scope', () => {
      const state = new State();
      state.set('foo', 1, State.FEATURE_SCOPE);
      expect(state.get('foo')).toBe(undefined);
      expect(state.get('foo', State.SCENARIO_SCOPE)).toBe(undefined);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(1);
    });

    it('should isolate scopes', () => {
      const state = new State();
      state.set('foo', 1);
      state.set('foo', 2, State.FEATURE_SCOPE);
      state.set('foo', 3, State.PLAYBOOK_SCOPE);
      expect(state.get('foo')).toBe(1);
      expect(state.get('foo', State.SCENARIO_SCOPE)).toBe(1);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(2);
      expect(state.get('foo', State.PLAYBOOK_SCOPE)).toBe(3);
    });
  });

  describe('Set', () => {
    it('should error when the specified scope does not exist', () => {
      expect(() => new State().set('foo', 1, 'missing')).toThrow('Invalid scope: missing');
    });
  });

  describe('Remove', () => {
    it('should remove the specified item from the default scope', () => {
      const state = new State();
      state.set('foo', 1);
      expect(state.get('foo')).toBe(1);
      state.remove('foo');
      expect(state.get('foo')).toBe(undefined);
    });

    it('should remove the specified item from the specified scope', () => {
      const state = new State();
      state.set('foo', 1, State.FEATURE_SCOPE);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(1);
      state.remove('foo', State.FEATURE_SCOPE);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(undefined);
    });

    it('should error when the specified scope does not exist', () => {
      expect(() => new State().remove('foo', 'missing')).toThrow('Invalid scope: missing');
    });
  });

  describe('Clear', () => {
    it('should remove all items from all scopes', () => {
      const state = new State();
      state.set('foo', 1, State.SCENARIO_SCOPE);
      state.set('foo', 2, State.FEATURE_SCOPE);
      state.set('foo', 3, State.PLAYBOOK_SCOPE);
      state.clear();

      expect(state.get('foo', State.SCENARIO_SCOPE)).toBe(undefined);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(undefined);
      expect(state.get('foo', State.PLAYBOOK_SCOPE)).toBe(undefined);
    });

    it('should remove all items from the specified scopes', () => {
      const state = new State();
      state.set('foo', 1, State.SCENARIO_SCOPE);
      state.set('foo', 2, State.FEATURE_SCOPE);
      state.set('foo', 3, State.PLAYBOOK_SCOPE);
      state.clear(State.SCENARIO_SCOPE, State.FEATURE_SCOPE);

      expect(state.get('foo', State.SCENARIO_SCOPE)).toBe(undefined);
      expect(state.get('foo', State.FEATURE_SCOPE)).toBe(undefined);
      expect(state.get('foo', State.PLAYBOOK_SCOPE)).toBe(3);
    });

    it('should error when the specified scope does not exist', () => {
      expect(() => new State().clear(State.SCENARIO_SCOPE, 'missing')).toThrow('Invalid scope: missing');
    });
  });
});
