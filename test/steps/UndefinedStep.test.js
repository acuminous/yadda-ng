const expect = require('expect');

const { Annotations, Steps, State } = require('../..');
const { UndefinedStep } = Steps;

describe('UndefinedStep', () => {

  it('should run step', async () => {
    const step = new UndefinedStep({ text: 'Given A', generalised: 'A' });
    const outcome = await step.run(new State());
    expect(outcome.status).toBe('undefined');
    expect(outcome.suggestion).toBe('.define(\'A\', (state) => { // your code here })');
  });

  it('should not abort', async () => {
    const step = new UndefinedStep({ text: 'Given A', generalised: 'A' });
    const outcome = await step.abort().run(new State());

    expect(step.isAborted()).toBe(false);
    expect(outcome.status).toBe('undefined');
    expect(outcome.suggestion).toBe('.define(\'A\', (state) => { // your code here })');
  });

  it('should advise when pending', async () => {
    const annotations = new Annotations().add('pending');
    const step = new UndefinedStep({ annotations, text: 'Given A', generalised: 'A' });
    expect(step.isPending()).toBe(true);

    const status = await step.run(new State());
    expect(status).toEqual({ status: 'pending' });
  });

  it('should advise when not pending', () => {
    expect(new UndefinedStep({ text: 'Given A', generalised: 'A' }).isPending()).toBe(false);
  });

  it('should delete current library when not pending', async () => {
    const step = new UndefinedStep({ text: 'Given A', generalised: 'A' });
    const state = new State();
    state.set('currentLibrary', 'A');
    await step.run(state);
    expect(state.currentLibrary).toBe(undefined);
  });

  it('should not delete current library when pending', async () => {
    const annotations = new Annotations().add('pending');
    const step = new UndefinedStep({ annotations, text: 'Given A', generalised: 'A' });
    const state = new State();
    state.set('currentLibrary', 'A');
    await step.run(state);
    expect(state.get('currentLibrary')).toBe('A');
  });

});
