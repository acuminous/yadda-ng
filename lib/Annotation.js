const debug = require('debug')('yadda:Annotation');

module.exports = class Annotation {
  constructor({ name, value }) {
    this._name = name;
    this._values = [].concat(value);
  }

  get value() {
    debug(`Getting annotation: [${this._name}] value: [${this._values[0]}]`);
    if (this._values.length > 1) throw new Error(`Annotation [${this._name}] has multiple values and cannot be accessed in a singular way`);
    return this._values[0];
  }

  get boolean() {
    return /^true$/i.test(this.value);
  }

  get number() {
    return Number(this.value);
  }

  get date() {
    return new Date(this.value);
  }

  get string() {
    return String(this.value);
  }

  get values() {
    debug(`Getting annotation: [${this._name}] values: [${this._values.join(', ')}]`);
    return [].concat(this._values);
  }

  answersTo(name) {
    return this._name.toLowerCase() === name.toLowerCase();
  }

  set(value) {
    this._values = [value];
  }

  add(value) {
    this._values.push(value);
  }
};
