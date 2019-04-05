module.exports = class Pattern extends RegExp {

  supports(text) {
    return this.test(text);
  }

  equals(other) {
    return other.source === this.source;
  }

  countMatchingGroups() {
    return new RegExp(`${this.source}|`).exec().length - 1;
  }
};
