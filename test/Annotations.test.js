const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Annotations } = require('..');

describe('Annotations', () => {
  it('should advise when an annotation is missing', () => {
    eq(new Annotations().has('missing'), false);
  });

  it('should advise when an annotation is present', () => {
    eq(new Annotations().add('Bob').has('Bob'), true);
  });

  it('should advise when an annotation is present with a different case', () => {
    eq(new Annotations().add('Bob').has('bob'), true);
  });

  it('should get an annotation by name', () => {
    eq(new Annotations().add('Bob', 1).get('Bob').value, 1);
  });

  it('should extend existing annotations', () => {
    deq(new Annotations().add('Bob', 1).add('Bob', 2).get('Bob').values, [1, 2]);
  });

  it('should extend existing annotations when using a different case', () => {
    deq(new Annotations().add('Bob', 1).add('bob', 2).get('Bob').values, [1, 2]);
  });

  it('should add new annotations', () => {
    const annotations = new Annotations().add('Bob', 1).add('Jim', 2);
    deq(annotations.get('Bob').value, 1);
    deq(annotations.get('Jim').value, 2);
  });
});
