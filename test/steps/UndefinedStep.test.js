const expect = require('expect');

const { Steps, Languages } = require('../..');
const { UndefinedStep } = Steps;
const { English } = Languages;

describe('UndefinedStep', () => {

  it('should pretend to run step', () => {
    expect(new UndefinedStep({ statement: 'Given A', language: new English() }).pretend()).toBe('undefined');
  });

  it('should run step', async () => {
    expect(() => new UndefinedStep({ statement: 'Given A', language: new English() }).run())
      .toThrow('Undefined step: [Given A]');
  });

  it('should suggest a step signature', async () => {
    expect(new UndefinedStep({ statement: 'Given A', language: new English() }).suggest()).toBe('A');
    expect(new UndefinedStep({ statement: 'Step A', language: new English() }).suggest()).toBe('Step A');
  });

  it('should not be pending', () => {
    expect(new UndefinedStep({ statement: 'Given A', language: new English() }).isPending()).toBe(false);
  });

});
