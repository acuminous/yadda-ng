const expect = require('expect');

const { Playbooks, Feature, Scenario, Steps, Languages, Macro, Pattern } = require('../..');
const { FeaturePlaybook } = Playbooks;
const { AsyncStep, UndefinedStep, PendingStep, AmbiguousStep } = Steps;

describe('Feature Playbook', () => {

  it('should pretend to run features', async () => {
    const macro = new Macro({ pattern: new Pattern(/.*/), fn: () => {} });
    const step1 = new AsyncStep({ statement: 'one', macro });
    const step2 = new UndefinedStep({ statement: 'two' });
    const step3 = new PendingStep({ statement: 'three' });
    const step4 = new AmbiguousStep({ statement: 'four', language: Languages.default });
    const scenario1 = new Scenario({ title: 'Scenario A', steps: [ step1, step2, step3, step4 ] });
    const scenario2 = new Scenario({ title: 'Scenario B', steps: [ step1, step2, step3, step4 ] });
    const feature1 = new Feature({ title: 'Feature A', scenarios: [ scenario1, scenario2 ] });
    const feature2 = new Feature({ title: 'Feature B', scenarios: [ scenario1, scenario2 ] });
    const playbook = new FeaturePlaybook({ features: [ feature1, feature2 ]});

    const report = await playbook.pretend();
    expect(report.length).toBe(16);
    expect(report[0].feature).toEqual(feature1);
    expect(report[8].feature).toEqual(feature2);

    expect(report[0].scenario).toEqual(scenario1);
    expect(report[4].scenario).toEqual(scenario2);
    expect(report[8].scenario).toEqual(scenario1);
    expect(report[12].scenario).toEqual(scenario2);

    expect(report[0].step).toEqual(step1);
    expect(report[0].status).toEqual('run');
    expect(report[1].status).toEqual('undefined');
    expect(report[2].status).toEqual('pending');
    expect(report[3].status).toEqual('ambiguous');
  });
});
