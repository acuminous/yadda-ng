const { Gherkish, Playbooks, Convenience } = require('../..');
const { MochaPlaybook } = Playbooks;
const { compileFeatures } = Convenience;
const { simpleLibrary, convertersLibrary, duplicateLibrary1, duplicateLibrary2 } = require('./libraries');

Gherkish.Languages.utils.setDefault('English');

const features = compileFeatures({ libraries: [
  simpleLibrary,
  convertersLibrary,
  duplicateLibrary1,
  duplicateLibrary2,
] });

new MochaPlaybook({ features }).run();
