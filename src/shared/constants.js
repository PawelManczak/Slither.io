module.exports = Object.freeze({
    PLAYER_RADIUS: 20,
    PLAYER_SPEED: 50,

    SCORE_PER_FOOD: 1,

    MAP_SIZE: 100,

    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        GAME_OVER: 'dead',
    },

    SERVER_UPDATE_FREQ: 1000 / 60
});