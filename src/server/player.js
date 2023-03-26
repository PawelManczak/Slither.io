const {MAP_SIZE, PLAYER_SPEED, PLAYER_RADIUS} = require('../shared/constants');

class Player {
  constructor(socketID, username, x, y) {
    this.x = x;
    this.y = y;
    this.dir = 0;
    this.username = username;
    this.socketID = socketID;
  }

  setDirection(dir) {
    this.dir = dir;
  }

  update(delta) {
    this.x += PLAYER_SPEED * Math.sin(this.dir) * delta;
    this.y -= PLAYER_SPEED * Math.cos(this.dir) * delta;

    // Clamp position to boundaries
    this.x = Math.max(0, Math.min(MAP_SIZE - PLAYER_RADIUS, this.x));
    this.y = Math.max(0, Math.min(MAP_SIZE - PLAYER_RADIUS, this.y));
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
      username: this.username,
    };
  }
}

module.exports = Player;
