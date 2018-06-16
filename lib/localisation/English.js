const Language = require('./Language');

module.exports = class English extends Language {
  constructor() {
    super({ vocabulary: [ 'given', 'with', 'when', 'if', 'then', 'and', 'but', 'except' ] });
  }
};
