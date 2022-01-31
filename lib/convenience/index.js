const parseFeatures = require('./parseFeatures');
const compileFeatures = require('./compileFeatures');

/*
TODO
const loader = require('../FileSystemLoader');
const features = await loader.load();
MochaAdapter.run({ features, libraries, competion, state });
*/

module.exports = {
  parseFeatures,
  compileFeatures,
};
