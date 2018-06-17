const expect = require('expect');

const { Scores } = require('../..');
const { LevenshteinDistanceScore } = Scores;

describe('LevenshteinDistanceScore', () => {

  it('should show now difference between equal strings', () => {
    expect(new LevenshteinDistanceScore('foo', 'foo')._value).toBe(0);
  });

  it('should calculate difference between different strings of equal length', () => {
    expect(new LevenshteinDistanceScore('fox', 'foo')._value).toBe(1);
  });

  it('should calculate difference between different strings of different length', () => {
    expect(new LevenshteinDistanceScore('xfoox', 'foo')._value).toBe(2);
    expect(new LevenshteinDistanceScore('foo', 'xfoox')._value).toBe(2);
  });

  it('should compare with other scores', () => {
    const a = new LevenshteinDistanceScore('foo', 'foo');
    const b = new LevenshteinDistanceScore('foox', 'foo');
    expect(a.compare(b)).toBeGreaterThan(0);
    expect(b.compare(a)).toBeLessThan(0);
    expect(a.compare(a)).toBe(0);
  });

  it('should equate to other scores', () => {
    const a = new LevenshteinDistanceScore('foo', 'foo');
    const b = new LevenshteinDistanceScore('foox', 'foo');
    const c = new LevenshteinDistanceScore('foo', 'foo');
    expect(a.equals(b)).toBe(false);
    expect(b.equals(a)).toBe(false);
    expect(a.equals(a)).toBe(true);
    expect(a.equals(c)).toBe(true);
  });
});
