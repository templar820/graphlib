export default class ObjectsMap {
  constructor() {
    this.keysArray = [];
    this.valuesArray = [];
  }

  add(key, value) {
    this.keysArray.push(key);
    this.valuesArray.push(value);
  }

  has(key) {
    return !!(this.keysArray.find(el => el.x === key.x && el.y === key.y));
  }

  get(key) {
    return this.valuesArray[this.keysArray.findIndex(el => el.x === key.x && el.y === key.y)];
  }

  clear() {
    this.keysArray = [];
    this.valuesArray = [];
  }
}
