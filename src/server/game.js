const Constants = require('../shared/constants');
const Player = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.lastUpdateTime = Date.now();
    setInterval(this.update.bind(this), Constants.SERVER_UPDATE_FREQ);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    const x = Constants.MAP_SIZE * Math.random();
    const y = Constants.MAP_SIZE * Math.random();
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
    // Calculate delta
    const now = Date.now();
    const delta = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update players
    for (const socketID of Object.keys(this.sockets)) {
      this.players[socketID].update(delta);
    }

    // Send updated state
    for (const [socketID, socket] of Object.entries(this.sockets)) {
      const update = this.createUpdate(socketID);
      socket.emit(Constants.MSG_TYPES.GAME_UPDATE, update);
    }
  }

  createUpdate(playerSocketID) {
    // TODO: update only nearby players
    return {
      time: Date.now(),
      self: this.players[playerSocketID].serialize(),
      others: Object.values(this.players)
        .filter((p) => p.socketID != playerSocketID)
        .map((p) => p.serialize()),
    };
  }
}

module.exports = Game;
