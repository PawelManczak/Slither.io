import {initState} from './state';
import {connect, play} from './networking';
import {startRendering, stopRendering} from './render';
import {startCapturingInput, stopCapturingInput} from './input';

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const startScreen = document.getElementById('start-screen');

Promise.all([
  connect(onGameOver),
]).then(() => {
  playButton.onclick = () => {
    play(usernameInput.value);
    startScreen.style.display = 'none';
    initState();
    startRendering();
    startCapturingInput();
  };
});

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  startScreen.style.display = 'block';
}
