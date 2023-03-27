const { MAP_SIZE, PLAYER_SPEED, PLAYER_RADIUS } = require('../shared/constants');

class Player {
  constructor(socketID, username, x, y) {
    this.x = x;
    this.y = y;
    this.dir = 0;
    this.username = username;
    this.socketID = socketID;
    this.length = 50;
    this.bodyparts = Array(this.length).fill({ x: x, y: y });
  }

  setDirection(dir) {
    this.dir = dir;
  }

  update(delta) {
    this.x += PLAYER_SPEED * Math.cos(this.dir) * delta;
    this.y += PLAYER_SPEED * Math.sin(this.dir) * delta;

    // Clamp position to boundaries
    this.x = Math.max(PLAYER_RADIUS / 2, Math.min(MAP_SIZE - PLAYER_RADIUS / 2, this.x));
    this.y = Math.max(PLAYER_RADIUS / 2, Math.min(MAP_SIZE - PLAYER_RADIUS / 2, this.y));

    this.updateBodyparts();
  }

  updateBodyparts() {
    // remove last element
    this.bodyparts.pop();
    // insert new element on start
    this.bodyparts.unshift({ x: this.x, y: this.y });
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
      username: this.username,
      bodyparts: getEveryNth(this.bodyparts, 10), // send only part of bodyparts to render
    };
  }
}

function getEveryNth(arr, nth) {
  const result = [];

  for (let index = 0; index < arr.length; index += nth) {
    result.push(arr[index]);
  }

  return result;
}

module.exports = Player;
