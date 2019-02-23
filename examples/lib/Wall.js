// All functions use setTimeout and promises to simulate asynchronous operations
module.exports = class Wall {

  constructor(height) {
    this._height = height;
    this._bottles = [];
    this._graffiti = '';
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
    return new Promise((resolve) => {
      setTimeout(() => {
        this._graffiti = graffiti;
        resolve();
      }, 100);
    });
  }

  isCovered() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._graffiti.length >= 100);
      }, 100);
    });
  }

};
