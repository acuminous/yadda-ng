const expect = require('expect');

const { Library, Signature, Macro, Converters, Pattern, Functions, State } = require('..');
const { PassThroughConverter, UpperCaseConverter, LowerCaseConverter } = Converters;
const { AsyncFunction, CallbackFunction } = Functions;

describe('Macro', () => {

  it('should advise when it supports generalised text', () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/^A$/) });
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters: [], fn: spy.tap() });
    expect(macro.supports({ generalised: 'A' })).toBe(true);
  });

  it('should advise when it does not support generalised text', () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/^A$/) });
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters: [], fn: spy.tap() });
    expect(macro.supports({ generalised: 'B' })).toBe(false);
  });

  it('should set the preferred library ', () => {
    const library = new Library({ name: 'A' });
    const signature = new Signature({ library, pattern: new Pattern(/^A$/) });
    const macro = new Macro({ signature, converters: [] });
    expect(macro.isFromLibrary('A')).toBe(true);
    expect(macro.isFromLibrary('B')).toBe(false);
  });

  it('should advise when it is from the named library', () => {
    const library = new Library({ name: 'A' });
    const signature = new Signature({ library, pattern: new Pattern(/^A$/) });
    const macro = new Macro({ signature, converters: [] });
    expect(macro.isFromLibrary('A')).toBe(true);
    expect(macro.isFromLibrary('B')).toBe(false);
  });

  it('should run async step functions', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters: [], fn: spy.tap() });
    await macro.run(new State(), { text: 'Some Text', generalised: 'Some Text' });
    expect(spy.invocations).toHaveLength(1);
  });

  it('should run callback step functions', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const spy = new CallbackSpy();
    const macro = new Macro({ signature, converters: [], fn: spy.tap() });
    await macro.run(new State(), { text: 'Some Text', generalised: 'Some Text' });
    expect(spy.invocations).toHaveLength(1);
  });

  it('should pass state to step functions', async () => {
    const state = new State();
    state.set('A', 1);
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters: [], fn: spy.tap() });
    const step = { text: 'Some Text', generalised: 'Some Text' };
    await macro.run(state, step);
    expect(spy.invocations[0][0]).toBe(state);
  });

  it('should decorate state with current library', async () => {
    const state = new State();
    state.set('A', 1);
    const library = new Library({ name: 'A' });
    const signature = new Signature({ library, pattern: new Pattern(/.*/) });
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters: [], fn: spy.tap() });
    await macro.setCurrentLibrary(state);
    expect(state.get('currentLibrary')).toBe('A');
  });

  it('should pass parsed arguments to step functions', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/^(.+) (.+)$/) });
    const converters = [ new PassThroughConverter(), new PassThroughConverter() ];
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters, fn: spy.tap(3) });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await macro.run(new State(), step);
    expect(spy.invocations[0][1]).toBe('Bob');
    expect(spy.invocations[0][2]).toBe('Holness');
  });

  it('should convert parsed arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/^(.+) (.+)$/) });
    const converters = [ new UpperCaseConverter(), new LowerCaseConverter() ];
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters, fn: spy.tap(3) });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await macro.run(new State(), step);
    expect(spy.invocations[0][1]).toBe('BOB');
    expect(spy.invocations[0][2]).toBe('holness');
  });

  it('should raise an error when there are fewer matches than converter arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, pattern: new Pattern(/^(.+)$/), template: '$name' });
    const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters, fn: spy.tap() });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded only 1 value using signature [/^(.+)$/] derived from template [$name] defined in library [test], but 3 converter arguments were specified');
  });

  it('should raise an error when there are more matches than converter arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, template: '$name', pattern: new Pattern(/^(.+) (.+)$/) });
    const converters = [new PassThroughConverter()];
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters, fn: spy.tap() });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] derived from template [$name] defined in library [test], but only 1 converter argument was specified');
  });

  it('should raise an error when there are some matches but no converter arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, template: '$name', pattern: new Pattern(/^(.+) (.+)$/) });
    const converters = [];
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters, fn: spy.tap() });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] derived from template [$name] defined in library [test], but no converter arguments were specified');
  });

  it('should raise an error when there are no matches but some converter arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, template: '$name', pattern: new Pattern(/^.+$/) });
    const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
    const spy = new AsyncSpy();
    const macro = new Macro({ signature, converters, fn: spy.tap() });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded no values using signature [/^.+$/] derived from template [$name] defined in library [test], but 3 converter arguments were specified');
  });

  it('should raise an error when there are fewer parsed arguments than step arguments', async () => {
    const library = new Library({ name: 'test' });
    const converters = [new PassThroughConverter()];
    const signature = new Signature({ library, pattern: new Pattern(/^(.+)$/), template: '$name' });
    const fn = new AsyncFunction({ fn: (state, a, b) => {} });
    const macro = new Macro({ signature, converters, fn });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded only 1 value using signature [/^(.+)$/] derived from template [$name] defined in library [test], but 2 step arguments were specified');
  });

  it('should raise an error when there are more parsed arguments than step arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, template: '$name', pattern: new Pattern(/^(.+) (.+)$/) });
    const converters = [new PassThroughConverter({ demand: 2 })];
    const fn = new AsyncFunction({ fn: (state, a) => {} });
    const macro = new Macro({ signature, converters, fn });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] derived from template [$name] defined in library [test], but only 1 step argument was specified');
  });

  it('should raise an error when there no parsed arguments but some step arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, template: '$name', pattern: new Pattern(/^.+$/) });
    const converters = [];
    const fn = new AsyncFunction({ fn: (state, a, b) => {} });
    const macro = new Macro({ signature, converters, fn });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded no values using signature [/^.+$/] derived from template [$name] defined in library [test], but 2 step arguments were specified');
  });

  it('should raise an error when there some parsed arguments but no step arguments', async () => {
    const library = new Library({ name: 'test' });
    const signature = new Signature({ library, template: '$name', pattern: new Pattern(/^(.+) (.+)$/) });
    const converters = [new PassThroughConverter({ demand: 2 })];
    const fn = new AsyncFunction({ fn: (state) => {} });
    const macro = new Macro({ signature, converters, fn });
    const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
    await expect(macro.run(new State(), step)).rejects
      .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] derived from template [$name] defined in library [test], but no step arguments were specified');
  });

  describe('without template', () => {

    it('should raise an error when there are fewer matches than converter arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^(.+)$/) });
      const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
      const spy = new AsyncSpy();
      const macro = new Macro({ signature, converters, fn: spy.tap() });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded only 1 value using signature [/^(.+)$/] defined in library [test], but 3 converter arguments were specified');
    });

    it('should raise an error when there are more matches than converter arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^(.+) (.+)$/) });
      const converters = [new PassThroughConverter()];
      const spy = new AsyncSpy();
      const macro = new Macro({ signature, converters, fn: spy.tap() });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] defined in library [test], but only 1 converter argument was specified');
    });

    it('should raise an error when there are some matches but no converter arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^(.+) (.+)$/) });
      const converters = [];
      const spy = new AsyncSpy();
      const macro = new Macro({ signature, converters, fn: spy.tap() });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] defined in library [test], but no converter arguments were specified');
    });

    it('should raise an error when there are no matches but some converter arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^.+$/) });
      const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
      const spy = new AsyncSpy();
      const macro = new Macro({ signature, converters, fn: spy.tap() });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded no values using signature [/^.+$/] defined in library [test], but 3 converter arguments were specified');
    });

    it('should raise an error when there are fewer parsed arguments than step arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^(.+)$/) });
      const converters = [new PassThroughConverter()];
      const fn = new AsyncFunction({ fn: (state, a, b) => {} });
      const macro = new Macro({ signature, converters, fn });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded only 1 value using signature [/^(.+)$/] defined in library [test], but 2 step arguments were specified');
    });

    it('should raise an error when there are more parsed arguments than step arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^(.+) (.+)$/) });
      const converters = [new PassThroughConverter({ demand: 2 })];
      const fn = new AsyncFunction({ fn: (state, a) => {} });
      const macro = new Macro({ signature, converters, fn });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] defined in library [test], but only 1 step argument was specified');
    });

    it('should raise an error when there no parsed arguments but some step arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^.+$/) });
      const converters = [];
      const fn = new AsyncFunction({ fn: (state, a, b) => {} });
      const macro = new Macro({ signature, converters, fn });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded no values using signature [/^.+$/] defined in library [test], but 2 step arguments were specified');
    });

    it('should raise an error when there some parsed arguments but no step arguments', async () => {
      const library = new Library({ name: 'test' });
      const signature = new Signature({ library, pattern: new Pattern(/^(.+) (.+)$/) });
      const converters = [new PassThroughConverter({ demand: 2 })];
      const fn = new AsyncFunction({ fn: (state) => {} });
      const macro = new Macro({ signature, converters, fn });
      const step = { text: 'Bob Holness', generalised: 'Bob Holness' };
      await expect(macro.run(new State(), step)).rejects
        .toThrow('Step [Bob Holness] yielded 2 values using signature [/^(.+) (.+)$/] defined in library [test], but no step arguments were specified');
    });
  });

});

class AsyncSpy {
  constructor() {
    this.invocations = [];
  }

  tap(arity = 1) {
    const fn = async function(...args) {
      this.invocations.push(args);
    }.bind(this);
    Object.defineProperty(fn, 'length', { value: arity });
    return new AsyncFunction({ fn });
  }
}

class CallbackSpy {
  constructor() {
    this.invocations = [];
  }

  tap(arity = 1) {
    const fn = function(...args) {
      this.invocations.push(args);
      args[args.length - 1]();
    }.bind(this);
    Object.defineProperty(fn, 'length', { value: arity });
    return new CallbackFunction({ fn });
  }
}
