const { Playbooks, Convenience } = require('../..');
const { compileFeatures } = Convenience;
const { bottlesLibrary } = require('./libraries');

const features = compileFeatures({ libraries: [ bottlesLibrary ] });
const playbook = new Playbooks.MochaPlaybook({ features });
playbook.run();
