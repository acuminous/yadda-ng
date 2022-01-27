const expect = require('expect');

const { Annotation } = require('..');

describe('Annotation', () => {
  it('should initilise with single values', () => {
    expect(new Annotation({ name: 'Bob', value: [1] }).values).toEqual([1]);
  });

  it('should initilise with multiple values', () => {
    expect(new Annotation({ name: 'Bob', value: [1, 2] }).values).toEqual([1, 2]);
  });

  it("should answer to it's own name", () => {
    expect(new Annotation({ name: 'Bob' }).answersTo('Bob')).toBe(true);
  });

  it("should answer to it's own name with a different case", () => {
    expect(new Annotation({ name: 'bob' }).answersTo('Bob')).toBe(true);
  });

  it("should not answer to another's name", () => {
    expect(new Annotation({ name: 'Bob' }).answersTo('Jim')).toBe(false);
  });

  it('should yield raw value', () => {
    const value = {};
    expect(new Annotation({ name: 'Bob', value }).value).toBe(value);
  });

  it('should yield null value', () => {
    expect(new Annotation({ name: 'Bob', value: null }).value).toBe(null);
  });

  it('should yield undefined value', () => {
    expect(new Annotation({ name: 'Bob' }).value).toBe(undefined);
  });

  it('should yield boolean value', () => {
    expect(new Annotation({ name: 'Bob', value: true }).boolean).toBe(true);
    expect(new Annotation({ name: 'Bob', value: 'tRuE' }).boolean).toBe(true);
    expect(new Annotation({ name: 'Bob', value: 'untrue' }).boolean).toBe(false);
    expect(new Annotation({ name: 'Bob', value: false }).boolean).toBe(false);
    expect(new Annotation({ name: 'Bob', value: 'fAlsE' }).boolean).toBe(false);
  });

  it('should yield numeric value', () => {
    expect(new Annotation({ name: 'Bob', value: '100' }).number).toBe(100);
  });

  it('should yield string value', () => {
    expect(new Annotation({ name: 'Bob', value: 100 }).string).toBe('100');
  });

  it('should yield date value', () => {
    const value = new Date();
    expect(new Annotation({ name: 'Bob', value: value.toISOString() }).date.time).toBe(value.time);
  });

  it('should yield values', () => {
    expect(new Annotation({ name: 'Bob', value: 1 }).values).toEqual([1]);
  });

  it('should set value', () => {
    const annotation = new Annotation({ name: 'Bob', value: 1 });
    annotation.set(2);
    expect(annotation.value).toBe(2);
  });

  it('should add value', () => {
    const annotation = new Annotation({ name: 'Bob', value: 1 });
    annotation.add(2);
    expect(annotation.values).toEqual([1, 2]);
  });

  it('should error when asked to access multiple values singularly', () => {
    expect(() => new Annotation({ name: 'Bob', value: [1, 2] }).value).toThrow(/Annotation \[Bob\] has multiple values and cannot be accessed in a singular way/);
  });
});
