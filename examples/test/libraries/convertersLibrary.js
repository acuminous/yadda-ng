const { Library } = require('../../..');
const { commonDictionary } = require('../dictionaries');
const assert = require('assert');

module.exports = new Library({ name: 'Converters Library', dictionaries: [ commonDictionary ] })
  .define('something is $boolean', (state, argument) => {
    state.set('argument', argument);
  })
  .define('the date is $date', (state, argument) => {
    state.set('argument', argument);
  })
  .define('a value of $number', (state, argument) => {
    state.set('argument', argument);
  })
  .define('$number plus $number', (state, argument1, argument2) => {
    assert.set('total', argument1 + argument2);
  })
  .define('the total is $number', (state, total) => {
    assert.equal(state.total, total);
  })
  .define('coordinates of $coordinates', (state, argument) => {
    state.set('argument', argument);
  })
  .define(['the argument should be an $type', 'the argument should be a $type'], (state, type) => {
    switch (type) {
      case 'date': {
        assert.ok(state.get('argument') instanceof Date);
        break;
      }
      default: {
        assert.equal(typeof state.get('argument'), type);
        break;
      }
    }
  });
