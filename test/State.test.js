const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');

const { State } = require('..');

describe('State', () => {
  describe('Get', () => {
    it('should return undefined when getting something that does not exist in the default scope', () => {
      eq(new State().get('foo'), undefined);
    });

    it('should return undefined when getting something that does not exist in the specified scope', () => {
      eq(new State().get('foo', State.FEATURE_SCOPE), undefined);
    });

    it('should error when the specified scope does not exist', () => {
      throws(() => new State().get('foo', 'missing'), { message: 'Invalid scope: missing' });
    });

    it('should return the specified item from the default scope', () => {
      const state = new State();
      state.set('foo', 1);
      eq(state.get('foo'), 1);
      eq(state.get('foo', State.SCENARIO_SCOPE), 1);
      eq(state.get('foo', State.FEATURE_SCOPE), undefined);
    });

    it('should return the specified item from the specified scope', () => {
      const state = new State();
      state.set('foo', 1, State.FEATURE_SCOPE);
      eq(state.get('foo'), undefined);
      eq(state.get('foo', State.SCENARIO_SCOPE), undefined);
      eq(state.get('foo', State.FEATURE_SCOPE), 1);
    });

    it('should isolate scopes', () => {
      const state = new State();
      state.set('foo', 1);
      state.set('foo', 2, State.FEATURE_SCOPE);
      state.set('foo', 3, State.PLAYBOOK_SCOPE);
      eq(state.get('foo'), 1);
      eq(state.get('foo', State.SCENARIO_SCOPE), 1);
      eq(state.get('foo', State.FEATURE_SCOPE), 2);
      eq(state.get('foo', State.PLAYBOOK_SCOPE), 3);
    });
  });

  describe('Set', () => {
    it('should error when the specified scope does not exist', () => {
      throws(() => new State().set('foo', 1, 'missing'), { message: 'Invalid scope: missing' });
    });
  });

  describe('Remove', () => {
    it('should remove the specified item from the default scope', () => {
      const state = new State();
      state.set('foo', 1);
      eq(state.get('foo'), 1);
      state.remove('foo');
      eq(state.get('foo'), undefined);
    });

    it('should remove the specified item from the specified scope', () => {
      const state = new State();
      state.set('foo', 1, State.FEATURE_SCOPE);
      eq(state.get('foo', State.FEATURE_SCOPE), 1);
      state.remove('foo', State.FEATURE_SCOPE);
      eq(state.get('foo', State.FEATURE_SCOPE), undefined);
    });

    it('should error when the specified scope does not exist', () => {
      throws(() => new State().remove('foo', 'missing'), { message: 'Invalid scope: missing' });
    });
  });

  describe('Clear', () => {
    it('should remove all items from all scopes', () => {
      const state = new State();
      state.set('foo', 1, State.SCENARIO_SCOPE);
      state.set('foo', 2, State.FEATURE_SCOPE);
      state.set('foo', 3, State.PLAYBOOK_SCOPE);
      state.clear();

      eq(state.get('foo', State.SCENARIO_SCOPE), undefined);
      eq(state.get('foo', State.FEATURE_SCOPE), undefined);
      eq(state.get('foo', State.PLAYBOOK_SCOPE), undefined);
    });

    it('should remove all items from the specified scopes', () => {
      const state = new State();
      state.set('foo', 1, State.SCENARIO_SCOPE);
      state.set('foo', 2, State.FEATURE_SCOPE);
      state.set('foo', 3, State.PLAYBOOK_SCOPE);
      state.clear(State.SCENARIO_SCOPE, State.FEATURE_SCOPE);

      eq(state.get('foo', State.SCENARIO_SCOPE), undefined);
      eq(state.get('foo', State.FEATURE_SCOPE), undefined);
      eq(state.get('foo', State.PLAYBOOK_SCOPE), 3);
    });

    it('should error when the specified scope does not exist', () => {
      throws(() => new State().clear(State.SCENARIO_SCOPE, 'missing'), { message: 'Invalid scope: missing' });
    });
  });
});
