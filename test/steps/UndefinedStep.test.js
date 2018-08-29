const expect = require('expect');

const { Annotations, Steps } = require('../..');
const { UndefinedStep } = Steps;

describe('UndefinedStep', () => {

  it('should run step', async () => {
    const step = new UndefinedStep({ statement: 'Given A', generalised: 'A' });
    const outcome = await step.run({});
    expect(outcome.status).toBe('undefined');
    expect(outcome.suggestion).toBe('.define(\'A\', (state) => { // your code here })');
  });

  it('should advise when pending', async () => {
    const annotations = new Annotations().add('pending');
    const step = new UndefinedStep({ annotations, statement: 'Given A', generalised: 'A' });
    expect(step.isPending()).toBe(true);

    const status = await step.run({});
    expect(status).toEqual({ status: 'pending' });
  });

  it('should advise when not pending', () => {
    expect(new UndefinedStep({ statement: 'Given A', generalised: 'A' }).isPending()).toBe(false);
  });

  it('should delete current library when not pending', async () => {
    const step = new UndefinedStep({ statement: 'Given A', generalised: 'A' });
    const state = { currentLibrary: 'A' };
    await step.run(state);
    expect(state.currentLibrary).toBe(undefined);
  });

  it('should not delete current library when pending', async () => {
    const annotations = new Annotations().add('pending');
    const step = new UndefinedStep({ annotations, statement: 'Given A', generalised: 'A' });
    const state = { currentLibrary: 'A' };
    await step.run(state);
    expect(state.currentLibrary).toBe('A');
  });

});
