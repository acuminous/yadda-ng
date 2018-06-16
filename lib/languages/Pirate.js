const BaseLanguage = require('./BaseLanguage');

module.exports = class Pirate extends BaseLanguage {
  constructor() {
    super({ vocabulary: [ 'giveth', 'whence', 'thence', 'and', 'but', 'except' ] });
  }
};
