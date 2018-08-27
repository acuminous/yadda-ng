const { Library } = require('../../..');
const { commonDictionary } = require('../dictionaries');
const { Wall, Bottle } = require('../../lib');
const assert = require('assert');

module.exports = new Library({ name: 'BottlesLibrary', dictionaries: [ commonDictionary ] })
  .define('an empty wall', (state) => {
    state.wall = new Wall();
  })
  .define('$number $colour bottles are standing on the wall', (state, number, colour) => {
    return Promise.all(new Array(number).fill().map(() => state.wall.add(new Bottle({ colour }))));
  })
  .define(['$number $colour bottle accidentally falls', '$number $colour bottles accidentally fall'], (state, number, colour) => {
    return Promise.all(new Array(number).fill().map(
      () => state.wall.remove()
    ));
  })
  .define('there are $number $colour bottles standing on the wall', async (state, number, colour) => {
    const count = await state.wall.count();
    assert.equal(number, count);
  });
