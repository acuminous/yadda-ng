const debug = require('debug')('yadda:Librarian');

// The job of a Librian is to select compatible macros from a set of libraries
module.exports = class Librarian {

  constructor({ libraries }) {
    if (libraries.some((library) => !library)) throw new Error(`Null or undefined library`);
    this._libraries = libraries;
  }

  filter(names) {
    if (!names) return this;
    const libraries = this._libraries.filter((library) => names.includes(library.name));
    return new Librarian({ libraries });
  }

  getCompatibleMacros(step) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCompatibleMacros(step));
    }, []);
  }
};
