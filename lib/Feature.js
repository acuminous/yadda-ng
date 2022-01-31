const Debug = require('debug');
const Section = require('./Section');

module.exports = class Feature extends Section {
  constructor(props) {
    const { annotations, title, scenarios, debug = Debug('yadda:Feature') } = props;
    super({ annotations, title, iterables: scenarios, debug });
  }
};
