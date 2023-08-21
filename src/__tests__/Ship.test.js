import Ship from "../modules/Ship";

const ship = new Ship(3);

describe("hit()", () => {
  test("should increase the number of hits of the ship by one", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });
});

describe("isSunk()", () => {
  test("should return true when the number of hits equals to the legnth of the ship", () => {
    ship.hits = 3;
    expect(ship.isSunk()).toBe(true);
  });

  test("should return false when the number of hits doesn't equal to the legnth of the ship", () => {
    ship.hits = 2;
    expect(ship.isSunk()).toBe(false);
  });
});
