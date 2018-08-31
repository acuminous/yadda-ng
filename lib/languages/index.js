const BaseLanguage = require('./BaseLanguage');
const Pirate = require('./Pirate');
const English = require('./English');
const None = require('./None');

const english = new English();
const pirate = new Pirate();
const none = new None();
const instances = {
  english,
  pirate,
  none,
  default: none,
};

module.exports = {
  BaseLanguage,
  Pirate,
  English,
  None,
  instances,
  find: (name) => {
    const language = instances[name.toLowerCase()];
    if (!language) throw new Error(`Language not found: ${name}`);
    return language;
  },
};
