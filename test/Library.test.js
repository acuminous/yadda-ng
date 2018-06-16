const expect = require('expect');

const { Library, Converters, Localisation } = require('..');
const { NumberConverter } = Converters;
const { English } = Localisation;

describe('Library', () => {

  it('should generalise a statement', () => {
    expect(new Library().generalise('Given A')).toBe('Given A');
    expect(new Library({ language: new English() }).generalise('Given A')).toBe('A');
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

  it('should report duplicate step definitions defined by templates', async () => {
    expect(() => new Library({ name: 'test' })
      .define('duplicate step')
      .define('duplicate step')
    ).toThrow('Macro pattern [/^duplicate step$/] derived from template [duplicate step] defined in library [test] is a duplicate of pattern [/^duplicate step$/] derived from template [duplicate step] defined in library [test]');
  });

  it('should report duplicate step definitions defined by regular expressions', async () => {
    expect(() => new Library({ name: 'test' })
      .define(/duplicate step/)
      .define(/duplicate step/)
    ).toThrow('Macro pattern [/duplicate step/] defined in library [test] is a duplicate of pattern [/duplicate step/] defined in library [test]');
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
});
