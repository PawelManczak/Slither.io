import io from 'socket.io-client';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(
    () => { // success
      console.log("Connected!");
      socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
      socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    },
    () => { // failure
      console.log("Could not connect!");
    })
);

export const play = username => {
  console.log(`Sending ${Constants.MSG_TYPES.JOIN_GAME} message`);
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
};