const { Playbooks } = require('../..');
const { CommonLibrary, SearchLibrary } = require('../libraries');

const script = require('./script');

(async () => {
  try {
    const features = script.compile({ libraries: [ CommonLibrary, SearchLibrary ] });
    const playbook = new Playbooks.FeaturePlaybook({ features });
    await playbook.run();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

setTimeout(() => {}, Number.MAX_SAFE_INTEGER);
