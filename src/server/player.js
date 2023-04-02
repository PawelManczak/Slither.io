const tinycolor = require('tinycolor2');
const GameObject = require('./gameobject');
const {PLAYER_SPEED, PLAYER_RADIUS, PLAYER_STARTING_LENGTH, PLAYER_RADIUS_GROWTH,
  PLAYER_LENGTH_GROWTH, PLAYER_ROTATION} = require('../shared/constants');
const {getEveryNth, getAngleBetweenMinusPiAndPi} = require('../shared/helpers.js');

class BodyPart extends GameObject {
  constructor(x, y, radius, socketID) {
    super(x, y, radius);
    this.socketID = socketID;
  }

  serialize() {
    return {id: this.id, x: this._x, y: this._y};
  }
}

class Player extends GameObject {
  constructor(socketID, username, x, y) {
    super(x, y, PLAYER_RADIUS);
    this.dir = 0;
    this.color = tinycolor.random().toHexString();
    this.username = username;
    this.socketID = socketID;
    this.length = PLAYER_STARTING_LENGTH;
    this.nthBodypartReported = 5;
    this.bodyparts = Array(this.length).fill(new BodyPart(x, y, this.radius, socketID));
    this.headingAngle = 0.0;
  }

  delete() {
    this.bodyparts.forEach((element) => {
      element.delete();
    });
    super.delete();
  }

  setHeadingAngle(angle) {
    this.headingAngle = angle;
  }

  getSteeringDirection(delta) {
    const maxDeltaAngle = PLAYER_ROTATION * delta;
    const previousAngle = this.dir;
    const changeInAngle = this.headingAngle - previousAngle;
    const smallestChange = getAngleBetweenMinusPiAndPi(changeInAngle);
    const steeringAngle = previousAngle + Math.sign(smallestChange) * Math.min(Math.abs(smallestChange), maxDeltaAngle);
    return getAngleBetweenMinusPiAndPi(steeringAngle);
  }

  update(delta) {
    if (this.deleted) return;
    this.x += PLAYER_SPEED * Math.cos(this.dir) * delta;
    this.y += PLAYER_SPEED * Math.sin(this.dir) * delta;

    this.updateDirection(delta);
    this.updateBodyparts();
  }

  updateDirection(delta) {
    if (this.dir != this.headingAngle) {
      this.dir = this.getSteeringDirection(delta);
    }
  }

  // this part has to be time(delta)-dependent in future
  updateBodyparts() {
    // remove last element if player didnt eat
    if (this.bodyparts.length >= this.length) {
      const bodypart = this.bodyparts.pop();
      bodypart.delete();
    }
    // insert new element on start
    this.bodyparts.unshift(new BodyPart(this.x, this.y, this.radius, this.socketID));
  }

  serialize() {
    // send only part of bodyparts to render
    const reportedBodyParts = getEveryNth(this.bodyparts, this.nthBodypartReported);
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      dir: this.dir,
      color: this.color,
      radius: this.radius,
      username: this.username,
      bodyparts: reportedBodyParts.map((o) => o.serialize()),
    };
  }

  eat() {
    this.length += PLAYER_LENGTH_GROWTH;
    this.radius += PLAYER_RADIUS_GROWTH;
  }
}

module.exports = {Player, BodyPart};
