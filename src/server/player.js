const GameObject = require('./gameobject');
const {MAP_SIZE, PLAYER_SPEED, PLAYER_RADIUS, PLAYER_STARTING_LENGTH} = require('../shared/constants');

class BodyPart extends GameObject {
  constructor(x, y) {
    super(x, y);
  }

  serialize() {
    return {x: this._x, y: this._y};
  }
}

class Player extends GameObject {
  constructor(socketID, username, x, y) {
    super(x, y);
    this.dir = 0;
    this.username = username;
    this.socketID = socketID;
    this.length = PLAYER_STARTING_LENGTH;
    this.nthBodypartReported = 5;
    this.bodyparts = Array(this.length).fill(new BodyPart(x, y));
  }

  delete() {
    this.bodyparts.forEach((element) => {
      element.delete();
    });
    super.delete();
  }

  setDirection(dir) {
    this.dir = dir;
  }

  update(delta) {
    if (this.deleted) return;
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
      const bodypart = this.bodyparts.pop();
      bodypart.delete();
    }
    // insert new element on start
    this.bodyparts.unshift(new BodyPart(this.x, this.y));
  }

  serialize() {
    const reportedBodyParts = getEveryNth(this.bodyparts, this.nthBodypartReported);
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
      username: this.username,
      // send only part of bodyparts to render
      bodyparts: reportedBodyParts.map((o) => o.serialize()),
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
