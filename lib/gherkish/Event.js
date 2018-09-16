const debug = require('debug')('yadda:gherkish:Event');

module.exports = class Event {
  constructor({ name, handler, regexp, extract }) {
    this._name = name;
    this._handler = handler;
    this._regexp = regexp;
    this._extract = extract;
  }

  get name() {
    return this._name;
  }

  get handler() {
    return this._handler;
  }

  test(text) {
    return this._regexp.test(text);
  }

  parse(text) {
    const match = this._regexp.exec(text);
    return this._extract(match);
  }
};
