module.exports = class Wall {

  constructor(height) {
    this._height = height;
    this._bottles = [];
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

};
