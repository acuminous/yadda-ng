const expect = require('expect');

const { Steps, Macro, Library, Pattern } = require('../..');
const { AsyncStep } = Steps;

describe('AsyncStep', () => {
  const library = new Library();
  const macro = new Macro({ library, pattern: new Pattern(/.*/), fn: () => {} });
  const pendingMacro = new Macro({ library, pattern: new Pattern(/.*/) });

  it('should pretend to run step', () => {
    expect(new AsyncStep({ statement: 'Given A', macro }).pretend()).toBe('run');
  });

  it('should run step', async () => {
    expect(new AsyncStep({ statement: 'Given A', macro }).run()).resolves.toBe('run');
    expect(new AsyncStep({ statement: 'Given A', macro: pendingMacro }).run()).resolves.toBe('pending');
  });

  it('should be pending the macro is without a function', () => {
    expect(new AsyncStep({ statement: 'Given A', macro }).isPending()).toBe(false);
  });

  it('should not be pending the macro has a function', () => {
    expect(new AsyncStep({ statement: 'Given A', macro: pendingMacro }).isPending()).toBe(true);
  });

});
