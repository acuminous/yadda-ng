const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Steps, Macro, Pattern, Library, Signature, State } = require('../..');
const { AmbiguousStep } = Steps;

describe('AmbiguousStep', () => {
  it('should run step', async () => {
    const library = new Library();
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const macro = new Macro({ signature, fn: () => {} });
    const step = new AmbiguousStep({ text: 'Given A', contenders: [macro] });
    const outcome = await step.run(new State());
    eq(outcome.status, 'ambiguous');
    deq(outcome.contenders, [macro]);
  });

  it('should not abort', async () => {
    const library = new Library();
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const macro = new Macro({ signature, fn: () => {} });
    const step = new AmbiguousStep({ text: 'Given A', contenders: [macro] });
    const outcome = await step.abort().run(new State());

    eq(step.isAborted(), false);
    eq(outcome.status, 'ambiguous');
    deq(outcome.contenders, [macro]);
  });

  it('should not be pending', () => {
    eq(new AmbiguousStep({ text: 'Given A', contenders: [] }).isPending(), false);
  });

  it('should delete current library from state', async () => {
    const step = new AmbiguousStep({ text: 'Given A', contenders: [] });
    const state = new State();
    state.set('currentLibrary', 'A');
    await step.run(state);
    eq(state.currentLibrary, undefined);
  });
});
