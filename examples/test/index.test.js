const { Gherkish, Playbooks, Convenience } = require('../..');
const { MochaPlaybook } = Playbooks;
const { compileFeatures } = Convenience;
const { simpleLibrary, advancedLibrary, convertersLibrary } = require('./libraries');

Gherkish.Languages.utils.setDefault('English');

const features = compileFeatures({ libraries: [ simpleLibrary, advancedLibrary, convertersLibrary ] });
const playbook = new MochaPlaybook({ features });
playbook.run();
