import tinycolor from 'tinycolor2';
import Stats from 'stats.js';
import {getCurrentState} from './state';

const Constants = require('../shared/constants');
const {
  MAP_SIZE,
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

  const {self, others, food, scores} = getCurrentState();
  if (self) {
    renderBackground(self.x, self.y);
    renderFood(self.x, self.y, food);
    renderPlayer(self, self);
    renderLeaderBoard(scores, self);
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

function renderLeaderBoard(scores, self) {
  const offset = 10;
  let startOfText=35;
  const widthOfboard = canvas.width*0.2;
  const heightOfBoard = canvas.height*0.3;
  const distanceBetweenLines =20;
  context.fillStyle = 'rgba(113, 161, 228, 0.66)';
  context.fillRect(canvas.width*0.8, offset, widthOfboard-offset, heightOfBoard);
  context.fillStyle = 'rgba(255, 255, 228, 0.66)';
  context.font = '20px Trebuchet MS';
  context.textAlign = 'center';
  context.textBaseline = 'bottom';
  context.lineJoin = 'round';
  context.miterLimit = 2;
  context.lineWidth = 3;
  context.fillText('User name', canvas.width-widthOfboard*0.75, startOfText);
  context.fillText('Score', canvas.width-widthOfboard*0.25, startOfText);
  startOfText += distanceBetweenLines;
  let number=1;
  for (const player of scores) {
    startOfText += distanceBetweenLines;
    context.fillText('#'+number, canvas.width-widthOfboard+1.5*offset, startOfText);
    context.fillText(player.username, canvas.width-widthOfboard*0.75, startOfText);
    context.fillText(player.score, canvas.width-widthOfboard*0.25, startOfText);
    number+=1;
  }
}

function renderPlayer(self, player) {
  const {x, y, dir, radius, username, bodyparts} = player;
  const canvasX = canvas.width / 2 + x - self.x;
  const canvasY = canvas.height / 2 + y - self.y;
  const diameter = radius*2;

  // do not draw dead players
  if (player.dead == true) {
    return;
  }

  // save state to restore changes (e.g. context translation) later
  context.save();

  // make context relative to player
  context.translate(canvasX, canvasY);

  // draw player
  const center = 0;
  drawPlayer(bodyparts, player.color, diameter);

  // draw direction line
  const lineLength = diameter;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(center, center);
  context.lineTo(center + lineLength * Math.cos(dir), center + lineLength * Math.sin(dir));
  context.stroke();

  // draw username
  const usernameOffset = 10;
  context.font = '20px Trebuchet MS';
  context.textAlign = 'center';
  context.textBaseline = 'bottom';
  context.lineJoin = 'round';
  context.miterLimit = 2;
  context.lineWidth = 3;
  context.strokeStyle = tinycolor(player.color).darken(50);
  context.strokeText(username, center, -(radius + usernameOffset));
  context.fillStyle = tinycolor(player.color);
  context.fillText(username, center, -(radius+usernameOffset));

  // restore changes
  context.restore();
}

function drawPlayer(bodyparts, color, diameter) {
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
  context.lineWidth = diameter + outlineWidth;
  context.strokeStyle = tinycolor(color).darken(50);
  context.stroke();
  context.lineWidth = diameter;
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
        drawCircle(foodObject.x - offsetX, foodObject.y - offsetY, foodObject.radius, foodObject.color);
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

