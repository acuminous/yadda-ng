const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Playbooks, Feature, Scenario, Steps, Libraries, Library } = require('../..');
const { FeaturePlaybook } = Playbooks;
const { DynamicStep } = Steps;

describe('Feature Playbook', () => {
  it('should run features', async () => {
    const library = new Library().define('one', () => {}).define('two');
    const libraries = new Libraries({ libraries: [library] });
    const step1 = new DynamicStep({ libraries, text: 'one', generalised: 'one' });
    const step2 = new DynamicStep({ libraries, text: 'two', generalised: 'two' });
    const scenario1 = new Scenario({ title: 'Scenario A', steps: [step1, step2] });
    const scenario2 = new Scenario({ title: 'Scenario B', steps: [step1, step2] });
    const feature1 = new Feature({ title: 'Feature A', scenarios: [scenario1, scenario2] });
    const feature2 = new Feature({ title: 'Feature B', scenarios: [scenario1, scenario2] });
    const playbook = new FeaturePlaybook({ features: [feature1, feature2] });

    const report = await playbook.run();
    eq(report.summary.run, 4);
    eq(report.summary.pending, 4);

    eq(report.steps.length, 8);
    eq(report.steps[0].feature, feature1.title);
    eq(report.steps[4].feature, feature2.title);

    eq(report.steps[0].scenario, scenario1.title);
    eq(report.steps[2].scenario, scenario2.title);
    eq(report.steps[4].scenario, scenario1.title);
    eq(report.steps[7].scenario, scenario2.title);

    eq(report.steps[0].step, step1.text);
    eq(report.steps[0].status, 'run');
    eq(report.steps[1].step, step2.text);
    eq(report.steps[1].status, 'pending');
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

    const libraries = new Libraries({ libraries: [library1, library2] });
    const step1 = new DynamicStep({ libraries, text: 'one', generalised: 'one' });
    const step2 = new DynamicStep({ libraries, text: 'two', generalised: 'two' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step1, step2] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    eq(report.summary.run, 2);
    eq(run, true);
  });

  it('should prefer steps from current library even when the previous test is pending', async () => {
    let run = false;

    const library1 = new Library().define('one').define('two', () => {
      run = true;
    });
    const library2 = new Library().define(/TWO/i, () => {
      throw new Error('Wrong Step');
    });

    const libraries = new Libraries({ libraries: [library1, library2] });
    const step1 = new DynamicStep({ libraries, text: 'one', generalised: 'one' });
    const step2 = new DynamicStep({ libraries, text: 'two', generalised: 'two' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step1, step2] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    eq(report.summary.pending, 1);
    eq(report.summary.run, 1);
    eq(run, true);
  });

  it('should report undefined steps', async () => {
    const library = new Library();
    const libraries = new Libraries({ libraries: [library] });
    const step = new DynamicStep({ libraries, text: 'one', generalised: 'generalised' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    eq(report.steps.length, 1);
    eq(report.steps[0].step, step.text);
    eq(report.steps[0].status, 'undefined');
    eq(report.steps[0].suggestion, ".define('generalised', (state) => { // your code here })");
  });

  it('should report ambiguous steps', async () => {
    const library = new Library().define(/\w+/, () => {}).define(/\w*/, () => {});
    const libraries = new Libraries({ libraries: [library] });
    const step = new DynamicStep({ libraries, text: 'one', generalised: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    eq(report.steps.length, 1);
    eq(report.steps[0].step, step.text);
    eq(report.steps[0].status, 'ambiguous');
    eq(report.steps[0].contenders.length, 2);
  });

  it('should report step errors', async () => {
    const library = new Library().define('one', () => {
      throw new Error('oh noes!');
    });
    const libraries = new Libraries({ libraries: [library] });
    const step = new DynamicStep({ libraries, text: 'one', generalised: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    eq(report.steps.length, 1);
    eq(report.steps[0].step, step.text);
    eq(report.steps[0].status, 'error');
    eq(report.steps[0].error.message, 'oh noes!');
  });

  it('should time step execution', async () => {
    const library = new Library().define('one', async () => new Promise((resolve) => setTimeout(resolve, 201)));
    const libraries = new Libraries({ libraries: [library] });
    const step = new DynamicStep({ libraries, text: 'one', generalised: 'one' });
    const scenario = new Scenario({ title: 'Scenario A', steps: [step] });
    const feature = new Feature({ title: 'Feature A', scenarios: [scenario] });
    const playbook = new FeaturePlaybook({ features: [feature] });

    const report = await playbook.run();
    eq(report.steps.length, 1);
    eq(report.steps[0].duration > 200, true);
  });
});
