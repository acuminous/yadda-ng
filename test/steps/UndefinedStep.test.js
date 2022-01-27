const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Annotations, Steps, State } = require('../..');
const { UndefinedStep } = Steps;

describe('UndefinedStep', () => {
  it('should run step', async () => {
    const step = new UndefinedStep({ text: 'Given A', generalised: 'A' });
    const outcome = await step.run(new State());
    eq(outcome.status, 'undefined');
    eq(outcome.suggestion, ".define('A', (state) => { // your code here })");
  });

  it('should not abort', async () => {
    const step = new UndefinedStep({ text: 'Given A', generalised: 'A' });
    const outcome = await step.abort().run(new State());

    eq(step.isAborted(), false);
    eq(outcome.status, 'undefined');
    eq(outcome.suggestion, ".define('A', (state) => { // your code here })");
  });

  it('should advise when pending', async () => {
    const annotations = new Annotations().add('pending');
    const step = new UndefinedStep({ annotations, text: 'Given A', generalised: 'A' });
    eq(step.isPending(), true);

    const status = await step.run(new State());
    deq(status, { status: 'pending' });
  });

  it('should advise when not pending', () => {
    eq(new UndefinedStep({ text: 'Given A', generalised: 'A' }).isPending(), false);
  });

  it('should delete current library when not pending', async () => {
    const step = new UndefinedStep({ text: 'Given A', generalised: 'A' });
    const state = new State();
    state.set('currentLibrary', 'A');
    await step.run(state);
    eq(state.currentLibrary, undefined);
  });

  it('should not delete current library when pending', async () => {
    const annotations = new Annotations().add('pending');
    const step = new UndefinedStep({ annotations, text: 'Given A', generalised: 'A' });
    const state = new State();
    state.set('currentLibrary', 'A');
    await step.run(state);
    eq(state.get('currentLibrary'), 'A');
  });
});
