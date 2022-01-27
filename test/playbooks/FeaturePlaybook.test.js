const expect = require('expect');

const { Playbooks, Feature, Scenario, Steps, Librarian, Library } = require('../..');
const { FeaturePlaybook } = Playbooks;
const { DynamicStep } = Steps;

describe('Feature Playbook', () => {
  it('should run features', async () => {
    const library = new Library().define('one', () => {}).define('two');
    const librarian = new Librarian({ libraries: [library] });
    const step1 = new DynamicStep({ librarian, text: 'one', generalised: 'one' });
    const step2 = new DynamicStep({ librarian, text: 'two', generalised: 'two' });
    const scenario1 = new Scenario({ title: 'Scenario A', steps: [step1, step2] });
    const scenario2 = new Scenario({ title: 'Scenario B', steps: [step1, step2] });
    const feature1 = new Feature({ title: 'Feature A', scenarios: [scenario1, scenario2] });
    const feature2 = new Feature({ title: 'Feature B', scenarios: [scenario1, scenario2] });
    const playbook = new FeaturePlaybook({ features: [feature1, feature2] });

    const report = await playbook.run();
    expect(report.summary.run).toBe(4);
    expect(report.summary.pending).toBe(4);

    expect(report.steps.length).toBe(8);
    expect(report.steps[0].feature).toBe(feature1.title);
    expect(report.steps[4].feature).toBe(feature2.title);

    expect(report.steps[0].scenario).toBe(scenario1.title);
    expect(report.steps[2].scenario).toBe(scenario2.title);
    expect(report.steps[4].scenario).toBe(scenario1.title);
    expect(report.steps[7].scenario).toBe(scenario2.title);

    expect(report.steps[0].step).toBe(step1.text);
    expect(report.steps[0].status).toBe('run');
    expect(report.steps[1].step).toBe(step2.text);
    expect(report.steps[1].status).toBe('pending');
  });

  it('should prefer steps from current library', async () => {
    let run = false;

    const library1 = new Library({ name: 'A' })
      .define('one', () => {})
      .define('two', () => {
        run = true;
      });
    const library2 = new Library({ name: 'B' }).define(/TWO/i, () => {
      throw new Error('Wrong Step');
    });

    const librarian = new Librarian({ libraries: [library1, library2] });
    const step1 = new DynamicStep({ librarian, text: 'one', generalised: 'one' });
    const step2 = new DynamicStep({ librarian, text: 'two', generalised: 'two' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step1, step2] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    expect(report.summary.run).toBe(2);
    expect(run).toBe(true);
  });

  it('should prefer steps from current library even when the previous test is pending', async () => {
    let run = false;

    const library1 = new Library().define('one').define('two', () => {
      run = true;
    });
    const library2 = new Library().define(/TWO/i, () => {
      throw new Error('Wrong Step');
    });

    const librarian = new Librarian({ libraries: [library1, library2] });
    const step1 = new DynamicStep({ librarian, text: 'one', generalised: 'one' });
    const step2 = new DynamicStep({ librarian, text: 'two', generalised: 'two' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step1, step2] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    expect(report.summary.pending).toBe(1);
    expect(report.summary.run).toBe(1);
    expect(run).toBe(true);
  });

  it('should report undefined steps', async () => {
    const library = new Library();
    const librarian = new Librarian({ libraries: [library] });
    const step = new DynamicStep({ librarian, text: 'one', generalised: 'generalised' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    expect(report.steps.length).toBe(1);
    expect(report.steps[0].step).toBe(step.text);
    expect(report.steps[0].status).toBe('undefined');
    expect(report.steps[0].suggestion).toBe(".define('generalised', (state) => { // your code here })");
  });

  it('should report ambiguous steps', async () => {
    const library = new Library().define(/\w+/, () => {}).define(/\w*/, () => {});
    const librarian = new Librarian({ libraries: [library] });
    const step = new DynamicStep({ librarian, text: 'one', generalised: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    expect(report.steps.length).toBe(1);
    expect(report.steps[0].step).toBe(step.text);
    expect(report.steps[0].status).toBe('ambiguous');
    expect(report.steps[0].contenders.length).toBe(2);
  });

  it('should report step errors', async () => {
    const library = new Library().define('one', () => {
      throw new Error('oh noes!');
    });
    const librarian = new Librarian({ libraries: [library] });
    const step = new DynamicStep({ librarian, text: 'one', generalised: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    expect(report.steps.length).toBe(1);
    expect(report.steps[0].step).toBe(step.text);
    expect(report.steps[0].status).toBe('error');
    expect(report.steps[0].error.message).toBe('oh noes!');
  });

  it('should time step execution', async () => {
    const library = new Library().define('one', async () => new Promise((resolve) => setTimeout(resolve, 201)));
    const librarian = new Librarian({ libraries: [library] });
    const step = new DynamicStep({ librarian, text: 'one', generalised: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    expect(report.steps.length).toBe(1);
    expect(report.steps[0].duration).toBeGreaterThan(200);
  });
});
