import ComputerLogic from "./ComputerLogic";
import Game from "./Game";

let game;

let humanGameboardElement;
let computerGameboardElement;

const modal = document.querySelector(".modal");
const newGameButton = document.querySelector(".new-game-button");

function hideModal() {
  modal.innerHTML = "";
  modal.style.visibility = "hidden";
}

function showVictoryModal() {
  modal.textContent = "Congratulations! You won!";
  modal.style.visibility = "visible";
}

function showDefeatModal() {
  modal.textContent = "You lost!";
  modal.style.visibility = "visible";
}

function showPlaceShipsModal() {
  modal.textContent = "Place your ships (press R to rotate)";
  modal.style.visibility = "visible";

  const randomButton = document.createElement("button");
  randomButton.textContent = "Randomize";
  modal.appendChild(randomButton);
}

function createGameboards() {
  const gameboardContainerElements = document.querySelectorAll(
    ".gameboard-container",
  );

  gameboardContainerElements.forEach((container) => {
    const gameboardElement = container.querySelector(".gameboard");

    if (gameboardElement !== null) container.removeChild(gameboardElement);

    const newGameboardElement = document.createElement("div");
    newGameboardElement.classList.add("gameboard");
    container.appendChild(newGameboardElement);
  });

  humanGameboardElement = document.querySelector(
    ".human-gameboard-container .gameboard",
  );
  computerGameboardElement = document.querySelector(
    ".computer-gameboard-container .gameboard",
  );
}

function updateGameboard(player, isHuman) {
  const gameboardElement = isHuman
    ? humanGameboardElement
    : computerGameboardElement;

  gameboardElement.innerHTML = "";

  player.gameboard.squares.forEach((square) => {
    const squareElement = document.createElement("div");

    squareElement.dataset.row = square.coordinates.row;
    squareElement.dataset.col = square.coordinates.col;

    squareElement.classList.add("square");
    if (square.ship && isHuman) squareElement.classList.add("has-ship");

    if (square.ship && square.ship.sunken) {
      squareElement.classList.add("has-ship-sunk");
    } else if (square.shot && square.ship) {
      squareElement.classList.add("has-ship-shot");
    } else if (square.shot) {
      squareElement.classList.add("has-missed-shot");
    }

    gameboardElement.appendChild(squareElement);
  });
}

function updateGameboards() {
  updateGameboard(game.players.human, true);
  updateGameboard(game.players.computer, false);
}

function playTurns() {
  computerGameboardElement.classList.add("active");

  let targetComputerSquare;

  const computer = new ComputerLogic();

  function attackSquare(event) {
    if (!event.target.classList.contains("square")) return;

    const { row, col } = event.target.dataset;

    targetComputerSquare = game.players.computer.gameboard.selectSquare(
      +row,
      +col,
    );

    if (targetComputerSquare.shot) return;

    game.players.computer.gameboard.receiveAttack(targetComputerSquare);

    updateGameboards();

    if (game.players.computer.gameboard.allSunk()) {
      computerGameboardElement.removeEventListener("click", attackSquare);
      computerGameboardElement.classList.remove("active");
      humanGameboardElement.classList.remove("active");

      showVictoryModal();
      return;
    }

    computer.attack(game.players.human.gameboard);
    updateGameboards();

    if (game.players.human.gameboard.allSunk()) {
      computerGameboardElement.removeEventListener("click", attackSquare);
      computerGameboardElement.classList.remove("active");
      humanGameboardElement.classList.remove("active");

      showDefeatModal();
    }
  }

  computerGameboardElement.addEventListener("click", attackSquare);
}

function humanPlaceShips() {
  humanGameboardElement.classList.add("active");

  const randomButton = modal.querySelector("button");

  let hoveredSquare = null;
  let vertical = false;

  let currentShipIndex = 0;
  let currentShip = Object.values(game.players.human.gameboard.ships)[
    currentShipIndex
  ];

  function showPreview() {
    const humanGameboardSquareElements = humanGameboardElement.childNodes;

    const selectedSquares = game.players.human.gameboard.selectSquares(
      currentShip.length,
      +hoveredSquare.dataset.row,
      +hoveredSquare.dataset.col,
      vertical,
    );

    if (!selectedSquares) {
      hoveredSquare.classList.add("invalid-place");
      return;
    }

    selectedSquares.forEach((square) => {
      const { row, col } = square.coordinates;

      humanGameboardSquareElements.forEach((el) => {
        if (
          el.dataset.row === row.toString() &&
          el.dataset.col === col.toString()
        ) {
          el.classList.add("valid-place");
        }
      });
    });
  }

  function removePreview() {
    const humanGameboardSquareElements = humanGameboardElement.childNodes;

    humanGameboardSquareElements.forEach((el) => {
      el.classList.remove("valid-place");
      el.classList.remove("invalid-place");
    });
  }

  function handleRotatePress(event) {
    if (event.key !== "r") return;

    vertical = vertical !== true;
    removePreview();
    showPreview();
  }

  function handleSquareHover(event) {
    if (!event.target.classList.contains("square")) return;

    hoveredSquare = event.target;

    removePreview();
    showPreview();
  }

  function handleSquarePlace(event) {
    if (!event.target.classList.contains("square")) return;

    const selectedSquares = game.players.human.gameboard.selectSquares(
      currentShip.length,
      +hoveredSquare.dataset.row,
      +hoveredSquare.dataset.col,
      vertical,
    );

    if (!selectedSquares) return;

    game.players.human.gameboard.placeShip(currentShip, selectedSquares);

    currentShipIndex += 1;

    currentShip = Object.values(game.players.human.gameboard.ships)[
      currentShipIndex
    ];

    if (currentShipIndex > 4) {
      // eslint-disable-next-line no-use-before-define
      finishHumanPlaceShips();
    } else {
      showPreview();
      updateGameboards();
    }
  }

  function handleRandomClick() {
    game.players.human.gameboard.removeShips();
    game.players.human.gameboard.placeShipsRandomly();

    // eslint-disable-next-line no-use-before-define
    finishHumanPlaceShips();
  }

  window.addEventListener("keyup", handleRotatePress);
  humanGameboardElement.addEventListener("mouseover", handleSquareHover);
  humanGameboardElement.addEventListener("mouseleave", removePreview);
  humanGameboardElement.addEventListener("click", handleSquarePlace);
  randomButton.addEventListener("click", handleRandomClick);

  function finishHumanPlaceShips() {
    window.removeEventListener("keyup", handleRotatePress);
    humanGameboardElement.removeEventListener("mouseover", handleSquareHover);
    humanGameboardElement.removeEventListener("mouseleave", removePreview);
    humanGameboardElement.removeEventListener("click", handleSquarePlace);
    randomButton.removeEventListener("click", handleRandomClick);

    hideModal();
    game.players.computer.gameboard.placeShipsRandomly();
    updateGameboards();
    playTurns();
  }
}

function startGame() {
  game = new Game();
  createGameboards();
  updateGameboards();
  showPlaceShipsModal();
  humanPlaceShips();
}

newGameButton.addEventListener("click", startGame);

startGame();
