import {initState} from './state';
import {connect, play} from './networking';
import {startRendering} from './render';
import {startCapturingInput, stopCapturingInput} from './input';

const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const startScreen = document.getElementById('start-screen');
const playagainScreen = document.getElementById('playagain-screen');
const playagainButton = document.getElementById('playagain-button');
const gameCanvas = document.getElementById('game-canvas');

Promise.all([
  connect(onGameOver),
]).then(() => {
  playButton.onclick = () => {
    play(usernameInput.value);
    gameCanvas.style.opacity = 1.0;
    startScreen.style.display = 'none';
    initState();
    startRendering();
    startCapturingInput();
  };
});

function onGameOver() {
  stopCapturingInput();
  playagainScreen.style.visibility = 'visible';
  playagainScreen.style.opacity = 0.8;
  gameCanvas.style.opacity = 0.5;
}

playagainButton.onclick = () => {
  play(usernameInput.value);
  playagainScreen.style.visibility = 'hidden';
  playagainScreen.style.opacity = 0.0;
  gameCanvas.style.opacity = 1.0;
  initState();
  startCapturingInput();
};
