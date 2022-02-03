const { strictEqual: eq, deepStrictEqual: deq, match, throws } = require('assert');

const { Library, Converters } = require('..');
const { NumberConverter } = Converters;

describe('Library', () => {
  it('should use the specified name', () => {
    eq(new Library({ name: 'Search' }).name, 'Search');
  });

  it('should default to randomised constructor name', () => {
    class CustomLibrary extends Library {}
    match(new CustomLibrary().name, /CustomLibrary-\w+/);
  });

  it('should define a step using a single regular expressions and no matching groups', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(/step 1/, (state) => state.invocations++);

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single string and no matching groups', async () => {
    const state = { invocations: 0 };
    const library = new Library().define('step 1', (state) => state.invocations++);

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using multiple templates and no matching groups', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(['step 1', /STEP 1/], (state) => {
      state.invocations++;
    });

    const lcStep = { text: 'step 1', generalised: 'step 1' };
    const candidates1 = library.getCompatibleMacros(lcStep);
    eq(candidates1.length, 1);
    await candidates1[0].run(state, lcStep);

    const ucStep = { text: 'STEP 1', generalised: 'STEP 1' };
    const candidates2 = library.getCompatibleMacros(ucStep);
    eq(candidates2.length, 1);
    await candidates2[0].run(state, ucStep);

    eq(state.invocations, 2);
  });

  it('should define a step using a single string and matching group with default converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define('step $number', (state, value) => {
      eq(value, '1');
      state.invocations++;
    });

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single regular expression and matching group with default converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(/step (\d)/, (state, value) => {
      eq(value, '1');
      state.invocations++;
    });

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single string and matching group with custom converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(
      'step $number',
      (state, value) => {
        eq(value, 1);
        state.invocations++;
      },
      {
        arguments: {
          converters: [new NumberConverter()],
        },
      }
    );

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single regular expression and matching group with custom converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(
      /step (\d)/,
      (state, value) => {
        eq(value, 1);
        state.invocations++;
      },
      {
        arguments: {
          converters: [new NumberConverter()],
        },
      }
    );

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single string with no arguments and a docstring with default converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(
      'step',
      (state, value) => {
        eq(value, '1');
        state.invocations++;
      },
      { docString: true }
    );

    const step = { text: 'step', generalised: 'step', docString: '1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single string with arguments and a docstring with default converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(
      'step $value',
      (state, value, docString) => {
        eq(value, '1');
        eq(docString, '2');
        state.invocations++;
      },
      { docString: true }
    );

    const step = { text: 'step 1', generalised: 'step 1', docString: '2' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single string and a docstring with custom converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(
      'step',
      (state, value) => {
        eq(value, 1);
        state.invocations++;
      },
      {
        docString: {
          converter: new NumberConverter(),
        },
      }
    );

    const step = { text: 'step', generalised: 'step', docString: '1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should define a step using a single string with arguments using custom converters and a docstring with custom converters', async () => {
    const state = { invocations: 0 };
    const library = new Library().define(
      'step $value',
      (state, value, docString) => {
        eq(value, 1);
        eq(docString, 2);
        state.invocations++;
      },
      {
        arguments: {
          converters: [new NumberConverter()],
        },
        docString: {
          converter: new NumberConverter(),
        },
      }
    );

    const step = { text: 'step 1', generalised: 'step 1', docString: '2' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 1);

    await candidates[0].run(state, step);
    eq(state.invocations, 1);
  });

  it('should report duplicate step definitions defined by templates', async () => {
    throws(() => new Library({ name: 'test' }).define('duplicate step').define('duplicate step'), {
      message: 'Signature [/^duplicate step$/] derived from template [duplicate step] defined in library [test] is a duplicate of signature [/^duplicate step$/] derived from template [duplicate step] defined in library [test]',
    });
  });

  it('should report duplicate step definitions defined by templates', async () => {
    throws(() => new Library({ name: 'test' }).define('$foo step').define('$bar step'), { message: 'Signature [/^(\\S+) step$/] derived from template [$bar step] defined in library [test] is a duplicate of signature [/^(\\S+) step$/] derived from template [$foo step] defined in library [test]' });
  });

  it('should report duplicate step definitions defined by regular expressions', async () => {
    throws(() => new Library({ name: 'test' }).define(/duplicate step/).define(/duplicate step/), { message: 'Signature [/duplicate step/] defined in library [test] is a duplicate of signature [/duplicate step/] defined in library [test]' });
  });

  it('should return matching candidate', async () => {
    const library = new Library()
      .define(/step (.+)/)
      .define('step (.*)')
      .define('step $term')
      .define('step 1')
      .define('not this one');

    const step = { text: 'step 1', generalised: 'step 1' };
    const candidates = library.getCompatibleMacros(step);
    eq(candidates.length, 4);
  });
});
