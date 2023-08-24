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

  static #isShipOutOfBounds(shipLength, row, col, vertical) {
    return vertical ? row + shipLength > 10 : col + shipLength > 10;
  }

  static #areSquaresInvalid(squares) {
    return squares.some((square) => square.busy);
  }

  removeShips() {
    this.squares.forEach((square) => {
      square.ship = null;
    });
  }

  selectSquare(row, col) {
    return this.squares.find(
      (square) =>
        square.coordinates.row === row && square.coordinates.col === col,
    );
  }

  selectSquares(shipLength, row, col, vertical) {
    if (Gameboard.#isShipOutOfBounds(shipLength, row, col, vertical)) {
      return null;
    }

    const selectedSquares = [];

    for (let i = 0; i < shipLength; i++) {
      const selectedSquare = vertical
        ? this.selectSquare(row + i, col)
        : this.selectSquare(row, col + i);

      selectedSquares.push(selectedSquare);
    }

    if (Gameboard.#areSquaresInvalid(selectedSquares)) {
      return null;
    }

    return selectedSquares;
  }

  #selectShipSquares(ship) {
    const selectedSquares = [];

    this.squares.forEach((square) => {
      if (square.ship === ship) selectedSquares.push(square);
    });

    return selectedSquares;
  }

  placeShip(ship, squares) {
    squares.forEach((square) => {
      square.ship = ship;
      square.busy = true;

      const adjacentSquares = this.#selectAdjacentSquares(square);

      adjacentSquares.forEach((adjSquare) => {
        adjSquare.busy = true;
      });
    });
  }

  #selectAdjacentSquares(square) {
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
        square.coordinates.row + rowShift,
        square.coordinates.col + colShift,
      );

      if (adjacentSquare) adjacentSquares.push(adjacentSquare);
    });

    return adjacentSquares;
  }

  receiveAttack(square) {
    if (square.shot) return;

    if (square.ship) {
      square.ship.hit();

      if (square.ship.sunken) {
        const shipSquares = this.#selectShipSquares(square.ship);

        shipSquares.forEach((shipSquare) => {
          const adjacentSquares = this.#selectAdjacentSquares(shipSquare);
          adjacentSquares.forEach((adjSquare) => {
            adjSquare.shot = true;
          });
        });
      }
    }

    square.shot = true;
  }

  allSunk() {
    return Object.values(this.ships).every((ship) => ship.sunken);
  }

  static getRandomCoordinate() {
    return Math.floor(Math.random() * 10);
  }

  getRandomSquare() {
    const row = Gameboard.getRandomCoordinate();
    const col = Gameboard.getRandomCoordinate();

    return this.selectSquare(row, col);
  }

  findValidCoordinates(ship) {
    const row = Gameboard.getRandomCoordinate();
    const col = Gameboard.getRandomCoordinate();
    const vertical = Math.random() < 0.5;

    const selectedSquares = this.selectSquares(ship.length, row, col, vertical);

    if (selectedSquares) return selectedSquares;

    return this.findValidCoordinates(ship);
  }

  placeShipsRandomly() {
    Object.values(this.ships).forEach((ship) => {
      const selectedSquares = this.findValidCoordinates(ship);

      this.placeShip(ship, selectedSquares);
    });
  }
}
