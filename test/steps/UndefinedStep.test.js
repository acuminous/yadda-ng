const expect = require('expect');

const { Steps } = require('../..');
const { UndefinedStep } = Steps;

describe('UndefinedStep', () => {

  it('should pretend to run step', () => {
    expect(new UndefinedStep({ statement: 'Given A' }).pretend()).toBe('undefined');
  });

  it('should run step', async () => {
    expect(() => new UndefinedStep({ statement: 'Given A' }).run())
      .toThrow('Undefined step: [Given A]');
  });

  it('should not be pending', () => {
    expect(new UndefinedStep({ statement: 'Given A' }).isPending()).toBe(false);
  });

});
