const expect = require('expect');

const { Library, Converters } = require('..');
const { NumberConverter } = Converters;

describe('Library', () => {

  it('should answer to it\'s own name', () => {
    expect(new Library({ name: 'Bob' }).answersTo('Bob')).toBe(true);
  });

  it('should not answer to another\'s name', () => {
    expect(new Library({ name: 'Bob' }).answersTo('Jim')).toBe(false);
  });

  it('should define a step using a single regular expressions and no matching groups', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define(/step 1/, (state) => state.invocations++);

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(1);

    await candidates[0].run(state, 'step 1');
    expect(state.invocations).toBe(1);
  });

  it('should define a step using a single string and no matching groups', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define('step 1', (state) => state.invocations++);

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(1);

    await candidates[0].run(state, 'step 1');
    expect(state.invocations).toBe(1);
  });

  it('should define a step using multiple templates and no matching groups', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define(['step 1', /STEP 1/], (state) => {
        state.invocations++;
      });

    const candidates1 = library.getCandidateMacros('step 1');
    expect(candidates1.length).toBe(1);
    await candidates1[0].run(state, 'step 1');

    const candidates2 = library.getCandidateMacros('STEP 1');
    expect(candidates2.length).toBe(1);
    await candidates2[0].run(state, 'STEP 1');

    expect(state.invocations).toBe(2);
  });

  it('should define a step using a single string and matching group with default converters', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define('step $number', (state, value) => {
        expect(value).toBe('1');
        state.invocations++;
      });

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(1);

    await candidates[0].run(state, 'step 1');
    expect(state.invocations).toBe(1);
  });

  it('should define a step using a single regular expression and matching group with default converters', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define(/step (\d)/, (state, value) => {
        expect(value).toBe('1');
        state.invocations++;
      });

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(1);

    await candidates[0].run(state, 'step 1');
    expect(state.invocations).toBe(1);
  });

  it('should define a step using a single string and matching group with custom converters', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define('step $number', (state, value) => {
        expect(value).toBe(1);
        state.invocations++;
      }, new NumberConverter());

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(1);

    await candidates[0].run(state, 'step 1');
    expect(state.invocations).toBe(1);
  });

  it('should define a step using a single regular expression and matching group with custom converters', async () => {
    const state = { invocations: 0 };
    const library = new Library()
      .define(/step (\d)/, (state, value) => {
        expect(value).toBe(1);
        state.invocations++;
      }, new NumberConverter());

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(1);

    await candidates[0].run(state, 'step 1');
    expect(state.invocations).toBe(1);
  });

  it('should report duplicate step definitions', async () => {
    expect(() => new Library({ name: 'test' })
      .define(/^duplicate step$/)
      .define('duplicate step')
    ).toThrow('Duplicate step definition [^duplicate step$] in library [test]');
  });

  it('should return matching candidate', async () => {
    const library = new Library()
      .define(/step (.+)/)
      .define('step (.*)')
      .define('step $term')
      .define('step 1')
      .define('not this one');

    const candidates = library.getCandidateMacros('step 1');
    expect(candidates.length).toBe(4);
  });

  xit('should report all duplicate patterns in the error message');
  xit('should be consistent with template, pattern, signature');
});
