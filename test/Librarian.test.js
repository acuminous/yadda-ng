const expect = require('expect');

const { Librarian, Library, Annotations } = require('..');

describe('Librarian', () => {

  it('should filter libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
    ] }).filter(['A', 'C']);

    librarian.createStep(new Annotations(), 'foo').run();
    librarian.createStep(new Annotations(), 'baz').run();

    expect(() => librarian.createStep(new Annotations(), 'bar').run()).toThrow('Undefined step: [bar]');
  });

  it('should create pending steps', () => {
    const librarian = new Librarian({ libraries: [
      new Library().define('foo'),
    ] });

    const step = librarian.createStep(new Annotations(), 'foo');

    expect(step.isPending()).toBe(true);
  });

  it('should create undefined steps', () => {
    const librarian = new Librarian({ libraries: [] });
    const step = librarian.createStep(new Annotations(), 'undefined');

    expect(step.isPending()).toBe(false);
    expect(() => step.run()).toThrow('Undefined step: [undefined]');
  });

  it('should create asynchronous steps', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library().define('foo', () => { run = true; }),
    ] });

    const step = librarian.createStep(new Annotations(), 'foo');
    expect(step.isPending()).toBe(false);

    await step.run();
    expect(run).toBe(true);
  });

  it.skip('should create ambiguous steps', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('foo'),
    ] });

    const step = librarian.createStep(new Annotations(), 'foo');

    expect(step.isPending()).toBe(false);
    expect(() => step.run()).toThrow('Undefined step: [undefined]');
  });

  it.skip('should select the compatible step that most closesly matches the statement', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library()
        .define(/(\d+) (.*) patient/, () => { throw new Error('Wrong step'); })
        .define(/1 (.*) patient/, () => { run = true; })
        .define(/([0123456789]+) (.*) patient/, () => { throw new Error('Wrong step'); })
    ] });

    const step = librarian.createStep(new Annotations(), 'Given 1 male patient');

    await step.run();
    expect(run).toBe(true);
  });

  it.skip('should select the compatible step that was from the previously used library ', () => {

  });
});
