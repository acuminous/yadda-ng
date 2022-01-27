module.exports = class BaseConverter {
  constructor(props = {}) {
    const { debug } = props;

    this._debug = debug;
  }

  get demand() {
    return this.convert.length - 1;
  }
};
