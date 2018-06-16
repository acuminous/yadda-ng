const expect = require('expect');

const { Steps, Languages } = require('../..');
const { UndefinedStep } = Steps;
const { English } = Languages;

describe('UndefinedStep', () => {

  it('should suggest a step signature', () => {
    expect(new UndefinedStep({ statement: 'Given A', language: new English() }).suggest()).toBe('A');
  });

});
