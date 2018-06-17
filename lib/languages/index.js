const BaseLanguage = require('./BaseLanguage');
const Pirate = require('./Pirate');
const English = require('./English');

module.exports = {
  BaseLanguage,
  Pirate,
  English,
  default: new English(),
};
