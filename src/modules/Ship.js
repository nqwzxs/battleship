export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunken = false;
  }

  hit() {
    this.hits += 1;
    this.sunken = this.isSunk();
  }

  isSunk() {
    return this.hits === this.length;
  }
}
