const expect = require('expect');

const { Steps, Macro, Library, Pattern, Signature, Functions, State } = require('../..');
const { RunnableStep } = Steps;
const { AsyncFunction, PendingFunction } = Functions;

describe('RunnableStep', () => {
  const library = new Library();
  const signature = new Signature({ library, pattern: new Pattern(/.*/) });
  const macro = new Macro({ signature, fn: new AsyncFunction ({ fn: () => {} }) });
  const pendingMacro = new Macro({ signature, fn: new PendingFunction() });
  const programaticallyPendingMacro = new Macro({ signature, fn: new AsyncFunction ({ fn: () => ({ status: 'pending' }) }) });

  it('should run a runnable step', async () => {
    const step = new RunnableStep({ text: 'Given A', macro });
    await expect(step.run(new State())).resolves.toEqual({ status: 'run' });
  });

  it('should not run a pending step', async () => {
    const step = new RunnableStep({ text: 'Given A', macro: pendingMacro });
    await expect(step.run(new State())).resolves.toEqual({ status: 'pending' });
  });

  it('should not run an aborted step', async () => {
    const step = new RunnableStep({ text: 'Given A', macro }).abort();
    expect(step.isAborted()).toBe(true);
    await expect(step.run(new State())).resolves.toEqual({ status: 'aborted' });
  });

  it('should be pending the macro is without a function', async () => {
    const step = new RunnableStep({ text: 'Given A', macro });
    expect(step.isPending()).toBe(false);
  });

  it('should not be pending the macro has a function', async () => {
    const step = new RunnableStep({ text: 'Given A', macro: pendingMacro });
    expect(step.isPending()).toBe(true);
  });

  it('should honour return status', async () => {
    const step = new RunnableStep({ text: 'Given A', macro: programaticallyPendingMacro });
    await expect(step.run(new State())).resolves.toEqual({ status: 'pending' });
  });

});
