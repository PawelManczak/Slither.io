module.exports = Object.freeze({
  PLAYER_DIAMETER: 50,          // px size of player
  PLAYER_RADIUS: 25,
  PLAYER_SPEED: 200,            // px position change per second
  PLAYER_ROTATION: 2 * Math.PI, // max. angle in radians change per second

  FOOD_AMOUNT_PER_SQUARE: 5,    // food per 100x100px rectangle
  FOOD_SIZE: 10,
  SCORE_PER_FOOD: 1,

  MAP_SIZE: 1000,

  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },

  SERVER_UPDATE_FREQ: 1000 / 60,

  PLAYER_COLOR: '#99ff66',
  OTHERS_COLOR: '#ff3399',
  FOOD_COLOR: '#00ff00',
});
