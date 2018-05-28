const expect = require('expect');

const { Annotations } = require('..');

describe('Annotations', () => {

  it('should advise when an annotation is missing', () => {
    expect(new Annotations().has('missing')).toBe(false);
  });

  it('should advise when an annotation is present', () => {
    expect(new Annotations().add('Bob').has('Bob')).toBe(true);
  });

  it('should get an annotation by name', () => {
    expect(new Annotations().add('Bob', 1).get('Bob').value).toBe(1);
  });

  it('should extend existing annotations', () => {
    expect(new Annotations().add('Bob', 1).add('Bob', 2).get('Bob').values).toEqual([1, 2]);
  });

  it('should add new annotations', () => {
    const annotations = new Annotations().add('Bob', 1).add('Jim', 2);
    expect(annotations.get('Bob').value).toEqual(1);
    expect(annotations.get('Jim').value).toEqual(2);
  });

});
