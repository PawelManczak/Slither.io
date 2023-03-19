const Constants = require('../shared/constants');

class Player {
    constructor(socketID, username, x, y) {
        this.x = x;
        this.y = y;
        this.dir = 0;
        this.username = username;
        this.socketID = socketID
    }

    setDirection(dir) {
        this.dir = dir;
    }

    update(delta) {
        this.x += Constants.PLAYER_SPEED * Math.sin(this.dir) * delta;
        this.y -= Constants.PLAYER_SPEED * Math.cos(this.dir) * delta;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            dir: this.dir,
            username: this.username
        };
    }
}

module.exports = Player;