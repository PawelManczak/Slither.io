import {updateDirection} from './networking';
import {switchPerformanceDisplay} from './render';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function onKeyDown(e) {
  switch (e.key) {
    case 'ArrowRight':
      headingAngle = 0;
      break;
    case 'ArrowUp':
      headingAngle = -Math.PI / 2;
      break;
    case 'ArrowLeft':
      headingAngle = -Math.PI;
      break;
    case 'ArrowDown':
      headingAngle = Math.PI / 2;
      break;
    case 'P':
    case 'p':
      switchPerformanceDisplay();
      break;
  }
}

function handleInput(x, y) {
  const headingAngle = Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2);
  updateDirection(headingAngle);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyDown);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('keydown', onKeyDown);
}
