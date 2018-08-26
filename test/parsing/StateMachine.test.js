const expect = require('expect');
const { Parsing } = require('../..');
const { SpecificationBuilder, StateMachine } =  Parsing;

describe('StateMachine', () => {

  it('should start in initial state', () => {
    const machine = new StateMachine({ specificationBuilder: new SpecificationBuilder() });
    expect(machine.state).toBe('initial');
  });

  it('should delegate event to current state', () => {
    const machine = new StateMachine({ specificationBuilder: new SpecificationBuilder() });
    machine.handle({ name: 'feature', data: { title: 'Some Feature' } });
    expect(machine.state).toBe('create_feature');
  });

});
