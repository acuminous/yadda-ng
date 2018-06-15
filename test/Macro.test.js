const expect = require('expect');

const { Macro, Converters, Pattern } = require('..');
const { PassthroughConverter, UpperCaseConverter, LowerCaseConverter } = Converters;

describe('Macro', () => {

  it('should run step functions', async () => {
    const spy = new Spy();
    const macro = new Macro({ pattern: new Pattern(/.*/), converters: [], fn: spy.tap() });
    await macro.run({}, 'Some Text');
    expect(spy.invocations).toHaveLength(1);
  });

  it('should pass state to step functions', async () => {
    const state = { a: 1 };
    const spy = new Spy();
    const macro = new Macro({ pattern: new Pattern(/.*/), converters: [], fn: spy.tap() });
    await macro.run(state, 'Some Text');
    expect(spy.invocations[0][0]).toEqual({ a: 1 });
  });

  it('should allow state changes', async () => {
    const state = {};
    const macro = new Macro({ pattern: new Pattern(/.*/), converters: [], fn: (state) => state.updated = true });
    await macro.run(state, 'Some Text');
    expect(state.updated).toBe(true);
  });

  it('should pass parsed arguments to step functions', async () => {
    const spy = new Spy();
    const converters = [ new PassthroughConverter(), new PassthroughConverter() ];
    const macro = new Macro({ pattern: new Pattern(/^(.+) (.+)$/), converters, fn: spy.tap(3) });
    await macro.run({}, 'Bob Holness');
    expect(spy.invocations[0][1]).toBe('Bob');
    expect(spy.invocations[0][2]).toBe('Holness');
  });

  it('should convert parsed arguments', async () => {
    const spy = new Spy();
    const converters = [ new UpperCaseConverter(), new LowerCaseConverter() ];
    const macro = new Macro({ pattern: new Pattern(/^(.+) (.+)$/), converters, fn: spy.tap(3) });
    await macro.run({}, 'Bob Holness');
    expect(spy.invocations[0][1]).toBe('BOB');
    expect(spy.invocations[0][2]).toBe('holness');
  });

  it('should raise an error when there are fewer matches than converter arguments', async () => {
    const converters = [new PassthroughConverter(), new PassthroughConverter({ demand: 2 })];
    const spy = new Spy();
    const macro = new Macro({ pattern: new Pattern(/^(.+)$/), template: '$name', converters, fn: spy.tap() });
    expect(macro.run({}, 'Bob Holness')).rejects.toThrow('Step [Bob Holness] matched only 1 value using pattern [/^(.+)$/] from template [$name], but a total of 3 converter arguments were specified');
  });

  it('should raise an error when there are more matches than converter arguments', async () => {
    const converters = [new PassthroughConverter()];
    const spy = new Spy();
    const macro = new Macro({ pattern: new Pattern(/^(.+) (.+)$/), template: '$name', converters, fn: spy.tap() });
    expect(macro.run({}, 'Bob Holness')).rejects.toThrow('Step [Bob Holness] matched 2 values using pattern [/^(.+) (.+)$/] from template [$name], but only a total of 1 converter argument was specified');
  });

  it('should raise an error when there are fewer parsed arguments than step arguments', async () => {
    const converters = [new PassthroughConverter()];
    const macro = new Macro({ pattern: new Pattern(/^(.+)$/), template: '$name', converters, fn: (state, a, b) => {}});
    expect(macro.run({}, 'Bob Holness')).rejects.toThrow('Step [Bob Holness] yielded only 1 value using pattern [/^(.+)$/] from template [$name], but 2 step arguments were specified');
  });

  it('should raise an error when there are more parsed arguments than step arguments', async () => {
    const converters = [new PassthroughConverter({ demand: 2 })];
    const macro = new Macro({ pattern: new Pattern(/^(.+) (.+)$/), template: '$name', converters, fn: (state, a) => {}});
    expect(macro.run({}, 'Bob Holness')).rejects.toThrow('Step [Bob Holness] yielded 2 values using pattern [/^(.+) (.+)$/] from template [$name], but only 1 step argument was specified');
  });

});

class Spy {
  constructor() {
    this.invocations = [];
  }

  tap(arity = 1) {
    const fn = async function(...args) {
      this.invocations.push(args);
    }.bind(this);
    Object.defineProperty(fn, 'length', { value: arity });
    return fn;
  }
}
