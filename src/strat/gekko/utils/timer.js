// I'm not sure how this even worked with name = strategyName because multiple must be running the same time ...
// anyway, now creating startId() which returns next id just so we can quickly move forward

const start = (name, noThrow) => {
  time(name, noThrow);
  //   console.log(pad(` RUNNING ${name} `, 100, "="));
};

let idx = 0;
const startId = (name, noThrow) => {
  const currId = idx++;
  time(currId.toString(), noThrow);
  //   console.log(pad(` RUNNING ${name} `, 100, "="));
  return currId;
};

const end = (name, noThrow) => {
  return timeEnd(name, noThrow);
};

const times = {};
const time = (name, noThrow) => {
  if (times[name] && !noThrow) {
    throw new Error(`Time for ${name} already running`);
  }

  times[name] = new Date().getTime();
};

const timeEnd = (name, noThrow) => {
  const start = times[name];
  if (!start && !noThrow) {
    throw new Error(`Start time for ${name} not found`);
  }

  delete times[name];

  const end = new Date().getTime();

  const elapsedSeconds = Math.round((end - start) / 1000);
  //   console.log(pad(`TIME ${name}:     ${elapsedSeconds}s`, 100, "="));
  return elapsedSeconds;
};

module.exports = {
  start,
  startId,
  end,
};
