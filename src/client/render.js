import { getCurrentState } from "./state";

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animationFrameRequestId;

var x = 100;
var y = 100;

function render() {
    renderBackground();
    const state = getCurrentState()
    if (state) {
        const {time, self, players} = state;
        context.fillStyle = "#1c3c0a";
        context.fillRect(self.x, self.y, 50, 50);
        players.forEach(p => {
            context.fillStyle = "#3c6cfa";
            context.fillRect(p.x, p.y, 50, 50);
        }
        );
    } 
    animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground() {
    context.fillStyle = "rgb(68, 90, 97)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ffffff";
    context.strokeRect(window.innerWidth / 2, window.innerHeight / 2, 30, 30)
}

export function startRendering() {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(render);
}
