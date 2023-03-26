module.exports = Object.freeze({
  PLAYER_RADIUS: 50, // px size of player 
  PLAYER_SPEED: 200, // px position change per second 
  PLAYER_ROTATION: 2*Math.PI, // max. angle in radians change per second 

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
});
