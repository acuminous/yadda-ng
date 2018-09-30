const path = require('path');
const fs = require('fs');
const { SpecificationParser } = require('../gherkish');

module.exports = (props = {}) => {
  const featureDirectoryPath = props.path || path.join('test', 'features');
  const regexp = props.regexp || /^.*\.(?:feature|spec|specification|bdd)$/;
  const language = props.language;
  return fs.readdirSync(featureDirectoryPath)
    .filter((filename) => regexp.test(filename))
    .map((filename) => path.join(featureDirectoryPath, filename))
    .reduce((files, filename) => files.concat(fs.readFileSync(filename, 'utf-8')), [])
    .map((file) => new SpecificationParser().parse(file, { language }));
};
