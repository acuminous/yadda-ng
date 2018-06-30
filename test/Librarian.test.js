const expect = require('expect');

const { Librarian, Library, Annotations, Competition, Steps } = require('..');
const { DynamicStep } = Steps;

describe('Librarian', () => {

  it('should return compatible macros', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] });

    const macros = librarian.getCompatibleMacros('bar');
    expect(macros.length).toBe(2);
    expect(macros[0].supports('bar')).toBe(true);
    expect(macros[1].supports('bar')).toBe(true);
  });

  it('should filter libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).filter(['A', 'B', 'C']);

    const macros = librarian.getCompatibleMacros('bar');
    expect(macros.length).toBe(1);
    expect(macros[0].supports('bar')).toBe(true);
  });

  it('should not filter when passed no filters', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).filter();

    const macros = librarian.getCompatibleMacros('bar');
    expect(macros.length).toBe(2);
  });

  xit('should filter libraries', async () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
    ] }).filter(['A', 'C']);

    const foo = new DynamicStep({ librarian, competition: new Competition(), statement: 'foo' });
    const bar = new DynamicStep({ librarian, competition: new Competition(), statement: 'bar' });
    const baz = new DynamicStep({ librarian, competition: new Competition(), statement: 'baz' });

    await foo.run({});
    await expect(bar.run()).rejects.toThrow('Undefined step: [bar]');
    await baz.run({});
  });

  xit('should create pending steps', () => {
    const librarian = new Librarian({ libraries: [
      new Library().define('foo'),
    ] });

    const step = librarian.registerStep(new Competition(), new Annotations(), 'foo');

    expect(step.isPending()).toBe(true);
  });

  xit('should create undefined steps', () => {
    const librarian = new Librarian({ libraries: [] });
    const step = librarian.registerStep(new Competition(), new Annotations(), 'undefined step');

    expect(step.isPending()).toBe(false);
    expect(step.suggestion).toBe('.define(\'undefined step\', () => { // your code here })');
    expect(() => step.run()).toThrow('Undefined step: [undefined step]');
  });

  xit('should create asynchronous steps', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library().define('foo', () => { run = true; }),
    ] });

    const step = librarian.registerStep(new Competition(), new Annotations(), 'foo');
    expect(step.isPending()).toBe(false);

    await step.run();
    expect(run).toBe(true);
  });

  xit('should create ambiguous steps from templates', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('foo'),
    ] });

    const step = librarian.registerStep(new Competition(), new Annotations(), 'foo');

    expect(step.isPending()).toBe(false);
    expect(() => step.run()).toThrow('Ambiguous Step: [foo] is equally matched by macro with pattern [/^foo$/] derived from template [foo] defined in library [A], macro with pattern [/^foo$/] derived from template [foo] defined in library [B]');
  });

  xit('should create ambiguous steps from patterns', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define(/.*/),
      new Library({ name: 'B' }).define(/.*/),
    ] });

    const step = librarian.registerStep(new Competition(), new Annotations(), 'foo');

    expect(step.isPending()).toBe(false);
    expect(() => step.run()).toThrow('Ambiguous Step: [foo] is equally matched by macro with pattern [/.*/] defined in library [A], macro with pattern [/.*/] defined in library [B]');
  });

  xit('should prefer the compatible steps from the previous winners library', async () => {
    let run = false;

    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define(/B/, () => { throw new Error('Wrong step'); }),
      new Library({ name: 'B' }).define(/A/),
      new Library({ name: 'B' }).define(/B/, () => { run = true; }),
      new Library({ name: 'C' }).define(/B/, () => { throw new Error('Wrong step'); }),
    ] });

    const competition = new Competition();
    librarian.registerStep(competition, new Annotations(), 'A');
    const step = librarian.registerStep(competition, new Annotations(), 'B');

    await step.run();
    expect(run).toBe(true);
  });
});
