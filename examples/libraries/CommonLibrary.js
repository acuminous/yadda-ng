const { Library } = require('../..');
const { promisify } = require('util');

module.exports = new Library({ name: 'common' })
  .define('Step 1', promisify((state, args, cb) => {
    setTimeout(() => {
      console.log('Step 1');
      cb();
    }, 100);
  }));
