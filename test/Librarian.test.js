const expect = require('expect');

const { Librarian, Library, Annotations, Competition } = require('..');

describe('Librarian', () => {

  it('should filter libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
    ] }).filter(['A', 'C']);

    librarian.createStep(new Competition(), new Annotations(), 'foo').run();
    librarian.createStep(new Competition(), new Annotations(), 'baz').run();

    expect(() => librarian.createStep(new Competition(), new Annotations(), 'bar').run()).toThrow('Undefined step: [bar]');
  });

  it('should create pending steps', () => {
    const librarian = new Librarian({ libraries: [
      new Library().define('foo'),
    ] });

    const step = librarian.createStep(new Competition(), new Annotations(), 'foo');

    expect(step.isPending()).toBe(true);
  });

  it('should create undefined steps', () => {
    const librarian = new Librarian({ libraries: [] });
    const step = librarian.createStep(new Competition(), new Annotations(), 'undefined step');

    expect(step.isPending()).toBe(false);
    expect(step.suggestion).toBe('.define(\'undefined step\', () => { // your code here })');
    expect(() => step.run()).toThrow('Undefined step: [undefined step]');
  });

  it('should create asynchronous steps', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library().define('foo', () => { run = true; }),
    ] });

    const step = librarian.createStep(new Competition(), new Annotations(), 'foo');
    expect(step.isPending()).toBe(false);

    await step.run();
    expect(run).toBe(true);
  });

  it('should create ambiguous steps from templates', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('foo'),
    ] });

    const step = librarian.createStep(new Competition(), new Annotations(), 'foo');

    expect(step.isPending()).toBe(false);
    expect(() => step.run()).toThrow('Ambiguous Step: [foo] is equally matched by macro with pattern [/^foo$/] derived from template [foo] defined in library [A], macro with pattern [/^foo$/] derived from template [foo] defined in library [B]');
  });

  it('should create ambiguous steps from patterns', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define(/.*/),
      new Library({ name: 'B' }).define(/.*/),
    ] });

    const step = librarian.createStep(new Competition(), new Annotations(), 'foo');

    expect(step.isPending()).toBe(false);
    expect(() => step.run()).toThrow('Ambiguous Step: [foo] is equally matched by macro with pattern [/.*/] defined in library [A], macro with pattern [/.*/] defined in library [B]');
  });

  it('should prefer the compatible steps from the previous winners library', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define(/B/, () => { throw new Error('Wrong step'); }),
      new Library({ name: 'B' }).define(/A/),
      new Library({ name: 'B' }).define(/B/, () => { run = true; }),
      new Library({ name: 'C' }).define(/B/, () => { throw new Error('Wrong step'); }),
    ] });

    const competition = new Competition();
    librarian.createStep(competition, new Annotations(), 'A');
    const step = librarian.createStep(competition, new Annotations(), 'B');

    await step.run();
    expect(run).toBe(true);
  });
});
