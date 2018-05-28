const { Playbooks } = require('../..');
const { CommonLibrary, SearchLibrary } = require('../libraries');
const script = require('./script');

const features = script.compile({ libraries: [ CommonLibrary, SearchLibrary ] });
const hooks = {
  featureLevel: {
    before: [
      async () => console.log('before all (feature)'),
    ],
    beforeEach: [
      async () => console.log('before each (feature)'),
    ],
    after: [
      async () => console.log('after all (feature)'),
    ],
    afterEach: [
      async () => console.log('after each (feature)'),
    ],
  },
  scenarioLevel: {
    before: [
      async () => console.log('before all (scenario)'),
    ],
    beforeEach: [
      async () => console.log('before each (scenario)'),
    ],
    after: [
      async () => console.log('after all (scenario)'),
    ],
    afterEach: [
      async () => console.log('after each (scenario)'),
    ],
  },
  stepLevel: {
    before: [
      async () => console.log('before all (step)'),
    ],
    beforeEach: [
      async () => console.log('before each (step)'),
    ],
    after: [
      async () => console.log('after all (step)'),
    ],
    afterEach: [
      async () => console.log('after each (step)'),
    ],
  }
};

new Playbooks.MochaPlaybook({ features, hooks }).run();
