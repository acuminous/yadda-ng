const debug = require('debug')('yadda-ng:Librarian');
const Languages = require('./languages');

// The job of a Librian is to select compatible macros from a set of libraries
module.exports = class Librarian {

  constructor({ libraries, language = Languages.default }) {
    if (libraries.some((library) => !library)) throw new Error(`Null or undefined library`);
    this._libraries = libraries;
    this._language = language;
  }

  filter(names) {
    if (!names) return this;
    const libraries = this._libraries.filter((library) => names.includes(library.name));
    return new Librarian({ libraries });
  }

  getCompatibleMacros(statement) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCompatibleMacros(statement));
    }, []);
  }

  suggest(statement) {
    const generalised = this._language.generalise(statement);
    return `.define('${generalised}', (state) => { // your code here })`;
  }
};
