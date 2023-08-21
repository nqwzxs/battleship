import Gameboard from "../modules/Gameboard";
import Ship from "../modules/Ship";

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

describe("selectSquare()", () => {
  test("should select square at specified coordinates", () => {
    const row = 9;
    const col = 9;

    const selectedSquare = gameboard.selectSquare(row, col);

    const expectedSquare = gameboard.squares.find(
      (square) =>
        square.coordinates.row === row && square.coordinates.col === col,
    );

    expect(selectedSquare).toEqual(expectedSquare);
  });
});

describe("selectSquares()", () => {
  test("should select squares at specified coordinates horizontally", () => {
    const shipLength = 3;
    const row = 1;
    const col = 1;
    const vertical = false;

    const selectedSquares = gameboard.selectSquares(
      shipLength,
      row,
      col,
      vertical,
    );

    const expectedSquares = [];

    for (let i = 0; i < shipLength; i++) {
      const expectedSquare = gameboard.selectSquare(row, col + i);

      expectedSquares.push(expectedSquare);
    }

    expect(selectedSquares).toEqual(expectedSquares);
  });

  test("should select squares at specified coordinates vertically", () => {
    const shipLength = 3;
    const row = 5;
    const col = 5;
    const vertical = true;

    const selectedSquares = gameboard.selectSquares(
      shipLength,
      row,
      col,
      vertical,
    );

    const expectedSquares = [];

    for (let i = 0; i < shipLength; i++) {
      const expectedSquare = gameboard.selectSquare(row + i, col);

      expectedSquares.push(expectedSquare);
    }

    expect(selectedSquares).toEqual(expectedSquares);
  });
});

describe("placeShip()", () => {
  test("should place ship on specified squares", () => {
    const ship = new Ship(3);
    const row = 1;
    const column = 1;

    const selectedSquare = gameboard.selectSquare(row, column);

    Gameboard.placeShip(ship, selectedSquare);

    expect(selectedSquare.ship).toBe(ship);
  });
});

describe("placeShip()", () => {
  test("should place ship on specified squares", () => {
    const ship = new Ship(3);
    const row = 0;
    const column = 0;

    const selectedSquare = gameboard.selectSquare(row, column);

    Gameboard.placeShip(ship, selectedSquare);

    expect(selectedSquare.ship).toBe(ship);
  });
});
