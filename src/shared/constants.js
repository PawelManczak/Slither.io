const constants = {
  PLAYER_DIAMETER: 50,          // px size of player
  PLAYER_RADIUS: 25,
  PLAYER_SPEED: 200,            // px position change per second
  PLAYER_ROTATION: 2 * Math.PI, // max. angle in radians change per second
  PLAYER_STARTING_LENGTH: 50,

  FOOD_AMOUNT_PER_SQUARE: 1,    // food per AxA square
  FOOD_SQUARE: 200,
  FOOD_SIZE: 10,
  SCORE_PER_FOOD: 1,

  MAP_SIZE: 1000,

  CELL_SIZE: 100,

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
}

constants.GRID_CELLS = Math.floor(constants.MAP_SIZE / constants.CELL_SIZE)


module.exports = Object.freeze(constants);
