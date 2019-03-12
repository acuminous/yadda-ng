const { Library } = require('../../..');
const { commonDictionary } = require('../dictionaries');
const { Wall, Bottle } = require('../../lib');
const assert = require('assert');

module.exports = new Library({ name: 'Simple Library', dictionaries: [ commonDictionary ] })
  .define('an $height empty wall', (state, height) => {
    state.set('wall', new Wall(height));
  })
  .define('$number $colour bottles are standing on the wall', (state, number, colour) => {
    return Promise.all(new Array(number).fill().map(
      () => state.get('wall').add(new Bottle({ colour }))
    ));
  })
  .define([
    '$number $colour bottle accidentally falls',
    '$number $colour bottles accidentally fall'
  ], (state, number, colour) => {
    return Promise.all(new Array(number).fill().map(
      () => state.get('wall').remove()
    ));
  })
  .define('there are $number $colour bottles standing on the wall', async (state, number, colour) => {
    const wall = state.get('wall');
    const count = await wall.count();
    assert.equal(number, count);
  })
  .define('I spray the following graffiti on the wall:', async (state, graffiti) => {
    const wall = state.get('wall');
    await wall.spray(graffiti);
  }, {
    docString: true,
  })
  .define('there is no more room for graffiti', async (state) => {
    const wall = state.get('wall');
    const isCovered = await wall.isCovered();
    assert.ok(isCovered);
  })
  .define('there can be programatically $status steps', async (state, status) => {
    return { status };
  });
