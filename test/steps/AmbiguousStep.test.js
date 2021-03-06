const expect = require('expect');

const { Steps, Macro, Pattern, Library, Signature, State } = require('../..');
const { AmbiguousStep } = Steps;

describe('AmbiguousStep', () => {

  it('should run step', async () => {
    const library = new Library();
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const macro = new Macro({ signature, fn: () => {} });
    const step = new AmbiguousStep({ text: 'Given A', contenders: [ macro ] });
    const outcome = await step.run(new State());
    expect(outcome.status).toBe('ambiguous');
    expect(outcome.contenders).toEqual([ macro ]);
  });

  it('should not abort', async () => {
    const library = new Library();
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const macro = new Macro({ signature, fn: () => {} });
    const step = new AmbiguousStep({ text: 'Given A', contenders: [ macro ] });
    const outcome = await step.abort().run(new State());

    expect(step.isAborted()).toBe(false);
    expect(outcome.status).toBe('ambiguous');
    expect(outcome.contenders).toEqual([ macro ]);
  });

  it('should not be pending', () => {
    expect(new AmbiguousStep({ text: 'Given A', contenders: [] }).isPending()).toBe(false);
  });

  it('should delete current library from state', async () => {
    const step = new AmbiguousStep({ text: 'Given A', contenders: [] });
    const state = new State();
    state.set('currentLibrary', 'A');
    await step.run(state);
    expect(state.currentLibrary).toBe(undefined);
  });

});
