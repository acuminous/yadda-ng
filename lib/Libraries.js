const Debug = require('debug');

module.exports = class Libraries {
  constructor(props) {
    const { libraries = [], debug = Debug('yadda:Libraries') } = props;

    if (libraries.some((library) => !library)) throw new Error('Null or undefined library');
    this._libraries = libraries;
    this._debug = debug;
  }

  select(names = []) {
    return names.length
      ? this._dedupe(names).reduce((libraries, name) => {
          const library = this._libraries.find((library) => library.name === name);
          if (!library) throw new Error(`Library: ${name} was not found`);
          return libraries.add(library);
        }, new Libraries({ debug: this._debug }))
      : this;
  }

  add(library) {
    this._libraries = this._libraries.concat(library);
    return this;
  }

  _dedupe(items) {
    return [...new Set(items)];
  }

  getCompatibleMacros(step) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCompatibleMacros(step));
    }, []);
  }
};
