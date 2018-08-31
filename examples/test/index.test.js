// Default language must be set before instantiating step libraries. See mocha.opts
const { Playbooks, Convenience, Languages } = require('../..');
const { compileFeatures } = Convenience;
const { bottlesLibrary } = require('./libraries');

Languages.default = new Languages.English().setDefault();
const features = compileFeatures({ libraries: [ bottlesLibrary ] });
const playbook = new Playbooks.MochaPlaybook({ features });
playbook.run();
