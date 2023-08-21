export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunken = this.isSunk();
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits === this.length;
  }
}
