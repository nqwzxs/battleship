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

    const expectedSquare = gameboard.squares[99];

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

  test("should return null if ship is out of bounds", () => {
    const shipLength = 7;
    const row = 7;
    const col = 7;
    const vertical = false;

    const selectedSquares = gameboard.selectSquares(
      shipLength,
      row,
      col,
      vertical,
    );

    expect(selectedSquares).toBe(null);
  });

  test("should return null if one of selected squares is busy", () => {
    const shipLength = 5;
    const row = 0;
    const col = 0;
    const vertical = false;

    gameboard.squares[0].busy = true;

    const selectedSquares = gameboard.selectSquares(
      shipLength,
      row,
      col,
      vertical,
    );

    expect(selectedSquares).toBe(null);
  });
});

describe("placeShip()", () => {
  test("should place ship on specified squares", () => {
    const ship = new Ship(3);
    const row = 1;
    const column = 1;
    const vertical = false;

    const selectedSquares = gameboard.selectSquares(
      ship.length,
      row,
      column,
      vertical,
    );

    gameboard.placeShip(ship, selectedSquares);

    selectedSquares.forEach((square) => {
      expect(square.ship).toBe(ship);
    });
  });

  test("should set ship's adjacent squares busy", () => {
    const ship = new Ship(1);
    const row = 1;
    const column = 1;
    const vertical = false;

    const selectedSquares = gameboard.selectSquares(
      ship.length,
      row,
      column,
      vertical,
    );

    const adjacentSquareIndexes = [0, 1, 2];

    gameboard.placeShip(ship, selectedSquares);

    adjacentSquareIndexes.forEach((index) => {
      expect(gameboard.squares[index].busy).toBe(true);
    });
  });
});

describe("allSunk()", () => {
  test("should return true if all ships are sunk", () => {
    Object.values(gameboard.ships).forEach((ship) => {
      ship.sunken = true;
    });

    expect(gameboard.allSunk()).toBe(true);
  });

  test("should return false if not all ships are sunk", () => {
    expect(gameboard.allSunk()).toBe(false);
  });
});

describe("receiveAttack()", () => {
  test("should set square shot", () => {
    const square = gameboard.squares[0];

    gameboard.receiveAttack(square);

    expect(square.shot).toBe(true);
  });

  test("should call ship.hit() if ship is hit", () => {
    const square = gameboard.squares[0];
    square.ship = new Ship(3);

    gameboard.receiveAttack(square);

    expect(square.ship.hits).toEqual(1);
  });

  test("should shoot adjacent squares if ship is sunk", () => {
    const square = gameboard.squares[11];
    square.ship = new Ship(1);

    gameboard.receiveAttack(square);

    const adjacentSquareIndexes = [0, 1, 2, 10, 12, 20, 21, 22];

    adjacentSquareIndexes.forEach((index) => {
      expect(gameboard.squares[index].shot).toBe(true);
    });
  });
});

describe("removeShips()", () => {
  test("should remove ships on all squares", () => {
    const ship = new Ship(1);

    Object.values(gameboard.squares).forEach((square) => {
      square.ship = ship;
    });

    gameboard.removeShips();

    Object.values(gameboard.squares).forEach((square) => {
      expect(square.ship).toBe(null);
    });
  });
});

describe("getRandomSquare()", () => {
  test("should return one of the squares", () => {
    const randomSquare = gameboard.getRandomSquare();

    const isSquare = Object.values(gameboard.squares).some(
      (square) => randomSquare === square,
    );

    expect(isSquare).toBe(true);
  });
});

describe("placeShipsRandomly()", () => {
  test("should place all ships randomly", () => {
    gameboard.placeShipsRandomly();

    const areShipsPlaced = Object.values(gameboard.ships).every((ship) =>
      Object.values(gameboard.squares).some((square) => square.ship === ship),
    );

    expect(areShipsPlaced).toBe(true);
  });
});

describe("createDirections()", () => {
  test("should return object of directions with squares", () => {
    const square = gameboard.selectSquare(0, 0);

    const directions = gameboard.createDirections(square);

    const expectedDirections = {
      right: gameboard.selectSquares(
        9,
        square.coordinates.row,
        square.coordinates.col + 1,
        false,
      ),
      left: [],
      down: gameboard.selectSquares(
        9,
        square.coordinates.row + 1,
        square.coordinates.col,
        true,
      ),
      up: [],
    };

    expect(directions).toEqual(expectedDirections);
  });
});
