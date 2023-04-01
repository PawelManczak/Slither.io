const GameObject = require('./gameobject');
const {MAP_SIZE, PLAYER_SPEED, PLAYER_RADIUS, PLAYER_STARTING_LENGTH} = require('../shared/constants');

class Player extends GameObject {
  constructor(socketID, username, x, y) {
    super(x, y);
    this.dir = 0;
    this.username = username;
    this.socketID = socketID;
    this.length = PLAYER_STARTING_LENGTH;
    this.nthBodypartReported = 5;
    this.bodyparts = Array(this.length).fill({x: x, y: y});
  }

  setDirection(dir) {
    this.dir = dir;
  }

  update(delta) {
    this.x += PLAYER_SPEED * Math.cos(this.dir) * delta;
    this.y += PLAYER_SPEED * Math.sin(this.dir) * delta;

    // Clamp position to boundaries
    this.x = Math.max(PLAYER_RADIUS, Math.min(MAP_SIZE - PLAYER_RADIUS, this.x));
    this.y = Math.max(PLAYER_RADIUS, Math.min(MAP_SIZE - PLAYER_RADIUS, this.y));

    this.updateBodyparts();
  }

  // this part has to be time(delta)-dependent in future
  updateBodyparts() {
    // remove last element if player didnt eat
    if (this.bodyparts.length >= this.length) {
      this.bodyparts.pop();
    }
    // insert new element on start
    this.bodyparts.unshift({x: this.x, y: this.y});
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
      username: this.username,
      bodyparts: getEveryNth(this.bodyparts, this.nthBodypartReported), // send only part of bodyparts to render
    };
  }

  eat() {
    this.length += 1;
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
