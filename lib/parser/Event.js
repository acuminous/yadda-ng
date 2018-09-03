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

  test(text) {
    return this._regexp.test(text);
  }

  handle(state, text, source) {
    const match = this._regexp.exec(text);
    const data = this._extract(match);
    const payload = { name: this._name, source, data };
    return state[this._handler](payload);
  }
};
