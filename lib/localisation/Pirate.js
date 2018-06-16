const Language = require('./Language');

module.exports = class Pirate extends Language {
  constructor() {
    super({ vocabulary: [ 'giveth', 'whence', 'thence', 'and', 'but', 'except' ] });
  }
};
