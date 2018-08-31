const BaseLanguage = require('./BaseLanguage');
const Pirate = require('./Pirate');
const English = require('./English');
const None = require('./None');

module.exports = {
  BaseLanguage,
  Pirate,
  English,
  None,
  default: new None(),
};
