const BaseLanguage = require('./BaseLanguage');

module.exports = class English extends BaseLanguage {
  constructor() {
    super({ vocabulary: [ 'given', 'with', 'when', 'if', 'then', 'and', 'but', 'except' ] });
  }
};
