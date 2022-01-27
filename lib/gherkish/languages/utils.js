const debug = require('debug')('yadda:Languages:utils');

const Pirate = require('./Pirate');
const English = require('./English');
const None = require('./None');

const languages = [new English(), new Pirate(), new None()];

function getDefault() {
  return instance;
}

function setDefault(identifier) {
  const language = find(identifier);
  if (!language) throw new Error(`Unknown language: ${identifier}`);
  instance = language;
}

function add(language, isDefault = true) {
  if (find(language.name) || find(language.code)) throw new Error(`Language: ${language} already exists`);
  languages.push(language);
  if (isDefault) setDefault(language.name);
}

function find(id) {
  debug(`Finding language by id: ${id}`);
  return languages.find((l) => l.answersToName(id) || l.answersToCode(id));
}

function get(id) {
  return find(id) || reportMissingLanguage(id);
}

function reportMissingLanguage(id) {
  throw Error(`Language: ${id} was not found`);
}

let instance = find('none');

module.exports = {
  getDefault,
  setDefault,
  find,
  get,
  add,
};
