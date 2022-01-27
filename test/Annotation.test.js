const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');

const { Annotation } = require('..');

describe('Annotation', () => {
  it('should initilise with single values', () => {
    deq(new Annotation({ name: 'Bob', value: [1] }).values, [1]);
  });

  it('should initilise with multiple values', () => {
    deq(new Annotation({ name: 'Bob', value: [1, 2] }).values, [1, 2]);
  });

  it("should answer to it's own name", () => {
    eq(new Annotation({ name: 'Bob' }).answersTo('Bob'), true);
  });

  it("should answer to it's own name with a different case", () => {
    eq(new Annotation({ name: 'bob' }).answersTo('Bob'), true);
  });

  it("should not answer to another's name", () => {
    eq(new Annotation({ name: 'Bob' }).answersTo('Jim'), false);
  });

  it('should yield raw value', () => {
    const value = {};
    eq(new Annotation({ name: 'Bob', value }).value, value);
  });

  it('should yield null value', () => {
    eq(new Annotation({ name: 'Bob', value: null }).value, null);
  });

  it('should yield undefined value', () => {
    eq(new Annotation({ name: 'Bob' }).value, undefined);
  });

  it('should yield boolean value', () => {
    eq(new Annotation({ name: 'Bob', value: true }).boolean, true);
    eq(new Annotation({ name: 'Bob', value: 'tRuE' }).boolean, true);
    eq(new Annotation({ name: 'Bob', value: 'untrue' }).boolean, false);
    eq(new Annotation({ name: 'Bob', value: false }).boolean, false);
    eq(new Annotation({ name: 'Bob', value: 'fAlsE' }).boolean, false);
  });

  it('should yield numeric value', () => {
    eq(new Annotation({ name: 'Bob', value: '100' }).number, 100);
  });

  it('should yield string value', () => {
    eq(new Annotation({ name: 'Bob', value: 100 }).string, '100');
  });

  it('should yield date value', () => {
    const value = new Date();
    eq(new Annotation({ name: 'Bob', value: value.toISOString() }).date.time, value.time);
  });

  it('should yield values', () => {
    deq(new Annotation({ name: 'Bob', value: 1 }).values, [1]);
  });

  it('should set value', () => {
    const annotation = new Annotation({ name: 'Bob', value: 1 });
    annotation.set(2);
    eq(annotation.value, 2);
  });

  it('should add value', () => {
    const annotation = new Annotation({ name: 'Bob', value: 1 });
    annotation.add(2);
    deq(annotation.values, [1, 2]);
  });

  it('should error when asked to access multiple values singularly', () => {
    throws(() => new Annotation({ name: 'Bob', value: [1, 2] }).value, /Annotation \[Bob\] has multiple values and cannot be accessed in a singular way/);
  });
});
