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
    context.fillStyle = "#6c2c3a";
    context.fillRect(x, y, 100, 100);
    x += 0.5;
    y += 0.5;
    requestAnimationFrame(render);
}

function renderBackground() {
    context.fillStyle = "rgb(68, 90, 97)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export function startRendering() {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(render);
}
