const expect = require('expect');

const { Playbooks, Feature, Scenario, Steps, Library, Languages, Macro, Pattern } = require('../..');
const { FeaturePlaybook } = Playbooks;
const { AsyncStep, UndefinedStep, AmbiguousStep } = Steps;

describe('Feature Playbook', () => {

  const macro = new Macro({ pattern: new Pattern(/.*/), fn: () => {} });
  const pendingMacro = new Macro({ pattern: new Pattern(/.*/) });

  it('should pretend to run features', async () => {
    const step1 = new AsyncStep({ statement: 'one', macro });
    const step2 = new UndefinedStep({ language: Languages.default, statement: 'two' });
    const step3 = new AsyncStep({ statement: 'three', macro: pendingMacro });
    const step4 = new AmbiguousStep({ statement: 'four', language: Languages.default });
    const scenario1 = new Scenario({ title: 'Scenario A', steps: [ step1, step2, step3, step4 ] });
    const scenario2 = new Scenario({ title: 'Scenario B', steps: [ step1, step2, step3, step4 ] });
    const feature1 = new Feature({ title: 'Feature A', scenarios: [ scenario1, scenario2 ] });
    const feature2 = new Feature({ title: 'Feature B', scenarios: [ scenario1, scenario2 ] });
    const playbook = new FeaturePlaybook({ features: [ feature1, feature2 ]});

    const report = await playbook.pretend();
    expect(report.length).toBe(16);
    expect(report[0].feature).toBe(feature1.title);
    expect(report[8].feature).toBe(feature2.title);

    expect(report[0].scenario).toBe(scenario1.title);
    expect(report[4].scenario).toBe(scenario2.title);
    expect(report[8].scenario).toBe(scenario1.title);
    expect(report[12].scenario).toBe(scenario2.title);

    expect(report[0].step).toBe(step1.statement);
    expect(report[0].status).toEqual('run');
    expect(report[1].step).toBe(step2.statement);
    expect(report[1].status).toEqual('undefined');
    expect(report[1].suggestion).toEqual('two');
    expect(report[2].step).toBe(step3.statement);
    expect(report[2].status).toEqual('pending');
    expect(report[3].step).toBe(step4.statement);
    expect(report[3].status).toEqual('ambiguous');
  });

  it('should run features', async () => {
    const library = new Library();
    const macro = new Macro({ library, pattern: new Pattern(/.*/), fn: () => {} });
    const step1 = new AsyncStep({ statement: 'one', macro });
    const step2 = new AsyncStep({ statement: 'two', macro: pendingMacro });
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
    expect(report[0].status).toEqual('run');
    expect(report[1].step).toBe(step2.statement);
    expect(report[1].status).toEqual('pending');
  });

  it('should error on undefined steps', async () => {
    const macro = new Macro({ pattern: new Pattern(/.*/), fn: () => {} });
    const step = new UndefinedStep({ statement: 'one', macro });
    const scenario = new Scenario({ title: 'Scenario A', steps: [ step ] });
    const feature = new Feature({ title: 'Feature A', scenarios: [ scenario ] });
    const playbook = new FeaturePlaybook({ features: [ feature ]});

    await expect(playbook.run()).rejects.toThrow('Undefined step: [one]');
  });

  it('should error on undefined steps', async () => {
    const library = new Library();
    const macro = new Macro({ library, pattern: new Pattern(/.*/), fn: () => {} });
    const step = new AmbiguousStep({ statement: 'one', contenders: [ macro ] });
    const scenario = new Scenario({ title: 'Scenario A', steps: [ step ] });
    const feature = new Feature({ title: 'Feature A', scenarios: [ scenario ] });
    const playbook = new FeaturePlaybook({ features: [ feature ]});

    await expect(playbook.run()).rejects.toThrow('Ambiguous Step: [one] is equally matched by macro with pattern [/.*/] defined in library [Library]');
  });
});
