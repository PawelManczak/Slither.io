function getEveryNth(arr, nth) {
  const result = [];

  for (let index = 0; index < arr.length; index += nth) {
    result.push(arr[index]);
  }

  return result;
}

module.exports = {getEveryNth};
