import tinycolor from 'tinycolor2';
import Stats from 'stats.js';
import {getCurrentState} from './state';

const Constants = require('../shared/constants');
const {
  MAP_SIZE,
  PLAYER_DIAMETER,
  PLAYER_COLOR,
  OTHERS_COLOR,
  OUTLINE_RATIO,
} = Constants;


// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Measure performance
const stats = new Stats();

let animationFrameRequestId;

function setCanvasDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', setCanvasDimensions);

function render() {
  stats.begin();

  const state = getCurrentState();
  if (state) {
    const {self, others, food} = state;
    renderBackground(self.x, self.y);
    renderFood(self.x, self.y, food);
    renderPlayer(self, self);
    others.forEach((p) => renderPlayer(self, p));
  }

  stats.end();

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
      backgroundY + MAP_SIZE,
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
  const {x, y, dir, username, bodyparts} = player;
  const canvasX = canvas.width / 2 + x - self.x;
  const canvasY = canvas.height / 2 + y - self.y;

  // save state to restore changes (e.g. context translation) later
  context.save();

  // make context relative to player
  context.translate(canvasX, canvasY);

  // draw player
  const playerColor = (self == player) ? PLAYER_COLOR : OTHERS_COLOR;
  const center = 0;
  drawPlayer(bodyparts, playerColor, canvasX, canvasY);

  // draw direction line
  const lineLength = 50;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(center, center);
  context.lineTo(center + lineLength * Math.cos(dir), center + lineLength * Math.sin(dir));
  context.stroke();

  // draw username
  context.font = '20px Trebuchet MS';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.lineJoin = 'round';
  context.miterLimit = 2;
  context.lineWidth = 3;
  context.strokeStyle = tinycolor(playerColor).darken(50);
  context.strokeText(username, center, -PLAYER_DIAMETER);
  context.fillStyle = tinycolor(playerColor);
  context.fillText(username, center, -PLAYER_DIAMETER);

  // restore changes
  context.restore();
}

function drawPlayer(bodyparts, color) {
  context.beginPath();
  bodyparts.forEach(
      (bodypart) => {
        // as canvas is centered to the player, each bodypart
        // should have position relative to the head
        const x = bodypart.x - bodyparts[0].x;
        const y = bodypart.y - bodyparts[0].y;
        context.lineTo(x, y);
      },
  );
  const outlineWidth = 5;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = PLAYER_DIAMETER + outlineWidth;
  context.strokeStyle = tinycolor(color).darken(50);
  context.stroke();
  context.lineWidth = PLAYER_DIAMETER;
  context.strokeStyle = color;
  context.stroke();
}

function drawCircle(centerX, centerY, radius, color) {
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
  context.lineWidth = radius*OUTLINE_RATIO;
  context.strokeStyle = tinycolor(color).darken(50);
  context.stroke();
}

function renderFood(playerX, playerY, food) {
  const offsetX = playerX - canvas.width / 2;
  const offsetY = playerY - canvas.height / 2;
  food.forEach(
      (foodObject) => {
        drawCircle(foodObject.x - offsetX, foodObject.y - offsetY, foodObject.size, foodObject.color);
      },
  );
}

export function switchPerformanceDisplay() {
  if (document.getElementById('performanceDisplay')) {
    document.body.removeChild(stats.dom);
  } else {
    stats.dom.id = 'performanceDisplay';
    document.body.appendChild(stats.dom);
    stats.showPanel(0);
  }
}

export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

export function stopRendering() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(animationFrameRequestId);
}

