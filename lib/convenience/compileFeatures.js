const parseFeatures = require('./parseFeatures');
const Script = require('../Script');

module.exports = (props = {}) => {
  const libraries = props.libraries || [];
  const specifications = parseFeatures(props);
  return new Script({ source: specifications }).compile({ libraries });
};
