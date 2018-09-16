const { Gherkish, Playbooks, Convenience } = require('../..');
const { compileFeatures } = Convenience;
const { bottlesLibrary, convertersLibrary } = require('./libraries');

Gherkish.Languages.utils.setDefault('English');

const features = compileFeatures({ libraries: [ bottlesLibrary, convertersLibrary ] });
const playbook = new Playbooks.MochaPlaybook({ features });
playbook.run();
