import { getCurrentState } from "./state";

const Constants = require('../shared/constants');
const { MAP_SIZE, PLAYER_RADIUS, PLAYER_COLOR, OTHERS_COLOR } = Constants;


// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animationFrameRequestId;

function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', setCanvasDimensions);

function render() {
    const state = getCurrentState()
    if (state) {
        const { time, self, others } = state;
        renderBackground(self.x, self.y);
        renderPlayer(self, self);
        others.forEach(p => renderPlayer(self, p));
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
    const { x, y, dir, username } = player;
    const canvasX = canvas.width / 2 + x - self.x;
    const canvasY = canvas.height / 2 + y - self.y;

    // save state to restore changes (e.g. context translation) later  
    context.save();

    // draw player
    context.translate(canvasX, canvasY); // make context relative to player
    context.fillStyle = self == player ? PLAYER_COLOR : OTHERS_COLOR;
    context.fillRect(0, 0, PLAYER_RADIUS, PLAYER_RADIUS);
    context.fillRect(0, 0, PLAYER_RADIUS, PLAYER_RADIUS);

    // draw direction line
    const center = PLAYER_RADIUS / 2;
    const lineLength = 50;
    context.beginPath();
    context.moveTo(center, center);
    context.lineTo(center + lineLength * Math.cos(dir), center + lineLength * Math.sin(dir));
    context.stroke();

    // draw username
    context.font = "20px Trebuchet MS";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText(username, PLAYER_RADIUS / 2, -PLAYER_RADIUS / 2);

    // restore changes
    context.restore();
}

export function startRendering() {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(render);
}
