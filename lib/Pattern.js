// TODO Does this class earn it's keep?
module.exports = class Pattern extends RegExp {
  // Could be moved to Signature
  supports(text) {
    return this.test(text);
  }

  // Could be moved to Signature
  equals(other) {
    return other.source === this.source;
  }

  // Could be a utility function
  countMatchingGroups() {
    return new RegExp(`${this.source}|`).exec().length - 1;
  }
};
