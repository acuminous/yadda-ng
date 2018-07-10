const BaseLanguage = require('./BaseLanguage');

module.exports = class None extends BaseLanguage {
  constructor() {
    super({ vocabulary: [] });
  }
};
