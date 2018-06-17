// Rates the similarity of two strings
module.exports = class LevenshteinDistanceScore {

  constructor(s1, s2) {
    this._value = this._calculateDifference(s1, s2);
  }

  compare(other) {
    return other._value - this._value;
  }

  equals(other) {
    return this._value === other._value;
  }

  _createDistanceTable(x, y) {
      const table = new Array(x + 1);
      for (let i = 0; i <= x; i++) {
        table[i] = new Array(y + 1).fill(0);
      }
      for (let i = 0; i <= x; i++) {
        table[i][0] = i;
      }
      for (let j = 0; j <= y; j++) {
        table[0][j] = j;
      }
      return table;
  }


  _calculateDifference(s1, s2) {
    if (s1 === s2) return 0;
    
    const table = this._createDistanceTable(s1.length, s2.length);
    for (let j = 0; j < s2.length; j++) {
      for (let i = 0; i < s1.length; i++) {
        if (s1[i] === s2[j]) {
          table[i + 1][j + 1] = table[i][j];
        } else {
          const deletion = table[i][j + 1] + 1;
          const insertion = table[i + 1][j] + 1;
          const substitution = table[i][j] + 1;
          table[i + 1][j + 1] = Math.min(substitution, deletion, insertion);
        }
      }
    }
    return table[s1.length][s2.length];
  }
};
