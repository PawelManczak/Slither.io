const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');
const Constants = require('../shared/constants');
const Game = require('./game');

const webpackConfig = require('../../webpack.dev.js');

const app = express();
app.use(express.static('public'));
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

const delayWrapper = ((callback, maxDelay) => {
  // artifial delay is only present on development
  if (process.env.npm_lifecycle_event == 'develop') {
    return function(...args) {
      setTimeout(() => callback.apply(this, args), maxDelay * Math.random());
    };
  }
  return callback;
});

// Listen for socket.io connections
io.on('connection', (socket) => {
  console.log('Player connected!', socket.id);

  // add artifical delay to simulate network latency
  socket.emit = delayWrapper(socket.emit, Constants.SERVER_ARTIFICAL_MAX_DELAY);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, delayWrapper(joinGame, Constants.CLIENT_ARTIFICAL_MAX_DELAY));
  socket.on(Constants.MSG_TYPES.INPUT, delayWrapper(handleInput, Constants.CLIENT_ARTIFICAL_MAX_DELAY));
  socket.on('disconnect', delayWrapper(onDisconnect, Constants.CLIENT_ARTIFICAL_MAX_DELAY));
});

// Setup the Game
const game = new Game();

function joinGame(username) {
  const socketID = this.id;
  console.log(`Player ${username} (${socketID}) joined`);
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function onDisconnect() {
  const socketID = this.id;
  console.log(`Player (${socketID}) disconnected`);
  game.removePlayer(socketID);
}
