const BaseLanguage = require('./BaseLanguage');
const Pirate = require('./Pirate');
const English = require('./English');
const None = require('./None');
const defaultLanguage = require('./defaultLanguage');

module.exports = {
  BaseLanguage,
  Pirate,
  English,
  None,
  get default() {
    return defaultLanguage.instance || new None();
  }
};
