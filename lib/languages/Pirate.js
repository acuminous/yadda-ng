const BaseLanguage = require('./BaseLanguage');

module.exports = class Pirate extends BaseLanguage {
  constructor() {
    super({
      vocabulary: {
        step: [ 'giveth', 'whence', 'thence', 'and', 'but', 'except' ],
        feature: [ 'tale', 'yarn' ],
        scenario: [ 'adventure', 'sortie' ],
        background: [ 'aftground' ],
      }
    });
  }
};
