const path = require('path');
const fs = require('fs');
const { Specification } = require('../parsing');

module.exports = (props = {}) => {
  const featureDirectoryPath = props.path || path.join('test', 'features');
  const regexp = props.regexp || /^.*\.(?:feature|spec|specification|bdd)$/;
  return fs.readdirSync(featureDirectoryPath)
    .filter((filename) => regexp.test(filename))
    .map((filename) => path.join(featureDirectoryPath, filename))
    .reduce((files, filename) => files.concat(fs.readFileSync(filename, 'utf-8')), [])
    .map((file) => new Specification().parse(file).export());
};
