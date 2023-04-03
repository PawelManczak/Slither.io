const constants = {
  PLAYER_DIAMETER: 50,          // px size of player
  PLAYER_RADIUS: 15,
  PLAYER_SPEED: 200,            // px position change per second
  PLAYER_ROTATION: 2 * Math.PI, // max. angle in radians change per second
  PLAYER_STARTING_LENGTH: 50,
  PLAYER_LENGTH_GROWTH: 1.0,    // growth per food
  PLAYER_RADIUS_GROWTH: 0.3,    // growth per food

  FOOD_AMOUNT_PER_SQUARE: 1,    // food per AxA square
  FOOD_SQUARE: 200,
  FOOD_MIN_SIZE: 8,
  FOOD_MAX_SIZE: 12,
  SCORE_PER_FOOD: 1,
  PERCENT_OF_BODY_COMPOSTED: 25,

  MAP_SIZE: 1000,
  CELL_SIZE: 100,

  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },

  SERVER_UPDATE_FREQ: 1000 / 60,
  SERVER_ARTIFICAL_MAX_DELAY: 50,  
  CLIENT_ARTIFICAL_MAX_DELAY: 0,  
  
  OUTLINE_RATIO: 0.12,
};

constants.GRID_CELLS = Math.floor(constants.MAP_SIZE / constants.CELL_SIZE);


module.exports = Object.freeze(constants);
