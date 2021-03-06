const expect = require('expect');

const { Librarian, Library, Annotations, Steps, State } = require('../..');
const { DynamicStep } = Steps;

describe('DynamicStep', () => {

  it('should create undefined steps', async () => {
    const librarian = new Librarian({ libraries: [] });
    const step = new DynamicStep({ librarian, annotations: new Annotations(), text: 'foo', generalised: 'bar' });
    expect(step.isPending()).toBe(false);

    const outcome = await step.run(new State());
    expect(outcome.status).toBe('undefined');
    expect(outcome.suggestion).toBe('.define(\'bar\', (state) => { // your code here })');
  });

  it('should disregard pending annotations', async () => {
    const librarian = new Librarian({ libraries: [
      new Library().define('foo'),
    ] });

    const annotations = new Annotations().add('pending');

    const step = new DynamicStep({ librarian, annotations, text: 'foo', generalised: 'foo' });
    expect(step.isPending()).toBe(false);

    const outcome = await step.run(new State());
    expect(outcome.status).toBe('pending');
  });

  it('should create asynchronous steps', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library().define('foo', () => { run = true; }),
    ] });

    const step = new DynamicStep({ librarian, annotations: new Annotations(), text: 'foo', generalised: 'foo' });
    expect(step.isPending()).toBe(false);

    const outcome = await step.run(new State());
    expect(run).toBe(true);
    expect(outcome.status).toBe('run');
  });

  it('should create ambiguous steps', async () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('foo'),
    ] });

    const step = new DynamicStep({ librarian, annotations: new Annotations(), text: 'foo', generalised: 'foo' });
    expect(step.isPending()).toBe(false);

    const outcome = await step.run(new State());
    expect(outcome.status).toBe('ambiguous');
    expect(outcome.contenders.length).toBe(2);
  });

  it('should prefer the compatible steps from the previous winners library', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define(/B/, () => { throw new Error('Wrong step'); }),
      new Library({ name: 'B' }).define(/A/),
      new Library({ name: 'B' }).define(/B/, () => { run = true; }),
      new Library({ name: 'C' }).define(/B/, () => { throw new Error('Wrong step'); }),
    ] });

    const step = new DynamicStep({ librarian, annotations: new Annotations(), text: 'B', generalised: 'B' });

    const state = new State();
    state.set('currentLibrary', 'B');
    const outcome = await step.run(state);
    expect(run).toBe(true);
    expect(outcome.status).toBe('run');
  });
});
