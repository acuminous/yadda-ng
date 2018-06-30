const expect = require('expect');

const { Steps, Macro, Library, Pattern } = require('../..');
const { AsyncStep } = Steps;

describe('AsyncStep', () => {
  const library = new Library();
  const macro = new Macro({ library, pattern: new Pattern(/.*/), fn: () => {} });
  const pendingMacro = new Macro({ library, pattern: new Pattern(/.*/) });

  it('should run step', async () => {
    await expect(new AsyncStep({ statement: 'Given A', macro }).run({})).resolves.toEqual({ status: 'run' });
    await expect(new AsyncStep({ statement: 'Given A', macro: pendingMacro }).run({})).resolves.toEqual({ status: 'pending' });
  });

  it('should be pending the macro is without a function', async () => {
    await expect(new AsyncStep({ statement: 'Given A', macro }).isPending()).toBe(false);
  });

  it('should not be pending the macro has a function', async () => {
    await expect(new AsyncStep({ statement: 'Given A', macro: pendingMacro }).isPending()).toBe(true);
  });

});
