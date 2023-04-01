function getEveryNth(arr, nth) {
  const result = [];

  for (let index = 0; index < arr.length; index += nth) {
    result.push(arr[index]);
  }

  return result;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

module.exports = {getEveryNth, randomInteger, clamp};
