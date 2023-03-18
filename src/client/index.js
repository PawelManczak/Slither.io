import { connect, play } from './networking';
import { startRendering } from './render';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const startScreen = document.getElementById('start-screen');

Promise.all([
    connect(onGameOver)
]).then(() => {
    playButton.onclick = () => {
        play(usernameInput.value);
        startScreen.style.display = "none";
        startRendering();
    }
})

function onGameOver() {
    stopRendering();
    startScreen.style.display = "block";
  }