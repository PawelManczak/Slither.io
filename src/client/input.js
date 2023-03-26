import { updateDirection } from './networking';

const Constants = require('../shared/constants');

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  let headingAngle = Math.atan2(y - Constants.PLAYER_RADIUS / 2 - window.innerHeight / 2, x - Constants.PLAYER_RADIUS / 2 - window.innerWidth / 2);
  updateDirection(headingAngle);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('touchmove', onTouchInput);
}