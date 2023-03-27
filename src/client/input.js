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

function onKeyDown(e) {
  switch (e.key) {
    case "ArrowRight":
      headingAngle = 0;
      break;
    case "ArrowUp":
      headingAngle = -Math.PI / 2;
      break;
    case "ArrowLeft":
      headingAngle = -Math.PI;
      break;
    case "ArrowDown":
      headingAngle = Math.PI / 2;
      break;
  }
}

function handleInput(x, y) {
  headingAngle = Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2);
  currentAngle = getSteeringDirection();
  updateDirection(currentAngle);
}

function getAngleBetweenMinusPiAndPi(angle) {
  if (angle > Math.PI)
    angle -= 2 * Math.PI;
  else if (angle < -Math.PI)
    angle += 2 * Math.PI;
  return angle;
}

function getSteeringDirection() {
  const state = getCurrentState();
  if (state) {
    const { time, self } = state;
    const deltaTimeSeconds = (Date.now() - time) / 1000;
    const maxDeltaAngle = Constants.PLAYER_ROTATION * deltaTimeSeconds
    const previousAngle = self.dir;
    const changeInAngle = headingAngle - previousAngle;
    const smallestChange = getAngleBetweenMinusPiAndPi(changeInAngle);
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
  window.addEventListener('keydown', onKeyDown);
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(steerDirection);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('keydown', onKeyDown);
  cancelAnimationFrame(animationFrameRequestId);
}