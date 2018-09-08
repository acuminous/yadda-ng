// Default language must be set before instantiating step libraries. See mocha.opts
const { Playbooks, Convenience } = require('../..');
const { compileFeatures } = Convenience;
const { bottlesLibrary, convertersLibrary } = require('./libraries');

const features = compileFeatures({ libraries: [ bottlesLibrary, convertersLibrary ] });
const playbook = new Playbooks.MochaPlaybook({ features });
playbook.run();
