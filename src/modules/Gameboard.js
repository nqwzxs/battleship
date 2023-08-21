import Ship from "./Ship";

export default class Gameboard {
  constructor() {
    this.squares = Gameboard.#generateSquares();
    this.ships = Gameboard.#generateShips();
  }

  static #generateSquares() {
    const squares = [];

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const square = {
          coordinates: {
            row: i,
            col: j,
          },
          ship: null,
          shot: false,
          busy: false,
        };

        squares.push(square);
      }
    }

    return squares;
  }

  static #generateShips() {
    return {
      Carrier: new Ship(5),
      Battleship: new Ship(4),
      Cruiser: new Ship(3),
      Submarine: new Ship(3),
      Destroyer: new Ship(2),
    };
  }

  static areOutOfBounds(shipLength, row, col, vertical) {
    if (vertical) {
      return row + shipLength > 9 || row < 0 || col > 9 || col < 0;
    }

    return col + shipLength > 9 || col < 0 || row > 9 || row < 0;
  }

  static isSquareBusy(square) {
    return square.busy;
  }

  selectSquare(row, col) {
    return this.squares.find(
      (square) =>
        square.coordinates.row === row && square.coordinates.col === col,
    );
  }

  selectSquares(shipLength, row, col, vertical) {
    const selectedSquares = [];

    for (let i = 0; i < shipLength; i++) {
      const selectedSquare = vertical
        ? this.selectSquare(row + i, col)
        : this.selectSquare(row, col + i);

      selectedSquares.push(selectedSquare);
    }

    return selectedSquares;
  }

  static placeShip(ship, square) {
    square.ship = ship;
  }

  static setSquareBusy(square) {
    square.busy = true;
  }

  selectAdjacentSquares(square) {
    const adjacentSquares = [];

    const offsets = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    offsets.forEach((offset) => {
      const [rowShift, colShift] = offset;

      const adjacentSquare = this.selectSquare(
        square.row + rowShift,
        square.col + colShift,
      );

      if (adjacentSquare) adjacentSquares.push(adjacentSquare);
    });

    return adjacentSquares;
  }

  static receiveAttack(square) {
    if (square.ship) {
      square.ship.hit();
    }

    square.shot = true;
  }

  allSunk() {
    Object.values(this.ships).every((ship) => ship.sunken === true);
  }
}
