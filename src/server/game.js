const Constants = require('../shared/constants');
const {Food, FoodManager} = require('./food');
const {Player, BodyPart} = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.lastUpdateTime = Date.now();
    this.foodManager = new FoodManager();
    setInterval(this.update.bind(this), Constants.SERVER_UPDATE_FREQ);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    const x = Constants.MAP_SIZE * Math.random();
    const y = Constants.MAP_SIZE * Math.random();
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socketID) {
    if (socketID in this.players) {
      const player = this.players[socketID];
      this.foodManager.compostBody(player);
      player.delete();
      delete this.sockets[socketID];
      delete this.players[socketID];
    }
  }

  handleInput(socket, dir) {
    if (socket.id in this.players) {
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

    // Update food
    this.foodManager.update();

    // Check collisions
    this.handleCollisions();

    // Send updated state
    for (const [socketID, socket] of Object.entries(this.sockets)) {
      const update = this.createUpdate(socketID);
      socket.emit(Constants.MSG_TYPES.GAME_UPDATE, update);
    }
  }

  handleCollisions() {
    const collisionCheckRange = 100;
    const collisions = {}; // playerSocketID: GameObject
    for (const socketID of Object.keys(this.players)) {
      const player = this.players[socketID];
      const objectsInRange = player.getCloseObjectsTo(collisionCheckRange);
      const filteredObjects = objectsInRange.filter((object) => object.socketID != socketID);
      for (const object of filteredObjects) {
        const dist = Math.hypot(player.x - object.x, player.y - object.y);
        if (dist < Constants.PLAYER_RADIUS) {
          collisions[socketID] = object;
        }
      }
    }

    for (const [socketID, object] of Object.entries(collisions)) {
      const player = this.players[socketID];
      if (object instanceof Food) {
        this.players[socketID].eat();
        this.foodManager.removeFood(object);
      } else if (object instanceof BodyPart) {
        this.sockets[socketID].emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socketID);
      } else {
        console.log(`Unimplemented collision of ${player.username} with ${object.constructor.name}`);
      }
    }
  }

  createUpdate(playerSocketID) {
    const range = 800;
    const objectsInRange = this.players[playerSocketID].getCloseObjectsTo(range);
    const otherPlayers = objectsInRange.filter((o) => o instanceof Player && o.socketID != playerSocketID);
    const food = objectsInRange.filter((o) => o instanceof Food);

    return {
      time: Date.now(),
      self: this.players[playerSocketID].serialize(),
      others: otherPlayers.map((p) => p.serialize()),
      foodPositions: food.map((obj) => ({x: obj.x, y: obj.y})),
    };
  }
}

module.exports = Game;
