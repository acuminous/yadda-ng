const Debug = require('debug');

module.exports = class Librarian {

  constructor(props) {
    const {
      libraries,
      debug = Debug('yadda:Librarian'),
    } = props;

    if (libraries.some((library) => !library)) throw new Error('Null or undefined library');
    this._libraries = libraries;
    this._debug = debug;
  }

  select(names = []) {
    if (!names.length) return this;
    const libraries = this._dedupe(names).reduce((libraries, name) => {
      const library = this._libraries.find((library) => library.name === name);
      if (!library) throw new Error(`Library: ${name} was not found`);
      return libraries.concat(library);
    }, []);
    return new Librarian({ libraries });
  }

  _dedupe(items) {
    return [ ...new Set(items) ];
  }

  getCompatibleMacros(step) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCompatibleMacros(step));
    }, []);
  }
};
