module.exports.valueToOHLC = value => {
  if (value === null || value === undefined) {
    return null;
  }

  return { open: value, high: value, low: value, close: value };
};
