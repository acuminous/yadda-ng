module.exports = class BaseConverter {

  get demand() {
    return this.convert.length - 1;
  }
};
