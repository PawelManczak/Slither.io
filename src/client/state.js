const RENDER_DELAY = 100;

const gameUpdates = [];
let startClientTimestamp = 0;
let startServerTimestamp = 0;

export function initState() {
  startClientTimestamp = 0;
  startServerTimestamp = 0;
}

export function processGameUpdate(update) {
  if (startServerTimestamp == 0) {
    startServerTimestamp = update.time;
    startClientTimestamp = Date.now();
  }
  gameUpdates.push(update);

  // Keep only one game update before the current server time
  const base = getBaseUpdateIndex();
  if (base > 0) {
    gameUpdates.splice(0, base);
  }
}

function currentServerTime() {
  return startServerTimestamp + (Date.now() - startClientTimestamp) - RENDER_DELAY;
}

// Returns the index of the base update, the first game update before
// current server time, or -1 if N/A.
function getBaseUpdateIndex() {
  const serverTime = currentServerTime();
  for (let i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].time <= serverTime) {
      return i;
    }
  }
  return -1;
}

export function getCurrentState() {
  if (startServerTimestamp == 0) {
    return {};
  }

  const base = getBaseUpdateIndex();
  const serverTime = currentServerTime();

  // If base is the most recent update we have, use its state.
  // Else, interpolate between its state and the state of (base + 1).
  if (base < 0) {
    return gameUpdates[gameUpdates.length - 1];
  } else if (base == gameUpdates.length - 1) {
    return gameUpdates[base];
  } else {
    const baseUpdate = gameUpdates[base];
    const next = gameUpdates[base + 1];
    const ratio = (serverTime - baseUpdate.time) / (next.time - baseUpdate.time);
    return {
      time: baseUpdate.time,
      self: interpolateObject(baseUpdate.self, next.self, ratio),
      others: interpolateObjectArray(baseUpdate.others, next.others, ratio),
      food: baseUpdate.food,
    };
  }
}

function interpolateObject(object1, object2, ratio) {
  if (!object2) {
    return object1;
  }

  const interpolated = {};
  Object.keys(object1).forEach((key) => {
    if (['color', 'username'].includes(key)) {
      interpolated[key] = object1[key];
    } else if (key == 'dir') {
      interpolated[key] = interpolateDirection(object1[key], object2[key], ratio);
    } else if (key == 'bodyparts') {
      interpolated[key] = interpolateObjectArray(object1[key], object2[key], ratio);
    } else {
      interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
    }
  });
  return interpolated;
}

function interpolateObjectArray(object1, object2, ratio) {
  return object1.map((o) => interpolateObject(o, object2.find((o2) => o.id === o2.id), ratio));
}

// Determines the best way to rotate (cw or ccw) when interpolating a direction.
// For example, when rotating from -3 radians to +3 radians, we should really rotate from
// -3 radians to +3 - 2pi radians.
function interpolateDirection(d1, d2, ratio) {
  const absD = Math.abs(d2 - d1);
  if (absD >= Math.PI) {
    // The angle between the directions is large - we should rotate the other way
    if (d1 > d2) {
      return d1 + (d2 + 2 * Math.PI - d1) * ratio;
    } else {
      return d1 - (d2 - 2 * Math.PI - d1) * ratio;
    }
  } else {
    // Normal interpolation
    return d1 + (d2 - d1) * ratio;
  }
}
