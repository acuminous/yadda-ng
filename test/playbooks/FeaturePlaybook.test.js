const expect = require('expect');

const { Playbooks, Feature, Scenario, Steps, Librarian, Library } = require('../..');
const { FeaturePlaybook } = Playbooks;
const { DynamicStep } = Steps;

describe('Feature Playbook', () => {

  it('should run features', async () => {
    const library = new Library()
      .define('one', () => {})
      .define('two');
    const librarian = new Librarian({ libraries: [ library ] });
    const step1 = new DynamicStep({ librarian, statement: 'one' });
    const step2 = new DynamicStep({ librarian, statement: 'two' });
    const scenario1 = new Scenario({ title: 'Scenario A', steps: [ step1, step2 ] });
    const scenario2 = new Scenario({ title: 'Scenario B', steps: [ step1, step2 ] });
    const feature1 = new Feature({ title: 'Feature A', scenarios: [ scenario1, scenario2 ] });
    const feature2 = new Feature({ title: 'Feature B', scenarios: [ scenario1, scenario2 ] });
    const playbook = new FeaturePlaybook({ features: [ feature1, feature2 ]});

    const report = await playbook.run();
    expect(report.length).toBe(8);
    expect(report[0].feature).toBe(feature1.title);
    expect(report[4].feature).toBe(feature2.title);

    expect(report[0].scenario).toBe(scenario1.title);
    expect(report[2].scenario).toBe(scenario2.title);
    expect(report[4].scenario).toBe(scenario1.title);
    expect(report[7].scenario).toBe(scenario2.title);

    expect(report[0].step).toBe(step1.statement);
    expect(report[0].status).toBe('run');
    expect(report[1].step).toBe(step2.statement);
    expect(report[1].status).toBe('pending');
  });

  it('should report undefined steps', async () => {
    const library = new Library();
    const librarian = new Librarian({ libraries: [ library ] });
    const step = new DynamicStep({ librarian, statement: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [ step ] });
    const feature = new Feature({ title: 'Feature A', scenarios: [ scenario ] });
    const playbook = new FeaturePlaybook({ features: [ feature ]});

    const report = await playbook.run();
    expect(report.length).toBe(1);
    expect(report[0].step).toBe(step.statement);
    expect(report[0].status).toBe('undefined');
    expect(report[0].suggestion).toBe('.define(\'one\', () => { // your code here })');
  });

  it('should report ambiguous steps', async () => {
    const library = new Library()
      .define(/\w+/, () => {})
      .define(/\w*/, () => {});
    const librarian = new Librarian({ libraries: [ library ] });
    const step = new DynamicStep({ librarian, statement: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [ step ] });
    const feature = new Feature({ title: 'Feature A', scenarios: [ scenario ] });
    const playbook = new FeaturePlaybook({ features: [ feature ]});

    const report = await playbook.run();
    expect(report.length).toBe(1);
    expect(report[0].step).toBe(step.statement);
    expect(report[0].status).toBe('ambiguous');
    expect(report[0].contenders.length).toBe(2);
  });

  it('should step errors', async () => {
    const library = new Library()
      .define('one', () => { throw new Error('oh noes!'); });
    const librarian = new Librarian({ libraries: [ library ] });
    const step = new DynamicStep({ librarian, statement: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [ step ] });
    const feature = new Feature({ title: 'Feature A', scenarios: [ scenario ] });
    const playbook = new FeaturePlaybook({ features: [ feature ]});

    const report = await playbook.run();
    expect(report.length).toBe(1);
    expect(report[0].step).toBe(step.statement);
    expect(report[0].status).toBe('error');
    expect(report[0].error.message).toBe('oh noes!');
  });

  it('should time step execution', async () => {
    const library = new Library()
      .define('one', async () => new Promise((resolve) => setTimeout(resolve, 201)));
    const librarian = new Librarian({ libraries: [ library ] });
    const step = new DynamicStep({ librarian, statement: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [ step ] });
    const feature = new Feature({ title: 'Feature A', scenarios: [ scenario ] });
    const playbook = new FeaturePlaybook({ features: [ feature ]});

    const report = await playbook.run();
    expect(report.length).toBe(1);
    expect(report[0].duration).toBeGreaterThan(200);
  });
});
