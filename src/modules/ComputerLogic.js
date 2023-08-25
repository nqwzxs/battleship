export default class ComputerLogic {
  constructor() {
    this.attackingShip = false;
    this.directions = {};
  }

  attack(gameboard) {
    if (this.attackingShip) {
      this.attackDirection(gameboard);
    } else {
      this.attackRandom(gameboard);
    }
  }

  attackDirection(gameboard) {
    const randomDirection = Math.floor(
      Math.random() * Object.keys(this.directions).length,
    );
    const square = Object.values(this.directions)[randomDirection][0];

    if (!square || square.shot) {
      this.attackDirection(gameboard);
      return;
    }

    gameboard.receiveAttack(square);

    if (square.ship && square.ship.sunken) {
      this.attackingShip = false;
      this.directions = [];
    } else if (square.ship) {
      Object.values(this.directions)[randomDirection].shift();

      if (
        Object.keys(this.directions)[randomDirection] === "left" ||
        Object.keys(this.directions)[randomDirection] === "right"
      ) {
        this.directions.down = [];
        this.directions.up = [];
      } else {
        this.directions.left = [];
        this.directions.right = [];
      }
    }
  }

  attackRandom(gameboard) {
    const square = gameboard.getRandomSquare();

    if (square.shot) {
      this.attackRandom(gameboard);
      return;
    }

    gameboard.receiveAttack(square);

    if (square.ship) {
      this.attackingShip = true;
      this.directions = gameboard.createDirections(square);
    }
  }
}
