import io from 'socket.io-client';

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = () => (
    connectedPromise.then(
    () => { // success
      console.log("Connected!");
    },
    () => { // failure
        console.log("Could not connect!");
    })
  );