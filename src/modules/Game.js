import Player from "./Player";

export default class Game {
  constructor() {
    this.players = {
      human: new Player(),
      computer: new Player(),
    };
  }
}
