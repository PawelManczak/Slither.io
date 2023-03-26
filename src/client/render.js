import { getCurrentState } from "./state";

const Constants = require('../shared/constants');
const { MAP_SIZE, PLAYER_COLOR, OTHERS_COLOR } = Constants;


// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animationFrameRequestId;

function render() {
    const state = getCurrentState()
    if (state) {
        const { time, self, players } = state;
        renderBackground(self.x, self.y);
        renderPlayer(self, self);
        players.forEach(p => renderPlayer(self, p));
    }
    animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(centerX, centerY) {
    // background
    const backgroundX = canvas.width / 2 - centerX;
    const backgroundY = canvas.height / 2 - centerY;
    const backgroundGradient = context.createLinearGradient(
        backgroundX,
        backgroundY,
        backgroundX + MAP_SIZE,
        backgroundY + MAP_SIZE
    );
    backgroundGradient.addColorStop(0, 'crimson');
    backgroundGradient.addColorStop(1, 'beige');
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // boundaries
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(canvas.width / 2 - centerX, canvas.height / 2 - centerY, MAP_SIZE, MAP_SIZE);

}

function renderPlayer(self, player) {
    const { x, y, username } = player;
    const canvasX = canvas.width / 2 + x - self.x;
    const canvasY = canvas.height / 2 + y - self.y;

    context.save();

    context.translate(canvasX, canvasY);
    context.fillStyle = self == player ? PLAYER_COLOR : OTHERS_COLOR;
    context.fillRect(0, 0, 50, 50);

    context.restore();
}

export function startRendering() {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(render);
}
