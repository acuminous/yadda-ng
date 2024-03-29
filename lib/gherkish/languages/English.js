const Debug = require('debug');
const BaseLanguage = require('./BaseLanguage');

module.exports = class English extends BaseLanguage {
  constructor() {
    super({
      code: 'en',
      vocabulary: {
        step: ['given', 'with', 'when', 'if', 'then', 'and', 'but', 'except'],
        feature: ['feature'],
        scenario: ['scenario'],
        background: ['background'],
      },
      debug: Debug('yadda:languages:English'),
    });
  }
};
