const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');
const Constants = require('../shared/constants');

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

// Listen for socket.io connections
io.on('connection', (socket) => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, (username) => {
    console.log(`Player ${username} joined`);
  });

  socket.on(Constants.MSG_TYPES.INPUT, (dir) => {
    console.log(`Directory update ${dir}`);
  });
});

