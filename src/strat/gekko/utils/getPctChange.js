// return change as % like 5.8% not 0.058
module.exports = (curr, prev) => {
  return ((curr - prev) / prev) * 100;
};
