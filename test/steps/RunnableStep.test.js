const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Steps, Macro, Library, Pattern, Signature, Functions, State } = require('../..');
const { RunnableStep } = Steps;
const { AsyncFunction, PendingFunction } = Functions;

describe('RunnableStep', () => {
  const library = new Library();
  const signature = new Signature({ library, pattern: new Pattern(/.*/) });
  const macro = new Macro({ signature, fn: new AsyncFunction({ fn: () => {} }) });
  const pendingMacro = new Macro({ signature, fn: new PendingFunction() });
  const programaticallyPendingMacro = new Macro({ signature, fn: new AsyncFunction({ fn: () => ({ status: 'pending' }) }) });

  it('should run a runnable step', async () => {
    const step = new RunnableStep({ text: 'Given A', macro });
    const result = await step.run(new State());
    deq(result, { status: 'run' });
  });

  it('should not run a pending step', async () => {
    const step = new RunnableStep({ text: 'Given A', macro: pendingMacro });
    const result = await step.run(new State());
    deq(result, { status: 'pending' });
  });

  it('should not run an aborted step', async () => {
    const step = new RunnableStep({ text: 'Given A', macro }).abort();
    eq(step.isAborted(), true);
    const result = await step.run(new State());
    deq(result, { status: 'aborted' });
  });

  it('should be pending the macro is without a function', async () => {
    const step = new RunnableStep({ text: 'Given A', macro });
    eq(step.isPending(), false);
  });

  it('should not be pending the macro has a function', async () => {
    const step = new RunnableStep({ text: 'Given A', macro: pendingMacro });
    eq(step.isPending(), true);
  });

  it('should honour return status', async () => {
    const step = new RunnableStep({ text: 'Given A', macro: programaticallyPendingMacro });
    const result = await step.run(new State());
    deq(result, { status: 'pending' });
  });
});
