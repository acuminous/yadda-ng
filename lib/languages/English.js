const BaseLanguage = require('./BaseLanguage');

module.exports = class English extends BaseLanguage {
  constructor() {
    super({
      vocabulary: {
        step: [ 'given', 'with', 'when', 'if', 'then', 'and', 'but', 'except' ],
        feature: [ 'feature' ],
        scenario: [ 'scenario' ],
        background: [ 'background' ],
      }
    });
  }
};
