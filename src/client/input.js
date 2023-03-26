import { updateDirection } from './networking';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

let headingAngle = 0.0;
let currentAngle = 0.0;
let animationFrameRequestId;

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  headingAngle = Math.atan2(y - Constants.PLAYER_RADIUS / 2 - window.innerHeight / 2, x - Constants.PLAYER_RADIUS / 2 - window.innerWidth / 2);
  currentAngle = getSteeringDirection();
  updateDirection(currentAngle);
}

function getSteeringDirection() {
  const state = getCurrentState();
  if (state) {
    const { time, self } = state;
    const deltaTimeSeconds = (Date.now() - time) / 1000;
    const maxDeltaAngle = Constants.PLAYER_ROTATION * deltaTimeSeconds
    const previousAngle = self.dir;
    const changeInAngle = headingAngle - previousAngle;

    // https://stackoverflow.com/questions/1878907/how-can-i-find-the-smallest-difference-between-two-angles-around-a-point
    let smallestChange = changeInAngle;
    if (changeInAngle > Math.PI)
      smallestChange -= 2 * Math.PI;
    else if (changeInAngle < -Math.PI)
      smallestChange += 2 * Math.PI;

    const steeringAngle = previousAngle + Math.sign(smallestChange) * Math.min(Math.abs(smallestChange), maxDeltaAngle);
    return steeringAngle;
  }
  else
    return headingAngle;
}

function steerDirection() {
  if (headingAngle != currentAngle) {
    currentAngle = getSteeringDirection();
    updateDirection(currentAngle);
  }
  animationFrameRequestId = requestAnimationFrame(steerDirection);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('touchmove', onTouchInput);
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(steerDirection);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('touchmove', onTouchInput);
  cancelAnimationFrame(animationFrameRequestId);
}