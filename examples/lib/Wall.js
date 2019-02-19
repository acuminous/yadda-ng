const os = require('os');

module.exports = class Wall {

  constructor(height) {
    this._height = height;
    this._bottles = [];
    this._graffiti = [];
  }

  add(bottle) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._bottles.push(bottle);
        resolve();
      }, 100);
    });
  }

  remove(bottle) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._bottles.pop();
        resolve();
      }, 100);
    });
  }

  count() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._bottles.length);
      }, 100);
    });
  }

  spray(graffiti) {
    this._graffiti = graffiti.split(os.EOL);
  }

  isCovered() {
    return this._graffiti.length >= 8;
  }

};
