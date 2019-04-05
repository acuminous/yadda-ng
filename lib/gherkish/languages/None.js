const Debug = require('debug');
const BaseLanguage = require('./BaseLanguage');

module.exports = class None extends BaseLanguage {
  constructor() {
    super({
      vocabulary: {
        step: [],
        feature: [ 'feature' ],
        scenario: [ 'scenario' ],
        background: [ 'background' ],
      },
      debug: Debug('yadda:languages:None'),
    });
  }
};
